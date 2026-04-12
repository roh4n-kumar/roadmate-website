# RoadMate: Premium Mobility & Rental Platform

RoadMate is a high-fidelity car and bike rental platform built for performance, security, and a seamless user experience. Designed with a "Security-First" approach, it combines a cinematic glassmorphic UI with a robust serverless backend to redefine mobility in urban environments.

---

## 🛡️ Enterprise-Grade Security
The platform has been hardened with a focus on data integrity and identity protection.

*   **Google-Only Authentication**: Transitioned to a centralized, high-security Google-only authentication model. This eliminates password-related vulnerabilities (brute force, credential stuffing) and ensures identity verification via Google's enterprise infrastructure.
*   **Zero-Trust Data Access (IDOR Prevention)**: Implemented strict UID-based verification across all sensitive data points including Bookings, Payments, and User Profiles. Data is strictly isolated via server-side Firestore Security Rules.
*   **Security Audit Logging**: Built an internal `SecurityLogger` that monitors:
    *   Authentication successes and failures.
    *   Unauthorized data access attempts (potential IDOR hits).
    *   Payment transaction integrity and errors.
*   **Deployment Protection**: Configured with hardened `.gitignore` policies and environment variable modularization to ensure 0% exposure of backend secrets.

## ✨ Premium UI/UX Experience
RoadMate features a custom-built **Glassmorphic Design System** tailored for a premium feel.

*   **Cinematic Hero & Navbar**: Dynamic, scroll-responsive navigation with high-blur backdrops.
*   **Fluid Animations**: Powered by **Framer Motion**, featuring smooth layouts, staggered entrance animations, and micro-interactions.
*   **Mobile-First Precision**: Every component is vertically optimized for mobile viewports, ensuring zero layout shifts and a native-app feel on smartphones.
*   **Typography**: Clean, geometric aesthetics using the **'Outfit'** font family for a professional look.

## 🛠️ Tech Stack & Architecture
*   **Frontend**: React 18 (Vite)
*   **Styling**: Vanilla CSS (Modular & Scalable), Framer Motion
*   **Backend**: Firebase (Authentication | Firestore Cloud Database)
*   **Security**: Firebase Security Rules (Version 2)
*   **Hosting**: High-performance deployment on Vercel

---

## 🚀 Development Setup

1. **Environment Config**:
   Create a `.env` file and populate it with your Firebase configuration variables as defined in `src/firebase.js`.

2. **Installation**:
   ```bash
   npm install
   ```

3. **Running the App**:
   ```bash
   npm run dev
   ```

---
*Built with ❤️ for a smarter way to travel.*
