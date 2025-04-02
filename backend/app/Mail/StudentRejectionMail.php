<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StudentRejectionMail extends Mailable
{
    use Queueable, SerializesModels;

    public $last_name_ar;

    public function __construct($last_name_ar)
    {
        $this->last_name_ar = $last_name_ar;
    }

    public function build()
    {
        return $this->subject('Your application was not approved')
            ->view('emails.student_rejected')
            ->with(['name' => $this->last_name_ar]);
    }
}
