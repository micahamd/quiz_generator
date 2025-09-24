// Store the quiz JS implementation that will be included in the generated file
const quizImplementation = `
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
function validateStudentId(id, validIds, anyIdAllowed = false) {
    // If "Any ID?" is enabled, validate alphanumeric 2-12 characters
    if (anyIdAllowed) {
        return /^[a-zA-Z0-9]{2,12}$/.test(id);
    }
    // Original behavior: if no IDs loaded, accept any input, otherwise check against list
    if (!validIds) return true;
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
    progressIndicator.style.width = \`\${percentage}%\`;
    progressIndicator.setAttribute('aria-valuenow', percentage);
}

// Quiz Management
async function initializeQuiz() {
    try {
        showLoading(true);

        // Get student ID
        let studentId = prompt('Please enter your student ID');
        if (studentId) {
            if (!validateStudentId(studentId, state.quizData.metadata.validStudentIds, state.quizData.metadata.anyIdAllowed)) {
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

    const quizElement = document.getElementById(\`quiz-\${quizId}\`);
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

        questionDiv.innerHTML = \`
            <p>\${question.question}</p>
            \${renderQuestionInputs(question, index, quizId)}
            <div class="feedback" role="alert"></div>
        \`;

        quizElement.appendChild(questionDiv);
    });

    // Add submit button
    const submitBtn = document.createElement('button');
    submitBtn.textContent = \`Submit \${quiz.title}\`;
    submitBtn.onclick = () => checkAnswers(quizId, questions);
    quizElement.appendChild(submitBtn);

    quiz.rendered = true;
    updateProgress();
}

function renderQuestionInputs(question, index, quizId) {
    switch (question.type) {
        case 'instructions':
            const content = question.options?.content || question.content || question.question || '';
            return \`
                <div class="instructions-content" style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 10px 0; line-height: 1.6;">
                    \${content}
                </div>
            \`;

        case 'trueFalse':
            return \`
                <div class="option-container">
                    <input type="radio" id="true-\${quizId}-\${index}" name="q\${quizId}-\${index}" value="true">
                    <label for="true-\${quizId}-\${index}">True</label>
                </div>
                <div class="option-container">
                    <input type="radio" id="false-\${quizId}-\${index}" name="q\${quizId}-\${index}" value="false">
                    <label for="false-\${quizId}-\${index}">False</label>
                </div>
            \`;

        case 'shortAnswer':
            return \`
                <input type="text"
                    name="q\${quizId}-\${index}"
                    minlength="\${question.validation?.minLength || 0}"
                    maxlength="\${question.validation?.maxLength || 10000}"
                    \${question.validation?.required ? 'required' : ''}
                >
            \`;

        case 'multipleChoice':
            return question.options.map((option, optIndex) => \`
                <div class="option-container">
                    <input type="radio"
                        id="opt\${optIndex}-\${quizId}-\${index}"
                        name="q\${quizId}-\${index}"
                        value="\${String.fromCharCode(97 + optIndex)}">
                    <label for="opt\${optIndex}-\${quizId}-\${index}">
                        \${String.fromCharCode(65 + optIndex)}) \${option}
                    </label>
                </div>
            \`).join('');

        case 'imageRate':
            // For image rate, the image path is stored in the first element of the options array
            // Clean up the path - remove quotes and normalize slashes
            let imagePath = question.options[0];

            // Remove any surrounding quotes
            imagePath = imagePath.replace(/^["']|["']$/g, '');

            // Convert backslashes to forward slashes
            imagePath = imagePath.replace(/\\\\/g, '/');

            // Remove any escaped slashes
            imagePath = imagePath.replace(/\\\//g, '/');

            console.log('Rendering image with path:', imagePath);
            return \`
                <div class="image-container">
                    <img src="\${imagePath}" alt="Question image" style="max-width: 100%; margin-bottom: 10px;">
                </div>
                <div class="response-container">
                    <textarea
                        name="q\${quizId}-\${index}"
                        minlength="\${question.validation?.minLength || 0}"
                        maxlength="\${question.validation?.maxLength || 10000}"
                        \${question.validation?.required ? 'required' : ''}
                        rows="4"
                        style="width: 100%;"
                        placeholder="Enter your response here..."
                    ></textarea>
                </div>
            \`;

        case 'sliderRating':
            // For slider rating, we need to extract the slider parameters from the options object
            const sliderOptions = question.options || {};
            const leftValue = sliderOptions.leftValue || 1;
            const rightValue = sliderOptions.rightValue || 5;
            const leftLabel = sliderOptions.leftLabel || 'Weak';
            const rightLabel = sliderOptions.rightLabel || 'Strong';
            const sliderText = sliderOptions.sliderText || 'Rate on the scale below:';

            return \`
                <div class="slider-container">
                    <p class="slider-text">\${sliderText}</p>
                    <div class="slider-labels">
                        <span class="slider-left-label">\${leftLabel} (\${leftValue})</span>
                        <span class="slider-right-label">\${rightLabel} (\${rightValue})</span>
                    </div>
                    <input type="range"
                        name="q\${quizId}-\${index}"
                        min="\${leftValue}"
                        max="\${rightValue}"
                        value="\${Math.floor((leftValue + rightValue) / 2)}"
                        class="slider-input"
                        style="width: 100%;"
                    >

                </div>
            \`;

        default:
            return '';
    }
}

function checkAnswers(quizId, questions) {
    const quiz = state.quizData.quizzes[quizId];
    let allAnswered = true;
    let score = 0;
    let unattemptedQuestions = []; // Track unattempted questions for specific error messaging

    // Check if responses are mandated (default to true for backward compatibility)
    const responsesMandatedElement = document.getElementById('responsesMandatedSetting');
    const responsesMandated = responsesMandatedElement ? responsesMandatedElement.value === 'true' : true;

    questions.forEach((question, index) => {
        const questionElement = document.querySelector(\`[data-question-id="\${question.id}"]\`);
        const feedbackElement = questionElement.querySelector('.feedback');
        let answer;

        if (question.type === 'instructions') {
            // Instructions don't require any input - always considered complete
            // No scoring, no validation needed
            return;
        }

        if (question.type === 'shortAnswer' || question.type === 'imageRate' || question.type === 'sliderRating') {
            // Handle shortAnswer, imageRate, and sliderRating
            let inputElement;

            if (question.type === 'shortAnswer') {
                inputElement = document.querySelector(\`input[name="q\${quizId}-\${index}"]\`);
            } else if (question.type === 'imageRate') {
                inputElement = document.querySelector(\`textarea[name="q\${quizId}-\${index}"]\`);
            } else if (question.type === 'sliderRating') {
                inputElement = document.querySelector(\`input[name="q\${quizId}-\${index}"]\`);
            }

            answer = inputElement ? inputElement.value.trim() : '';

            // Check if responses are mandated and validate accordingly
            if (responsesMandated) {
                // For text inputs (shortAnswer and imageRate), check minimum length requirement
                if (question.type === 'shortAnswer' || question.type === 'imageRate') {
                    const minLength = question.validation?.minLength || 0;
                    if (!answer || answer.length < minLength) {
                        allAnswered = false;
                        unattemptedQuestions.push(question.id);
                        return;
                    }
                }
                // For slider rating, just check if it has been interacted with (default value check)
                else if (question.type === 'sliderRating') {
                    // Slider always has a value, so we consider it answered
                    // Could add more sophisticated logic here if needed
                }
            }

            // Enhanced result object with comprehensive information
            const resultObj = {
                quizId,
                questionId: question.id,
                studentId: state.studentId,
                answer,
                points: question.points,
                questionType: question.type,
                // Enhanced fields for comprehensive output
                questionText: question.question,
                answerText: answer // For these types, answer and answerText are the same
            };

            // Add question-specific details
            if (question.type === 'imageRate' && question.options && question.options.length > 0) {
                resultObj.imagePath = question.options[0];
            } else if (question.type === 'sliderRating' && question.options) {
                resultObj.sliderOptions = question.options;
            }

            state.quizResults.push(resultObj);
        }
         else {
            const selected = document.querySelector(\`input[name="q\${quizId}-\${index}"]:checked\`);

            // Check if responses are mandated and question is unanswered
            if (responsesMandated && !selected) {
                allAnswered = false;
                unattemptedQuestions.push(question.id);
                return;
            }

            // If responses are not mandated and no answer selected, skip scoring but continue
            if (!selected) {
                return;
            }

            answer = selected.value;
            const isCorrect = answer === question.correctAnswer;
            score += isCorrect ? question.points : 0;

            // Remove individual feedback display - no longer showing individual MCQ/TF feedback

            // Get the actual text of the selected answer for MCQs
            let answerText = answer;
            if (question.type === 'multipleChoice' && question.options) {
                // Convert letter answer (a, b, c, d) to option index
                const optionIndex = answer.charCodeAt(0) - 97; // 'a' = 0, 'b' = 1, etc.
                if (optionIndex >= 0 && optionIndex < question.options.length) {
                    answerText = question.options[optionIndex];
                }
            } else if (question.type === 'trueFalse') {
                answerText = answer === 'true' ? 'True' : 'False';
            }

            // Enhanced result object with comprehensive information
            const resultObj = {
                quizId,
                questionId: question.id,
                studentId: state.studentId,
                answer,
                correct: isCorrect,
                points: isCorrect ? question.points : 0,
                questionType: question.type,
                // Enhanced fields for comprehensive output
                questionText: question.question,
                answerText: answerText,
                correctAnswer: question.correctAnswer
            };

            // Add options for multiple choice questions
            if (question.type === 'multipleChoice' && question.options) {
                resultObj.questionOptions = question.options;
                // Also include the correct answer text
                const correctIndex = question.correctAnswer.charCodeAt(0) - 97;
                if (correctIndex >= 0 && correctIndex < question.options.length) {
                    resultObj.correctAnswerText = question.options[correctIndex];
                }
            }

            state.quizResults.push(resultObj);
        }
    });

    if (!allAnswered) {
        // Show specific error message with unattempted question IDs
        const errorMessage = unattemptedQuestions.length > 0
            ? \`Item(s) \${unattemptedQuestions.join(', ')} not attempted\`
            : 'Please answer all questions';
        showError(errorMessage);
        return;
    }

    // Mark quiz as completed
    quiz.submitted = true;
    document.getElementById(\`quiz-\${quizId}\`).style.display = 'none';
    state.videoPaused = false;
    playVideo();

    updateProgress();
}

function saveResults() {
    try {
        // Extract test ID from the current script filename
        const scripts = document.getElementsByTagName('script');
        let testId = 'unknown_quiz';

        // Look for the quiz data script (should be the last script with a .js extension)
        for (let i = scripts.length - 1; i >= 0; i--) {
            const src = scripts[i].src;
            if (src && src.endsWith('.js')) {
                // Extract filename without extension
                const filename = src.split('/').pop().replace('.js', '');
                testId = filename;
                break;
            }
        }

        // Fallback: try to get from quiz metadata if available
        if (testId === 'unknown_quiz' && state.quizData?.metadata?.title) {
            testId = state.quizData.metadata.title.toLowerCase().replace(/\s+/g, '_');
        }

        const results = {
            studentId: state.studentId,
            timestamp: new Date().toISOString(),
            testID: testId,
            results: state.quizResults
        };

        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`quiz_results_\${state.studentId}.json\`;
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
`;

