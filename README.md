# 🛍️ ecom-app (Next.js E-Commerce Platform)

A premium, modern e-commerce web application built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **MongoDB/Mongoose**, and **Zustand**. This application features custom authentication, cart management, search & filtering, interactive carousels, mock checkout payment routing, and a clean, responsive Dark/Light mode theme system.

---

## 📖 Table of Contents
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Dependencies](#%EF%B8%8F-tech-stack--dependencies)
- [📁 Project Directory Structure](#-project-directory-structure)
- [🚀 Getting Started](#-getting-started)
  - [1. Prerequisites](#1-prerequisites)
  - [2. Clone & Install](#2-clone--install)
  - [3. Environment Configuration](#3-environment-configuration)
  - [4. Seed the Database](#4-seed-the-database)
  - [5. Run the Application](#5-run-the-application)
- [⚙️ Available Scripts](#%EF%B8%8F-available-scripts)
- [🔒 Authentication & Security](#-authentication--security)
- [⚡ Optimizations](#-optimizations)

---

## ✨ Key Features

*   **🏠 Modern Landing Page**: Features a stunning, fluid Hero section utilizing `framer-motion` for micro-animations, alongside a "Featured Products" showcase driven by `embla-carousel-react`.
*   **🌓 Dark & Light Mode Toggle**: Perfectly styled theme variations powered by `next-themes` and Tailwind CSS v4 variables.
*   **🛒 Persistent Client-Side Cart**: Full-featured shopping cart state management using `zustand` with local storage persistence. Adds, removes, and updates quantities instantly with smooth transitions.
*   **🔍 Product Exploration**: View product lists, category details, new arrivals, deals, and detail pages.
*   **🔒 Secure Custom Authentication**: User signup and login routes using JSON Web Tokens (JWT) for session control and `bcrypt` for secure password hashing.
*   **💳 Simulated Checkout Flow**: Multistep checkout validation with a mock payment gateway simulation page to test ordering logic.
*   **📊 DB Seeding Utility**: Pre-configured MongoDB seed script with 20 premium gadget/electronic items (MacBooks, iPhones, gaming consoles, etc.) to immediately populate the application.

---

## 🛠️ Tech Stack & Dependencies

### Core Frameworks & Libraries
*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, API Routes)
*   **Language**: TypeScript
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Database ORM**: [Mongoose](https://mongoosejs.com/) (connecting to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Base UI](https://base-ui.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Forms & Validation
*   **React Hook Form**: Form state handling
*   **Zod**: Schema validation for products, orders, and authentication

### Utilities
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Notifications**: [Sonner](https://sonner.dev/) (toast messages)
*   **Dev Utilities**: `tsx` (TypeScript execute script runner)

---

## 📁 Project Directory Structure

```text
Menu/
├── src/
│   ├── app/                      # Next.js App Router (pages & API routes)
│   │   ├── api/                  # API Endpoint handlers (auth, orders, products, etc.)
│   │   ├── cart/                 # Shopping Cart page
│   │   ├── categories/           # Category views
│   │   ├── checkout/             # Checkout billing & info inputs
│   │   ├── deals/                # Promotional offers page
│   │   ├── login/                # Authentication - Sign In page
│   │   ├── mock-payment/         # Simulated credit card/payment processor gateway
│   │   ├── new-arrivals/         # New arrivals filtering page
│   │   ├── products/             # Search, details, and listing page
│   │   ├── profile/              # User account details and order history
│   │   ├── signup/               # Authentication - Sign Up page
│   │   ├── globals.css           # Global CSS and Tailwind directives
│   │   └── layout.tsx            # Main layout wrapper containing Navbar and Footer
│   ├── components/               # Reusable UI React Components
│   │   ├── categories/           # Category-specific display units
│   │   ├── home/                 # FeaturedProducts, Hero, and landing page units
│   │   ├── layout/               # Global components (Navbar.tsx, Footer.tsx)
│   │   ├── products/             # Product cards, detail panels, etc.
│   │   ├── ui/                   # Generic elements (buttons, inputs, cards)
│   │   ├── theme-provider.tsx    # Next-themes provider
│   │   └── theme-toggle.tsx      # Dark/Light mode selector switch
│   ├── lib/                      # Helper libraries and DB connections
│   │   ├── db.ts                 # MongoDB Mongoose connection handler
│   │   └── utils.ts              # Tailwind merger & clsx styling helper
│   ├── models/                   # Mongoose Database Schemas
│   │   ├── Order.ts              # Purchase Orders data model
│   │   ├── Product.ts            # E-commerce store item data model
│   │   ├── Subscription.ts       # Newsletter/Email subscriber schema
│   │   └── User.ts               # User accounts schema (hashed passwords)
│   ├── scripts/                  # Command line scripts
│   │   └── seed.ts               # Database populator for mock products
│   └── store/                    # State management (Zustand)
│       ├── useAuthStore.ts       # User session state management
│       └── useCartStore.ts       # Global cart addition, updates & totals
```

---

## 🚀 Getting Started

To run this application locally, follow these steps:

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18.x or higher recommended)
*   A running [MongoDB Instance](https://www.mongodb.com/try/download/community) locally or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud URI.

### 2. Clone & Install
```bash
# Navigate to project directory
cd Menu

# Install all project dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root of the project. A template for this configuration is:

```env
# MongoDB Connection String (Atlas or Localhost)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecom?retryWrites=true&w=majority

# JWT signing secret (for custom auth tokens)
JWT_SECRET=your_super_secret_jwt_string_here

# App URL (needed for API calls and client headers)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Seed the Database
Populate your database with the pre-configured products using `tsx` (which executes the TypeScript seed script):

```bash
npx tsx src/scripts/seed.ts
```
*(This will clear any existing products and seed 20 tech products: laptops, phones, accessories, etc.)*

### 5. Run the Application
Start the development server:

```bash
npm run dev
```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)** to view the store.

---

## ⚙️ Available Scripts

In the project directory, you can run the following scripts:

*   `npm run dev`: Starts the Next.js development server with hot-reloading.
*   `npm run build`: Compiles the React compilation compiler and builds the production-ready build bundle.
*   `npm run start`: Starts the Next.js production server (requires running `build` first).
*   `npm run lint`: Performs lint analysis on your code files using ESLint configuration.

---

## 🔒 Authentication & Security

*   **Bcrypt Password Hashing**: Passwords are never stored as plain text. The application uses `bcrypt` to hash and salt passwords during signup, validating hashes during login.
*   **JWT Sessions**: When users log in, a JWT token is created on the backend. This is stored securely in cookies or headers, enabling validation for secure API actions (e.g. creating orders or reading user profiles).
*   **Validation**: All request payloads are rigorously validated on both client (React Hook Form) and server (Zod schemas) sides.

---

## ⚡ Optimizations

*   **Tailwind CSS v4**: Built with the brand new compile-time CSS engine from Tailwind for lightning fast styles.
*   **Next.js Server Components**: Pages fetch catalog data directly from MongoDB inside Server Components, avoiding client-side layout shifts and drastically improving loading times.
*   **React Compiler**: Employs React's new compiler for automated dependency tracking and component memoization.
*   **Embla Carousel**: Uses highly optimized, lightweight swipe/touch carousel structures.
#   M e n u  
 