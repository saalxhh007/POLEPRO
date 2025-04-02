<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class StudentApprovalMail extends Mailable
{
    use Queueable, SerializesModels;

    public $last_name_ar;
    public $registrationLink;

    public function __construct($last_name_ar, $registrationLink)
    {
        $this->last_name_ar = $last_name_ar;
        $this->registrationLink = $registrationLink;
    }

    public function build()
    {
        return $this->subject('You have been approved!')
            ->view('emails.student_approved')
            ->with([
                'name' => $this->last_name_ar,
                'registrationLink' => $this->registrationLink,
            ]);
    }
}
