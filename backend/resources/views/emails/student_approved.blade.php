<!DOCTYPE html>
<html>

<head>
    <title>Application Approved</title>
</head>

<body>
    <h1>Dear {{ $name }},</h1>
    <p>Congratulations! Your application has been approved.</p>
    <p>You can complete your registration by clicking the link below:</p>
    <p><a href="{{ $registrationLink }}">Complete Registration</a></p>
    <p>Thank you for your interest.</p>
</body>

</html>