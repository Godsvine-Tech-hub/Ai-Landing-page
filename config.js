/**
 * AI VIDEO CONTENT CREATION MASTERCLASS
 * Master Configuration File
 * 
 * Update your course parameters, pricing, countdown deadline, 
 * WhatsApp contact, and video URLs in this file or through the 
 * built-in Admin Settings modal.
 */

window.COURSE_CONFIG = {
  // Course Information
  courseTitle: "AI VIDEO CONTENT CREATION MASTERCLASS",
  courseTagline: "CREATE AMAZING VIDEOS WITH ARTIFICIAL INTELLIGENCE",
  courseDescription: "Learn how to use AI to generate stunning images, create engaging videos, write powerful scripts, edit your content, add automatic captions, and produce professional-looking content for social media, businesses, advertisements, and personal brands.",
  courseSupportText: "You do not need to be an expert before you start. This practical, beginner-friendly masterclass takes you through the entire process, step by step, from generating your first AI image to producing a complete video.",

  // Pricing (Currency: Nigerian Naira ₦)
  // Configured directly from Master Creator with AI Graphic
  pricing: {
    currencySymbol: "₦",
    currencyCode: "NGN",
    regularPrice: "25,000",
    regularPricePlaceholder: "25,000",
    offerPrice: "5,000",
    offerPricePlaceholder: "5,000",
    hasSpecialOffer: true
  },

  // Registration Deadline for Countdown Timer
  // Evergreen rolling countdown: starts at 1 day + 24 hours and never finishes
  countdown: {
    deadlineISO: "", // Leave empty for evergreen rolling countdown (starts from 1 day and 24 hours)
    closeEnrollmentOnExpire: false,
    closedMessage: "Registration for this cohort is now officially closed. Stay tuned for the next batch announcement!"
  },

  // Bank Account Details (MUST be displayed exactly as provided)
  bankDetails: {
    accountName: "Godsvine Tech Hub",
    bankName: "FirstBank",
    accountNumber: "2048352886"
  },

  // WhatsApp Contact for Payment Confirmation
  // International format WITHOUT plus sign, spaces, or brackets (e.g., "2348012345678")
  whatsapp: {
    number: "2348100910788",
    numberPlaceholder: "08100910788"
  },

  // Course Access Duration (Do not assume lifetime access)
  accessDuration: "[ENTER COURSE ACCESS DURATION e.g. 6 Months Access]",

  // Sample Showcases & Visual Demonstrations
  sampleVideos: [
    {
      id: "showcase-1",
      title: "Showcase 1: AI Image Generation with ChatGPT",
      description: "Discover how to craft creative visual prompts and generate high-impact, photorealistic digital artwork directly using ChatGPT & DALL-E.",
      tool: "ChatGPT & DALL-E",
      duration: "AI Image Synthesis",
      image: "showcase-1-image-gen.jpg",
      url: ""
    },
    {
      id: "showcase-2",
      title: "Showcase 2: AI Video Generation & Advert Creation",
      description: "Learn how to turn prompts into captivating commercial adverts featuring realistic human anchors and 3D Disney Pixar characters co-hosting for Godsvine Tech Hub.",
      tool: "Godsvine Studio Advert",
      duration: "Realistic + 3D Disney",
      image: "showcase-2-video-gen.jpg",
      script: [
        { speaker: "Alex (Realistic Anchor)", text: "Welcome to Godsvine Tech Live! In 2026, content is king, but producing high-budget adverts used to cost millions." },
        { speaker: "Leo (3D AI Co-Host)", text: "Not anymore, Alex! With AI, you can generate animated characters like me, craft viral scripts, and launch brand adverts in minutes!" },
        { speaker: "Alex (Realistic Anchor)", text: "That's why Dickson Onwurah created this masterclass. Zero experience required. Step-by-step from beginner to pro." },
        { speaker: "Leo (3D AI Co-Host)", text: "Spots are limited, guys! Tap Enroll Now and let's start creating together!" }
      ],
      url: ""
    },
    {
      id: "showcase-3",
      title: "Showcase 3: Professional Video Editing in CapCut",
      description: "Master the CapCut desktop editing suite: assembling the Godsvine newscast video, syncing multi-track audio waveforms, adding automated captions, and color grading.",
      tool: "CapCut Timeline Suite",
      duration: "Timeline & Audio Sync",
      image: "showcase-3-capcut-edit.jpg",
      url: ""
    },
    {
      id: "showcase-4",
      title: "Showcase 4: Multi-Platform Commercial Campaign",
      description: "End-to-end case study: See how combining ChatGPT scripts, AI video synthesis, and CapCut editing produced an award-winning advert with 1.4 Million views and soaring conversion ROI.",
      tool: "Complete Commercial",
      duration: "1.4M+ Viral Views",
      image: "showcase-4-complete-project.jpg",
      url: ""
    }
  ],

  // Course Delivery Terms
  deliveryNotice: "Course is delivered through prerecorded lessons and a private Telegram channel. Access is granted manually after your payment has been verified by our administrator."
};
