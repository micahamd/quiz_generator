// Quiz Data (Embedded from question_bank.json)
const quizData = {
  "metadata": {
    "title": "PS203 Week 1 Quizzes",
    "description": "Interactive quizzes for PS203 Week 1 lecture",
    "version": "1.0.0",
    "totalQuizzes": 4,
    "validStudentIdPattern": "^[A-Z]\\d{7}$",
    "passingScore": 70
  },
  "quizSchedule": [
    {
      "time": 10,
      "quizId": 1,
      "title": "Basic Concepts Quiz",
      "description": "Testing understanding of initial concepts"
    },
    {
      "time": 60,
      "quizId": 2,
      "title": "Core Principles Quiz",
      "description": "Evaluating comprehension of core principles"
    },
    {
      "time": 120,
      "quizId": 3,
      "title": "True/False Assessment",
      "description": "Quick true/false check on key points"
    },
    {
      "time": 180,
      "quizId": 4,
      "title": "Final Understanding Check",
      "description": "Final assessment of lecture comprehension"
    }
  ],
  "quizzes": {
    "1": {
      "title": "Basic Concepts Quiz",
      "description": "Testing understanding of initial concepts",
      "present_items": 1,
      "timeLimit": 120,
      "questions": [
        {
          "id": "1.1",
          "question": "What is the capital of France?",
          "type": "multipleChoice",
          "options": ["Berlin", "Paris", "London"],
          "correctAnswer": "b",
          "points": 5,
          "feedback": {
            "correct": "Correct! Paris is indeed the capital of France.",
            "incorrect": "Incorrect. The capital of France is Paris."
          }
        },
        {
          "id": "1.2",
          "question": "What is the chemical symbol for water?",
          "type": "multipleChoice",
          "options": ["H2O", "CO2", "NaCl"],
          "correctAnswer": "a",
          "points": 5,
          "feedback": {
            "correct": "Correct! H2O is the chemical symbol for water.",
            "incorrect": "Incorrect. Water's chemical symbol is H2O."
          }
        }
      ]
    },
    "2": {
      "title": "Core Principles Quiz",
      "description": "Evaluating comprehension of core principles",
      "present_items": "ALL",
      "timeLimit": 180,
      "questions": [
        {
          "id": "2.1",
          "question": "What is the largest planet in our solar system?",
          "type": "multipleChoice",
          "options": ["Earth", "Jupiter", "Saturn"],
          "correctAnswer": "b",
          "points": 5,
          "feedback": {
            "correct": "Correct! Jupiter is the largest planet.",
            "incorrect": "Incorrect. Jupiter is the largest planet in our solar system."
          }
        },
        {
          "id": "2.2",
          "question": "What is the speed of light in vacuum?",
          "type": "multipleChoice",
          "options": ["300,000 km/s", "150,000 km/s", "500,000 km/s"],
          "correctAnswer": "a",
          "points": 5,
          "feedback": {
            "correct": "Correct! Light travels at 300,000 km/s in vacuum.",
            "incorrect": "Incorrect. The speed of light in vacuum is 300,000 km/s."
          }
        }
      ]
    },
    "3": {
      "title": "True/False Assessment",
      "description": "Quick true/false check on key points",
      "present_items": 1,
      "timeLimit": 60,
      "questions": [
        {
          "id": "3.1",
          "question": "The Earth is flat.",
          "type": "trueFalse",
          "correctAnswer": "false",
          "points": 5,
          "feedback": {
            "correct": "Correct! The Earth is indeed not flat.",
            "incorrect": "Incorrect. The Earth is not flat - it's roughly spherical."
          }
        },
        {
          "id": "3.2",
          "question": "Water boils at 100 degrees Celsius at sea level.",
          "type": "trueFalse",
          "correctAnswer": "true",
          "points": 5,
          "feedback": {
            "correct": "Correct! Water boils at 100°C at sea level.",
            "incorrect": "Incorrect. Water does boil at 100°C at sea level."
          }
        }
      ]
    },
    "4": {
      "title": "Final Understanding Check",
      "description": "Final assessment of lecture comprehension",
      "present_items": "ALL",
      "timeLimit": 300,
      "questions": [
        {
          "id": "4.1",
          "question": "What is the name of the university you are studying at?",
          "type": "shortAnswer",
          "points": 5,
          "validation": {
            "required": true,
            "minLength": 2,
            "maxLength": 100
          }
        },
        {
          "id": "4.2",
          "question": "What is the name of this module?",
          "type": "shortAnswer",
          "points": 5,
          "validation": {
            "required": true,
            "minLength": 2,
            "maxLength": 100
          }
        }
      ]
    }
  }
};
// State management
const state = {
    studentId: null,
    quizData: quizData,
    currentQuiz: null,
    quizResults: [],
    videoPaused: false,
    loading: true,
    error: null
};

