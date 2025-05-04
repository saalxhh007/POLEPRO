<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Admin;
use App\Models\Mentor;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function login(Request $req)
    {
        try {
            $req->validate([
                "email" => "required|email",
                "password" => [
                    "required",
                    "string",
                    "min:8",
                    "regex:/[A-Z]/",
                    "regex:/[0-9]/",
                    "regex:/[@$!%*?&]/"
                ],
            ]);

            $roles = [
                'admin' => Admin::class,
                'student' => Student::class,
                'mentor' => Mentor::class,
            ];

            foreach ($roles as $role => $model) {
                $user = $model::where('email', $req->email)->first();

                if ($user && Hash::check($req->password, $user->password)) {
                    $accessToken = JWT::encode([
                        'sub' => $user->id,
                        'role' => $role,
                        'email' => $user->email,
                        'iat' => time(),
                        'exp' => time() + (60 * 15),
                    ], env('JWT_SECRET'), 'HS256');

                    $refreshToken = Str::random(64);
                    $user->refresh_token = $refreshToken;
                    $user->save();

                    return response()
                        ->json(
                            [
                                "success" => true,
                                'message' => 'Login successful',
                                'access_token' => $accessToken,
                                'role' => $role
                            ],
                        )
                        ->cookie(
                            "refresh_token",
                            $refreshToken,
                            60 * 24 * 7,
                            "/",
                            "",
                            true,
                            true,
                            false,
                            "Strict"
                        );
                }
            }

            return response()->json([
                "success" => false,
                'message' => 'Invalid credentials',
            ], 401);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    public function refreshToken(Request $req)
    {
        $refreshToken = $req->cookie('refresh_token');
        if (!$refreshToken) {
            return response()->json(['message' => 'Refresh token not found'], 401);
        }

        $roles = [
            'admin' => Admin::class,
            'student' => Student::class,
            'mentor' => Mentor::class,
        ];

        foreach ($roles as $role => $model) {
            $user = $model::where('refresh_token', $refreshToken)->first();

            if ($user) {
                $accessToken = JWT::encode([
                    'sub' => $user->id,
                    'role' => $role,
                    'email' => $user->email,
                    'iat' => time(),
                    'exp' => time() + (60 * 15),
                ], env('JWT_SECRET'), 'HS256');

                return response()->json([
                    'access_token' => $accessToken,
                    'role' => $role
                ]);
            }
        }

        return response()->json(['message' => 'Invalid refresh token'], 401);
    }
    public function register(Request $req)
    {
        try {
            $req->validate([
                'username' => 'nullable|string|unique:admins|max:50',
                'name' => 'nullable|string|unique:mentors|max:50',
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'regex:/[A-Z]/',
                    'regex:/[0-9]/',
                    'regex:/[@$!%*?&]/'
                ],
                'type' => 'required|in:admin,mentor',
                'faculty_code' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'name' => 'required_if:type,mentor|string|max:300',
                'grade' => 'nullable|string|max:50',
                'specialization' => 'nullable|string|max:200',
                'faculty_name' => 'nullable|string|max:300',
                'department_name' => 'nullable|string|max:200',
            ]);

            $hashedPassword = Hash::make($req->password);

            if ($req->type === 'admin') {
                $user = Admin::create([
                    'username' => $req->username,
                    'password' => $hashedPassword,
                    'type' => $req->type,
                    'faculty_code' => $req->faculty_code,
                    'email' => $req->email,
                    'refresh_token' => Str::random(64),
                ]);
            } elseif ($req->type === 'mentor') {
                $user = Mentor::create([
                    'name' => $req->username,
                    'password' => $hashedPassword,
                    'type' => $req->type,
                    'faculty_code' => $req->faculty_code,
                    'email' => $req->email,
                    'refresh_token' => Str::random(64),
                    'name' => $req->name,
                    'grade' => $req->grade,
                    'specialization' => $req->specialization,
                    'faculty_name' => $req->faculty_name,
                    'department_name' => $req->department_name,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'user' => $user
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
                'success' => false
            ], 500);
        }
    }
}
