# Video Quiz Generator v0.4

## Overview
A comprehensive web-based tool for creating interactive video quizzes with multiple question types, student ID validation, and detailed result tracking. Supports both online and offline deployment.

## Features
- JSON configuration import/export
- Student ID validation (optional)
- Multiple question types: Multiple Choice, True/False, Short Answer, Image Ratings, Slider Ratings
- HTML-formatted instruction components for rich content display
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
        },
        {
          "id": "1.2",
          "type": "instruction",
          "content": "<h3>Study Instructions</h3><p>Please review the following diagram carefully before proceeding:</p><img src='diagram.png' alt='Study diagram' style='max-width: 100%; height: auto;'><ul><li>Note the highlighted sections</li><li>Pay attention to the relationships shown</li></ul>"
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

#### Instruction Component
Display-only components for presenting HTML-formatted content including:
- Rich text with headers, paragraphs, and styling
- Images with custom styling and positioning
- Lists (ordered and unordered)
- Links and other HTML elements
- Custom CSS styling within the content

**Instruction Component Properties:**
- `type`: Must be set to `"instruction"`
- `content`: HTML string containing the formatted content to display
- No user interaction required - automatically advances

**Example:**
```json
{
  "id": "inst1",
  "type": "instruction", 
  "content": "<h3>Welcome</h3><p>This quiz will test your knowledge. Please read each question carefully.</p><img src='welcome.png' alt='Welcome image' style='width: 300px;'>"
}
```

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
├── quiz_generator.html       # Core generator interface
├── quiz_generator.js         # Core generator logic
├── quiz_schema.json          # JSON schema validation
├── video_with_quiz.css       # Generated quiz styling
├── save_results.php          # Server-side result handler
├── .htaccess                 # Access control
├── .gitignore               # Repository exclusions
├── README.md                # This documentation
├── new_quizzes/             # Generated quiz files (excluded from repo)
└── quiz_results/            # Quiz result data (excluded from repo)
```

**Important Repository Notes:**
- Video files (.mp4, .mov, .avi) are excluded from the repository
- Generated quiz files are excluded from the repository  
- Quiz results and student data are excluded from the repository
- Only core application files should be committed to version control

## .gitignore Configuration
The following items should be excluded from the repository:
```
# Video files
*.mp4
*.mov
*.avi
*.mkv
*.webm

# Directories with video content
PS203/
test_quiz/
output.mp4

# Generated content
new_quizzes/
quiz_results/
generated_*

# Student data
student_ids.txt
*_ids.txt

# Python
__pycache__/
*.pyc
*.pyo

# OS files
.DS_Store
Thumbs.db
```

**To verify exclusions:**
1. Check `.gitignore` file exists in your project root
2. Run `git status` to see what files are tracked
3. Run `git ls-files` to list all tracked files
4. Use `git check-ignore <filename>` to test if specific files are ignored
5. Large files should not appear in `git status` output

## Notes
- This application is currently under peer review
- Never commit video files, student data, or generated quizzes to the repository
- Never modify core template files directly
- Test all quizzes thoroughly before deployment
- Use relative paths for cross-platform compatibility
- Videos should be stored separately and referenced via configuration

## License
MIT License - See LICENSE file for details
