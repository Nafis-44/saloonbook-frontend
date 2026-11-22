SalonBook – Frontend
The frontend application for SalonBook, an online salon booking platform. Customers can explore salon services, book appointments, manage their bookings, and complete payments through Stripe.
Project Overview
This repository contains the client-side application built with Next.js, React, and TypeScript. It communicates with the SalonBook backend API to retrieve services and manage booking-related operations.
Important Features
- Responsive salon booking interface
- User authentication
- Browse salon services and view service details
- Book appointments and select available time slots
- Customer dashboard and booking management
- Admin dashboard interface
- Stripe checkout flow
- Payment success and cancellation pages
- Dynamic service data from the backend API
Technology Stack
- Next.js
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Better Auth
- Stripe Checkout
Installation Instructions
1. Clone the repository
git clone https://github.com/Nafis-44/saloonbook-frontend.git
cd saloonbook-frontend
2. Install dependencies
npm install
Required Environment Variables
Create a .env.local file in the root of the frontend project.
NEXT_PUBLIC_API_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
MONGODB_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_PUBLIC_IMGBB_API_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
Use the variable names that match your local authentication configuration. Google OAuth variables are needed only if Google sign-in is enabled.

Important: Add real values only to your local environment file or deployment environment settings. Never commit secret values or .env files to GitHub.
How to Run the Project Locally
Start the development server:
npm run dev
Open http://localhost:3000 in your browser.

To create a production build:
npm run build
To run the production build locally:
npm start
Live Website
Live Website: ADD_YOUR_DEPLOYED_FRONTEND_URL_HERE
Client and Server Repositories
- Client Repository: https://github.com/Nafis-44/saloonbook-frontend
- Server Repository: https://github.com/Nafis-44/saloonbook-server