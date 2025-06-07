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
                        "matricule" => $user->matricule,
                        'iat' => time(),
                        'exp' => time() + (60 * 15),
                    ], env('JWT_SECRET'), 'HS256');

                    $rawRefreshToken = Str::random(64);
                    $hashedRefreshToken = Hash::make($rawRefreshToken);

                    $user->refresh_token = $hashedRefreshToken;
                    $user->refresh_token_expires_at = now()->addDays(7);
                    $user->save();

                    return response()
                        ->json(
                            [
                                "success" => true,
                                'message' => 'Login successful',
                                'access_token' => $accessToken,
                                'role' => $role,
                                "expires_in" => 900,
                            ],
                        )->cookie(
                            'refresh_token',
                            $rawRefreshToken,
                            60 * 24 * 7,
                            '/',
                            null,        // domain
                            false,       // Secure = false for localhost
                            false,        // HttpOnly
                            false,       // Raw
                            'Lax'        // SameSite
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
                'success' => false,
                (env('FRONTEND_URL'))
            ], 500);
        }
    }

    public function refresh(Request $request)
    {
        try {
            $refreshToken = $request->cookie('refresh_token');

            if (!$refreshToken) {
                return response()->json(['message' => 'No refresh token provided'], 401);
            }

            $roles = [
                'admin' => Admin::class,
                'student' => Student::class,
                'mentor' => Mentor::class,
            ];

            foreach ($roles as $role => $model) {
                $users = $model::whereNotNull('refresh_token')
                    ->where('refresh_token_expires_at', '>=', now())
                    ->get();
                $user = $users->first(function ($u) use ($refreshToken) {
                    return Hash::check($refreshToken, $u->refresh_token);
                });

                if ($user) {
                    $accessToken = JWT::encode([
                        'sub' => $user->id,
                        'role' => $role,
                        'email' => $user->email,
                        "matricule" => $user->matricule,
                        'iat' => time(),
                        'exp' => time() + (60 * 15),
                    ], env('JWT_SECRET'), 'HS256');

                    return response()
                        ->json([
                            'access_token' => $accessToken,
                            'role' => $role,
                            'expires_in' => 900,
                            "matricule" => $user->matricule,
                        ])
                        ->cookie(
                            'refresh_token',
                            $refreshToken,
                            60 * 24 * 7,
                            '/',
                            null,
                            false,
                            false,
                            false,
                            'Lax'
                        );
                }
            }

            return response()->json(['message' => 'Invalid refresh token'], 401);
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Something went wrong', 'error' => $th->getMessage()], 500);
        }
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

    public function logout(Request $request)
    {
        try {
            $refreshToken = $request->cookie('refresh_token');

            if (!$refreshToken) {
                return response()->json(['message' => 'No refresh token found'], 400)->cookie(
                    'refresh_token',
                    '',
                    -1,
                    '/',
                    null,
                    false,
                    false,
                    false,
                    'Lax'
                );
            }

            $roles = [
                'admin' => Admin::class,
                'student' => Student::class,
                'mentor' => Mentor::class,
            ];

            foreach ($roles as $model) {
                $user = $model::whereNotNull('refresh_token')->get()->first(function ($u) use ($refreshToken) {
                    return Hash::check($refreshToken, $u->refresh_token);
                });

                if ($user) {
                    $user->refresh_token = null;
                    $user->save();
                    break;
                }
            }

            return response()->json(['message' => 'Logged out successfully'])->cookie(
                'refresh_token',
                '',
                -1,
                '/',
                null,
                false,
                false,
                false,
                'Lax'
            );
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => $th->getMessage()
            ], 400);
        }
    }

    public function passwordUpdate(Request $req)
    {
        try {

            $req->validate([
                'matricule' => 'required|string',
                'current_password' => 'required|string',
                'new_password' => [
                    'required',
                    'string',
                    'min:8',
                    'regex:/[A-Z]/',
                    'regex:/[0-9]/',
                    'regex:/[@$!%*?&]/'
                ],
            ]);

            $student = Student::where('matricule', $req->matricule)->first();
            if (!$student || !Hash::check($req->current_password, $student->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Matricule ou mot de passe actuel incorrect'
                ], 401);
            }

            $student->password = Hash::make($req->new_password);
            $student->save();
            return response()->json([
                'success' => true,
                'message' => 'Mot de passe mis à jour avec succès'
            ]);
        } catch (\Throwable $th) {

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du mot de passe',
                'error' => $th->getMessage()
            ], 500);
        }
    }
}
