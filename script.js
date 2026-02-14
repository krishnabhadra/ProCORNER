// ==========================================
// 1. CONFIGURATION
// ==========================================
// NEW WAY: Read from config.js
// If config is missing (on GitHub), use a placeholder to prevent errors
const GROQ_API_KEY = (typeof CONFIG !== 'undefined') ? CONFIG.GROQ_API_KEY : "";; 

// ==========================================
// 2. DOM ELEMENTS & GLOBAL STATE
// ==========================================
const views = {
    landing: document.getElementById('landing-view'),
    dashboard: document.getElementById('dashboard-view'),
    syllabus: document.getElementById('syllabus-view'),
    notes: document.getElementById('notes-view'),
    qp: document.getElementById('qp-view'),
    quiz: document.getElementById('quiz-view') // <--- THIS WAS MISSING
};

const modal = document.getElementById('selection-modal');
const userBadge = document.getElementById('user-badge');

// Global Variables
let currentContext = "";
let currentNoteSubject = "";
let currentQPSubject = "";
let currentQuizSubject = 'VLSI Design';
let currentQuestionIndex = 0;
let userScore = 0;
let quizQuestions = [];

// ==========================================
// 3. DATABASES
// ==========================================
const syllabusDatabase = {
    'VLSI Design': `COURSE: VLSI Design. Module 1: Moore's Law, Scaling. Module 2: CMOS Inverter. Module 3: Pass Transistor Logic. Module 4: Sequential Circuits. Module 5: Arithmetic Circuits. Module 6: FPGA.`,
    'ITC': `COURSE: ITC. Module 1: Entropy. Module 2: Huffman Coding. Module 3: Channel Capacity. Module 4: Linear Block Codes. Module 5: Viterbi Algorithm.`,
    'Electromagnetics': `COURSE: EMT. Module 1: Vector Calculus. Module 2: Maxwell Eq. Module 3: Wave Propagation. Module 4: Transmission Lines. Module 5: Waveguides.`,
    'Embedded Systems': `COURSE: Embedded. Module 1: Microcontrollers. Module 2: ARM Arch. Module 3: Embedded C. Module 4: RTOS. Module 5: Communication Protocols.`
};

const subjectData = {
    'VLSI Design': { topics: ["Moore's Law", "CMOS Inverter", "Twin-Tub Process", "Pass Transistor Logic", "FPGA"], files: [{name:"M1 Notes", link:"#"}, {name:"QB", link:"#"}] },
    'ITC': { topics: ["Entropy", "Huffman", "Shannon-Fano", "Channel Capacity", "Viterbi"], files: [{name:"Textbook", link:"#"}, {name:"Formulas", link:"#"}] },
    'Electromagnetics': { topics: ["Maxwell Eq", "Gauss Law", "Poynting Vector", "Smith Chart", "T-Lines"], files: [{name:"Solutions", link:"#"}, {name:"M1 Notes", link:"#"}] },
    'Embedded Systems': { topics: ["ARM Arch", "Pipeline", "RTOS", "I2C Protocol", "Interrupts"], files: [{name:"Lab Manual", link:"#"}, {name:"Prev QP", link:"#"}] }
};

const qpDatabase = {
    'VLSI Design': { high: "Mod 2 & 5", repeated: [{q:"Explain CMOS Inverter VTC", c:5}, {q:"Twin-Tub Process", c:4}, {q:"Wallace Tree Multiplier", c:3}] },
    'ITC': { high: "Mod 2 & 5", repeated: [{q:"Channel Capacity Theorem", c:5}, {q:"Viterbi Algorithm", c:5}, {q:"Huffman Coding", c:4}] },
    'Electromagnetics': { high: "Mod 2 & 4", repeated: [{q:"Maxwell Eq Integral Form", c:6}, {q:"Poynting Vector", c:4}, {q:"Wave Equation", c:4}] },
    'Embedded Systems': { high: "Mod 4 & 2", repeated: [{q:"ARM Cortex-M3 Arch", c:5}, {q:"Semaphore vs Mutex", c:5}, {q:"I2C Timing Diagram", c:4}] }
};

