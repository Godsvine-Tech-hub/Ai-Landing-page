# AI VIDEO CONTENT CREATION MASTERCLASS — LANDING PAGE

A modern, high-converting, mobile-responsive landing page built for Dickson Onwurah's **AI Video Content Creation Masterclass**.

---

## 🎨 Brand & Design System

- **Color Palette (White & Purple):**
  - Electric Royal Purple: `#5b36f5` / `#4524db` / `#3b0764`
  - Soft Lavender & Accent Purple: `#7c5cfc` / `#f4f0ff` / `#ede8fe`
  - Crisp White & Canvas Surface: `#ffffff` / `#f8fafc` / `#f1f5f9`
  - Subtle Slate Typography: `#0f172a` / `#334155` / `#64748b`
- **Typography:** Plus Jakarta Sans & system fallbacks.
- **Micro-Animations & Interactions:**
  - One-click clipboard copy for the Moniepoint account number with checkmark animations and floating toast alerts.
  - Interactive live countdown timer with configurable deadline.
  - Dynamic WhatsApp payment message generator with live preview.
  - Video modal player for sample demonstrations.
  - Expandable FAQ accordions.
  - Mobile sticky action bar with course fee, quick account copy, and enroll button.
  - Built-in Administrator Settings drawer for live configuration updates without writing code.

---

## 📋 Implemented Sections Overview

1. **Hero Section:**
   - Headline: *CREATE AMAZING VIDEOS WITH ARTIFICIAL INTELLIGENCE*
   - Subheadline & supporting copy.
   - Primary button (*ENROLL NOW*) scrolling to offer/payment.
   - Secondary button (*WATCH FREE DEMOS*) scrolling to video gallery.
   - Visual AI workflow preview.

2. **Countdown Timer:**
   - Prominent *DAYS : HOURS : MINUTES : SECONDS* display.
   - Configurable registration deadline placeholder until set.
   - Automatically displays closed state when deadline passes.

3. **Sample Video Showcase:**
   - Four sample video cards with badges and play triggers:
     - Video 1: AI Image Generation
     - Video 2: AI Video Generation
     - Video 3: AI Video Editing (CapCut)
     - Video 4: Complete AI Video Project
   - Supports YouTube, Vimeo, direct MP4, or high-tech simulated demo previews.

4. **Curriculum Modules:**
   - 10 distinct, beautifully formatted module cards covering:
     - Module 1: Introduction to AI Content Creation
     - Module 2: ChatGPT for Content Creation
     - Module 3: AI Image Generation with Google Flow
     - Module 4: AI Video Generation with Google Flow
     - Module 5: AI Storytelling and Scene Creation
     - Module 6: Video Editing with CapCut
     - Module 7: Captions, Subtitles, and Audio
     - Module 8: Creating AI-Powered Advertisements
     - Module 9: Social Media Content Creation
     - Module 10: Practical Final Project

5. **Who Is This Course For?:**
   - 7 key audience categories with clear checkmark cards.
   - Distinct note: *"No advanced technical background is required."*

6. **Course Bundle Inclusions:**
   - All 11 course deliverables presented clearly.
   - Explicit transparency note confirming prerecorded lessons & private Telegram community delivery.

7. **Pricing & Offer Section:**
   - Regular Price & Special Offer Price fields formatted in Nigerian Naira (₦).
   - Direct CTA scrolling to bank transfer details.

8. **Payment Instructions (Step-by-Step):**
   - **Step 1:** Review course fee in ₦.
   - **Step 2:** Official FirstBank transfer details:
     - **Account Name:** Godsvine Tech Hub
     - **Bank Name:** FirstBank
     - **Account Number:** 2048352886
     - One-click **COPY ACCOUNT NUMBER** button with toast confirmation.
   - **Step 3:** Confirm Payment on WhatsApp:
     - Interactive form for student details (Full Name, WhatsApp Phone, Email, Amount Paid, Payment Date, Payment Reference).
     - Live message preview box.
     - **I HAVE MADE PAYMENT** button generating the WhatsApp deep-link.

9. **Manual Payment Verification Notice:**
   - Clear 5-step timeline of what happens after payment.
   - Prominent **IMPORTANT PAYMENT NOTICE** emphasizing manual verification before granting private Telegram access.

10. **Frequently Asked Questions (FAQ):**
    - 7 expandable accordions with precise answers, including course access duration.

11. **Final Call to Action:**
    - High-impact closing banner leading back to payment.

12. **Administrator Configuration (Section 12):**
    - **Completely separated from the public site:** The public landing page (`index.html`) has ZERO admin buttons, links, or controls.
    - **Dedicated Admin Portal:** Located at [admin.html](file:///c:/Users/dell/Downloads/Desktop/Ai%20Landing%20page/admin.html) with secure passcode authentication (default passcode: `admin2026`).
    - Allows updating course fees, deadline datetime, WhatsApp contact, video URLs, and access duration live.
    - Saves directly to browser storage or can be permanently edited in [config.js](file:///c:/Users/dell/Downloads/Desktop/Ai%20Landing%20page/config.js).

---

## 🔒 Security & Admin Access

- **Public Site (`/index.html`):** Clean visitor/student landing page. Inaccessible to admin dashboard.
- **Admin Portal (`/admin.html`):** Standalone dashboard protected by passcode.
  - **Default Passcode:** `admin2026`
  - Accessible only by navigating directly to `http://localhost:3000/admin.html` (or opening `admin.html` in your browser).


## 🚀 How to Run Locally

You can open `index.html` directly in any web browser, or launch the included Node.js server:

```powershell
node server.js
```

Then visit:
`http://localhost:3000`