// DOM Elements
const video = document.getElementById('myVideo');
const quizContainer = document.getElementById('quiz-container');
const submitButton = document.getElementById('submitResults');
const loadingElement = document.getElementById('quiz-loading');
const progressIndicator = document.getElementById('progress-indicator');

// Templates
const errorTemplate = document.getElementById('error-template');
const feedbackTemplate = document.getElementById('feedback-template');

// Utility Functions
function validateStudentId(id, pattern) {
    const regex = new RegExp(pattern);
    return regex.test(id);
}

function shuffleArray(array) {
    const clone = [...array];
    for (let i = clone.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
}

function showError(message) {
    const errorElement = errorTemplate.content.cloneNode(true);
    errorElement.querySelector('p').textContent = message;
    document.body.appendChild(errorElement);
    setTimeout(() => {
        document.querySelector('.error-message').remove();
    }, 5000);
}

function showLoading(show) {
    state.loading = show;
    loadingElement.style.display = show ? 'block' : 'none';
}

function updateProgress() {
    if (!state.quizData) return;
    
    const totalQuizzes = state.quizData.metadata.totalQuizzes;
    const completedQuizzes = state.quizResults.reduce((acc, result) => {
        return acc + (result.completed ? 1 : 0);
    }, 0);
    
    const percentage = (completedQuizzes / totalQuizzes) * 100;
    progressIndicator.style.width = `${percentage}%`;
    progressIndicator.setAttribute('aria-valuenow', percentage);
}

// Quiz Management
async function initializeQuiz() {
    try {
        showLoading(true);
        
        
        // Get student ID (optional for now)
        let studentId = prompt('Please enter your student ID (optional)');
        if (studentId && !validateStudentId(studentId, state.quizData.metadata.validStudentIdPattern)) {
            showError('Invalid student ID format');
            state.studentId = null;
        } else {
            state.studentId = studentId;
        }
        
        // Initialize event listeners
        initEventListeners();
        
        showLoading(false);
    } catch (error) {
        showError(error.message);
        console.error('Initialization error:', error);
    }
}

function initEventListeners() {
    submitButton.addEventListener('click', saveResults);
    
    video.addEventListener('play', () => {
        if (state.videoPaused) video.pause();
    });
    
    video.addEventListener('timeupdate', handleVideoProgress);
}

function handleVideoProgress() {
    if (!state.quizData) return;
    
    for (const schedule of state.quizData.quizSchedule) {
        const quiz = state.quizData.quizzes[schedule.quizId];
        if (video.currentTime >= schedule.time && !quiz.submitted) {
            renderQuiz(schedule.quizId);
            return;
        }
    }
    
    // Show final submit button if all quizzes completed
    if (video.currentTime >= state.quizData.quizSchedule[state.quizData.quizSchedule.length - 1].time) {
        const allCompleted = state.quizData.quizSchedule.every(
            schedule => state.quizData.quizzes[schedule.quizId].submitted
        );
        if (allCompleted) {
            submitButton.style.display = 'block';
        }
    }
}

function renderQuiz(quizId) {
    const quiz = state.quizData.quizzes[quizId];
    if (quiz.rendered) return;
    
    state.currentQuiz = quizId;
    state.videoPaused = true;
    video.pause();
    
    const quizElement = document.getElementById(`quiz-${quizId}`);
    quizContainer.style.display = 'block';
    quizElement.style.display = 'block';
    
    // Select questions based on present_items
    let questions = quiz.questions;
    if (quiz.present_items !== 'ALL' && typeof quiz.present_items === 'number') {
        questions = shuffleArray(questions).slice(0, quiz.present_items);
    }
    
    // Render questions
    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('quiz-question');
        questionDiv.setAttribute('data-question-id', question.id);
        
        questionDiv.innerHTML = `
            <p>${question.question}</p>
            ${renderQuestionInputs(question, index, quizId)}
            <div class="feedback" role="alert"></div>
        `;
        
        quizElement.appendChild(questionDiv);
    });
    
    // Add submit button
    const submitBtn = document.createElement('button');
    submitBtn.textContent = `Submit ${quiz.title}`;
    submitBtn.onclick = () => checkAnswers(quizId, questions);
    quizElement.appendChild(submitBtn);
    
    quiz.rendered = true;
    updateProgress();
}

