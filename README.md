# Video Quiz Generator v2.3

## Overview
The Video Quiz Generator is a comprehensive tool for creating interactive video quizzes for educational purposes. It supports both online and offline use, with features for student ID validation, multiple question types, and detailed result tracking.

## Features :bulb:
- JSON config import/export
- Student ID validation (optional)
- Multiple question types:
  - Multiple Choice
  - True/False
  - Short Answer
  - Image Rate
- Automatic quiz timing from JSON
- Progress tracking
- Accessible UI
- Works both online and offline
- Compatible with local and remote file paths
- PHP-based result submission (online mode)

## Project Components

### 1. Quiz Generator
The core web-based interface for creating quizzes with the following files:
- `quiz_generator.html` - Main interface (never modify)
- `quiz_generator.js` - Core functionality (never modify)
- `quiz_schema.json` - JSON schema for quiz configuration
- `video_with_quiz.css` - Styling for generated quizzes

### 2. Python Utilities
Several Python tools to enhance the quiz generation workflow:
- `quiz_processor.py` - Processes quiz results into CSV format
- `quiz_file_organizer.py` - Organizes quiz files and processes data
- `video_compressor.py` - Utility for compressing video files
- `test_bank_creator.py` - AI-powered tool for generating quiz content from lecture transcripts (planned)

### 3. Server Components
Files for online deployment:
- `save_results.php` - Saves quiz results to server
- `.htaccess` - Controls access to quiz admin files

## Student ID Handling
1. Create a text file with one ID per line
2. Click "Upload Student IDs"
3. Select your ID file
- *Note:* Leave empty to allow any ID

## JSON Configuration
Use `question_bank.json` template:
```json
{
  "videoConfig": {
    "source": "Course/Course_vid.mp4"
  },
  "quizSchedule": [
    {
      "time": 120,
      "quizId": "q1"
    }
  ],
  "quizzes": {
    "q1": {
      "title": "Course Quiz",
      "description": "First quiz",
      "present_items": "ALL",
      "timeLimit": 180,
      "questions": [
        {
          "id": "1.1",
          "type": "multipleChoice",
          "question": "What is...?",
          "options": ["A", "B", "C"],
          "correctAnswer": "a",
          "points": 5,
          "feedback": {
            "correct": "Correct!",
            "incorrect": "Incorrect."
          }
        },
        {
          "id": "1.2",
          "type": "trueFalse",
          "question": "Is this statement true?",
          "correctAnswer": "true",
          "points": 5,
          "feedback": {
            "correct": "Correct!",
            "incorrect": "Incorrect."
          }
        },
        {
          "id": "1.3",
          "type": "shortAnswer",
          "question": "Explain in your own words...",
          "points": 10,
          "validation": {
            "minLength": 2,
            "maxLength": 10000,
            "required": true
          },
          "feedback": {
            "correct": "Submitted!",
            "incorrect": "Please provide an answer."
          }
        },
        {
          "id": "1.4",
          "type": "imageRate",
          "question": "Analyze the image below and explain...",
          "points": 10,
          "options": ["images/example.jpg"],
          "validation": {
            "minLength": 2,
            "maxLength": 10000,
            "required": true
          },
          "feedback": {
            "correct": "Submitted!",
            "incorrect": "Please provide an answer."
          }
        }
      ]
    }
  }
}
```

## Quiz Generator Usage
1. Load config via JSON upload or create a new quiz from scratch
2. Edit directly in form
3. Add questions of various types (Multiple Choice, True/False, Short Answer, Image Rate)
4. For Image Rate questions, specify:
   - Image path (local or remote URL)
   - Minimum and maximum response length
5. Generate files
6. Open generated_video_quiz.html

