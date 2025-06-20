<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReminderMail extends Mailable
{
    public $subjectLine;
    public $content;
    use Queueable, SerializesModels;

    public function __construct($subjectLine, $content)
    {
        $this->subjectLine = $subjectLine;
        $this->content = $content;
    }

    public function build()
    {
        return $this->subject($this->subjectLine)
            ->view('emails.reminder')
            ->with(['content' => $this->content]);
    }
}
