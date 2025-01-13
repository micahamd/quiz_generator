# Video Quiz System

A web-based system for delivering interactive quizzes during video lectures. The system pauses video playback at predetermined timestamps to present quizzes, ensuring student engagement and comprehension.

## Core Features

### 1. Video Integration
- Seamless integration with HTML5 video player
- Automatic video pausing at quiz timestamps
- Resume playback only after quiz completion
- Support for MP4 video format

### 2. Quiz Management
- Multiple quiz types supported:
  - Multiple Choice
  - True/False
  - Short Answer
- Question randomization within quizzes
- Configurable number of questions to present
- Immediate feedback on answers
- Point-based scoring system
- Quiz progress tracking

### 3. Student Interaction
- Student ID validation (format: letter followed by 7 digits)
- Progress tracking across quizzes
- Results saved as JSON files
- Visual feedback for correct/incorrect answers

## System Architecture

### File Structure
```
video-quiz/
├── video_with_quiz.html    # Main HTML structure
├── video_with_quiz.css     # Styles and responsive design
├── video_with_quiz.js      # Core functionality
├── question_bank.json      # Quiz content and configuration
└── README.md              # Documentation
```

### Component Overview

#### 1. HTML (video_with_quiz.html)
- Semantic structure with accessibility support
- Video player integration
- Quiz container templates
- Error and feedback message templates

#### 2. CSS (video_with_quiz.css)
- Responsive design system
- Custom styling for quiz elements
- Visual feedback states
- Loading and error states
- Progress indicators

#### 3. JavaScript (video_with_quiz.js)
- State management
- Quiz rendering and validation
- Video playback control
- Student ID validation
- Results handling
- Error management

#### 4. Question Bank (question_bank.json)
- Quiz metadata and configuration
- Question definitions
- Answer validation rules
- Feedback messages
- Timing configuration

## Usage Guide

### 1. Adding New Quizzes
1. Open `question_bank.json`
2. Add quiz details under the "quizzes" object
3. Configure timing in "quizSchedule"
4. Define questions with:
   - Question text
   - Answer options
   - Correct answer
   - Points value
   - Feedback messages

Example:
```json
{
  "quizId": "5",
  "title": "Chapter Review",
  "present_items": 2,
  "timeLimit": 180,
  "questions": [
    {
      "id": "5.1",
      "question": "Your question here?",
      "type": "multipleChoice",
      "options": ["Option A", "Option B", "Option C"],
      "correctAnswer": "a",
      "points": 5,
      "feedback": {
        "correct": "Well done!",
        "incorrect": "The correct answer is Option A"
      }
    }
  ]
}
```

### 2. Customizing Validation
- Modify `validStudentIdPattern` in metadata
- Adjust `validation` rules for short answer questions
- Configure time limits per quiz

### 3. Styling Changes
- Update CSS variables in `:root`
- Modify responsive breakpoints
- Customize feedback styles

## Future Improvements

### 1. Authentication & Security
- [ ] Implement proper authentication system
- [ ] Add session management
- [ ] Secure student data handling
- [ ] Add role-based access control

### 2. Data Management
- [ ] Add server-side storage for results
- [ ] Implement database integration
- [ ] Add result export in multiple formats
- [ ] Create backup system for results

### 3. Quiz Features
- [ ] Add more question types:
  - [ ] Matching questions
  - [ ] Ordering questions
  - [ ] Fill-in-the-blanks
  - [ ] Code snippets
- [ ] Add timed quizzes with countdown
- [ ] Implement question pools
- [ ] Add quiz retry options
- [ ] Add partial credit scoring

### 4. User Experience
- [ ] Add progress save/resume
- [ ] Implement dark mode
- [ ] Add keyboard navigation
- [ ] Improve mobile experience
- [ ] Add offline support
- [ ] Implement undo/redo functionality

### 5. Analytics
- [ ] Add student performance tracking
- [ ] Create instructor dashboard
- [ ] Generate performance reports
- [ ] Add learning analytics
- [ ] Implement quiz statistics

### 6. Video Features
- [ ] Add support for more video formats
- [ ] Implement video bookmarking
- [ ] Add transcript integration
- [ ] Support multiple video sources
- [ ] Add picture-in-picture during quizzes

### 7. Technical Improvements
- [ ] Add unit tests
- [ ] Implement error tracking
- [ ] Add performance monitoring
- [ ] Improve load times
- [ ] Add service worker for offline access
- [ ] Implement WebSocket for real-time features

### 8. Accessibility
- [ ] Enhance screen reader support
- [ ] Add high contrast mode
- [ ] Improve keyboard navigation
- [ ] Add text-to-speech for questions
- [ ] Support multiple languages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
