# 🚀 Nexus: The Ultimate Job Application CRM

[Visit Website](https://nexus-app-weld-seven.vercel.app/)
![Nexus Banner](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80)

Nexus is a premium, commercial-grade Software as a Service (SaaS) application built to help software engineers systematically track, analyze, and optimize their job hunting pipelines. 

Designed with a modern glassmorphism aesthetic and built on cutting-edge React patterns, Nexus replaces messy spreadsheets with a powerful, data-driven Kanban workflow.

## ✨ Key Features

- **📊 Advanced Data Analytics**: Interactive charts built with Recharts to visualize your application conversion funnel (Applied -> Interviewing -> Offer).
- **🛤️ Drag-and-Drop Kanban Pipeline**: A frictionless, native HTML5 drag-and-drop board to manage application statuses.
- **🧠 Simulated AI Interview Prep**: Features a simulated streaming UI that generates custom technical interview questions based on the role and company.
- **📅 Interactive Calendar View**: A custom-built CSS Grid calendar mapping applications to their exact dates.
- **🏢 Automated Brand Fetching**: Integrates seamlessly with `logo.dev` to instantly fetch and display company logos based on the company name.
- **🔒 Secure Authentication & Settings**: JWT-based authentication with bcrypt password hashing, and fully simulated Settings UI (including mock 2FA and Stripe Checkout flows).

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router), React 19
- **Styling**: Vanilla CSS Modules (Custom Design System, CSS Variables, Glassmorphism)
- **Backend/API**: Next.js Route Handlers (Custom REST API)
- **Database**: Persistent JSON File Storage (Simulating a NoSQL document store)
- **Icons**: Lucide React
- **Date Parsing**: date-fns

## ⚙️ Engineering & Architecture

This project was built to demonstrate FAANG-level engineering maturity:
- **State Management**: Complex global state managed via React Context (`AuthContext`, `ApplicationContext`).
- **DevOps**: Automated CI/CD pipeline configured via GitHub Actions to ensure successful builds on every push.
- **Testing**: Configured with Jest and React Testing Library for component and utility unit testing.
- **Accessibility**: Audited for semantic HTML and ARIA compliance.

## 🚀 Getting Started

To run Nexus locally on your machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nexus-app.git
   cd nexus-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   Navigate to `http://localhost:3000` in your browser. You can create a new account or log in with the default test credentials.

## 💡 Why I Built This

I built Nexus to demonstrate my ability to handle complex frontend challenges—such as client-side data filtering, complex grid layouts, drag-and-drop mechanics, and streaming asynchronous UI updates. It proves my proficiency in building polished, production-ready React applications from the ground up without relying on heavy UI libraries like Tailwind or Material UI.

---
*Developed as a portfolio piece for Frontend Software Engineering roles.*
