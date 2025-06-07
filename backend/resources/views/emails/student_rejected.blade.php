<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Rejected</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            width: 80%;
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin-top: 50px;
        }
        h1 {
            color: #e74c3c; /* Red color for rejection */
        }
        p {
            color: #555;
            font-size: 16px;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>Dear {{ $name }},</h1>
        <p>We regret to inform you that your application has not been approved.</p>
        <p>Thank you for your interest.</p>
        
        <div class="footer">
            <p>Best Regards,</p>
            <p>The Startup Team</p>
        </div>
    </div>
</body>

</html>