// Helper function to download generated files
function populateFormFromJson(json) {
    // Set basic video info
    document.getElementById('videoSource').value = json.videoConfig.source;

    // Set the correct video source type radio button
    if (json.metadata && json.metadata.videoSourceType === 'youtube') {
        document.getElementById('youtubeSource').checked = true;
    } else {
        document.getElementById('filePathSource').checked = true;
    }
    updateSourceHelp();

    // Set responses mandated setting (default to true for backward compatibility)
    const responsesMandatedCheckbox = document.getElementById('responsesMandated');
    if (responsesMandatedCheckbox) {
        responsesMandatedCheckbox.checked = json.responsesMandated !== undefined ? json.responsesMandated : true;
    }

    // Set anyIdAllowed setting (default to false for backward compatibility)
    const anyIdAllowedCheckbox = document.getElementById('anyIdAllowed');
    if (anyIdAllowedCheckbox) {
        anyIdAllowedCheckbox.checked = json.metadata?.anyIdAllowed || false;
    }

    document.getElementById('quizCount').value = json.quizSchedule.length;

    // Create quiz sections
    document.getElementById('generateQuizFields').click();

    // Populate each quiz from quizSchedule
    json.quizSchedule.forEach((schedule, index) => {
        const quizId = index + 1;
        const quizElem = document.getElementById(`quizTime${quizId}`);
        const quiz = json.quizzes[schedule.quizId];
        if (quizElem) {
            quizElem.value = schedule.time; // Use time from schedule
            document.getElementById(`quizTitle${quizId}`).value = quiz.title;
            document.getElementById(`quizDesc${quizId}`).value = quiz.description;
            document.getElementById(`presentItems${quizId}`).value = quiz.present_items;
            document.getElementById(`timeLimit${quizId}`).value = quiz.timeLimit;

            // Create question fields
            const questionCount = quiz.questions.length;
            document.getElementById(`questionCount${quizId}`).value = questionCount;
            window.generateQuestionFields(quizId);

            // Populate questions
            quiz.questions.forEach((question, qIndex) => {
                document.getElementById(`qText${quizId}-${qIndex + 1}`).value = question.question;
                const typeSelect = document.getElementById(`qType${quizId}-${qIndex + 1}`);
                typeSelect.value = question.type;
                // Trigger change event to show correct options
                const event = new Event('change');
                typeSelect.dispatchEvent(event);
                document.getElementById(`qPoints${quizId}-${qIndex + 1}`).value = question.points;

                if (question.type === 'instructions') {
                    // For instructions, populate the content field
                    const content = question.content || question.options?.content || '';
                    document.getElementById(`qContent${quizId}-${qIndex + 1}`).value = content;
                } else if (question.type === 'multipleChoice') {
                    document.getElementById(`qOptions${quizId}-${qIndex + 1}`).value =
                        question.options.join(',');
                    document.getElementById(`qCorrect${quizId}-${qIndex + 1}`).value =
                        question.correctAnswer;
                } else if (question.type === 'trueFalse') {
                    document.getElementById(`qCorrect${quizId}-${qIndex + 1}`).value =
                        question.correctAnswer.toString();
                } else if (question.type === 'imageRate') {
                    // For image rate, the image path is stored in the first element of the options array
                    if (question.options && question.options.length > 0) {
                        document.getElementById(`qImagePath${quizId}-${qIndex + 1}`).value = question.options[0];
                    }
                    // Set min/max length if validation exists
                    if (question.validation) {
                        if (question.validation.minLength) {
                            document.getElementById(`qMinLength${quizId}-${qIndex + 1}`).value = question.validation.minLength;
                        }
                        if (question.validation.maxLength) {
                            document.getElementById(`qMaxLength${quizId}-${qIndex + 1}`).value = question.validation.maxLength;
                        }
                    }
                } else if (question.type === 'sliderRating') {
                    // For slider rating, the parameters are stored in the options object
                    if (question.options) {
                        if (question.options.leftValue !== undefined) {
                            document.getElementById(`qSliderLeftValue${quizId}-${qIndex + 1}`).value = question.options.leftValue;
                        }
                        if (question.options.rightValue !== undefined) {
                            document.getElementById(`qSliderRightValue${quizId}-${qIndex + 1}`).value = question.options.rightValue;
                        }
                        if (question.options.leftLabel) {
                            document.getElementById(`qSliderLeftLabel${quizId}-${qIndex + 1}`).value = question.options.leftLabel;
                        }
                        if (question.options.rightLabel) {
                            document.getElementById(`qSliderRightLabel${quizId}-${qIndex + 1}`).value = question.options.rightLabel;
                        }
                        if (question.options.sliderText) {
                            document.getElementById(`qSliderText${quizId}-${qIndex + 1}`).value = question.options.sliderText;
                        }
                    }
                }
            });
        }
    });
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Helper functions for video source handling
function getVideoSourceType() {
    return document.querySelector('input[name="videoSourceType"]:checked').value;
}

function extractYouTubeId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

function updateSourceHelp() {
    const sourceType = getVideoSourceType();
    const helpText = document.getElementById('videoSourceHelp');

    if (sourceType === 'youtube') {
        helpText.textContent = 'Enter a YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEOID)';
    } else {
        helpText.textContent = 'Enter the path to your video file (e.g., videos/lecture.mp4)';
    }
}

// Main function to generate quiz files
// Global variable for student IDs
let validStudentIds = null;

function generateFiles() {
    // Collect basic info
    const videoSource = document.getElementById('videoSource').value.trim();
    const sourceType = getVideoSourceType();
    const quizCount = parseInt(document.getElementById('quizCount').value, 10) || 0;
    const outputFileNamePrefix = document.getElementById('outputFileName').value.trim() || 'generated_video_quiz'; // Get the prefix
    const responsesMandated = document.getElementById('responsesMandated').checked;

    // Process video source based on type
    let processedSource, embedCode;

    if (sourceType === 'youtube') {
        const youtubeId = extractYouTubeId(videoSource);
        if (!youtubeId) {
            alert('Invalid YouTube URL. Please enter a valid YouTube video URL.');
            return;
        }
        processedSource = youtubeId;
        embedCode = `<div class="youtube-container">
                        <iframe id="myVideo"
                        src="https://www.youtube.com/embed/${youtubeId}?enablejsapi=1"
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write;
                        encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                        </iframe>
                     </div>`;
    } else {
        // Regular file path
        processedSource = videoSource.replace(/["']/g, '');
        embedCode = `<video id="myVideo" controls aria-label="Lecture content">
                    <source src="${processedSource}" type="video/mp4">
                    <p>Your browser does not support the video tag.</p>
                </video>`;
    }

    // Add Student IDs handling
    const idFileInput = document.getElementById('idFile');
    if (idFileInput && idFileInput.files.length > 0) {
        const file = idFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                validStudentIds = event.target.result
                    .split(/[\n,]/)
                    .map(id => id.replace(/[\r\n]+/g, '').trim())
                    .filter(id => id.length > 0);
            };
            reader.readAsText(file);
        }
    }

    // Build quiz data structure
    const quizSchedule = [];
    const quizzes = {};

    for (let i = 1; i <= quizCount; i++) {
        const time = parseInt(document.getElementById(`quizTime${i}`).value, 10) || 0;
        const quizId = i; // Use 'i' directly as quizId
        const title = document.getElementById(`quizTitle${i}`).value;
        const description = document.getElementById(`quizDesc${i}`).value;
        // Modified conversion for present_items:
        const presentItemsRaw = document.getElementById(`presentItems${i}`).value;
        const presentItems = presentItemsRaw.trim().toUpperCase() === 'ALL' ? 'ALL' : parseInt(presentItemsRaw, 10);
        const timeLimit = parseInt(document.getElementById(`timeLimit${i}`).value, 10) || 180;

        quizSchedule.push({ time, quizId, title, description });
        quizzes[i] = {
            title: title,
            description: description,
            present_items: presentItems,
            timeLimit: timeLimit,
            questions: []
        };

        // Question gathering logic
        const questionCount = parseInt(document.getElementById(`questionCount${i}`).value, 10) || 0;
        for (let q = 1; q <= questionCount; q++) {
            const questionText = document.getElementById(`qText${i}-${q}`).value;
            const questionType = document.getElementById(`qType${i}-${q}`).value;
            let points = parseInt(document.getElementById(`qPoints${i}-${q}`).value, 10) || 5;
            let correctAnswer = '';
            let options = [];
            let validation = null;

            switch (questionType) {
                case 'instructions':
                    const content = document.getElementById(`qContent${i}-${q}`).value;
                    correctAnswer = 'N/A'; // Instructions don't have correct answers
                    points = 0; // Instructions don't contribute to scoring
                    options = { content: content }; // Store content in options for consistency
                    break;
                case 'multipleChoice':
                    options = document.getElementById(`qOptions${i}-${q}`).value.split(',');
                    correctAnswer = document.getElementById(`qCorrect${i}-${q}`).value;
                    break;
                case 'trueFalse':
                    correctAnswer = document.getElementById(`qCorrect${i}-${q}`).value;
                    break;
                case 'shortAnswer':
                    correctAnswer = 'true'; // Placeholder
                    // Add validation object with min and max length
                    const minLength = parseInt(document.getElementById(`qMinLength${i}-${q}`).value, 10) || 2;
                    const maxLength = parseInt(document.getElementById(`qMaxLength${i}-${q}`).value, 10) || 10000;
                    validation = {
                        minLength: minLength,
                        maxLength: maxLength,
                        required: true
                    };
                    break;
                case 'imageRate':
                    correctAnswer = 'true'; // Placeholder
                    // Get image path
                    let imagePath = document.getElementById(`qImagePath${i}-${q}`).value.trim();

                    // Clean up the image path - remove quotes and normalize slashes
                    imagePath = imagePath.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
                    imagePath = imagePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes

                    // Ensure the image path is properly formatted
                    // If it's not a URL (doesn't start with http:// or https://) and doesn't start with a slash,
                    // we'll assume it's a relative path
                    if (!imagePath.match(/^(https?:\/\/|\/)/)) {
                        // It's a relative path, keep as is
                        console.log(`Using relative image path: ${imagePath}`);
                    }

                    // Add validation object with min and max length
                    const imgMinLength = parseInt(document.getElementById(`qMinLength${i}-${q}`).value, 10) || 2;
                    const imgMaxLength = parseInt(document.getElementById(`qMaxLength${i}-${q}`).value, 10) || 10000;
                    validation = {
                        minLength: imgMinLength,
                        maxLength: imgMaxLength,
                        required: true
                    };
                    // Store image path in options array for consistency
                    options = [imagePath];
                    break;
                case 'sliderRating':
                    correctAnswer = 'true'; // Placeholder, not used for slider

                    // Get slider parameters
                    const leftValue = parseInt(document.getElementById(`qSliderLeftValue${i}-${q}`).value, 10) || 1;
                    const rightValue = parseInt(document.getElementById(`qSliderRightValue${i}-${q}`).value, 10) || 5;
                    const leftLabel = document.getElementById(`qSliderLeftLabel${i}-${q}`).value.trim() || 'Weak';
                    const rightLabel = document.getElementById(`qSliderRightLabel${i}-${q}`).value.trim() || 'Strong';
                    const sliderText = document.getElementById(`qSliderText${i}-${q}`).value.trim() || 'This is a slider scale.';

                    // Store slider parameters in options object
                    options = {
                        leftValue: leftValue,
                        rightValue: rightValue,
                        leftLabel: leftLabel,
                        rightLabel: rightLabel,
                        sliderText: sliderText
                    };
                    break;
            }

            const questionObj = {
                id: `${i}.${q}`,
                question: questionText,
                type: questionType,
                correctAnswer: correctAnswer,
                points: points,
                options: options,
                feedback: {
                    correct: "Correct!",
                    incorrect: "Incorrect."
                }
            };

            // Add validation object if it exists
            if (validation) {
                questionObj.validation = validation;
            }

            quizzes[i].questions.push(questionObj);
        }
    }

    // Add PHP toggle handling
    const saveResultsViaPhp = document.getElementById('togglePhpResults')?.checked || false;

    let saveResultsFunctionCode;
    if (saveResultsViaPhp) {
        // PHP save results function
        saveResultsFunctionCode = `function saveResults() {
            // Extract test ID from the current script filename
            const scripts = document.getElementsByTagName('script');
            let testId = 'unknown_quiz';

            // Look for the quiz data script (should be the last script with a .js extension)
            for (let i = scripts.length - 1; i >= 0; i--) {
                const src = scripts[i].src;
                if (src && src.endsWith('.js')) {
                    // Extract filename without extension
                    const filename = src.split('/').pop().replace('.js', '');
                    testId = filename;
                    break;
                }
            }

            // Fallback: try to get from quiz metadata if available
            if (testId === 'unknown_quiz' && state.quizData?.metadata?.title) {
                testId = state.quizData.metadata.title.toLowerCase().replace(/\\s+/g, '_');
            }

            const results = {
                studentId: state.studentId,
                timestamp: new Date().toISOString(),
                testID: testId,
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
        }`;
    } else {
        // Client-side implementation for TOGGLE=OFF
        saveResultsFunctionCode = `function saveResults() {
            try {
                // Extract test ID from the current script filename
                const scripts = document.getElementsByTagName('script');
                let testId = 'unknown_quiz';

                // Look for the quiz data script (should be the last script with a .js extension)
                for (let i = scripts.length - 1; i >= 0; i--) {
                    const src = scripts[i].src;
                    if (src && src.endsWith('.js')) {
                        // Extract filename without extension
                        const filename = src.split('/').pop().replace('.js', '');
                        testId = filename;
                        break;
                    }
                }

                // Fallback: try to get from quiz metadata if available
                if (testId === 'unknown_quiz' && state.quizData?.metadata?.title) {
                    testId = state.quizData.metadata.title.toLowerCase().replace(/\\s+/g, '_');
                }

                const results = {
                    studentId: state.studentId,
                    timestamp: new Date().toISOString(),
                    testID: testId,
                    results: state.quizResults
                };

                const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = \`quiz_results_\${state.studentId}.json\`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);

                showError('Results saved successfully!');
            } catch (error) {
                showError('Failed to save results');
                console.error('Save error:', error);
            }
        }`;
    }

    // Process quiz data to ensure image paths are properly handled
    // Create a deep copy of the quizzes object to avoid modifying the original
    const processedQuizzes = JSON.parse(JSON.stringify(quizzes));

    console.log('DEBUG - QUIZ GENERATION:');
    console.log('Original quizzes object:', JSON.stringify(quizzes, null, 2));

    // Process each quiz to handle image paths
    Object.keys(processedQuizzes).forEach(quizId => {
        const quiz = processedQuizzes[quizId];
        if (quiz.questions) {
            quiz.questions.forEach(question => {
                if (question.type === 'imageRate' && question.options && question.options.length > 0) {
                    // Log the original path
                    console.log(`DEBUG - Processing image path for quiz ${quizId}, question ${question.id}:`);
                    console.log(`  - Original path: ${question.options[0]}`);

                    // IMPORTANT FIX: Directly modify the options array to ensure the path is correct
                    // This ensures the path is stored correctly in the generated JS file
                    // The backslashes in JSON.stringify will be properly handled when the JS is executed

                    // No need to modify the path here, just ensure it's logged for debugging
                    console.log(`  - Final path used: ${question.options[0]}`);
                }
            });
        }
    });

    // Generate final JS
    const quizzesJson = JSON.stringify(processedQuizzes, null, 2);

    const generatedJs = `
    // filepath: ${outputFileNamePrefix}.js
    const quizData = {
        "metadata": {
            "title": "Generated Quiz",
            "description": "Auto-generated!",
            "version": "1.0.0",
            "totalQuizzes": ${quizCount},
            "validStudentIds": ${validStudentIds ? JSON.stringify(validStudentIds.map(id => id.replace(/[\r\n]+/g, '').trim())) : null},
            "anyIdAllowed": ${document.getElementById('anyIdAllowed')?.checked || false},
            "passingScore": 70,
            "videoSourceType": "${sourceType}" // Store the video source type
        },
        "quizSchedule": ${JSON.stringify(quizSchedule)},
        "quizzes": ${quizzesJson}
    };



    ${sourceType === 'youtube' ? `
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
    ` : ''}

    ${quizImplementation.replace(/function saveResults\(\)[\s\S]*?^}(?=\n*\/\/ Initialize)/m, saveResultsFunctionCode)}`;

    // Generate final HTML (remove the YouTube-specific CSS link)
    const generatedHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Video with Quiz</title>
        <link rel="stylesheet" href="video_with_quiz.css">
        ${sourceType === 'youtube' ? '<script src="https://www.youtube.com/iframe_api"></script>' : ''}
    </head>
    <body>
        <main>
            <!-- Video Section -->
            <section class="video-container" aria-label="Lecture Video">
                ${embedCode}
            </section>

            <!-- Quiz Section -->
            <section id="quiz-container" aria-label="Quiz Section">
                <!-- Loading State -->
                <div id="quiz-loading" class="loading" role="status" aria-live="polite"></div>

                <!-- Quiz Progress -->
                <div class="quiz-progress" aria-label="Quiz Progress">
                    <div id="progress-indicator"></div>
                </div>

                <!-- Quiz Questions -->
                ${Array.from({ length: quizCount }, (_, i) => `<div id="quiz-${i + 1}" class="quiz-section" aria-label="Quiz ${i + 1}"></div>`).join('\n                ')}
            </section>

            <!-- Results Section -->
            <section id="results-section" aria-label="Quiz Results">
                <div id="results-container"></div>
                <button id="submitResults" class="submit-button" aria-label="Submit Final Results">
                    Submit Final Results
                </button>
            </section>

            <!-- Configuration Settings -->
            <input type="hidden" id="responsesMandatedSetting" value="${responsesMandated}">
        </main>

        <!-- Templates -->
        <template id="error-template">
            <div class="error-message" role="alert">
                <p></p>
            </div>
        </template>

        <template id="feedback-template">
            <div class="feedback" role="alert">
                <p></p>
            </div>
        </template>
        <script src="${outputFileNamePrefix}.js" defer></script>
    </body>
    </html>
    `;

    // Create downloadable files
    downloadFile(`${outputFileNamePrefix}.js`, generatedJs);
    downloadFile(`${outputFileNamePrefix}.html`, generatedHtml);
}

// JSON config handler
async function handleJsonConfigUpload(event) {
    const file = event.target.files[0];
    const status = document.getElementById('jsonUploadStatus');

    if (!file) return;

    try {
        // Try client-side file reading first (works offline)
        const config = JSON.parse(await file.text());
        // Clean and validate JSON structure
        if (!config.videoConfig?.source) {
            throw new Error('Missing videoConfig.source in JSON');
        }
        if (!Array.isArray(config.quizSchedule)) {
            throw new Error('quizSchedule must be an array');
        }
        if (!config.quizzes || typeof config.quizzes !== 'object') {
            throw new Error('Missing quizzes object in JSON');
        }

        // Clean student IDs if present
        if (config.metadata?.validStudentIds) {
            config.metadata.validStudentIds = config.metadata.validStudentIds.map(id =>
                id.replace(/[\r\n]+/g, '').trim()
            );
        }

        populateFormFromJson(config);
        status.textContent = "Config loaded successfully!";
        status.style.color = 'green';
    } catch (clientError) {
        console.error('Client-side JSON parsing failed, trying server-side:', clientError);

        // If client-side fails, try server-side (for online mode)
        // Store the file name for potential server-side fallback
        const fileName = file.name;

        try {
            // Try to use the server-side file handler
            const response = await fetch(`file_access.php?action=load_json&file=${encodeURIComponent(fileName)}`);

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const config = await response.json();

            // Validate the JSON structure
            if (!config.videoConfig?.source) {
                throw new Error('Missing videoConfig.source in JSON');
            }
            if (!Array.isArray(config.quizSchedule)) {
                throw new Error('quizSchedule must be an array');
            }
            if (!config.quizzes || typeof config.quizzes !== 'object') {
                throw new Error('Missing quizzes object in JSON');
            }

            // Clean student IDs if present
            if (config.metadata?.validStudentIds) {
                config.metadata.validStudentIds = config.metadata.validStudentIds.map(id =>
                    id.replace(/[\r\n]+/g, '').trim()
                );
            }

            populateFormFromJson(config);
            status.textContent = "Config loaded successfully (server-side)!";
            status.style.color = 'green';
        } catch (serverError) {
            console.error('Server-side JSON parsing also failed:', serverError);
            status.textContent = `Error: ${serverError.message || 'Failed to load JSON from server'}`;
            status.style.color = 'red';
            console.error('JSON config error:', serverError);
        }
    }
}

function exportJsonFile() {
    // Gather quiz data (similar to generateFiles, but only produce JSON)
    const videoSource = document.getElementById('videoSource').value.trim();
    const quizCount = parseInt(document.getElementById('quizCount').value, 10) || 0;
    const responsesMandated = document.getElementById('responsesMandated').checked;

    const quizSchedule = [];
    const quizzes = {};

    for (let i = 1; i <= quizCount; i++) {
        const time = parseInt(document.getElementById(`quizTime${i}`).value, 10) || 0;
        const quizId = i;
        const title = document.getElementById(`quizTitle${i}`).value;
        const description = document.getElementById(`quizDesc${i}`).value;
        const presentItems = document.getElementById(`presentItems${i}`).value;
        const timeLimit = parseInt(document.getElementById(`timeLimit${i}`).value, 10) || 180;

        quizSchedule.push({ time, quizId, title, description });
        quizzes[i] = {
            title,
            description,
            present_items: presentItems,
            timeLimit,
            questions: []
        };

        // Gather questions
        const questionCount = parseInt(document.getElementById(`questionCount${i}`).value, 10) || 0;
        for (let q = 1; q <= questionCount; q++) {
            const questionText = document.getElementById(`qText${i}-${q}`).value;
            const questionType = document.getElementById(`qType${i}-${q}`).value;
            let points = parseInt(document.getElementById(`qPoints${i}-${q}`).value, 10) || 5;
            let correctAnswer = '';
            let options = [];
            let validation = null;

            switch (questionType) {
                case 'instructions':
                    const content = document.getElementById(`qContent${i}-${q}`).value;
                    correctAnswer = 'N/A'; // Instructions don't have correct answers
                    points = 0; // Instructions don't contribute to scoring
                    options = { content: content }; // Store content in options for consistency
                    break;
                case 'multipleChoice':
                    options = document.getElementById(`qOptions${i}-${q}`).value.split(',');
                    correctAnswer = document.getElementById(`qCorrect${i}-${q}`).value;
                    break;
                case 'trueFalse':
                    correctAnswer = document.getElementById(`qCorrect${i}-${q}`).value;
                    break;
                case 'shortAnswer':
                    correctAnswer = 'true'; // Placeholder
                    // Add validation object with min and max length
                    const minLength = parseInt(document.getElementById(`qMinLength${i}-${q}`).value, 10) || 2;
                    const maxLength = parseInt(document.getElementById(`qMaxLength${i}-${q}`).value, 10) || 10000;
                    validation = {
                        minLength: minLength,
                        maxLength: maxLength,
                        required: true
                    };
                    break;
                case 'imageRate':
                    correctAnswer = 'true'; // Placeholder
                    // Get image path
                    let imagePath = document.getElementById(`qImagePath${i}-${q}`).value.trim();

                    // Clean up the image path - remove quotes and normalize slashes
                    imagePath = imagePath.replace(/^["']|["']$/g, ''); // Remove surrounding quotes
                    imagePath = imagePath.replace(/\\/g, '/'); // Convert backslashes to forward slashes

                    // Ensure the image path is properly formatted
                    // If it's not a URL (doesn't start with http:// or https://) and doesn't start with a slash,
                    // we'll assume it's a relative path
                    if (!imagePath.match(/^(https?:\/\/|\/)/)) {
                        // It's a relative path, keep as is
                        console.log(`Using relative image path: ${imagePath}`);
                    }

                    // Add validation object with min and max length
                    const imgMinLength = parseInt(document.getElementById(`qMinLength${i}-${q}`).value, 10) || 2;
                    const imgMaxLength = parseInt(document.getElementById(`qMaxLength${i}-${q}`).value, 10) || 10000;
                    validation = {
                        minLength: imgMinLength,
                        maxLength: imgMaxLength,
                        required: true
                    };
                    // Store image path in options array for consistency
                    options = [imagePath];
                    break;
                case 'sliderRating':
                    correctAnswer = 'true'; // Placeholder, not used for slider

                    // Get slider parameters
                    const sliderLeftValue = parseInt(document.getElementById(`qSliderLeftValue${i}-${q}`).value, 10) || 1;
                    const sliderRightValue = parseInt(document.getElementById(`qSliderRightValue${i}-${q}`).value, 10) || 5;
                    const sliderLeftLabel = document.getElementById(`qSliderLeftLabel${i}-${q}`).value.trim() || 'Weak';
                    const sliderRightLabel = document.getElementById(`qSliderRightLabel${i}-${q}`).value.trim() || 'Strong';
                    const sliderText = document.getElementById(`qSliderText${i}-${q}`).value.trim() || 'This is a slider scale.';

                    // Store slider parameters in options object
                    options = {
                        leftValue: sliderLeftValue,
                        rightValue: sliderRightValue,
                        leftLabel: sliderLeftLabel,
                        rightLabel: sliderRightLabel,
                        sliderText: sliderText
                    };
                    break;
            }

            const questionObj = {
                id: `${i}.${q}`,
                question: questionText,
                type: questionType,
                correctAnswer: correctAnswer,
                points: points,
                options: options,
                feedback: {
                    correct: "Correct!",
                    incorrect: "Incorrect."
                }
            };

            // Add validation object if it exists
            if (validation) {
                questionObj.validation = validation;
            }

            quizzes[i].questions.push(questionObj);
        }
    }

    const exportedJson = {
        "$schema": "./quiz_schema.json",
        "videoConfig": {
            "source": videoSource || "video.mp4",
            "startOffset": 0,
            "endPadding": 5
        },
        "responsesMandated": responsesMandated,
        "quizSchedule": quizSchedule,
        "quizzes": quizzes
    };

    // Use user-defined filename or default
    let exportFileName = document.getElementById('exportFileName').value.trim();
    if (!exportFileName) {
        exportFileName = 'my_question_bank.json';
    }

    const blob = new Blob([JSON.stringify(exportedJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = exportFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quizGeneratorForm');
    const quizzesContainer = document.getElementById('quizzesContainer');
    const generateQuizFieldsButton = document.getElementById('generateQuizFields');

    // Add JSON config uploader
    const jsonUploadContainer = document.createElement('div');
    jsonUploadContainer.className = 'upload-section';
    jsonUploadContainer.innerHTML = `
        <h3>Upload JSON Config</h3>
        <input type="file" id="jsonConfigUpload" accept=".json" hidden>
        <label for="jsonConfigUpload" class="upload-label">
            <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            Choose JSON File
        </label>
        <div id="jsonUploadStatus"></div>
    `;
    quizzesContainer.parentNode.insertBefore(jsonUploadContainer, quizzesContainer);

    // Handle JSON config upload
    document.getElementById('jsonConfigUpload').addEventListener('change', handleJsonConfigUpload);
    const uploadIdsBtn = document.getElementById('uploadIdsBtn');
    const idFileInput = document.getElementById('idFile');
    const uploadStatus = document.getElementById('uploadStatus');

    // Handle ID file upload
    uploadIdsBtn.addEventListener('click', () => {
        idFileInput.click();
    });

    idFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Try client-side file reading first (works offline)
                const text = await file.text();
                // Split by newline or comma, clean up whitespace and remove \r\n
                validStudentIds = text.split(/[\n,]/)
                    .map(id => id.replace(/[\r\n]+/g, '').trim())
                    .filter(id => id.length > 0);
                uploadStatus.textContent = `Loaded ${validStudentIds.length} valid IDs`;
            } catch (error) {
                console.error('Client-side file reading failed, trying server-side:', error);

                // If client-side fails, try server-side (for online mode)
                // Store the file name for potential server-side fallback
                const fileName = file.name;

                try {
                    // Try to use the server-side file handler
                    const response = await fetch(`file_access.php?action=load_ids&file=${encodeURIComponent(fileName)}`);

                    if (!response.ok) {
                        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
                    }

                    const data = await response.json();

                    if (data.status === 'success' && Array.isArray(data.ids)) {
                        validStudentIds = data.ids;
                        uploadStatus.textContent = `Loaded ${validStudentIds.length} valid IDs (server-side)`;
                    } else {
                        throw new Error(data.message || 'Failed to load IDs from server');
                    }
                } catch (serverError) {
                    console.error('Server-side file reading also failed:', serverError);
                    uploadStatus.textContent = 'Error reading file (both client and server-side failed)';
                    validStudentIds = null;
                }
            }
        }
    });

    // Generate quiz input fields
    generateQuizFieldsButton.addEventListener('click', () => {
        const quizCount = parseInt(document.getElementById('quizCount').value);
        quizzesContainer.innerHTML = ''; // Clear existing fields

        for (let i = 1; i <= quizCount; i++) {
            const quizSection = document.createElement('div');
            quizSection.classList.add('quiz-section');
            quizSection.innerHTML = `
                <h3>Quiz ${i}</h3>
                <div>
                    <label>Time Stamp (seconds): <input type="number" id="quizTime${i}" required></label>
                </div>
                <div>
                    <label>Title: <input type="text" id="quizTitle${i}" required></label>
                </div>
                <div>
                    <label>Description: <input type="text" id="quizDesc${i}" required></label>
                </div>
                <div>
                    <label>Present Items (number or "ALL"):
                        <input type="text" id="presentItems${i}" value="ALL" required>
                    </label>
                </div>
                <div>
                    <label>Time Limit (seconds):
                        <input type="number" id="timeLimit${i}" value="180" required>
                    </label>
                </div>
                <div>
                    <label>Number of Questions:
                        <input type="number" id="questionCount${i}" min="1" required>
                    </label>
                    <button type="button" onclick="generateQuestionFields(${i})">Add Questions</button>
                </div>
                <div id="questions${i}"></div>
            `;
            quizzesContainer.appendChild(quizSection);
        }
    });

    // Generate question fields
    window.generateQuestionFields = (quizId) => {
        const questionCount = parseInt(document.getElementById(`questionCount${quizId}`).value);
        const questionsContainer = document.getElementById(`questions${quizId}`);
        questionsContainer.innerHTML = '';

        for (let q = 1; q <= questionCount; q++) {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-section');
            questionDiv.innerHTML = `
                <h4>Question ${q}</h4>
                <div>
                    <label>Question Text:
                        <input type="text" id="qText${quizId}-${q}" required>
                    </label>
                </div>
                <div>
                    <label>Question Type:
                        <select id="qType${quizId}-${q}" onchange="showTypeOptions(${quizId}, ${q})" required>
                            <option value="instructions">Instructions</option>
                            <option value="multipleChoice">Multiple Choice</option>
                            <option value="trueFalse">True/False</option>
                            <option value="shortAnswer">Short Answer</option>
                            <option value="imageRate">Image Rate</option>
                            <option value="sliderRating">Slider Rating</option>
                        </select>
                    </label>
                </div>
                <div id="typeOptions${quizId}-${q}"></div>
                <div>
                    <label>Points:
                        <input type="number" id="qPoints${quizId}-${q}" value="5" required>
                    </label>
                </div>
            `;
            questionsContainer.appendChild(questionDiv);
            showTypeOptions(quizId, q);
        }
    };

    // Show type-specific options
    window.showTypeOptions = (quizId, questionNum) => {
        const type = document.getElementById(`qType${quizId}-${questionNum}`).value;
        const container = document.getElementById(`typeOptions${quizId}-${questionNum}`);

        let html = '';
        switch (type) {
            case 'instructions':
                html = `
                    <div>
                        <label>Instructions Content (HTML):
                            <textarea
                                id="qContent${quizId}-${questionNum}"
                                rows="6"
                                style="width: 100%; resize: vertical; min-height: 120px;"
                                placeholder="Enter HTML content for instructions..."
                                required>
                            </textarea>
                        </label>
                        <button type="button" id="htmlHelpBtn${quizId}-${questionNum}" onclick="toggleHtmlHelp(${quizId}, ${questionNum})" style="margin-top: 5px; padding: 5px 10px; background: #f0f0f0; border: 1px solid #ccc; border-radius: 4px; cursor: pointer;">
                            📖 Show HTML Examples
                        </button>
                        <div id="htmlHelp${quizId}-${questionNum}" class="html-help" style="display: none; margin-top: 10px; padding: 15px; background: #f9f9f9; border: 1px solid #ddd; border-radius: 4px; font-size: 0.9em;">
                            <h4 style="margin-top: 0;">HTML Examples:</h4>
                            <p><strong>Bold text:</strong> <code>&lt;strong&gt;Important&lt;/strong&gt;</code></p>
                            <p><strong>Italic text:</strong> <code>&lt;em&gt;emphasis&lt;/em&gt;</code></p>
                            <p><strong>Headers:</strong> <code>&lt;h2&gt;Section Title&lt;/h2&gt;</code></p>
                            <p><strong>Line break:</strong> <code>&lt;br&gt;</code></p>
                            <p><strong>Paragraph:</strong> <code>&lt;p&gt;Your text here&lt;/p&gt;</code></p>
                            <p><strong>Unordered list:</strong></p>
                            <pre>&lt;ul&gt;
  &lt;li&gt;First item&lt;/li&gt;
  &lt;li&gt;Second item&lt;/li&gt;
&lt;/ul&gt;</pre>
                            <p><strong>Ordered list:</strong></p>
                            <pre>&lt;ol&gt;
  &lt;li&gt;Step one&lt;/li&gt;
  &lt;li&gt;Step two&lt;/li&gt;
&lt;/ol&gt;</pre>
                            <p><strong>Link:</strong> <code>&lt;a href="https://example.com" target="_blank"&gt;Link text&lt;/a&gt;</code></p>
                            <p><strong>Image:</strong> <code>&lt;img src="images/photo.jpg" alt="Description" style="max-width: 100%;"&gt;</code></p>
                        </div>
                    </div>
                `;
                break;
            case 'multipleChoice':
                html = `
                    <div>
                        <label>Options (comma-separated):
                            <input type="text" id="qOptions${quizId}-${questionNum}" required>
                        </label>
                    </div>
                    <div>
                        <label>Correct Answer (a, b, c, ...):
                            <input type="text" id="qCorrect${quizId}-${questionNum}" required>
                        </label>
                    </div>
                `;
                break;
            case 'trueFalse':
                html = `
                    <div>
                        <label>Correct Answer:
                            <select id="qCorrect${quizId}-${questionNum}" required>
                                <option value="true">True</option>
                                <option value="false">False</option>
                            </select>
                        </label>
                    </div>
                `;
                break;
            case 'shortAnswer':
                html = `
                    <div>
                        <label>Minimum Length:
                            <input type="number" id="qMinLength${quizId}-${questionNum}" value="2">
                        </label>
                    </div>
                    <div>
                        <label>Maximum Length:
                            <input type="number" id="qMaxLength${quizId}-${questionNum}" value="10000">
                        </label>
                    </div>
                `;
                break;
            case 'imageRate':
                html = `
                    <div>
                        <label>Image Path:
                            <input type="text" id="qImagePath${quizId}-${questionNum}"
                                placeholder="images/example.jpg or https://example.com/image.jpg" required>
                        </label>
                        <div class="form-help">
                            <strong>Image Path Options:</strong><br>
                            - Local relative path (e.g., <code>images/photo.jpg</code>)<br>
                            - Full URL (e.g., <code>https://example.com/image.jpg</code>)<br>
                            <em>Note: For local paths, make sure the image is accessible relative to the generated HTML file</em>
                        </div>
                    </div>
                    <div>
                        <label>Minimum Length:
                            <input type="number" id="qMinLength${quizId}-${questionNum}" value="2">
                        </label>
                    </div>
                    <div>
                        <label>Maximum Length:
                            <input type="number" id="qMaxLength${quizId}-${questionNum}" value="10000">
                        </label>
                    </div>
                `;
                break;
            case 'sliderRating':
                html = `
                    <div>
                        <label>Left Value (numeric):
                            <input type="number" id="qSliderLeftValue${quizId}-${questionNum}" value="1" required>
                        </label>
                    </div>
                    <div>
                        <label>Right Value (numeric):
                            <input type="number" id="qSliderRightValue${quizId}-${questionNum}" value="5" required>
                        </label>
                    </div>
                    <div>
                        <label>Left Anchor Label:
                            <input type="text" id="qSliderLeftLabel${quizId}-${questionNum}" value="Weak" required>
                        </label>
                    </div>
                    <div>
                        <label>Right Anchor Label:
                            <input type="text" id="qSliderRightLabel${quizId}-${questionNum}" value="Strong" required>
                        </label>
                    </div>
                    <div>
                        <label>Slider Text:
                            <input type="text" id="qSliderText${quizId}-${questionNum}" value="This is a slider scale." required>
                        </label>
                    </div>
                `;
                break;
        }
        container.innerHTML = html;
    };

    // Handle form submission and file generation
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        generateFiles();
    });

    const exportJsonBtn = document.getElementById('exportJsonBtn');
    exportJsonBtn.addEventListener('click', exportJsonFile);

    // Update event listeners to change help text based on selected source type
    document.getElementById('filePathSource').addEventListener('change', updateSourceHelp);
    document.getElementById('youtubeSource').addEventListener('change', updateSourceHelp);
});

// Function to toggle HTML help section for Instructions
function toggleHtmlHelp(quizId, questionNum) {
    const helpDiv = document.getElementById(`htmlHelp${quizId}-${questionNum}`);
    const buttonId = `htmlHelpBtn${quizId}-${questionNum}`;
    const button = document.getElementById(buttonId);

    if (helpDiv.style.display === 'none') {
        helpDiv.style.display = 'block';
        button.textContent = '📖 Hide HTML Examples';
    } else {
        helpDiv.style.display = 'none';
        button.textContent = '📖 Show HTML Examples';
    }
}

function getVideoSourceType() {
    return document.querySelector('input[name="videoSourceType"]:checked').value;
}

function extractYouTubeId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

function updateSourceHelp() {
    const sourceType = getVideoSourceType();
    const helpText = document.getElementById('videoSourceHelp');

    if (sourceType === 'youtube') {
        helpText.textContent = 'Enter a YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEOID)';
    } else {
        helpText.textContent = 'Enter the path to your video file (e.g., videos/lecture.mp4)';
    }
}

/**
 * Helper function to detect if we're running online or offline
 * This helps determine which file loading method to use
 */
function isRunningOnline() {
    // Check if we're running on a web server (http or https protocol)
    return window.location.protocol === 'http:' || window.location.protocol === 'https:';
}