const quizDatabase = {
    'VLSI Design': [
        { question: "What is the building block of modern processors?", options: ["Resistor", "CMOS Transistor", "Capacitor", "Inductor"], answer: 1, level: "Easy", badgeClass: "badge-easy" },
        { question: "Which scaling factor is used in Constant Field Scaling?", options: ["Alpha", "Beta", "S (Scaling Factor)", "Gamma"], answer: 2, level: "Medium", badgeClass: "badge-medium" },
        { question: "In Wallace Tree Multiplier, what reduces partial products?", options: ["Full Adders", "Carry Save Adders", "Ripple Carry", "Look Ahead"], answer: 1, level: "Hard", badgeClass: "badge-hard" }
    ],
    'ITC': [
        { question: "Measure of uncertainty is called?", options: ["Entropy", "Probability", "Noise", "Capacity"], answer: 0, level: "Easy", badgeClass: "badge-easy" },
        { question: "Huffman coding is?", options: ["Lossy", "Lossless", "Encryption", "Channel Coding"], answer: 1, level: "Medium", badgeClass: "badge-medium" },
        { question: "For Hamming code (7,4), parity bits needed?", options: ["2", "3", "4", "5"], answer: 1, level: "Hard", badgeClass: "badge-hard" }
    ],
    'Electromagnetics': [
        { question: "Law relating electric flux to charge?", options: ["Ampere", "Faraday", "Gauss", "Biot-Savart"], answer: 2, level: "Easy", badgeClass: "badge-easy" },
        { question: "Unit of Poynting Vector?", options: ["Watts", "Watts/m²", "Joules", "Volts/m"], answer: 1, level: "Medium", badgeClass: "badge-medium" },
        { question: "At Brewster's angle, which polarization transmits?", options: ["Perpendicular", "Parallel", "Circular", "None"], answer: 1, level: "Hard", badgeClass: "badge-hard" }
    ],
    'Embedded Systems': [
        { question: "RTOS stands for?", options: ["Real Time OS", "Run Time OS", "Robot OS", "Rapid OS"], answer: 0, level: "Easy", badgeClass: "badge-easy" },
        { question: "ARM register for Program Counter?", options: ["R0", "R13", "R14", "R15"], answer: 3, level: "Medium", badgeClass: "badge-medium" },
        { question: "Priority Inversion is solved by?", options: ["Round Robin", "Priority Inheritance", "FIFO", "Deadlock"], answer: 1, level: "Hard", badgeClass: "badge-hard" }
    ]
};

// ==========================================
// 4. NAVIGATION & VIEW SWITCHING
// ==========================================

// -- Modal --
function openModal() { if(modal) modal.classList.add('active'); }
function closeModal() { if(modal) modal.classList.remove('active'); }

// -- Helper to Hide All --
function hideAllViews() {
    Object.values(views).forEach(el => {
        if(el) el.classList.add('hidden');
    });
}

function goBackToDashboard() {
    hideAllViews();
    if(views.dashboard) {
        views.dashboard.classList.remove('hidden');
        views.dashboard.classList.add('fade-in');
    }
}

// -- Open Tool Functions --
function openSyllabusView() {
    hideAllViews();
    if(views.syllabus) {
        views.syllabus.classList.remove('hidden');
        views.syllabus.classList.add('fade-in');
    }
}

function openNotesView() {
    hideAllViews();
    if(views.notes) {
        views.notes.classList.remove('hidden');
        views.notes.classList.add('fade-in');
        loadSubjectResources('VLSI Design', null);
    }
}

function openQPView() {
    hideAllViews();
    if(views.qp) {
        views.qp.classList.remove('hidden');
        views.qp.classList.add('fade-in');
        loadQPAnalysis('VLSI Design', null);
    }
}

function openQuizView() {
    hideAllViews();
    if(views.quiz) {
        views.quiz.classList.remove('hidden');
        views.quiz.classList.add('fade-in');
        loadQuiz('VLSI Design', null); // Load default quiz
    }
}

// ==========================================
// 5. FEATURE LOGIC
// ==========================================

// --- Feature 1: Syllabus Chat ---
function loadSubject(subject) {
    currentContext = syllabusDatabase[subject];
    document.getElementById('active-status').classList.remove('hidden');
    document.getElementById('current-subject-name').innerText = `${subject} Loaded`;
    document.getElementById('chat-box').innerHTML = `<div class="message bot-msg">I've loaded <strong>${subject}</strong>. Ask me anything!</div>`;
    document.getElementById('user-question').disabled = false;
    document.getElementById('send-btn').disabled = false;
}

