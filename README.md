# Video Quiz Generator v2.1

## Template file: video_with_quiz.js/html/css. Never remove or alter these

## Features :chipmunk: 
- JSON config import/export :bulb: 
- Student ID validation (optional) 
- Multiple question types:
  - Multiple Choice
  - True/False 
  - Short Answer
- Automatic quiz timing from JSON
- Progress tracking
- Accessible UI

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
      "present_items": 5,
      "questions": [
        {
          "type": "multipleChoice",
          "question": "What is...?",
          "options": ["A", "B", "C"],
          "correctAnswer": "A"
        }
      ]
    }
  }
}
```

## Key Improvements
1. Full JSON config support
2. Windows path compatibility
3. Question type preservation
4. Enhanced validation
5. Progress tracking

## Usage
1. Load config via JSON upload
2. Edit directly in form (optional)
3. Generate files
4. Open generated_video_quiz.html

# Quiz Results Processor

This tool processes JSON quiz result files and converts them to a CSV format that's easier for instructors to review.

## Features

- Processes multiple JSON quiz result files
- Identifies different question types (multiple choice, true/false, short answer)
- Exports results to CSV format
- Works with different quiz formats
- Graphical user interface for easier operation
- Select multiple files or an entire folder
- Customizable output location
- Student ID to Course mapping functionality
- **New:** Test bank mapping for complete question details

## Requirements

- Python 3.6 or higher
- tkinter (usually included with Python)

## Usage

### GUI Mode (Recommended)

Run the script with GUI mode:
