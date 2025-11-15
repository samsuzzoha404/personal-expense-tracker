# 💰 Personal Expense Tracker

A modern, full-stack expense tracking application built with React, TypeScript, Node.js, and MongoDB. Track your expenses, set budgets, and gain insights into your spending habits with an intuitive and beautiful interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)

## ✨ Features

- 🔐 **User Authentication** - Secure authentication with Firebase (Email/Password & Google OAuth)
- 💳 **Transaction Management** - Add, edit, delete, and categorize transactions
- 📊 **Budget Tracking** - Set category-based budgets and monitor spending
- 📈 **Interactive Dashboard** - Visualize spending patterns with charts and analytics
- 🎨 **Modern UI** - Beautiful, responsive interface built with Tailwind CSS and shadcn/ui
- 🌓 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🚀 **Real-time Updates** - Instant feedback with React Query
- 💾 **Data Persistence** - MongoDB database for reliable data storage
- 🎯 **Demo Mode** - Try the app without signing up

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **State Management:** React Context API + React Query
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Authentication:** Firebase Auth

### Backend
- **Runtime:** Node.js with Express
- **Database:** MongoDB
- **API:** RESTful API
- **Deployment:** Vercel (Serverless)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or Bun package manager
- MongoDB (local or Atlas account)
- Firebase account (for authentication)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/samsuzzoha404/personal-expense-tracker.git
cd personal-expense-tracker
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/expense-tracker
# or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/expense-tracker

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Start the Backend Server

```bash
# Development mode with auto-restart
npm run server:dev

# Production mode
npm run server
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

#### Install Dependencies

```bash
cd frontend
npm install
# or using Bun
bun install
```

#### Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# API Configuration
VITE_API_URL=http://localhost:5000/api
```

#### Start the Development Server

```bash
npm run dev
# or using Bun
bun run dev
```

The frontend will be available at `http://localhost:5173`

## 🔧 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google Sign-in
4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Copy the configuration values to your `.env` file

## 📁 Project Structure

```
personal-expense-tracker/
├── backend/
│   ├── api/
│   │   └── index.js           # Vercel serverless entry point
│   ├── server/
│   │   ├── config/
│   │   │   └── database.js    # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── budgetController.js
│   │   │   └── transactionController.js
│   │   ├── models/
│   │   │   ├── Budget.js
│   │   │   └── Transaction.js
│   │   ├── routes/
│   │   │   ├── budgets.js
│   │   │   └── transactions.js
│   │   └── server.js          # Express server
│   ├── package.json
│   └── vercel.json            # Vercel deployment config
│
└── frontend/
    ├── src/
    │   ├── components/        # Reusable UI components
    │   │   ├── auth/
    │   │   ├── dashboard/
    │   │   └── ui/            # shadcn/ui components
    │   ├── config/
    │   │   └── firebase.ts    # Firebase configuration
    │   ├── contexts/          # React Context providers
    │   │   ├── AuthContext.tsx
    │   │   ├── ThemeContext.tsx
    │   │   └── TransactionContext.tsx
    │   ├── hooks/             # Custom React hooks
    │   ├── layouts/           # Layout components
    │   ├── lib/               # Utility functions
    │   ├── pages/             # Page components
    │   │   ├── Dashboard.tsx
    │   │   ├── Transactions.tsx
    │   │   ├── Settings.tsx
    │   │   └── ...
    │   ├── services/          # API service layer
    │   │   ├── api.ts
    │   │   ├── budgetService.ts
    │   │   ├── dashboardService.ts
    │   │   └── transactionService.ts
    │   ├── types/             # TypeScript type definitions
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

## 🎯 API Endpoints

### Transactions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions/:userId` | Get all transactions for a user |
| POST | `/api/transactions` | Create a new transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

### Budgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/budgets/:userId` | Get all budgets for a user |
| POST | `/api/budgets` | Create a new budget |
| PUT | `/api/budgets/:id` | Update a budget |
| DELETE | `/api/budgets/:id` | Delete a budget |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |

## 🎨 Available Scripts

### Frontend

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend

```bash
npm run server       # Start production server
npm run server:dev   # Start development server with nodemon
```

## 🌐 Deployment

### Backend (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the backend directory
3. Configure environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

### Frontend (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Configure environment variables
4. Set up custom domain (optional)

## 🔐 Security Considerations

- All API endpoints are protected with user authentication
- Firebase handles secure authentication and token management
- MongoDB connection strings should be kept secure
- Environment variables should never be committed to version control
- CORS is configured to allow only specified origins

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Sam Suzzoha**
- GitHub: [@samsuzzoha404](https://github.com/samsuzzoha404)

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Firebase](https://firebase.google.com/) for authentication services
- [Vercel](https://vercel.com/) for seamless deployment

## 📞 Support

If you have any questions or need help, please:
- Open an issue in the GitHub repository
- Contact via email (if provided)

---

<div align="center">
  Made with ❤️ by Sam Suzzoha
</div>
