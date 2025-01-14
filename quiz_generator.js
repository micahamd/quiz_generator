document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quizGeneratorForm');
    const quizzesContainer = document.getElementById('quizzesContainer');
    const generateQuizFieldsButton = document.getElementById('generateQuizFields');
    
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

    // ... rest of your existing generation code ...
});

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

function generateFiles() {
    // Collect basic info
    const videoSource = document.getElementById('videoSource').value.trim();
    const sanitizedVideoSource = videoSource.replace(/["']/g, ''); // <-- Remove any quotes
    const quizCount = parseInt(document.getElementById('quizCount').value, 10) || 0;
    
    // Build quiz data structure
    const quizSchedule = [];
    const quizzes = {};
    
    for (let i = 1; i <= quizCount; i++) {
        // ...existing code to retrieve form fields for each quiz...
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
            // ...existing question form collection...
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
    
    // Generate final JS
    const generatedJs = `
    // filepath: video_with_quiz.js
    // ...existing code...
    const quizData = {
        "metadata": {
            "title": "Generated Quiz",
            "description": "Auto-generated!",
            "version": "1.0.0",
            "totalQuizzes": ${quizCount},
            "validStudentIdPattern": "^[A-Z]\\\\d{7}$",
            "passingScore": 70
        },
        "quizSchedule": ${JSON.stringify(quizSchedule)},
        "quizzes": ${JSON.stringify(quizzes, null, 2)}
    };
    // ...existing code...
    `;
    
    // Generate final HTML
    const generatedHtml = `
    <!-- filepath: video_with_quiz.html -->
    <!DOCTYPE html>
    <html lang="en">
    <!-- ...existing code... -->
    <body>
        <video id="myVideo" controls>
            <source src="${sanitizedVideoSource}" type="video/mp4">
        </video>
        <!-- ...existing code / quiz containers... -->
        <script src="video_with_quiz.js"></script>
    </body>
    </html>
    `;
    
    // Display output or create downloadable files
    outputContainer.textContent = "JS:\n" + generatedJs + "\n\nHTML:\n" + generatedHtml;
}