<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Prevent direct access to file if not a POST/OPTIONS request
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
    http_response_code(405);
    exit;
}

// Helper to handle JSON response
function sendResponse($success, $message, $code = 200)
{
    http_response_code($code);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    /* ---------- 1. VALIDATE UPLOAD ---------- */
    $uploadDir = __DIR__ . "/../uploads/";

    // Create uploads directory if it doesn't exist
    if (!file_exists($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception("Failed to create uploads directory on server.");
        }
    }

    if (!isset($_FILES['flyer']) || $_FILES['flyer']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("No valid flyer image uploaded.");
    }

    $file = $_FILES['flyer'];
    $fileExt = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($fileExt, $allowed)) {
        throw new Exception("Invalid file type. Only JPG, PNG, GIF allowed.");
    }

    // Generate safe filename
    $cleanName = preg_replace("/[^a-zA-Z0-9]/", "", pathinfo($file['name'], PATHINFO_FILENAME));
    $fileName = time() . "_" . $cleanName . "." . $fileExt;
    $filePath = $uploadDir . $fileName;

    if (!move_uploaded_file($file['tmp_name'], $filePath)) {
        throw new Exception("Failed to save uploaded file.");
    }

    /* ---------- 2. GATHER DATA ---------- */
    $first = htmlspecialchars($_POST['first_name'] ?? '');
    $last = htmlspecialchars($_POST['last_name'] ?? '');
    $email = filter_var($_POST['user_email'] ?? '', FILTER_SANITIZE_EMAIL);
    $phone = htmlspecialchars($_POST['phone'] ?? '');
    $title = htmlspecialchars($_POST['title'] ?? '');
    $date = htmlspecialchars($_POST['date'] ?? '');
    $time = htmlspecialchars($_POST['time'] ?? '');
    $loc = htmlspecialchars($_POST['location'] ?? '');
    $desc = htmlspecialchars($_POST['description'] ?? '');

    /* ---------- 3. SEND EMAIL ---------- */
    $mail = new PHPMailer(true);

    // Server Settings (Bluehost)
    $mail->isSMTP();
    $mail->Host = 'mail.maitriconnect.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'admin@maitriconnect.com'; // ✅ Correct Email
    $mail->Password = 'admin@!A';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;

    // Email Headers
    $mail->setFrom('admin@maitriconnect.com', 'MaitriConnect');
    $mail->addAddress('admin@maitriconnect.com'); // Receive notifications here

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($email, "$first $last");
    }

    // Attachment
    $mail->addAttachment($filePath);

    // Content
    $mail->isHTML(false);
    $mail->Subject = "New Event: $title";
    $mail->Body = "
New Event Submission
====================
Submitted by: $first $last
Email: $email
Phone: $phone

Event Details
-------------
Title:    $title
When:     $date at $time
Location: $loc

Description:
$desc
";

    $mail->send();

    /* ---------- 4. AUTO-REPLY ---------- */
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        try {
            $mail->clearAddresses();
            $mail->clearAttachments();
            $mail->addAddress($email);
            $mail->Subject = "Event API Submission Received";
            $mail->Body = "Hi $first,\n\nWe received your event submission for '$title'.\nOur team will review it shortly.\n\nThanks,\nMaitriConnect Team";
            $mail->send();
        } catch (Exception $e) {
            // Ignore auto-reply errors, main email sent successfully
        }
    }

    sendResponse(true, "Event submitted successfully!");

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage(),
        // Uncomment below to debug specific mailer errors
        // "debug" => isset($mail) ? $mail->ErrorInfo : ''
    ]);
}