async function askGroqSyllabus() {
    const input = document.getElementById('user-question');
    const chatBox = document.getElementById('chat-box');
    const question = input.value.trim();
    if (!question) return;

    chatBox.innerHTML += `<div class="message user-msg">${question}</div>`;
    input.value = '';
    const loadingId = 'loading-' + Date.now();
    chatBox.innerHTML += `<div id="${loadingId}" class="message bot-msg">Thinking...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const answer = await callGroqAPI([
            { role: "system", content: `You are a Tutor. Context: ${currentContext}` },
            { role: "user", content: question }
        ]);
        document.getElementById(loadingId).innerHTML = formatText(answer);
    } catch (e) {
        document.getElementById(loadingId).innerText = "Error: Check API Key.";
    }
}

// --- Feature 2: Note Generator ---
function loadSubjectResources(subject, btnElement) {
    currentNoteSubject = subject;
    document.querySelectorAll('#notes-view .rag-sub-btn').forEach(b => b.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
    else { const f = document.querySelector('#notes-view .rag-sub-btn'); if(f) f.classList.add('active'); }

    document.getElementById('note-subject-title').innerText = subject;
    document.getElementById('ai-note-display').classList.add('hidden');
    
    document.getElementById('syllabus-topic-list').innerHTML = subjectData[subject].topics.map(t => 
        `<button class="topic-btn" onclick="generateNote('${t}')">${t}</button>`
    ).join('');
    
    document.getElementById('note-file-list').innerHTML = subjectData[subject].files.map(f => 
        `<a href="${f.link}" class="file-card"><i class="ri-file-pdf-line"></i><span>${f.name}</span></a>`
    ).join('');
}

async function generateNote(topic) {
    const displayBox = document.getElementById('ai-note-display');
    displayBox.classList.remove('hidden');
    displayBox.innerHTML = `Generating note for <strong>${topic}</strong>...`;

    try {
        const answer = await callGroqAPI([
            { role: "system", content: `Create a structured note for ${currentNoteSubject}.` },
            { role: "user", content: `Explain: ${topic}` }
        ]);
        displayBox.innerHTML = `<h4>${topic}</h4>` + formatText(answer);
    } catch (e) {
        displayBox.innerHTML = "Error generating note.";
    }
}

// --- Feature 3: QP Analyzer ---
function loadQPAnalysis(subject, btnElement) {
    currentQPSubject = subject;
    document.querySelectorAll('#qp-view .rag-sub-btn').forEach(b => b.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
    else { const f = document.querySelector('#qp-view .rag-sub-btn'); if(f) f.classList.add('active'); }

    document.getElementById('qp-subject-title').innerText = `${subject} Analysis`;
    document.getElementById('prediction-output').classList.add('hidden');

    document.getElementById('repeated-questions-list').innerHTML = qpDatabase[subject].repeated.map(r => 
        `<div class="question-item"><span class="q-text">${r.q}</span><span class="q-badge">Repeated ${r.c}x</span></div>`
    ).join('');
}

async function generatePredictedPaper() {
    const outputBox = document.getElementById('prediction-output');
    outputBox.classList.remove('hidden');
    outputBox.innerHTML = `Predicting <strong>${currentQPSubject}</strong> Exam Pattern...`;

    try {
        const answer = await callGroqAPI([
            { role: "system", content: `Generate a predicted question paper for ${currentQPSubject}.` },
            { role: "user", content: "Generate paper." }
        ]);
        outputBox.innerHTML = `<h4>🔮 Predicted ${currentQPSubject} Exam</h4>` + formatText(answer);
    } catch (e) {
        outputBox.innerHTML = "Error generating paper.";
    }
}

// --- Feature 4: Quiz Mode (FIXED) ---
function loadQuiz(subject, btnElement) {
    currentQuizSubject = subject;
    
    document.querySelectorAll('#quiz-view .rag-sub-btn').forEach(b => b.classList.remove('active'));
    if(btnElement) btnElement.classList.add('active');
    else { const f = document.querySelector('#quiz-view .rag-sub-btn'); if(f) f.classList.add('active'); }

    document.getElementById('quiz-subject-title').innerText = `${subject} Challenge`;
    
    // Reset Screens
    document.getElementById('quiz-start-screen').classList.remove('hidden');
    document.getElementById('quiz-question-screen').classList.add('hidden');
    document.getElementById('quiz-result-screen').classList.add('hidden');
}

function startQuiz() {
    quizQuestions = quizDatabase[currentQuizSubject];
    currentQuestionIndex = 0;
    userScore = 0;
    
    document.getElementById('quiz-start-screen').classList.add('hidden');
    document.getElementById('quiz-question-screen').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const qData = quizQuestions[currentQuestionIndex];
    
    const badge = document.getElementById('q-difficulty');
    badge.className = qData.badgeClass;
    badge.innerText = qData.level;
    
    document.getElementById('q-counter').innerText = `${currentQuestionIndex + 1}/3`;
    document.getElementById('q-text').innerText = qData.question;
    
    document.getElementById('q-options').innerHTML = qData.options.map((opt, idx) => `
        <button class="option-btn" onclick="checkAnswer(${idx}, this)">${opt}</button>
    `).join('');
}

function checkAnswer(selectedIndex, btnElement) {
    const qData = quizQuestions[currentQuestionIndex];
    const allBtns = document.querySelectorAll('.option-btn');
    
    allBtns.forEach(btn => btn.disabled = true);
    
    if(selectedIndex === qData.answer) {
        btnElement.classList.add('correct');
        userScore++;
    } else {
        btnElement.classList.add('wrong');
        allBtns[qData.answer].classList.add('correct');
    }
    
    setTimeout(() => {
        currentQuestionIndex++;
        if(currentQuestionIndex < quizQuestions.length) {
            renderQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    document.getElementById('quiz-question-screen').classList.add('hidden');
    const resultScreen = document.getElementById('quiz-result-screen');
    resultScreen.classList.remove('hidden');
    resultScreen.classList.add('fade-in');
    
    document.getElementById('final-score').innerText = userScore;
    
    const analysisBox = document.getElementById('analysis-text');
    let feedback = "";
    
    if(userScore === 3) {
        feedback = `<strong>Excellent Work!</strong><br>You mastered Easy, Medium, and Hard concepts in ${currentQuizSubject}.`;
        document.getElementById('score-icon').innerHTML = `<i class="ri-trophy-fill" style="color: #fbbf24;"></i>`;
    } else if (userScore === 2) {
        feedback = `<strong>Good Job!</strong><br>You missed one concept. Review the <em>Hard</em> topics.`;
        document.getElementById('score-icon').innerHTML = `<i class="ri-thumb-up-line" style="color: #60a5fa;"></i>`;
    } else {
        feedback = `<strong>Needs Improvement.</strong><br>Please revisit the <em>Notes Analyzer</em> for basics.`;
        document.getElementById('score-icon').innerHTML = `<i class="ri-book-open-line" style="color: #f87171;"></i>`;
    }
    
    analysisBox.innerHTML = feedback;
}

function resetQuiz() {
    loadQuiz(currentQuizSubject, null);
}

// ==========================================
// 6. HELPERS
// ==========================================
async function callGroqAPI(messages) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: messages, temperature: 0.5 })
    });
    const data = await response.json();
    return data.choices[0].message.content;
}

function formatText(text) {
    return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--accent)">$1</strong>');
}

function searchWeb(type) {
    const query = type === 'notes' ? `KTU ${currentNoteSubject} notes` : `KTU ${currentNoteSubject} previous question papers`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
}

function clearChat() {
    document.getElementById('chat-box').innerHTML = '';
}

// ==========================================
// 7. EXPORTS TO WINDOW
// ==========================================
// Handle Login
if(document.getElementById('setup-form')) {
    document.getElementById('setup-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const dept = document.getElementById('dept-select').value;
        const sem = document.getElementById('sem-select').value;
        if(dept && sem) {
            userBadge.textContent = `${sem} ${dept}`;
            closeModal();
            views.landing.classList.add('hidden');
            views.dashboard.classList.remove('hidden');
            views.dashboard.classList.add('fade-in');
        }
    });
}
// ==========================================
// 8. SKILL BARTER (PRO: CHAT, MEET, FEEDBACK)
// ==========================================

// --- MOCK DATA ---
const peers = [
    { id: 1, name: "Rahul V.", teach: "Python, Django, Web Dev", need: "Graphic Design, Figma", rating: 4.8, reviews: 12, online: true, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
    { id: 2, name: "Sneha K.", teach: "Calculus, Math, Algebra", need: "Python, Java", rating: 5.0, reviews: 8, online: false, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha" },
    { id: 3, name: "Kevin J.", teach: "Photography, Photoshop", need: "Physics, Mechanics", rating: 4.5, reviews: 20, online: true, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin" },
    { id: 4, name: "Sana M.", teach: "Organic Chemistry, Bio", need: "Photography, Editing", rating: 4.9, reviews: 15, online: true, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sana" },
    { id: 5, name: "Arjun R.", teach: "VLSI, Verilog, Digital", need: "Embedded C, Arduino", rating: 4.2, reviews: 5, online: false, img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun" }
];

// Random responses for the chat bot
const chatResponses = [
    "That sounds interesting! Tell me more.",
    "Sure, I can help with that.",
    "Let's schedule a Google Meet to discuss.",
    "Do you have any notes on this topic?",
    "I'm free for the next hour if you want to start.",
    "Great! Let's swap skills."
];

// STATE
let myProfile = { name: "You", teach: "", need: "" };
let activePeer = null; // The peer currently in the room
let userCredits = 120; // Starting Credits

// --- NAVIGATION ---
function openSkillBarter() {
    hideAllViews();
    const barterView = document.getElementById('skill-barter-view');
    if(barterView) {
        barterView.classList.remove('hidden');
        barterView.classList.add('fade-in');
        renderBoard(); // Initial render
    }
}

// --- PROFILE & MATCHING ---
function updateBarterProfile() {
    const nameInput = document.getElementById('my-name').value;
    if(nameInput) myProfile.name = nameInput;
    
    myProfile.teach = document.getElementById('my-skill').value.toLowerCase();
    myProfile.need = document.getElementById('my-need').value.toLowerCase();
    
    renderBoard();
}

function calculateScore(peer) {
    let score = 0; let type = "No Match";
    const pTeach = peer.teach.toLowerCase(); 
    const pNeed = peer.need.toLowerCase();
    const myTeach = myProfile.teach; 
    const myNeed = myProfile.need;

    if(!myTeach && !myNeed) return { score: 0, type: "" };

    const demandMatch = myNeed && (pTeach.includes(myNeed) || myNeed.split(' ').some(w => pTeach.includes(w) && w.length > 2));
    const supplyMatch = myTeach && (pNeed.includes(myTeach) || myTeach.split(' ').some(w => pNeed.includes(w) && w.length > 2));

    if (demandMatch && supplyMatch) { score = 100; type = "Perfect Swap"; } 
    else if (demandMatch) { score = 60; type = "They Teach You"; } 
    else if (supplyMatch) { score = 50; type = "You Teach Them"; }
    return { score, type };
}

function renderBoard() {
    const grid = document.getElementById('barter-grid');
    grid.innerHTML = '';
    
    const processedPeers = peers.map(p => { 
        const matchData = calculateScore(p); 
        return { ...p, ...matchData }; 
    }).sort((a, b) => b.score - a.score);

    let totalMatches = processedPeers.filter(p => p.score > 0).length;

    processedPeers.forEach(p => {
        const card = document.createElement('div');
        let borderClass = p.score === 100 ? 'border: 2px solid #fbbf24;' : (p.score > 0 ? 'border: 1px solid #3b82f6;' : '');
        let badgeClass = p.score === 100 ? 'match-100' : (p.score > 0 ? 'match-50' : '');
        
        card.className = `barter-card`; 
        if(p.score > 0) card.style = borderClass;

        card.innerHTML = `
            ${p.score > 0 ? `<div class="match-badge ${badgeClass}"><i class="ri-flashlight-fill"></i> ${p.score}% Match</div>` : ''}
            <div class="user-header">
                <img src="${p.img}" class="avatar-small" alt="${p.name}">
                <div class="user-info">
                    <h3>${p.name}</h3>
                    <div class="user-meta">
                        <span class="status-dot ${p.online ? 'online' : ''}"></span> ${p.online ? 'Online' : 'Offline'}
                        <span class="rating-stars"><i class="ri-star-fill"></i> ${p.rating} (${p.reviews})</span>
                    </div>
                </div>
            </div>
            <p style="color:#4ade80; font-size:0.9rem;"><i class="ri-arrow-up-circle-line"></i> <b>Teaches:</b> ${p.teach}</p>
            <p style="color:#facc15; font-size:0.9rem;"><i class="ri-arrow-down-circle-line"></i> <b>Needs:</b> ${p.need}</p>
            ${p.score > 0 ? `<p style="font-size:0.8rem; margin-top:5px; color:#94a3b8;">Type: <strong>${p.type}</strong></p>` : ''}
            
            <button class="swap-btn" onclick="enterRoom(${p.id})" style="${p.score === 100 ? 'background:#fbbf24; color:black; border:none;' : ''}">
                ${p.score === 100 ? 'Request Swap <i class="ri-shake-hands-line"></i>' : 'Connect'}
            </button>
        `;
        grid.appendChild(card);
    });
    
    document.getElementById('match-indicator').innerText = `${totalMatches} Matches Found`;
}

// --- SESSION ROOM LOGIC ---
function enterRoom(peerId) {
    activePeer = peers.find(p => p.id === peerId);
    if(!activePeer) return;

    // UI Switch
    document.getElementById('discovery-view').classList.add('hidden');
    document.getElementById('room-view').classList.remove('hidden');

    // Populate Header
    document.getElementById('room-peer-name').innerText = `Session with ${activePeer.name}`;
    document.getElementById('room-peer-img').src = activePeer.img;

    // Clear Chat
    document.getElementById('barter-chat-box').innerHTML = `<div class="system-msg">Session Started. Say Hello to ${activePeer.name}! 👋</div>`;
}

function handleChatKey(e) {
    if(e.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if(!msg) return;

    // Add User Message
    const chatBox = document.getElementById('barter-chat-box');
    chatBox.innerHTML += `<div class="chat-bubble sent">${msg}</div>`;
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate Peer Reply after 1.5s
    setTimeout(() => {
        const reply = chatResponses[Math.floor(Math.random() * chatResponses.length)];
        chatBox.innerHTML += `<div class="chat-bubble received">${reply}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1500);
}

