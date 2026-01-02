<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Status Check</h1>";
echo "PHP Version: " . phpversion() . "<br>";
echo "Current File: " . __FILE__ . "<br>";

$files = [
    'PHPMailer/src/Exception.php',
    'PHPMailer/src/PHPMailer.php',
    'PHPMailer/src/SMTP.php'
];

foreach ($files as $file) {
    if (file_exists(__DIR__ . '/' . $file)) {
        echo "✅ Found: $file<br>";
    } else {
        echo "❌ MISSING: $file  <-- <b>THIS IS THE PROBLEM</b><br>";
    }
}

$uploadDir = __DIR__ . "/../uploads/";
echo "Checking Uploads Dir: $uploadDir <br>";
if (is_writable(__DIR__ . "/../")) {
    echo "✅ Parent directory is writable.<br>";
} else {
    echo "⚠️ Parent directory is NOT writable (Uploads might fail).<br>";
}
