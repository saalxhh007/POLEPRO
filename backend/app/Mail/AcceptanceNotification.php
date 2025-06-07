<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AcceptanceNotification extends Mailable
{
    use Queueable, SerializesModels;
    public $name;
    public $checkinUrl;
    public $qrPath;
    public $eventName;

    public function __construct($name, $checkinUrl, $qrPath, $eventName)
    {
        $this->name = $name;
        $this->checkinUrl = $checkinUrl;
        $this->qrPath = $qrPath;
        $this->eventName = $eventName;
    }

    public function build()
    {
        return $this->subject('Confirmation de participation')
            ->view('emails.accepted_event')
            ->with([
                "eventName" => $this->eventName,
                'name' => $this->name,
                'checkinUrl' => $this->checkinUrl,
            ])
            ->attach($this->qrPath, [
                'as' => 'qr_code_checkin.png',
                'mime' => 'image/png',
            ]);
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
