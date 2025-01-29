<?php
// CORS headers must be FIRST
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

header('Content-Type: application/json');
$upload_dir = __DIR__ . '/../quiz_results/'; // Corrected path

if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $results_json = file_get_contents('php://input');
    $student_id = '';

    $results_data = json_decode($results_json, true);
    if ($results_data && isset($results_data['studentId'])) {
        $student_id = $results_data['studentId'];
    }

    $filename = 'quiz_results_' . date('Ymd_His') . '_' . $student_id . '.json';
    $filepath = $upload_dir . $filename;

    if (file_put_contents($filepath, $results_json)) {
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Results saved successfully on server.']);
    } else {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save results to server.']);
    }
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method. Use POST.']);
}
?>
