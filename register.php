<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ── MySQL credentials ──────────────────────────────────
$host     = "localhost";
$dbUser   = "root";
$dbPass   = "mysql@987";      // ← renamed to avoid conflict
$database = "campusconnect";
// ──────────────────────────────────────────────────────

$conn = new mysqli($host, $dbUser, $dbPass, $database);

if ($conn->connect_error) {
    echo json_encode([
        "error" => "DB connection failed: " . $conn->connect_error
    ]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$fullName   = trim($data['fullName']   ?? '');
$email      = trim($data['email']      ?? '');
$password   = $data['password']        ?? '';   // user's password — safe now
$college    = trim($data['college']    ?? '');
$branch     = trim($data['branch']     ?? '');
$year       = trim($data['year']       ?? '');
$rollNumber = trim($data['rollNumber'] ?? '');
$bio        = trim($data['bio']        ?? '');
$skills     = implode(', ', $data['skills'] ?? []);

if (!$fullName || !$email || !$password || !$college) {
    echo json_encode(["error" => "Please fill all required fields."]);
    exit();
}

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$stmt = $conn->prepare(
    "INSERT INTO users (full_name, email, password, college, branch, year, roll_number, bio, skills)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param("sssssssss",
    $fullName, $email, $hashedPassword,
    $college, $branch, $year, $rollNumber, $bio, $skills
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Account created successfully!"]);
} else {
    if ($conn->errno === 1062) {
        echo json_encode(["error" => "This email is already registered."]);
    } else {
        echo json_encode(["error" => "DB error: " . $stmt->error]);
    }
}

$stmt->close();
$conn->close();
?>