<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanOldRequests extends Command
{
    protected $signature = 'requests:cleanup';
    protected $description = 'Remove student requests older than a week';

    private $pendingFile = 'pending_students.json';

    public function handle()
    {
        if (!Storage::exists($this->pendingFile)) {
            $this->info('No requests to clean.');
            return;
        }

        $students = json_decode(Storage::get($this->pendingFile), true) ?? [];
        $filteredStudents = array_filter($students, function ($student) {
            return now()->diffInDays($student['created_at']) < 7;
        });

        Storage::put($this->pendingFile, json_encode(array_values($filteredStudents), JSON_PRETTY_PRINT));
        $this->info('Old requests cleaned.');
    }
}