function endSession() {
    // Open Feedback Modal
    document.getElementById('feedback-peer-name').innerText = activePeer ? activePeer.name : "Peer";
    document.getElementById('feedback-modal').classList.add('active');
}

// --- FEEDBACK & SCORING ---
let currentRating = 0;
function rateSession(n, star) {
    currentRating = n;
    // Highlight Stars
    const stars = star.parentNode.children;
    for(let i=0; i<5; i++) {
        if(i < n) stars[i].classList.add('active', 'ri-star-fill');
        else stars[i].classList.remove('active', 'ri-star-fill');
        if(i >= n) stars[i].classList.add('ri-star-line');
        else stars[i].classList.remove('ri-star-line');
    }
}

function submitFeedback() {
    // 1. Close Modal
    document.getElementById('feedback-modal').classList.remove('active');
    
    // 2. Add Credits
    userCredits += 50; // Reward for completing session
    document.getElementById('user-credits').innerText = userCredits;
    
    // 3. Reset View
    document.getElementById('room-view').classList.add('hidden');
    document.getElementById('discovery-view').classList.remove('hidden');
    
    alert(`Feedback Submitted! You earned 50 Credits. Total: ${userCredits}`);
    currentRating = 0; // Reset
}

// EXPORT TO WINDOW
window.openSkillBarter = openSkillBarter;
window.updateBarterProfile = updateBarterProfile;
window.enterRoom = enterRoom;
window.endSession = endSession;
window.handleChatKey = handleChatKey;
window.sendChatMessage = sendChatMessage;
window.rateSession = rateSession;
window.submitFeedback = submitFeedback;
// EXPORT TO WINDOW
window.openSkillBarter = openSkillBarter;
window.updateBarterProfile = updateBarterProfile;
window.enterRoom = enterRoom;
window.exitRoom = exitRoom;

