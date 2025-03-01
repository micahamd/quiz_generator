
    // filepath: ps303w2_quiz.js
    const quizData = {
        "metadata": {
            "title": "Generated Quiz",
            "description": "Auto-generated!",
            "version": "1.0.0",
            "totalQuizzes": 3,
            "validStudentIds": ["s89507500","s11160686","s11210497","s11219251","s11029471","s11198814","s11198882","s11216858","s11172530","s11205002","s11079167","s11182099","s11202145","s11180038","s11067836","s11221838","s11220590","s11157731","s11121597","s11133050","s11208754","s11184368","s11188325","s11167932","s11196450","s11173879","s11057414","s11221103","s11177107","s11210637","s11126758","s11026561","s11046495","s11190077","s11220202","s11206894","s11193242","s11174993","s11213428","s11200051","s11086886","s11182443","s11173436","s11041024","s11211388","s11035592","s11115827","s11210295","s11203617","s11177932","s11208914","s11211217","s11211173","s11219935","s11214354","s11212818","s11163657","s11069337","s11175413","s11197621","s11177301","s11005178","s11209952","s1"],
            "passingScore": 70,
            "videoSourceType": "filePath" // Store the video source type
        },
        "quizSchedule": [{"time":567,"quizId":1,"title":"First Quiz","description":"first quiz"},{"time":1492,"quizId":2,"title":"Second Quiz","description":"Second Quiz"},{"time":2331,"quizId":3,"title":"Lab Activity","description":"Lab Activity"}],
        "quizzes": {
  "1": {
    "title": "First Quiz",
    "description": "first quiz",
    "present_items": "ALL",
    "timeLimit": 6000,
    "questions": [
      {
        "id": "1.1",
        "question": "Create four vectors in R: one character vector named `faculties` containing the faculty names \"FAS\", \"FALE\", \"FBE\", and \"FTE\"; and three numeric vectors named `enroll2015`, `enroll2016`, and `enroll2017` containing the enrollment numbers 421, 532, 643, and 754 respectively. Then, combine these vectors into a data frame named `my_data` with `faculties` as the first column. Visualize the dataframe in R by typing in 'my_data' in the console and pressing Enter. Finally, display the resulting data frame. What was the enrollment for FALE in 2016, according to the dataframe? ",
        "type": "multipleChoice",
        "correctAnswer": "a",
        "points": 2,
        "options": [
          "532",
          "421",
          "643",
          "537"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "1.2",
        "question": "What does `cbind` stand for in `cbind.data.frame()`?",
        "type": "multipleChoice",
        "correctAnswer": "d",
        "points": 2,
        "options": [
          "Complex bind",
          " Character bind",
          " Combine bind",
          " Column bind"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      }
    ]
  },
  "2": {
    "title": "Second Quiz",
    "description": "Second Quiz",
    "present_items": "ALL",
    "timeLimit": 6000,
    "questions": [
      {
        "id": "2.1",
        "question": "Assuming `mydf` is a data frame with columns `Schools`, `2015`, `2016`, and `2017` representing student enrollment, write the R code to calculate the total number of students enrolled in the FBE faculty across all years.",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 5,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "2.2",
        "question": "The lecture mentions using backticks when column names are numeric.  Provide an example of R code that would calculate the sum of the column named \"2017\" in the data frame `mydf`.",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 5,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "2.3",
        "question": "What R function could you use to get a quick overview of the descriptive statistics (min, max, mean, median, quartiles) for your data frame `mydf`?",
        "type": "multipleChoice",
        "correctAnswer": "b",
        "points": 2,
        "options": [
          "summary.mydf",
          " summary(mydf)",
          " summary[mydf]",
          " summary_mydf)"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "2.4",
        "question": "The `$` operator in R is primarily used for:",
        "type": "multipleChoice",
        "correctAnswer": "b",
        "points": 2,
        "options": [
          "Performing calculations on entire columns",
          " Accessing specific columns within a data frame",
          " Creating new variables",
          " Indexing rows in a data frame"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "2.5",
        "question": "Which function is used to determine the structure of a data frame in R?",
        "type": "multipleChoice",
        "correctAnswer": "b",
        "points": 2,
        "options": [
          "structure()",
          " str()",
          " summary()",
          " typeof()"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "2.6",
        "question": "In R, when indexing a data frame `mydf[x, y]`, what do `x` and `y` represent?",
        "type": "multipleChoice",
        "correctAnswer": "b",
        "points": 2,
        "options": [
          "`x` represents columns and `y` represents rows",
          " `x` represents rows and `y` represents columns",
          " Both `x` and `y` represent rows",
          " Both `x` and `y` represent columns"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      }
    ]
  },
  "3": {
    "title": "Lab Activity",
    "description": "Lab Activity",
    "present_items": "ALL",
    "timeLimit": 30000,
    "questions": [
      {
        "id": "3.1",
        "question": "Provide the raw code for setting up each numeric vector. Each line of code should be separated by a double colon (::) in your response.",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 4,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "3.2",
        "question": "Provide the code for setting up the factorial variable.",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 5,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "3.3",
        "question": "Provide the raw code for combining the three vectors into a dataframe called 'my.df'",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 5,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "3.4",
        "question": "Provide the raw code for the specific boxplot described.",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 5,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "3.5",
        "question": "Provide the raw code for the specific boxplot described (with a BLUE border and a YELLOW background).",
        "type": "shortAnswer",
        "correctAnswer": "true",
        "points": 5,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "3.6",
        "question": "The average number of deaths (across all causes) has increased from 2018 to 2020 ",
        "type": "trueFalse",
        "correctAnswer": "true",
        "points": 2,
        "options": [],
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
    
    // Handle different video source types
    if (state.quizData.metadata.videoSourceType === 'youtube') {
        // YouTube video events are handled through the YouTube API
        // Use interval for time tracking since timeupdate events aren't available
        setInterval(handleVideoProgress, 500);
    } else {
        // Standard HTML5 video
        video.addEventListener('play', () => {
            if (state.videoPaused) video.pause();
        });
        video.addEventListener('timeupdate', handleVideoProgress);
    }
}

function getCurrentTime() {
    if (state.quizData.metadata.videoSourceType === 'youtube') {
        return player ? player.getCurrentTime() : 0;
    } else {
        return video ? video.currentTime : 0;
    }
}

function pauseVideo() {
    if (state.quizData.metadata.videoSourceType === 'youtube') {
        if (player) player.pauseVideo();
    } else {
        if (video) video.pause();
    }
}

function playVideo() {
    if (state.quizData.metadata.videoSourceType === 'youtube') {
        if (player) player.playVideo();
    } else {
        if (video) video.play();
    }
}

function handleVideoProgress() {
    if (!state.quizData) return;
    
    const currentTime = getCurrentTime();
    
    for (const schedule of state.quizData.quizSchedule) {
        const quiz = state.quizData.quizzes[schedule.quizId];
        if (currentTime >= schedule.time && !quiz.submitted) {
            renderQuiz(schedule.quizId);
            return;
        }
    }
    
    // Show final submit button if all quizzes completed
    if (currentTime >= state.quizData.quizSchedule[state.quizData.quizSchedule.length - 1].time) {
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
    pauseVideo();
    
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
    playVideo();
    
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
