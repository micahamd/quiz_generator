
    // filepath: p203w10_quiz.js
    const quizData = {
        "metadata": {
            "title": "Generated Quiz",
            "description": "Auto-generated!",
            "version": "1.0.0",
            "totalQuizzes": 3,
            "validStudentIds": ["s11134827","s11035271","s11229588","s11212031","s11131885","s11229807","s11187868","s11215280","s11206579","s11171179","s11215737","s11237148","s11231080","s11170671","s11223584","s11209474","s11208835","s11248151","s11211396","s11159428","s11174833","s11224295","s11101129","s11025749","s11207386","s11178935","s11188067","s11220336","s11220638","s11211556","s11223163","s11214230","s11159048","s11198905","s11177229","s11232672","s11236003","s11195087","s11051847","s11081192","s11220387","s11132040","s11195001","s96000912","s11205154","s11174125","s11221019","s11136072","s11221603","s11190362","s11223548","s97005061","s11233043","s11230323","s11232155","s11229046","s11155406","s11220962","s11174423","s11053566","s11174705","s11054793","s11230480","s11210061","s11239811","s11182584","s11233884","s11230221","s11220249","s11139488","s11231129","s11220267","s11199747","s11109509","s11135066","s11199507","s11177123","s11207758","s11133268","s11208999","s11210348","s11205595","s11233769","s11162229","s11229580","s11169356","s11232673","s11220488","s11222663","s11223299","s11234528","s11098774","s11131962","s11232178","s11199217","s11200875","s11186264","s11128906","s11117528","s11040024","s11231615","s11231551","s11130811","s1"],
            "passingScore": 70,
            "videoSourceType": "filePath" // Store the video source type
        },
        "quizSchedule": [{"time":635,"quizId":1,"title":"First Quiz","description":"first quiz"},{"time":1056,"quizId":2,"title":"Second Quiz","description":"Second Quiz"},{"time":1650,"quizId":3,"title":"Teaching Activity","description":"Teaching Activity"}],
        "quizzes": {
  "1": {
    "title": "First Quiz",
    "description": "first quiz",
    "present_items": "ALL",
    "timeLimit": 300,
    "questions": [
      {
        "id": "1.1",
        "question": "What type of variables are required to conduct a correlation analysis?",
        "type": "multipleChoice",
        "correctAnswer": "c",
        "points": 5,
        "options": [
          "Categorical",
          " Discrete",
          " Continuous",
          " Ordinal"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "1.2",
        "question": "What does the HAT (^) superscript notation typically indicate in the context discussed? ",
        "type": "multipleChoice",
        "correctAnswer": "c",
        "points": 5,
        "options": [
          "A specific observation",
          " The maximum value",
          " A mean estimate",
          " The sum of values"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "1.3",
        "question": "What does the p-value help determine in a correlation analysis?",
        "type": "multipleChoice",
        "correctAnswer": "b",
        "points": 5,
        "options": [
          "The range of the correlation coefficient",
          " Whether the correlation is statistically significant",
          " The type of variables being correlated",
          " The sample size required"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "1.4",
        "question": "What is the possible range of values for a correlation coefficient?",
        "type": "multipleChoice",
        "correctAnswer": "c",
        "points": 5,
        "options": [
          "0 to 1",
          " -1 to 0",
          " -1 to +1",
          " Any real number"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "1.5",
        "question": "In the context of correlation, what does a POSITIVE relationship between two variables (X and Y) imply?",
        "type": "multipleChoice",
        "correctAnswer": "a",
        "points": 5,
        "options": [
          "As X goes up Y also goes up",
          " As X goes down Y also goes down",
          " As X goes up Y goes down",
          " There is no relationship between X and Y"
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
    "timeLimit": 300,
    "questions": [
      {
        "id": "2.1",
        "question": "How are individual deviation scores calculated for the target variable(s)?",
        "type": "multipleChoice",
        "correctAnswer": "a",
        "points": 5,
        "options": [
          "Subtract the mean from each individual value",
          " Add the mean to each individual value",
          " Multiply each individual value by the mean",
          " Divide the mean by each individual value"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "2.2",
        "question": "When subtracting a single value (like the mean) from a vector containing multiple observations in R, how does R handle the operation? ",
        "type": "multipleChoice",
        "correctAnswer": "c",
        "points": 5,
        "options": [
          "It subtracts the single value from the first observation only",
          " It subtracts the single value from the last observation only",
          " It subtracts the single value from every observation in the vector",
          " It returns an error because the lengths are different"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "2.3",
        "question": "What does the DENOMINATOR represent in the correlation coefficient ratio?",
        "type": "multipleChoice",
        "correctAnswer": "c",
        "points": 5,
        "options": [
          "The sum of the squared deviations for both variables",
          " The square root of the sum of the product deviations",
          " The square root of the product of the squared deviations for both variables",
          " The sum of the raw deviations for both variables"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "2.4",
        "question": "What does the NUMERATOR represent in the correlation coefficient ratio?",
        "type": "multipleChoice",
        "correctAnswer": "b",
        "points": 5,
        "options": [
          "The sum of the squared deviations for one variable",
          " The sum of the product deviations",
          " The sum of the raw deviations for both variables",
          " The product of the means of the two variables"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "2.5",
        "question": "What does N-2 represent when estimating the test statistic for a correlation coefficient?",
        "type": "multipleChoice",
        "correctAnswer": "c",
        "points": 5,
        "options": [
          "The total number of observations",
          " The number of variables being correlated",
          " The degrees of freedom",
          " The sample size minus the number of observations"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      }
    ]
  },
  "3": {
    "title": "Teaching Activity",
    "description": "Teaching Activity",
    "present_items": "ALL",
    "timeLimit": 1800,
    "questions": [
      {
        "id": "3.1",
        "question": "What is the NUMERATOR value of the correlation coefficient ratio between Walking and Moderate activities?",
        "type": "multipleChoice",
        "correctAnswer": "c",
        "points": 5,
        "options": [
          "-2190",
          " 5495",
          "30809",
          "5967"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "3.2",
        "question": "What is the DENOMINATOR value of the correlation coefficient ratio between Walking and Moderate activities?",
        "type": "multipleChoice",
        "correctAnswer": "d",
        "points": 5,
        "options": [
          "2952",
          "7018",
          "17073",
          "39615"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "3.3",
        "question": "Run the correlation test on the Walking and Moderate activity variables. What is the p-value?",
        "type": "multipleChoice",
        "correctAnswer": "b",
        "points": 5,
        "options": [
          "p < .001",
          " p < .05",
          " p > .05",
          " p > .001"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "3.4",
        "question": "What kind of correlation did you observe?",
        "type": "multipleChoice",
        "correctAnswer": "c",
        "points": 5,
        "options": [
          "No correlation",
          " Weak correlation",
          " Positive correlation",
          " Negative correlation"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "3.5",
        "question": "What claim can you make about the data following your correlational analysis?",
        "type": "multipleChoice",
        "correctAnswer": "b",
        "points": 5,
        "options": [
          "The null is retained",
          " The null is rejected",
          " The alternative is retained",
          " The alternative is rejected"
        ],
        "feedback": {
          "correct": "Correct!",
          "incorrect": "Incorrect."
        }
      },
      {
        "id": "3.6",
        "question": "What was the test statistic you observed following your correlation test?",
        "type": "multipleChoice",
        "correctAnswer": "a",
        "points": 5,
        "options": [
          "3.5",
          "4.2",
          "2.9",
          "5.1"
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
            // Clean up the path - remove quotes and normalize slashes
            let imagePath = question.options[0];

            // Remove any surrounding quotes
            imagePath = imagePath.replace(/^["']|["']$/g, '');

            // Convert backslashes to forward slashes
            imagePath = imagePath.replace(/\\/g, '/');

            // Remove any escaped slashes
            imagePath = imagePath.replace(/\//g, '/');

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

        case 'sliderRating':
            // For slider rating, we need to extract the slider parameters from the options object
            const sliderOptions = question.options || {};
            const leftValue = sliderOptions.leftValue || 1;
            const rightValue = sliderOptions.rightValue || 5;
            const leftLabel = sliderOptions.leftLabel || 'Weak';
            const rightLabel = sliderOptions.rightLabel || 'Strong';
            const sliderText = sliderOptions.sliderText || 'Rate on the scale below:';

            return `
                <div class="slider-container">
                    <p class="slider-text">${sliderText}</p>
                    <div class="slider-labels">
                        <span class="slider-left-label">${leftLabel} (${leftValue})</span>
                        <span class="slider-right-label">${rightLabel} (${rightValue})</span>
                    </div>
                    <input type="range"
                        name="q${quizId}-${index}"
                        min="${leftValue}"
                        max="${rightValue}"
                        value="${Math.floor((leftValue + rightValue) / 2)}"
                        class="slider-input"
                        style="width: 100%;"
                    >

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

        if (question.type === 'shortAnswer' || question.type === 'imageRate' || question.type === 'sliderRating') {
            // Handle shortAnswer, imageRate, and sliderRating
            let inputElement;

            if (question.type === 'shortAnswer') {
                inputElement = document.querySelector(`input[name="q${quizId}-${index}"]`);
            } else if (question.type === 'imageRate') {
                inputElement = document.querySelector(`textarea[name="q${quizId}-${index}"]`);
            } else if (question.type === 'sliderRating') {
                inputElement = document.querySelector(`input[name="q${quizId}-${index}"]`);
            }

            answer = inputElement ? inputElement.value.trim() : '';

            // Only validate min length for text inputs (shortAnswer and imageRate)
            if ((question.type === 'shortAnswer' || question.type === 'imageRate') &&
                answer && answer.length < (question.validation?.minLength || 0)) {
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