function renderQuestionInputs(question, index, quizId) {
    switch (question.type) {
        case 'trueFalse':
            return `
                <div class="option-container">
                    <input type="radio" id="true-${quizId}-${index}" name="q${quizId}-${index}" value="true">
                    <label for="true-${quizId}-${index}">True</label>
                </div>
                <div class="option-container">
                    <input type="radio" id="false-${quizId}-${index}" name="q${quizId}-${index}" value="false">
                    <label for="false-${quizId}-${index}">False</label>
                </div>
            `;
            
        case 'shortAnswer':
            return `
                <input type="text" 
                    name="q${quizId}-${index}"
                    minlength="${question.validation?.minLength || 0}"
                    maxlength="${question.validation?.maxLength || 100}"
                    ${question.validation?.required ? 'required' : ''}
                >
            `;
            
        case 'multipleChoice':
            return question.options.map((option, optIndex) => `
                <div class="option-container">
                    <input type="radio" 
                        id="opt${optIndex}-${quizId}-${index}"
                        name="q${quizId}-${index}"
                        value="${String.fromCharCode(97 + optIndex)}">
                    <label for="opt${optIndex}-${quizId}-${index}">
                        ${String.fromCharCode(65 + optIndex)}) ${option}
                    </label>
                </div>
            `).join('');
            
        default:
            return '';
    }
}

function checkAnswers(quizId, questions) {
    const quiz = state.quizData.quizzes[quizId];
    let allAnswered = true;
    let score = 0;
    
    questions.forEach((question, index) => {
        const questionElement = document.querySelector(`[data-question-id="${question.id}"]`);
        const feedbackElement = questionElement.querySelector('.feedback');
        let answer;
        
        if (question.type === 'shortAnswer') {
            const inputElement = document.querySelector(`input[name="q${quizId}-${index}"]`);
            answer = inputElement ? inputElement.value.trim() : '';
            
            if (answer && answer.length < (question.validation?.minLength || 0)) {
                allAnswered = false;
                return;
            }
            
            state.quizResults.push({
                quizId,
                questionId: question.id,
                studentId: state.studentId,
                answer,
                points: question.points
            });
        }
         else {
            const selected = document.querySelector(`input[name="q${quizId}-${index}"]:checked`);
            if (!selected) {
                allAnswered = false;
                return;
            }
            
            answer = selected.value;
            const isCorrect = answer === question.correctAnswer;
            score += isCorrect ? question.points : 0;
            
            // Show feedback
            feedbackElement.textContent = question.feedback[isCorrect ? 'correct' : 'incorrect'];
            feedbackElement.classList.add(isCorrect ? 'correct' : 'incorrect');
            feedbackElement.style.display = 'block';
            
            state.quizResults.push({
                quizId,
                questionId: question.id,
                studentId: state.studentId,
                answer,
                correct: isCorrect,
                points: isCorrect ? question.points : 0
            });
        }
    });
    
    if (!allAnswered) {
        showError('Please answer all questions');
        return;
    }
    
    // Mark quiz as completed
    quiz.submitted = true;
    document.getElementById(`quiz-${quizId}`).style.display = 'none';
    state.videoPaused = false;
    video.play();
    
    updateProgress();
}

function saveResults() {
    try {
        const results = {
            studentId: state.studentId,
            timestamp: new Date().toISOString(),
            results: state.quizResults
        };
        
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `quiz_results_${state.studentId}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showError('Results saved successfully!');
    } catch (error) {
        showError('Failed to save results');
        console.error('Save error:', error);
    }
}

// Initialize the quiz system
document.addEventListener('DOMContentLoaded', initializeQuiz);