## Image Path Recommendations
- **For local testing**: Use relative paths like `images/example.jpg` and place your images in a folder relative to the HTML file
- **For online use**: Use either relative paths that match your server structure or full URLs (starting with http:// or https://)
- **Windows paths**: While the application handles Windows paths correctly, it's better to use forward slashes and relative paths for better cross-platform compatibility

## Project Structure

```
video-quiz/
├── quiz_generator.js         # Main quiz generator JavaScript code
├── quiz_generator.html       # Quiz generator interface
├── quiz_schema.json          # JSON schema for quiz configuration
├── video_with_quiz.css       # CSS for generated quizzes
├── save_results.php          # PHP script for saving quiz results (online mode)
├── quiz_processor.py         # Python script for processing quiz results
├── quiz_file_organizer.py    # Python script for organizing quiz files
├── video_compressor.py       # Python utility for compressing video files
├── test_bank_creator.py      # AI-powered quiz content generator (planned)
├── old_files/                # Archive of older versions
├── new_quizzes/              # Directory for newly generated quizzes
└── test bank/                # Directory for test bank files
```

## Online/Offline Compatibility

The quiz generator is designed to work in both online and offline environments:

- **Offline Mode**: Quizzes can be generated and used locally without a server
- **Online Mode**: When deployed to a server, additional features like PHP-based result submission are available

### Online Deployment
1. Place quiz HTML/JS files in the appropriate web directory (e.g., public/lectures/)
2. Ensure video files are accessible (e.g., in public/videos/)
3. Configure the save_results.php path if using server-side result submission
4. The save_results.php file saves quiz results to a '../quiz_results/' directory
5. The .htaccess file restricts access to the quiz-admin directory, only allowing access to specific files

# Quiz Results Processor

This tool processes JSON quiz result files and converts them to a CSV format that's easier for instructors to review.

## Features

- Processes multiple JSON quiz result files
- Identifies different question types (multiple choice, true/false, short answer, image rate)
- Exports results to CSV format
- Works with different quiz formats
- Graphical user interface for easier operation
- Select multiple files or an entire folder
- Customizable output location
- Student ID to Course mapping functionality
- Test bank mapping for complete question details

## Requirements

- Python 3.6 or higher
- tkinter (usually included with Python)

## Usage

### GUI Mode (Recommended)

Run the script with GUI mode:

```bash
python quiz_processor.py --gui
```

Or from the command line:

```bash
python quiz_processor.py --input /path/to/quiz/results --output /path/to/output/directory
```

# Test Bank Creator (Planned)

The Test Bank Creator is a Python tool designed to automatically generate quiz content from lecture transcripts using AI. This tool will streamline the process of creating comprehensive question banks for educational videos.

## Planned Features

- AI-powered question generation using Gemini API or Ollama
- Support for multiple question types (MCQ, True/False, Short Answer)
- Automatic extraction of key concepts from lecture transcripts
- JSON output compatible with the Quiz Generator
- Customizable question difficulty levels
- Batch processing of multiple lecture transcripts
- GUI interface for easy operation

## Technical Requirements

- Python 3.8 or higher
- Required libraries:
  - For Gemini API: google-generativeai
  - For Ollama: ollama-python
  - tkinter (for GUI)
  - pandas, numpy (for data processing)

## Implementation Plan

1. Create a Python script that can read lecture transcript files
2. Implement AI integration with either Gemini API or Ollama
3. Develop algorithms to identify key topics and generate relevant questions
4. Format output as JSON compatible with the quiz generator
5. Build a user-friendly GUI interface
6. Add configuration options for customizing question generation

## Usage (Planned)

```bash
python test_bank_creator.py --input /path/to/transcript.txt --output /path/to/question_bank.json
```

Or using the GUI:

```bash
python test_bank_creator.py --gui
```

# Video Compressor Utility

The Video Compressor is a Python utility that helps optimize video files for web delivery. It provides a simple GUI interface to compress videos to various resolutions and bitrates, making them more suitable for online quiz integration.

## Features

- Simple GUI interface for video compression
- Adjustable bitrate settings
- Multiple resolution options (360p, 480p, 720p, 1080p)
- Audio bitrate control
- CRF (Constant Rate Factor) quality adjustment
- Output format selection (MP4, MOV, AVI)
- File size estimation before compression

## Requirements

- Python 3.6 or higher
- tkinter (for GUI)
- FFmpeg (must be installed and available in system PATH)

## Usage

Run the script to open the GUI interface:

```bash
python video_compressor.py
```

1. Select a video file using the "Select File" button
2. Adjust compression settings:
   - Bitrate (kbps)
   - Resolution
   - Audio bitrate
   - CRF (quality)
3. Select an output format (MP4, MOV, AVI)
4. Click "Estimate" to see the approximate file size
5. Click "Compress" to process the video

# Quiz File Organizer

The Quiz File Organizer is a Python utility that processes quiz result data and organizes it into a more structured format. It's primarily used by the Quiz Results Processor to transform raw quiz data into a format that's easier to analyze.

## Features

- Deduplicates quiz responses based on student ID, course ID, quiz ID, and question ID
- Restructures quiz data by question type (multiple choice, true/false, short answer)
- Calculates correct/total scores for multiple choice and true/false questions
- Extracts short answer responses into separate columns
- Handles test bank mapping for question identification
- Calculates performance ratios for different question types
- Supports course-specific scoring

## Usage

This utility is primarily used as a module imported by the Quiz Results Processor, but it can also be run directly:

```bash
python quiz_file_organizer.py
```

When run directly, it will process a hardcoded CSV file path (which can be modified in the script) and output a processed CSV file.

# Development and Contribution

## Version History
- v2.3: Added improved online/offline compatibility, enhanced image path handling
- v2.2: Added Image Rate question type, improved path handling
- v2.1: Added JSON configuration support, enhanced validation
- v2.0: Complete rewrite with multiple question types and student ID validation
- v1.0: Initial release with basic video quiz functionality

## Future Development
- Implementation of the Test Bank Creator tool
- Enhanced analytics for quiz results
- Mobile-responsive quiz interface improvements
- Integration with learning management systems (LMS)

## File Handling Notes
- The quiz generator creates files in the `new_quizzes/` directory by default
- Quiz results are saved to the `quiz_results/` directory when using the PHP backend
- Student ID lists should be placed in the project root directory
- Test bank files are stored in the `test bank/` directory

## .gitignore Configuration
The project's `.gitignore` file is configured to exclude:
- User-specific content directories (`test bank/`, `new_quizzes/`, etc.)
- Student ID lists (containing sensitive information)
- Generated quiz files
- Python bytecode and temporary files
- OS-specific files

## Important Reminders
- Never modify the template files (`video_with_quiz.js/html/css`)
- When deploying online, ensure proper server configuration for PHP functionality
- For security, use the provided `.htaccess` file to restrict access to admin files
- Always test quizzes thoroughly before distributing to students
