<?php
// debug_email.php
// Place this in /api/ folder on your server

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>PHP Debugger</h1>";

// 1. Check Files
echo "<h2>1. Checking Files</h2>";
$files = [
    'PHPMailer/src/Exception.php',
    'PHPMailer/src/PHPMailer.php',
    'PHPMailer/src/SMTP.php'
];

foreach ($files as $file) {
    if (file_exists(__DIR__ . '/' . $file)) {
        echo "<div style='color:green'>✅ Found: $file</div>";
        require_once __DIR__ . '/' . $file;
    } else {
        echo "<div style='color:red'>❌ MISSING: $file (Did you extract the zip correctly?)</div>";
    }
}

// 2. Check Directories
echo "<h2>2. Checking Directories</h2>";
$uploadDir = __DIR__ . "/../uploads/";
if (file_exists($uploadDir)) {
    echo "<div style='color:green'>✅ Uploads folder exists</div>";
    if (is_writable($uploadDir)) {
        echo "<div style='color:green'>✅ Uploads folder is writable</div>";
    } else {
        echo "<div style='color:red'>❌ Uploads folder is NOT writable (Permission Denied)</div>";
    }
} else {
    echo "<div style='color:orange'>⚠️ Uploads folder missing (Script should try to create it)</div>";
}

// 3. Test SMTP
echo "<h2>3. Testing SMTP Connection</h2>";
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = 'mail.maitriconnect.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'admin@maitriconnect.com';
    $mail->Password = 'admin@!A';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    // Send a test email to yourself
    $mail->setFrom('admin@maitriconnect.com', 'Debug Test');
    $mail->addAddress('admin@maitriconnect.com');

    $mail->Subject = "Debug Test - " . date("H:i:s");
    $mail->Body = "This is a test email to verify SMTP settings.";

    $mail->send();
    echo "<div style='color:green'>✅ Email Sent Successfully! SMTP is working.</div>";

} catch (Exception $e) {
    echo "<div style='color:red'>❌ Mailer Error: {$mail->ErrorInfo}</div>";
}
