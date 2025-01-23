# Video Quiz Generator v2.1

## Features
- JSON config import/export
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
    "source": "PS203/PS203 Week 2.mp4"
  },
  "quizSchedule": [
    {
      "time": 120,
      "quizId": "q1"
    }
  ],
  "quizzes": {
    "q1": {
      "title": "Week 2 Quiz",
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
