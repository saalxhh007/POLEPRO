<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StudentApprovalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            [
                "matricule" => "required|string|min:8|max:8",
                "email" => "required|email|unique:students,email",
                "phone_number" => "required|string|unique:students,phone_number",
                "birth_date" => "required|date",
                "gender" => "required|in:male,female,other",
                "last_name_ar" => "required|string|regex:/^[\p{Arabic} ]+$/u|max:50",
                "first_name_ar" => "regex:/^[\p{Arabic} ]+$/u|max:50",
                "Domain_ar" => "regex:/^[\p{Arabic} ]+$/u|max:50",
                "option_ar" => "regex:/^[\p{Arabic} ]+$/u|max:50",
                "diploma_ar" => "regex:/^[\p{Arabic} ]+$/u|max:50",
                "faculty_code" => "required|string",
                "department_code" => "required|string",
            ]
        ];
    }
}
