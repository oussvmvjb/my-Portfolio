/**
 * Script to rebuild the projects list in all locale files.
 * Run: node scripts/update-projects.mjs
 */

import { readFileSync, writeFileSync } from 'fs';

// ─── NEW CANONICAL PROJECT LIST (English source of truth) ───────────────────

const newProjects = [
  {
    id: 'frepping',
    title: 'FREPPING',
    tagline: 'AI-Powered 3D Clothing Customization and Virtual Fashion Experience.',
    description:
      'An interactive fashion technology platform that lets users explore 3D garments, customize designs with AI assistance, and visualize their creations in real time.',
    category: ['Web Development', '3D', 'E-commerce', 'AI'],
    featured: true,
    stack: {
      frontend: ['Angular', 'TypeScript', 'Three.js'],
      backend: ['Python', 'FastAPI'],
      database: ['PostgreSQL', 'Redis', 'Elasticsearch'],
      tools: ['Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/frepping',
    live: 'https://freepping.netlify.app/',
    images: [],
    overview:
      'FREPPING is an interactive fashion technology platform designed to transform the way users explore, customize, and visualize clothing. The platform combines 3D modeling, artificial intelligence, and interactive garment customization to provide users with a more personalized fashion experience.',
    problem:
      '3D clothing customization is typically reserved for professional designers with specialized software. Casual users cannot easily visualize or personalize garments before purchase, leading to returns and dissatisfaction.',
    solution:
      'FREPPING brings an accessible 3D customization environment directly to the browser. Users can explore garments, modify colors, textures, logos, and structural elements in real time — no professional 3D experience required.',
    features: [
      { title: 'Interactive 3D Garment Viewer', description: 'Explore clothing in full 3D with rotation, zoom, and inspection.' },
      { title: 'AI-Assisted Model Generation', description: 'Generate and modify 3D clothing models using artificial intelligence.' },
      { title: 'Custom Texture & Color Upload', description: 'Upload your own textures and apply colors to any garment element.' },
      { title: 'Logo & Sticker Placement', description: 'Position custom graphics interactively on the garment surface.' },
      { title: 'Real-Time Preview', description: 'See changes reflected immediately in the 3D environment.' },
      { title: 'UV Mapping & Material Control', description: 'Fine-grained control over garment materials and UV map regions.' },
    ],
    challenges: [
      'Rendering performant 3D models in the browser while maintaining smooth interactivity.',
      'Managing UV mapping and material zones for diverse garment geometries.',
      'Integrating AI-assisted model generation into a responsive web interface.',
      'Building scalable API infrastructure to support both real-time and batch operations.',
    ],
    relatedRepositories: [
      { label: 'Frontend (FREPPING)', url: 'https://github.com/oussvmvjb/frepping' },
      { label: 'Backend', url: 'https://github.com/oussvmvjb/freepping-backend' },
    ],
  },

  {
    id: 'frepping-backend',
    title: 'FREPPING Backend',
    tagline: 'Scalable API Infrastructure for an AI-Powered 3D Fashion Platform.',
    description:
      'The server-side foundation of FREPPING, providing REST APIs for user management, product operations, caching, search, and AI-powered customization workflows.',
    category: ['Backend Development', 'API Engineering', 'Python', 'Search Infrastructure'],
    featured: false,
    stack: {
      frontend: [],
      backend: ['Python', 'FastAPI', 'SQLAlchemy'],
      database: ['PostgreSQL', 'Redis', 'Elasticsearch'],
      tools: ['Git', 'GitHub', 'Alembic'],
    },
    github: 'https://github.com/oussvmvjb/freepping-backend',
    live: '',
    images: [],
    overview:
      'The FREPPING Backend provides the APIs and application services required to support user accounts, product-related operations, and interactive customization workflows. It is designed to serve a modern web application that combines 3D content, AI-powered functionality, and personalized product discovery.',
    problem:
      'A 3D fashion platform requires a reliable, scalable backend that can handle user sessions, product data, caching for real-time requests, and advanced search for personalization.',
    solution:
      'A modular FastAPI backend with SQLAlchemy for ORM, Alembic for migrations, Redis for caching, and Elasticsearch for personalized product discovery — all wired together with JWT authentication.',
    features: [
      { title: 'RESTful API Architecture', description: 'Clean, versioned endpoints serving the FREPPING frontend.' },
      { title: 'JWT Authentication', description: 'Secure token-based user authentication and session management.' },
      { title: 'Redis Caching', description: 'Reduces repeated database queries for frequently accessed product data.' },
      { title: 'Elasticsearch Integration', description: 'Powers advanced product search and personalized discovery.' },
      { title: 'Alembic Migrations', description: 'Versioned schema changes for safe database evolution.' },
      { title: 'Modular Service Design', description: 'Separation of concerns across product, user, and AI service modules.' },
    ],
    challenges: [
      'Designing a caching strategy that remains consistent during product updates.',
      'Integrating Elasticsearch to support relevance-tuned search results.',
      'Keeping API response times low during high-volume customization interactions.',
    ],
  },

  {
    id: 'ai-marketing-workflows',
    title: 'AI Marketing Workflows',
    tagline: 'Intelligent Workflow Automation for Digital Marketing Operations.',
    description:
      'A collection of AI-powered automation workflows built to simplify digital marketing operations, reduce repetitive tasks, and connect services through intelligent orchestration.',
    category: ['AI', 'Automation', 'Digital Marketing', 'Integration'],
    featured: false,
    stack: {
      frontend: [],
      backend: [],
      database: [],
      tools: ['n8n', 'AI APIs', 'Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/ai-marketing-workflows',
    live: '',
    images: [],
    overview:
      'AI Marketing Workflows is a collection of automation workflows designed to simplify and accelerate digital marketing operations through artificial intelligence and service integration. The project focuses on connecting AI-powered content generation with automated workflows to reduce repetitive tasks and improve operational efficiency.',
    problem:
      'Digital marketing teams handle many repetitive tasks — content creation, scheduling, reporting — that consume significant time and are prone to inconsistency.',
    solution:
      'Using n8n for workflow orchestration and AI API integrations, the project automates multi-step marketing processes, connects disparate services, and reduces manual intervention.',
    features: [
      { title: 'n8n Workflow Automation', description: 'Visual workflow builder connecting services and AI endpoints.' },
      { title: 'AI Content Integration', description: 'Plug AI-powered text and content generation into automated pipelines.' },
      { title: 'Webhook Support', description: 'Trigger workflows from external events and service callbacks.' },
      { title: 'Multi-Service Orchestration', description: 'Chain actions across multiple APIs and platforms.' },
      { title: 'Data Transformation', description: 'Process and reshape data between pipeline steps.' },
      { title: 'Reusable Workflow Structures', description: 'Modular designs that can be adapted across campaigns.' },
    ],
    challenges: [
      'Ensuring reliable execution when external APIs rate-limit or fail.',
      'Designing reusable workflow templates that work across different campaign types.',
    ],
  },

  {
    id: 'win-na9ra',
    title: 'Win Na9ra',
    tagline: 'A Student Guide to Discovering University Life in Tunisia.',
    description:
      'A web application helping new students discover universities, surrounding cities, student services, and practical cost-of-living information across Tunisia.',
    category: ['Web Development', 'Education', 'Student Services', 'Maps'],
    featured: false,
    stack: {
      frontend: ['HTML', 'CSS'],
      backend: [],
      database: [],
      tools: ['Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/win-na9ra',
    live: 'https://win-na9ra.netlify.app/#/',
    images: [],
    overview:
      'Win Na9ra is a web application designed to help new students discover and understand university life in Tunisia. The platform centralizes useful information about universities, study locations, surrounding cities, and student services — making the transition into university smoother.',
    problem:
      'New students arriving in a university city often struggle to find reliable, centralized information about housing, transportation, local costs, and student services.',
    solution:
      'Win Na9ra aggregates all this information into an accessible web interface with an interactive map, navigation aids, and curated points of interest around Tunisian universities.',
    features: [
      { title: 'University Directory', description: 'Browse universities and study locations across Tunisian governorates.' },
      { title: 'City & Governorate Guides', description: 'Practical information about the city surrounding each university.' },
      { title: 'Cost of Living', description: 'Estimated prices for accommodation, food, and daily expenses.' },
      { title: 'Transportation Info', description: 'Public transport options and routes near universities.' },
      { title: 'Interactive Map', description: 'Visualize and navigate to key locations around campus.' },
      { title: 'Points of Interest', description: 'Discover useful places like cafés, pharmacies, and markets.' },
    ],
    challenges: [
      'Collecting and maintaining accurate, up-to-date information across multiple cities.',
      'Building an accessible interface suitable for students with varying technical experience.',
    ],
  },

  {
    id: 'marketflow',
    title: 'MarketFlow AI',
    tagline: 'An Intelligent Microservices Platform for Multichannel Digital Marketing.',
    description:
      'A graduation project: a full AI-powered marketing platform unifying social media, email campaigns, content generation, analytics, and an AI assistant (ARIA) across six independent microservices.',
    category: ['AI', 'Microservices', 'Digital Marketing', 'Full Stack', 'Software Architecture'],
    featured: true,
    stack: {
      frontend: ['Next.js', 'TypeScript'],
      backend: ['Python', 'FastAPI', 'SQLAlchemy'],
      database: ['PostgreSQL', 'Redis', 'Elasticsearch'],
      tools: ['Docker', 'Jenkins', 'Git', 'n8n', 'Groq', 'Gemini', 'Cloudinary'],
    },
    github: '',
    live: '',
    images: [],
    overview:
      'MarketFlow AI is an intelligent digital marketing management platform developed as a final-year graduation project. It addresses the fragmentation of modern marketing operations by bringing social media, email campaigns, content generation, analytics, and customer engagement together in a centralized platform powered by AI and a modular microservices architecture.',
    problem:
      'Businesses must manage social media, email campaigns, content generation, analytics, and customer engagement through multiple disconnected tools — creating operational silos, inconsistency, and wasted time.',
    solution:
      'MarketFlow AI centralizes all these capabilities in one platform built on six independent microservices connected through a central API Gateway. AI assistance handles content generation, campaign automation, and performance analysis.',
    features: [
      { title: 'Authentication Service', description: 'JWT + OAuth, role-based access control, multi-tenant workspace management.' },
      { title: 'Email Hub Service', description: 'Campaign management, templates, contact segmentation, open/click tracking.' },
      { title: 'Social Media Service', description: 'Multi-platform publishing to Facebook, Instagram, LinkedIn, X, TikTok, YouTube.' },
      { title: 'AI Studio Service', description: 'AI text, image, and video generation with Groq, Gemini, and Cloudinary.' },
      { title: 'Analytics Service', description: 'KPI dashboards, ROI calculation, performance monitoring, and alerts.' },
      { title: 'ARIA — Assistance Bot', description: 'Natural-language AI assistant that can trigger platform operations via WebSocket.' },
    ],
    challenges: [
      'Coordinating six independent services through a centralized API Gateway without coupling.',
      'Implementing real-time WebSocket communication for the ARIA assistant bot.',
      'Designing a multi-tenant architecture with proper role-based access isolation.',
      'Integrating multiple AI providers (Groq, Gemini) with consistent output formats.',
      'Connecting to six social media OAuth flows with varied API rate limits.',
    ],
    architectureServices: [
      { name: 'API Gateway', description: 'Central router for all client requests', features: ['Routing', 'Auth validation', 'Rate limiting'], color: '#FFC400' },
      { name: 'Auth Service', description: 'Identity and access management', features: ['JWT', 'OAuth', 'RBAC', 'Multi-tenant'], color: '#3B82F6' },
      { name: 'Email Hub', description: 'Email campaign engine', features: ['Campaigns', 'Templates', 'Tracking', 'SMTP'], color: '#10B981' },
      { name: 'Social Media', description: 'Multi-platform publisher', features: ['6 platforms', 'Scheduling', 'Analytics', 'Calendar'], color: '#8B5CF6' },
      { name: 'AI Studio', description: 'AI content generation', features: ['Text/Image/Video', 'Prompt Builder', 'Media library'], color: '#F59E0B' },
      { name: 'Analytics', description: 'Marketing intelligence', features: ['KPIs', 'ROI', 'Reports', 'Alerts'], color: '#06B6D4' },
      { name: 'ARIA Bot', description: 'AI conversational assistant', features: ['NLP intents', 'WebSocket', 'Cross-service', 'Groq LLM'], color: '#EC4899' },
    ],
    achievements: [
      'Six fully implemented and independently deployable microservices',
      'Centralized API Gateway with routing and authentication middleware',
      'Multi-platform social media publishing pipeline',
      'AI-powered content generation with Groq and Gemini integrations',
      'Real-time conversational assistant (ARIA) with WebSocket support',
      'Comprehensive analytics dashboard with ROI tracking',
    ],
  },

  {
    id: 'signvi-ai-fastapi',
    title: 'SignVi AI – FastAPI',
    tagline: 'Computer Vision and Deep Learning for Sign Language Recognition.',
    description:
      'The Python/FastAPI backend and AI processing layer of SignVi AI — handling gesture recognition via deep learning, model training, and REST API integration.',
    category: ['AI', 'Computer Vision', 'Deep Learning', 'Python', 'Backend'],
    featured: false,
    stack: {
      frontend: [],
      backend: ['Python', 'FastAPI', 'PyTorch', 'OpenCV'],
      database: [],
      tools: ['Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/SignVi-AI-FastAPI',
    live: '',
    images: [],
    overview:
      'SignVi AI – FastAPI is the Python-based backend of the SignVi AI educational platform. It focuses on processing visual input, connecting trained deep-learning models to application APIs, and enabling gesture recognition for sign language learning.',
    problem:
      'Sign language learning apps need a backend capable of processing real-time video input and running inference on deep learning models at acceptable latency.',
    solution:
      'A FastAPI service wraps PyTorch and OpenCV-based gesture recognition pipelines, exposing clean REST endpoints for the Angular frontend to consume.',
    features: [
      { title: 'Deep Learning Inference', description: 'PyTorch models process gesture inputs and return classification results.' },
      { title: 'Computer Vision Pipeline', description: 'OpenCV handles video frame preprocessing and hand region detection.' },
      { title: 'REST API Endpoints', description: 'Clean FastAPI routes expose inference and feedback to the frontend.' },
      { title: 'Model Training Infrastructure', description: 'Training scripts and evaluation pipelines for gesture classifiers.' },
    ],
    challenges: [
      'Achieving low-latency inference suitable for real-time interactive use.',
      'Handling diverse hand poses, lighting conditions, and camera quality.',
    ],
  },

  {
    id: 'signvi-ai',
    title: 'SignVi AI',
    tagline: 'Learn Sign Language Through Artificial Intelligence.',
    description:
      'An interactive Angular application using MediaPipe hand-tracking and AI gesture recognition to help users learn sign language through camera-based exercises.',
    category: ['AI', 'Education', 'Computer Vision', 'Angular'],
    featured: false,
    stack: {
      frontend: ['Angular', 'TypeScript', 'MediaPipe'],
      backend: [],
      database: [],
      tools: ['Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/SignVi-AI',
    live: '',
    images: [],
    overview:
      'SignVi AI is an interactive educational application designed to make sign-language learning more accessible through artificial intelligence. Users practice sign-language gestures through the camera and receive AI-assisted feedback on their performance.',
    problem:
      'Learning sign language typically requires a human instructor. Most people cannot access in-person tuition, making the barrier to entry very high.',
    solution:
      'Using MediaPipe for real-time hand tracking and an AI recognition backend, SignVi AI creates an interactive solo learning experience with immediate gesture feedback.',
    features: [
      { title: 'Camera-Based Gesture Input', description: 'Real-time hand tracking directly in the browser.' },
      { title: 'MediaPipe Integration', description: 'Accurate landmark detection for 21 hand keypoints per frame.' },
      { title: 'AI Gesture Recognition', description: 'Classifies gestures against a trained sign-language vocabulary.' },
      { title: 'Interactive Learning Exercises', description: 'Structured lessons guiding users through the sign alphabet and words.' },
      { title: 'Visual Feedback', description: 'Overlay and scoring system to help users improve accuracy.' },
    ],
    challenges: [
      'Achieving real-time gesture recognition at 30fps without GPU acceleration in the browser.',
      'Designing a learning flow that adapts to different user skill levels.',
    ],
  },

  {
    id: 'back-619',
    title: '619 Backend',
    tagline: 'Backend Services for an Enactus Sign Language Learning Initiative.',
    description:
      'Java backend supporting the 619 Enactus mobile application — providing the API services for a multilingual sign language educational platform.',
    category: ['Backend Development', 'Java', 'Social Impact', 'Education'],
    featured: false,
    stack: {
      frontend: [],
      backend: ['Java'],
      database: [],
      tools: ['Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/back_619',
    live: '',
    images: [],
    overview:
      '619 Backend provides the server-side services for the 619 Enactus mobile application. The project connects sign language with spoken-language learning, supporting five spoken languages in an accessibility-focused educational initiative.',
    problem:
      'The 619 mobile app required a stable, organized API backend to manage educational content, user progress, and multilingual resources.',
    solution:
      'A Java-based backend application providing RESTful API services aligned with the five spoken-language variants of the 619 learning content.',
    features: [
      { title: 'REST API Services', description: 'Endpoints serving educational content to the mobile frontend.' },
      { title: 'Multilingual Content Support', description: 'Backend structure supports five spoken languages.' },
      { title: 'Business Logic Layer', description: 'Server-side validation and processing for educational workflows.' },
    ],
    challenges: [
      'Supporting multilingual content in a structured and extensible backend architecture.',
    ],
  },

  {
    id: '619',
    title: '619',
    tagline: 'Technology for Inclusive Communication and Sign Language Education.',
    description:
      'An Enactus mobile app teaching sign language through spoken-language experiences across five languages — winning 4th place in Tunisia and 18th worldwide.',
    category: ['Mobile Development', 'Education', 'Social Impact', 'Accessibility'],
    featured: false,
    stack: {
      frontend: [],
      backend: [],
      database: [],
      tools: ['Kotlin', 'Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/619',
    live: '',
    images: [],
    overview:
      '619 is an Enactus project focused on helping people learn sign language through spoken-language-based educational experiences. The initiative aims to reduce communication barriers and improve accessibility through technology.',
    problem:
      'Communication barriers between deaf and hearing communities remain significant. Few accessible, multilingual tools exist to teach sign language in an engaging mobile format.',
    solution:
      'A Kotlin mobile application that teaches sign language through interactive exercises in five spoken languages, designed to be inclusive and easy to use without prior sign language knowledge.',
    features: [
      { title: 'Sign Language Learning', description: 'Interactive lessons connecting spoken words to sign language gestures.' },
      { title: 'Five Language Support', description: 'The app supports educational content in five spoken languages.' },
      { title: 'Accessibility Focus', description: 'Designed to reduce communication barriers for deaf and hearing users alike.' },
      { title: 'Mobile-Native Experience', description: 'Built with Kotlin for smooth native Android performance.' },
    ],
    achievements: [
      '4th place nationally at the Enactus Tunisia competition',
      '18th place worldwide at the Enactus global competition',
      'Recognized for social impact in accessibility technology',
    ],
    challenges: [
      'Producing high-quality sign language content across five spoken languages.',
      'Making the app accessible to users with no prior sign language exposure.',
    ],
  },

  {
    id: 'virtual-medical-coaching',
    title: 'Virtual Medical Coaching',
    tagline: 'A Digital Healthcare Platform Connecting Patients with Real Medical Professionals.',
    description:
      'A multi-platform healthcare system connecting patients with real doctors for consultations, appointment scheduling, real-time sessions, medical forms, and AI-assisted support.',
    category: ['Healthcare', 'Full Stack', 'Mobile Development', 'AI'],
    featured: false,
    stack: {
      frontend: ['Angular', 'TypeScript', 'SCSS'],
      backend: ['Java', 'Spring Boot'],
      database: [],
      tools: ['Kotlin', 'Groq', 'Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/virtual-medical-coaching',
    live: '',
    images: [],
    overview:
      'Virtual Medical Coaching is a digital healthcare platform designed to connect patients with real healthcare professionals through an integrated web and mobile experience. The platform provides professional medical guidance, remote consultations, and progress monitoring within a healthcare-focused environment.',
    problem:
      'Accessing qualified medical guidance remotely is difficult. Patients lack structured tools for scheduling, conducting, and following up on medical consultations outside of physical clinic visits.',
    solution:
      'A multi-platform system where patients interact with real doctors through web and mobile apps, attend real-time consultation sessions, complete structured medical forms, and monitor their health progress over time.',
    features: [
      { title: 'Patient & Doctor Accounts', description: 'Separate portals for patients and healthcare professionals.' },
      { title: 'Appointment Scheduling', description: 'Book and manage consultation appointments in-app.' },
      { title: 'Real-Time Consultations', description: 'Live session capabilities for direct doctor-patient interaction.' },
      { title: 'Medical Forms', description: 'Doctors create structured forms; patients submit and doctors review.' },
      { title: 'Progress Monitoring', description: 'Track patient health data and progress over consultation cycles.' },
      { title: 'AI Medical Assistant', description: 'Groq-powered assistant restricted to healthcare domain queries.' },
    ],
    challenges: [
      'Coordinating real-time session functionality across web and mobile platforms.',
      'Ensuring the AI assistant only responds within healthcare-appropriate boundaries.',
      'Designing medical form workflows that match realistic clinical processes.',
    ],
    relatedRepositories: [
      { label: 'Web Frontend', url: 'https://github.com/oussvmvjb/virtual-medical-coaching' },
      { label: 'Mobile (Android/Kotlin)', url: 'https://github.com/oussvmvjb/virtual-medical-coaching-mobile' },
      { label: 'Backend (Spring Boot)', url: 'https://github.com/oussvmvjb/virtual-medical-coaching-backend' },
    ],
  },

  {
    id: 'reservation-express',
    title: 'Reservation Express',
    tagline: 'Smart Restaurant Reservations and Table-Side Food Ordering.',
    description:
      'A Flutter mobile app for discovering restaurants, booking tables, and ordering food directly from your table through a connected digital experience.',
    category: ['Mobile Development', 'Restaurant Technology', 'Full Stack'],
    featured: false,
    stack: {
      frontend: ['Flutter', 'Dart'],
      backend: ['Java'],
      database: [],
      tools: ['Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/Reservation-express',
    live: '',
    images: [],
    overview:
      'Reservation Express simplifies the restaurant experience from discovery to ordering. Customers can find a restaurant, make a table reservation, and order food from their table — all through one connected mobile application.',
    problem:
      'Restaurant reservations and table orders are still largely phone-based, creating friction for customers and inefficiency for restaurants.',
    solution:
      'A Flutter app connected to a Java REST API provides end-to-end digital coverage from table reservation to in-seat food ordering.',
    features: [
      { title: 'Restaurant Discovery', description: 'Browse cafés and restaurants with available table information.' },
      { title: 'Table Reservation', description: 'Reserve a table for a specific time and party size.' },
      { title: 'Food Ordering', description: 'Order directly from the digital menu while seated.' },
      { title: 'Backend API Integration', description: 'Flutter app communicates with a Java REST API backend.' },
    ],
    relatedRepositories: [
      { label: 'Mobile App (Flutter)', url: 'https://github.com/oussvmvjb/Reservation-express' },
      { label: 'Backend API (Java)', url: 'https://github.com/oussvmvjb/Reservation-express-api' },
    ],
  },

  {
    id: 'tableaux-vente',
    title: 'Tableaux Vente',
    tagline: 'A Digital Marketplace for Selling Artistic Paintings.',
    description:
      'A Flutter mobile application providing a digital space for users to explore and interact with a painting marketplace.',
    category: ['Mobile Development', 'E-commerce', 'Art'],
    featured: false,
    stack: {
      frontend: ['Flutter', 'Dart'],
      backend: [],
      database: [],
      tools: ['Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/tableaux-vente',
    live: '',
    images: [],
    overview:
      'Tableaux Vente is a mobile application project focused on the sale and discovery of artistic paintings. It provides a digital space where users can explore artwork and interact with a painting-selling experience.',
    features: [
      { title: 'Artwork Discovery', description: 'Browse a curated selection of paintings from the platform.' },
      { title: 'Digital Marketplace', description: 'A digital interface for the buying and selling of paintings.' },
      { title: 'Mobile-Native Design', description: 'Built with Flutter for a smooth cross-platform mobile experience.' },
    ],
  },

  {
    id: 'analyse-prodection',
    title: 'Analyse Production',
    tagline: 'Real-Time Business Intelligence for Raw Material Sales Analysis.',
    description:
      'A Business Intelligence dashboard delivering analytical insights into raw material sales — vegetables, meat, and similar products — across African markets.',
    category: ['Business Intelligence', 'Data Analytics', 'Web Development'],
    featured: false,
    stack: {
      frontend: ['TypeScript'],
      backend: [],
      database: [],
      tools: ['Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/Analyse-prodection',
    live: '',
    images: [],
    overview:
      'Analyse Production is a Business Intelligence application providing analytical insights into sales operations in the raw-material market, particularly products such as vegetables and meat across African markets. It transforms sales data into visual dashboards and charts to support business decision-making.',
    problem:
      'Raw material traders in African markets lack structured analytical tools to understand sales performance, identify trends, and make data-driven decisions.',
    solution:
      'An interactive dashboard application presents sales data through detailed analytical charts and KPI views, making market activity visible and actionable.',
    features: [
      { title: 'Sales Data Analysis', description: 'Visualize and analyze raw material sales across product categories.' },
      { title: 'Market Monitoring', description: 'Track performance for vegetables, meat, and similar products.' },
      { title: 'Interactive Dashboards', description: 'Detailed analytical charts and KPI panels.' },
      { title: 'Business Intelligence Views', description: 'Structured insights to support operational decision-making.' },
    ],
  },

  {
    id: 'my-weather',
    title: 'My Weather',
    tagline: 'A Mobile Application for Accessible Weather Information.',
    description:
      'A Flutter mobile application presenting weather information through a simple, clean, and accessible interface.',
    category: ['Mobile Development', 'Flutter'],
    featured: false,
    stack: {
      frontend: ['Flutter', 'Dart'],
      backend: [],
      database: [],
      tools: ['Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/my_weather',
    live: '',
    images: [],
    overview:
      'My Weather is a Flutter mobile application designed to present weather information through a simple and accessible interface. It focuses on providing users with a convenient way to consult weather-related information on mobile devices.',
    features: [
      { title: 'Weather Display', description: 'Clean presentation of weather conditions and forecasts.' },
      { title: 'Mobile-Native UI', description: 'Flutter-based interface optimized for smooth mobile use.' },
    ],
  },

  {
    id: 'stock-management',
    title: 'Stock Management System',
    tagline: 'A Full-Stack Solution for Inventory and Sales Operations.',
    description:
      'A full-stack web application for managing products, suppliers, clients, and sales with authentication, low-stock alerts, and management dashboards.',
    category: ['Full Stack', 'Web Development', 'Business Management'],
    featured: false,
    stack: {
      frontend: ['Angular', 'TypeScript'],
      backend: [],
      database: [],
      tools: ['Git', 'GitHub'],
    },
    github: 'https://github.com/oussvmvjb/web-app---gestion-de-stock---stage-app',
    live: '',
    images: [],
    overview:
      'A full-stack web application for managing stock operations. It allows users to track products, suppliers, clients, and sales through a centralized platform with secure authentication, low-stock alerts, and dashboards.',
    features: [
      { title: 'Product Management', description: 'Add, edit, and track products in the inventory.' },
      { title: 'Supplier & Client Management', description: 'Manage suppliers and customer records.' },
      { title: 'Sales Management', description: 'Record and track sales operations.' },
      { title: 'Low-Stock Alerts', description: 'Automatic alerts when product quantities fall below thresholds.' },
      { title: 'Management Dashboards', description: 'Overview panels showing key inventory and sales metrics.' },
      { title: 'Secure Authentication', description: 'Role-protected access to system operations.' },
    ],
  },
];

// ─── Helper: read and update a locale file ─────────────────────────────────

function updateLocale(localePath, projectsData) {
  const locale = JSON.parse(readFileSync(localePath, 'utf8'));
  
  // Replace the items list; keep all other projects.* keys intact
  locale.projects.items = projectsData.map(p => {
    // For non-English locales, preserve the original description/title if exists in current file
    const existing = locale.projects.items?.find(e => e.id === p.id);
    return {
      id: p.id,
      title: p.title,
      tagline: p.tagline || '',
      description: (existing && existing.description && localePath !== 'content/en.json')
        ? existing.description
        : p.description,
      category: p.category,
      featured: p.featured || false,
      stack: p.stack,
      github: p.github || '',
      live: p.live || '',
      images: (existing && existing.images) ? existing.images : [],
      // Extended fields (English only for now — translators can add later)
      overview: p.overview || '',
      problem: p.problem || '',
      solution: p.solution || '',
      features: p.features || [],
      challenges: p.challenges || [],
      achievements: p.achievements || [],
      relatedRepositories: p.relatedRepositories || [],
      architectureServices: p.architectureServices || [],
    };
  });

  writeFileSync(localePath, JSON.stringify(locale, null, 2) + '\n', 'utf8');
  console.log(`[update-projects] ✓ Updated ${localePath} (${projectsData.length} projects)`);
}

// ─── Run ────────────────────────────────────────────────────────────────────

for (const localePath of ['content/en.json', 'content/fr.json', 'content/ar.json', 'content/zh.json']) {
  updateLocale(localePath, newProjects);
}

console.log('\n[update-projects] All locale files updated successfully.');

