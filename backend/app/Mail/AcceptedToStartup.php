<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AcceptedToStartup extends Mailable
{
    use Queueable, SerializesModels;

    public $last_name_ar;

    public function __construct($last_name_ar)
    {
        $this->last_name_ar = $last_name_ar;
    }

    public function build()
    {
        return $this->subject('You Have Been Added To Startup')
            ->view('emails.studentAssignment')
            ->with(['name' => $this->last_name_ar]);
    }
}
