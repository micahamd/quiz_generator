
    // filepath: p303w1_quiz.js
    const quizData = {
        "metadata": {
            "title": "Generated Quiz",
            "description": "Auto-generated!",
            "version": "1.0.0",
            "totalQuizzes": 4,
            "validStudentIds": ["s89507500","s11160686","s11210497","s11219251","s11029471","s11198814","s11198882","s11216858","s11172530","s11205002","s11079167","s11182099","s11202145","s11180038","s11067836","s11221838","s11220590","s11157731","s11121597","s11133050","s11208754","s11184368","s11188325","s11167932","s11196450","s11173879","s11057414","s11221103","s11177107","s11210637","s11126758","s11026561","s11046495","s11220202","s11206894","s11193242","s11174993","s11213428","s11200051","s11086886","s11182443","s11173436","s11211388","s11035592","s11210295","s11203617","s11177932","s11208914","s11211217","s11211173","s11219935","s11214354","s11212818","s11163657","s11069337","s11175413","s11197621","s11177301","s11005178","s11209952","s1"],
            "passingScore": 70
        },
        "quizSchedule": [{"time":20,"quizId":1,"title":"R setup","description":"Setup R"},{"time":193,"quizId":2,"title":"Operator sequence","description":"Sequence of operations"},{"time":833,"quizId":3,"title":"Indexing operations","description":"Indexing operations"},{"time":1262,"quizId":4,"title":"Lab Activity 1","description":"Lab Activity 1"}],
        "quizzes": {
  "1": {
    "title": "R setup",
    "description": "Setup R",
    "present_items": "ALL",
    "timeLimit": 300,
    "questions": [
      {
        "id": "1.1",
        "question": "You will need to setup R and R studio to complete the excercises in this lecture. The instructions to setup R can be found on your Moodle page. In addition, there is a web version of R you can directly access without any downloads or registration. This link is also available on Moodle. Once you have done so, type in \"Yes\" below and submit the quiz results to continue",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 2,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      }
    ]
  },
  "2": {
    "title": "Operator sequence",
    "description": "Sequence of operations",
    "present_items": "ALL",
    "timeLimit": 300,
    "questions": [
      {
        "id": "2.1",
        "question": "What would be the outcome following: 3 + 2 * 5 ",
        "type": "multipleChoice",
        "correctAnswer": "b",
        "points": 2,
        "options": [
          "12",
          "13",
          "30",
          "25"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "2.2",
        "question": "What would be the outcome following: (3 + 2) * 5 ",
        "type": "multipleChoice",
        "correctAnswer": "d",
        "points": 2,
        "options": [
          "12",
          "13",
          "30",
          "25"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      }
    ]
  },
  "3": {
    "title": "Indexing operations",
    "description": "Indexing operations",
    "present_items": "ALL",
    "timeLimit": 180,
    "questions": [
      {
        "id": "3.1",
        "question": "What is the third-position value of the vector 'b1'?",
        "type": "multipleChoice",
        "correctAnswer": "a",
        "points": 2,
        "options": [
          "2",
          "3",
          "4",
          "5"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "3.2",
        "question": "Indexing the first value of 'b1'",
        "type": "multipleChoice",
        "correctAnswer": "b",
        "points": 2,
        "options": [
          "b1[\"1\"]",
          " b1[1]",
          " b1$1",
          " b1.1"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      }
    ]
  },
  "4": {
    "title": "Lab Activity 1",
    "description": "Lab Activity 1",
    "present_items": "ALL",
    "timeLimit": 1800,
    "questions": [
      {
        "id": "4.1",
        "question": "Type in the code for creating the 'm.ages' variable",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 2,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "4.2",
        "question": "Type in the code for creating the 'f.ages' variable",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 2,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "4.3",
        "question": "Provide the values of 'total.ages' (this should be a vector)",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 2,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "4.4",
        "question": "Provide the code for identifying values less than 36 in 'total.ages'.",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 2,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "4.5",
        "question": "Which is the correct code for finding out whether 'm.ages' is smaller than 'f.ages'?",
        "type": "multipleChoice",
        "correctAnswer": "a",
        "points": 2,
        "options": [
          "m.ages<f.ages",
          "m.ages>f.ages",
          "m.ages<=f.ages",
          "m.ages>=f.ages"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
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
function validateStudentId(id, validIds) {
    if (!validIds) return true; // If no IDs loaded, accept any input
    return validIds.includes(id);
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
        
        // Get student ID
        let studentId = prompt('Please enter your student ID');
        if (studentId) {
            if (!validateStudentId(studentId, state.quizData.metadata.validStudentIds)) {
                showError('ID not recognized');
                video.remove(); // Remove video element to terminate quiz
                throw new Error('Invalid student ID');
            }
            state.studentId = studentId;
        } else {
            showError('Student ID is required');
            video.remove(); // Remove video element to terminate quiz
            throw new Error('Student ID required');
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
            const results = {
                studentId: state.studentId,
                timestamp: new Date().toISOString(),
                results: state.quizResults
            };

            showLoading(true);

            fetch('/lectures/save_results.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(results)
            })
            .then(response => {
                showLoading(false);
                if (!response.ok) {
                    throw new Error('HTTP error! status: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    showError('Results saved successfully on the server!');
                } else {
                    throw new Error(data.message || 'Failed to save results');
                }
            })
            .catch(error => {
                showLoading(false);
                showError('Error saving results: ' + error.message);
                console.error('Save error:', error);
            });
        }

// Initialize the quiz system
document.addEventListener('DOMContentLoaded', initializeQuiz);