// Expose all functions
window.openModal = openModal;
window.closeModal = closeModal;
window.goBackToDashboard = goBackToDashboard;
window.openSyllabusView = openSyllabusView;
window.openNotesView = openNotesView;
window.openQPView = openQPView;
window.openQuizView = openQuizView;
window.loadSubject = loadSubject;
window.loadSubjectResources = loadSubjectResources;
window.loadQPAnalysis = loadQPAnalysis;
window.loadQuiz = loadQuiz;
window.askGroqSyllabus = askGroqSyllabus;
window.generateNote = generateNote;
window.generatePredictedPaper = generatePredictedPaper;
window.startQuiz = startQuiz;
window.checkAnswer = checkAnswer;
window.resetQuiz = resetQuiz;
window.searchWeb = searchWeb;
window.clearChat = clearChat;
// ==========================================
// 8. EXTERNAL TOOLS
// ==========================================
function openExamCracker() {
    window.open("https://dainty-caramel-4fa379.netlify.app/", "_blank");
}

// Don't forget to expose it to the window!
window.openExamCracker = openExamCracker;
// ==========================================
// ADD THIS AT THE BOTTOM OF script.js
// ==========================================

function openStudyPlanner() {
    window.open("https://grand-snickerdoodle-141af9.netlify.app/", "_blank");
}

// Expose it to the window so HTML can see it
window.openStudyPlanner = openStudyPlanner;