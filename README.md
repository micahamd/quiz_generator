# Video Quiz Generator v0.4

## Overview
A comprehensive web-based tool for creating interactive video quizzes with multiple question types, student ID validation, and detailed result tracking. Supports both online and offline deployment.

## Features
- JSON configuration import/export
- Student ID validation (optional)
- Multiple question types: Multiple Choice, True/False, Short Answer, Image Ratings, Slider Ratings
- Automatic quiz timing synchronization
- Progress tracking and accessible UI
- Cross-platform compatibility (online/offline)
- PHP-based result submission (online mode)

## Core Components

### Quiz Generator
- `quiz_generator.html` - Main interface
- `quiz_generator.js` - Core functionality
- `quiz_schema.json` - JSON schema for configuration
- `video_with_quiz.css` - Styling for generated quizzes

### Server Components
- `save_results.php` - Server-side result storage
- `.htaccess` - Access control for admin files

## Usage

### Configuration
Create or upload a JSON configuration file following this structure:

```json
{
  "videoConfig": {
    "source": "path/to/video.mp4"
  },
  "quizSchedule": [
    {
      "time": 120,
      "quizId": "q1"
    }
  ],
  "quizzes": {
    "q1": {
      "title": "Quiz Title",
      "description": "Quiz description",
      "timeLimit": 180,
      "questions": [
        {
          "id": "1.1",
          "type": "multipleChoice",
          "question": "Question text",
          "options": ["Option A", "Option B", "Option C"],
          "correctAnswer": "a",
          "points": 5,
          "feedback": {
            "correct": "Correct response",
            "incorrect": "Incorrect response"
          }
        }
      ]
    }
  }
}
```

### Question Types

#### Multiple Choice
Standard multiple-choice questions with single correct answer.

#### True/False
Boolean questions with true/false responses.

#### Short Answer
Open-ended text responses with configurable length validation.

#### Image Rate
Questions displaying images with text response requirements.

#### Slider Rating
Numerical rating questions with customizable scale and labels.

### Workflow
1. Load configuration via JSON upload or create new quiz
2. Configure video source and quiz timing
3. Add questions using the form interface
4. Generate quiz files
5. Deploy generated HTML file

## Student ID Management
1. Create text file with one student ID per line
2. Upload via "Upload Student IDs" button
3. Leave empty to allow unrestricted access

## Deployment

### Local/Offline
- Open `generated_video_quiz.html` directly in browser
- Ensure video and image files are accessible via relative paths

### Online/Server
- Deploy HTML/JS files to web directory
- Configure PHP backend for result submission
- Ensure proper file permissions and directory structure

## File Structure
```
video-quiz/
├── quiz_generator.html
├── quiz_generator.js
├── quiz_schema.json
├── video_with_quiz.css
├── save_results.php
├── new_quizzes/
└── quiz_results/
```


## Requirements
- Modern web browser with JavaScript enabled
- Python 3.6+ (for utilities)
- PHP-enabled web server (for online deployment)

## Version History
- v0.4: Added Slider Rating question type
- v0.3: Enhanced online/offline compatibility
- v0.2.5: Added Image Rate question type
- v0.2: JSON configuration support
- v0.1.5: Multiple question types and validation
- v0.1: Initial release

## Notes
- This application is currently under peer review
- Never modify core template files directly
- Test all quizzes thoroughly before deployment
- Use relative paths for cross-platform compatibility

## License
MIT License - See LICENSE file for details
