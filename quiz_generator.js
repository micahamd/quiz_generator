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
                    maxlength="\${question.validation?.maxLength || 100}"
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
            
        default:
            return '';
    }
}

function checkAnswers(quizId, questions) {
    const quiz = state.quizData.quizzes[quizId];
    let allAnswered = true;
    let score = 0;
    
    questions.forEach((question, index) => {
        const questionElement = document.querySelector(\`[data-question-id="\${question.id}"]\`);
        const feedbackElement = questionElement.querySelector('.feedback');
        let answer;
        
        if (question.type === 'shortAnswer') {
            const inputElement = document.querySelector(\`input[name="q\${quizId}-\${index}"]\`);
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
            const selected = document.querySelector(\`input[name="q\${quizId}-\${index}"]:checked\`);
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
    document.getElementById(\`quiz-\${quizId}\`).style.display = 'none';
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
    document.getElementById('quizCount').value = json.quizSchedule.length;
    
    // Create quiz sections
    document.getElementById('generateQuizFields').click();
    
    // Populate each quiz from quizSchedule
    json.quizSchedule.forEach((schedule, index) => {
        const quizId = index + 1;
        const quizElem = document.getElementById(`quizTime${quizId}`);
        const quiz = json.quizzes[schedule.quizId];
        if (quizElem) {
            quizElem.value = quiz.timestamp;
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
                
                if (question.type === 'multipleChoice') {
                    document.getElementById(`qOptions${quizId}-${qIndex + 1}`).value = 
                        question.options.join(',');
                    document.getElementById(`qCorrect${quizId}-${qIndex + 1}`).value = 
                        question.correctAnswer;
                } else if (question.type === 'trueFalse') {
                    document.getElementById(`qCorrect${quizId}-${qIndex + 1}`).value = 
                        question.correctAnswer.toString();
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

// Main function to generate quiz files
// Global variable for student IDs (as in the original)
let validStudentIds = null;

function generateFiles() {
    // Collect basic info
    const videoSource = document.getElementById('videoSource').value.trim();
    const sanitizedVideoSource = videoSource.replace(/["']/g, '');
    const quizCount = parseInt(document.getElementById('quizCount').value, 10) || 0;

    // Add Student IDs handling (using global validStudentIds)
    const idFileInput = document.getElementById('idFile');
    if (idFileInput && idFileInput.files.length > 0) {
        const file = idFileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                validStudentIds = event.target.result.trim().split('\n').filter(id => id.length > 0);
            };
            reader.readAsText(file);
        }
    }

    // Build quiz data structure (using 'i' as key, as in original)
    const quizSchedule = [];
    const quizzes = {};

    for (let i = 1; i <= quizCount; i++) {
        const time = parseInt(document.getElementById(`quizTime${i}`).value, 10) || 0;
        const quizId = i; // Use 'i' directly as quizId (number), as in original
        const title = document.getElementById(`quizTitle${i}`).value;
        const description = document.getElementById(`quizDesc${i}`).value;
        const presentItems = document.getElementById(`presentItems${i}`).value;
        const timeLimit = parseInt(document.getElementById(`timeLimit${i}`).value, 10) || 180;

        quizSchedule.push({ time, quizId, title, description });
        quizzes[i] = { // Use 'i' as key for quizzes object, as in original
            title: title,
            description: description,
            present_items: presentItems,
            timeLimit: timeLimit,
            questions: []
        };

        // Question gathering logic remains the same (using 'i' for quizId in question IDs)
        const questionCount = parseInt(document.getElementById(`questionCount${i}`).value, 10) || 0;
        for (let q = 1; q <= questionCount; q++) {
            const questionText = document.getElementById(`qText${i}-${q}`).value;
            const questionType = document.getElementById(`qType${i}-${q}`).value;
            const points = parseInt(document.getElementById(`qPoints${i}-${q}`).value, 10) || 5;
            let correctAnswer = '';
            let options = [];

            switch (questionType) {
                case 'multipleChoice':
                    options = document.getElementById(`qOptions${i}-${q}`).value.split(',');
                    correctAnswer = document.getElementById(`qCorrect${i}-${q}`).value;
                    break;
                case 'trueFalse':
                    correctAnswer = document.getElementById(`qCorrect${i}-${q}`).value;
                    break;
                case 'shortAnswer':
                    correctAnswer = 'true'; // Placeholder
                    break;
            }

            quizzes[i].questions.push({ // Use 'i' for quizId in question IDs, as in original
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
            });
        }
    }

    // Add PHP toggle handling (using ternary operator and robust regex)
    const saveResultsViaPhp = document.getElementById('togglePhpResults')?.checked || false;

    let saveResultsFunctionCode = saveResultsViaPhp ?
        // PHP save results function
        `function saveResults() {
            const results = {
                studentId: state.studentId,
                timestamp: new Date().toISOString(),
                results: state.quizResults
            };

            showLoading(true); // Show loading indicator during submission

            fetch('save_results.php', { //  <---  Path to your PHP script (adjust if needed)
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(results)
            })
            .then(response => {
                showLoading(false); // Hide loading indicator after response
                if (!response.ok) {
                    throw new Error('HTTP error! status: ' + response.status);
                }
                return response.json(); // Expecting JSON response from PHP
            })
            .then(data => {
                if (data.status === 'success') {
                    showError('Results saved successfully on the server!');
                } else {
                    showError('Failed to save results: ' + data.message);
                    console.error('Server save error:', data.message);
                }
            })
            .catch(error => {
                showLoading(false); // Ensure loading indicator is hidden on error
                showError('Error saving results. Please try again later.');
                console.error('Fetch error:', error);
            });
        }` :
        // Original JSON download function (extracted from quizImplementation)
        quizImplementation.match(/function saveResults\(\) \{[\s\S]*?\}/)[0];


    // Generate final JS - Inject the dynamically selected saveResultsFunctionCode **(INSIDE generatedJs)**
    const generatedJs = `
    // filepath: generated_video_quiz.js
    const quizData = {
        "metadata": {
            "title": "Generated Quiz",
            "description": "Auto-generated!",
            "version": "1.0.0",
            "totalQuizzes": ${quizCount},
            "validStudentIds": ${validStudentIds ? JSON.stringify(validStudentIds) : null},
            "passingScore": 70
        },
        "quizSchedule": ${JSON.stringify(quizSchedule)},
        "quizzes": ${JSON.stringify(quizzes, null, 2)}
    };
    ${quizImplementation.replace(/function saveResults\(\) \{[\s\S]*?\}/, saveResultsFunctionCode)}
    `;

    // Generate final HTML (remains unchanged - using backticks for template literal consistency)
    const generatedHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Video with Quiz</title>
        <link rel="stylesheet" href="video_with_quiz.css">
    </head>
    <body>
        <main>
            <!-- Video Section -->
            <section class="video-container" aria-label="Lecture Video">
                <video id="myVideo" controls aria-label="Lecture content">
                    <source src="${sanitizedVideoSource}" type="video/mp4">
                    <p>Your browser does not support the video tag.</p>
                </video>
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
        </main>

        <!-- Error Message Template -->
        <template id="error-template">
            <div class="error-message" role="alert">
                <p></p>
            </div>
        </template>

        <!-- Question Feedback Template -->
        <template id="feedback-template">
            <div class="feedback" role="alert">
                <p></p>
            </div>
        </template>

        <script src="generated_video_quiz.js" defer></script>
    </body>
    </html>
    `;


    // Create downloadable files
    downloadFile('generated_video_quiz.js', generatedJs);
    downloadFile('generated_video_quiz.html', generatedHtml);
}

// JSON config handler
async function handleJsonConfigUpload(event) {
    const file = event.target.files[0];
    const status = document.getElementById('jsonUploadStatus');
    
    if (!file) return;
    
    try {
        const config = JSON.parse(await file.text());
        
        // Validate JSON structure
        if (!config.videoConfig?.source) {
            throw new Error('Missing videoConfig.source in JSON');
        }
        if (!Array.isArray(config.quizSchedule)) {
            throw new Error('quizSchedule must be an array');
        }
        if (!config.quizzes || typeof config.quizzes !== 'object') {
            throw new Error('Missing quizzes object in JSON');
        }
        
        populateFormFromJson(config);
        status.textContent = "Config loaded successfully!";
        status.style.color = 'green';
    } catch (error) {
        status.textContent = `Error: ${error.message}`;
        status.style.color = 'red';
        console.error('JSON config error:', error);
    }
}

function exportJsonFile() {
    // Gather quiz data (similar to generateFiles, but only produce JSON)
    const videoSource = document.getElementById('videoSource').value.trim();
    const quizCount = parseInt(document.getElementById('quizCount').value, 10) || 0;
    
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
            timeLimit: timeLimit,
            questions: []
        };
        
        // Gather questions
        const questionCount = parseInt(document.getElementById(`questionCount${i}`).value, 10) || 0;
        for (let q = 1; q <= questionCount; q++) {
            const questionText = document.getElementById(`qText${i}-${q}`).value;
            const questionType = document.getElementById(`qType${i}-${q}`).value;
            const points = parseInt(document.getElementById(`qPoints${i}-${q}`).value, 10) || 5;
            let correctAnswer = '';
            let options = [];
            
            switch (questionType) {
                case 'multipleChoice':
                    options = document.getElementById(`qOptions${i}-${q}`).value.split(',');
                    correctAnswer = document.getElementById(`qCorrect${i}-${q}`).value;
                    break;
                case 'trueFalse':
                    correctAnswer = document.getElementById(`qCorrect${i}-${q}`).value;
                    break;
                case 'shortAnswer':
                    correctAnswer = 'true'; // Placeholder
                    break;
            }
            
            quizzes[i].questions.push({
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
            });
        }
    }
    
    const exportedJson = {
        "$schema": "./quiz_schema.json",
        "videoConfig": {
            "source": videoSource || "video.mp4",
            "startOffset": 0,
            "endPadding": 5
        },
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
                const text = await file.text();
                // Split by newline or comma and clean up whitespace
                validStudentIds = text.split(/[\n,]/)
                    .map(id => id.trim())
                    .filter(id => id.length > 0);
                uploadStatus.textContent = `Loaded ${validStudentIds.length} valid IDs`;
            } catch (error) {
                console.error('Error reading file:', error);
                uploadStatus.textContent = 'Error reading file';
                validStudentIds = null;
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
                            <option value="multipleChoice">Multiple Choice</option>
                            <option value="trueFalse">True/False</option>
                            <option value="shortAnswer">Short Answer</option>
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
                            <input type="number" id="qMaxLength${quizId}-${questionNum}" value="100">
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
});
