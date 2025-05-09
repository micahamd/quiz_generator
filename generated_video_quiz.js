
    // filepath: generated_video_quiz.js
    const quizData = {
        "metadata": {
            "title": "Generated Quiz",
            "description": "Auto-generated!",
            "version": "1.0.0",
            "totalQuizzes": 1,
            "validStudentIds": null,
            "passingScore": 70,
            "videoSourceType": "youtube" // Store the video source type
        },
        "quizSchedule": [{"time":2,"quizId":1,"title":"Q1","description":"first quiz"}],
        "quizzes": {
  "1": {
    "title": "Q1",
    "description": "first quiz",
    "present_items": "ALL",
    "timeLimit": 180,
    "questions": [
      {
        "id": "1.1",
        "question": "You will need to setup R and R studio to complete the excercises in this lecture. The instructions to setup R can be found on your Moodle page. In addition, there is a web version of R you can directly access without any downloads or registration. This link is also available on Moodle. Once you have done so, type in \"Yes\" below and submit the quiz results to continue",
        "type": "trueFalse",
        "correctAnswer": "true",
        "points": 5,
        "options": [],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "1.2",
        "question": "What are the first two steps involved in the scientific process, as outlined in the lecture?",
        "type": "imageRate",
        "correctAnswer": "true",
        "points": 5,
        "options": [
          "\"C:\\Users\\micah\\OneDrive\\Pictures\\Done.png\""
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        },
        "validation": {
          "minLength": 2,
          "maxLength": 10000,
          "required": true
        }
      }
    ]
  }
}
    };



    
    // Load YouTube API
    let player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('myVideo', {
            events: {
                'onStateChange': onPlayerStateChange,
                'onReady': onPlayerReady
            }
        });
    }

    function onPlayerReady(event) {
        // Initialization after player is ready
        initializeQuiz();
    }

    function onPlayerStateChange(event) {
        // Monitor player state
        if (event.data === YT.PlayerState.PLAYING && state.videoPaused) {
            player.pauseVideo();
        }
    }
    

    
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
                    maxlength="${question.validation?.maxLength || 10000}"
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

        case 'imageRate':
            // For image rate, the image path is stored in the first element of the options array
            // Ensure the path is properly unescaped for use in HTML
            const imagePath = question.options[0].replace(/\//g, '/');
            console.log('Rendering image with path:', imagePath);
            return `
                <div class="image-container">
                    <img src="${imagePath}" alt="Question image" style="max-width: 100%; margin-bottom: 10px;">
                </div>
                <div class="response-container">
                    <textarea
                        name="q${quizId}-${index}"
                        minlength="${question.validation?.minLength || 0}"
                        maxlength="${question.validation?.maxLength || 10000}"
                        ${question.validation?.required ? 'required' : ''}
                        rows="4"
                        style="width: 100%;"
                        placeholder="Enter your response here..."
                    ></textarea>
                </div>
            `;

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

        if (question.type === 'shortAnswer' || question.type === 'imageRate') {
            // Handle both shortAnswer and imageRate similarly
            let inputElement;

            if (question.type === 'shortAnswer') {
                inputElement = document.querySelector(`input[name="q${quizId}-${index}"]`);
            } else { // imageRate
                inputElement = document.querySelector(`textarea[name="q${quizId}-${index}"]`);
            }

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
                points: question.points,
                questionType: question.type // Add question type for easier processing
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
                points: isCorrect ? question.points : 0,
                questionType: question.type // Add question type for easier processing
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
