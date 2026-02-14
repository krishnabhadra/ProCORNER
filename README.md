<p align="center">
<img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" alt="ProCorner Banner" width="100%" style="border-radius: 20px;">
</p>

ProCorner | To make easier the life of ktu engineering students.
Basic Details
Team Name: InnovateHer
Team Members
Member 1: Bhadra Krishnan - Nss College of Engineering,Palakkad

Member 2: Mufeedha  - Nss College of Engineering,Palakkad



Hosted Project Link
https://procorner-innovateher.netlify.app/

Project Description
ProCorner is an AI powered academic platform designed to simplify exam preparation by aligning study materials strictly with the official syllabus and generating exam focused practice questions. It provides personalized performance tracking and adaptive study plans to help students improve efficiently. The platform also features a unique peer matching skill barter system, enabling students to exchange knowledge and strengthen weaker subjects through collaborative learning

The Problem statement
Students struggle with exam preparation due to scattered materials, poor syllabus alignment, lack of performance insights, and limited collaborative learning opportunities. There is a need for an integrated AI platform that aligns content strictly with the syllabus, provides structured exam-focused support, tracks performance, and enables peer matching with skill barter to promote mutual learning and knowledge exchange

The Solution
Our solution is an integrated AI-powered academic platform that aligns textbooks with the syllabus, generates exam-focused practice, tracks performance, and creates structured study plans, while uniquely enabling a peer matching system with a skill barter feature where students exchange knowledge in their strong subjects to improve weaker areas through mutual learning.

Technical Details
Technologies/Components Used
For Software:

Languages used: HTML5, CSS3, JavaScript (ES6+)

AI Models: Groq API (Llama-3.3-70b-versatile) for content generation and reasoning.

Libraries used: Remix Icons (UI), Google Fonts (Outfit).

Tools used: VS Code, Git, GitHub, Netlify (Deployment).

Features
 Syllabus Extractor: Chat with your syllabus context to understand modules instantly.

 Notes Analyzer (NoteGen): AI-powered summary generator that creates structured study notes from topic keywords.

QP analyzer: Analyzes past years' trends to highlight "High Weightage" modules and repeated questions.

 Quiz Mode: Instantly generates Easy, Medium, and Hard MCQs with AI feedback.

 Skill Barter Network: A P2P ecosystem with "Smart Matching" algorithms, live session requests, and a credit-based reward system.

Competitive Exam Cracker: Dedicated roadmap and resources for competitive exams.

Study Planner: Integrated scheduling tool to track academic goals.

Implementation
Installation & Run
Since ProCorner is a client-side web application, it requires no backend server setup.It uses grok API to run 

Clone the Repository

Bash
git clone :https://github.com/krishnabhadra/ProCORNER
cd ProCORNER

Configure API Key

Create a file named config.js in the root folder and added the groq API key
JavaScript
const CONFIG = {
    GROQ_API_KEY: "your_api_key_here"
};
Run Locally

Open index.html in your browser.

OR use Live Server in VS Code.

Project Documentation
Screenshots
<img src="main screen.png" width="500">
<img src="features.png" width="500">
<img src="skill barter.png" width="500">
Diagrams
System Architecture:
<img src="architecture diagram.png" width="500">


Project Demo
Video
https://youtu.be/iGnMKOm5XFA


AI Tools Used
We utilized AI to accelerate development and enhance functionality:

Tool Used: Groq API (Llama-3.3-70b)
Purpose:

Core Feature: Powering the Syllabus Chatbot, Note Generator, and Quiz Logic.

Development: Code optimization for the matchmaking algorithm.

Key Prompts Used:

"Generate a structured note for VLSI Design: Concept, Key Points, Example."

"Create a predicted question paper for Embedded Systems based on high weightage topics."

Percentage of AI-generated code: ~40% (Boilerplate and Logic Assistance)

Human Contributions:

UI/UX Design and CSS animations.

"Smart Match" Algorithm logic implementation.

Session lifecycle management (Alarm, Feedback, Credits).

Integration of all modules into a single "OS" experience.

Team Contributions
Mufeedha: Frontend Architecture, Dashboard Design, Skill Barter UI & Logic.

Bhadra Krishnan: AI Integration (Groq API), Syllabus & QP Analyzer Logic, Quiz Mode Implementation.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Made with ❤️ at TinkerHub