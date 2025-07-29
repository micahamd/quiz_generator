<?php
/**
 * Quiz Results Saving Script
 * 
 * This script receives quiz results in JSON format via POST requests and saves them to files.
 * It handles CORS to allow for cross-domain requests from the frontend application.
 * 
 * Usage: Send POST request with JSON data to this script.
 * Example JSON format:
 * {
 *   "studentId": "student123",
 *   "quizId": "quiz456",
 *   "answers": [...],
 *   "score": 85
 * }
 */

// CORS headers must be FIRST
// The following headers allow cross-origin requests
// Modify 'Access-Control-Allow-Origin' to restrict to specific domains for security
// Example: header('Access-Control-Allow-Origin: https://yourdomain.com');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
// This is required for CORS to work properly with complex requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Set the response content type to JSON
header('Content-Type: application/json');

// Configure the directory where quiz results will be stored
// You can customize this path to suit your server structure
// Make sure this directory exists and is writable by the web server
$upload_dir = __DIR__ . '/../quiz_results/'; // Ensure correct path

// Create the directory if it doesn't exist
// The permission 0755 allows the owner to read/write/execute and others to read/execute
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Process POST requests containing quiz results
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data as a JSON string
    $results_json = file_get_contents('php://input');
    $student_id = '';

    // Parse the JSON data to extract the student ID
    // You can modify this to extract other fields as needed
    $results_data = json_decode($results_json, true);
    if ($results_data && isset($results_data['studentId'])) {
        $student_id = $results_data['studentId'];
    }

    // Generate a filename based on timestamp and student ID
    // Format: quiz_results_YYYYMMDD_HHMMSS_studentID.json
    // You can customize this naming convention as needed
    $filename = 'quiz_results_' . date('Ymd_His') . '_' . $student_id . '.json';
    $filepath = $upload_dir . $filename;

    // Save the results to a file
    // The file will contain the complete JSON data as received
    if (file_put_contents($filepath, $results_json)) {
        // Success response
        // You can add additional processing here (e.g., database storage, notification)
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Results saved successfully on server.']);
    } else {
        // Error handling for file writing failure
        // Consider logging the error details for debugging
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Failed to save results to server.']);
    }
} else {
    // Handle non-POST requests with an error
    // This ensures the script only responds to the correct HTTP method
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method. Use POST.']);
}

/**
 * Additional customization options:
 * 
 * 1. Database Storage: Add code to store results in a database instead of/in addition to files
 * 2. Authentication: Add checks to verify the request comes from authorized sources
 * 3. Validation: Add validation for the received JSON data structure
 * 4. Error Logging: Implement detailed error logging for troubleshooting
 * 5. Email Notifications: Send email alerts when results are received
 */
?>
