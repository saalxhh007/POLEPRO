<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RejectionNotification extends Mailable
{
    public $name;
    use Queueable, SerializesModels;

    public function __construct($name)
    {
        $this->$name = $name;
    }

    public function build()
    {
        return $this->subject('Event Application Declined')
            ->view('emails.rejected_event')
            ->with(['name' => $this->name]);
    }
}
