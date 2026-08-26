# FinTraQ - Personal Budget Planner & Expense Tracker

<div align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" />
</div>

A modern, secure personal finance tracking application built with React and FastAPI. FinTraQ helps you manage your income and expenses with an intuitive interface, comprehensive charts, and secure authentication.

## ✨ Features

### 💰 Financial Management
- **Income & Expense Tracking**: Add, edit, and categorize transactions
- **Category Management**: Create custom categories for better organization
- **Monthly View**: Filter transactions by month for detailed analysis
- **Real-time Balance**: Automatic calculation of income, expenses, and balance
- **Visual Dashboard**: Interactive charts and graphs for spending insights

### 🔐 Security & Authentication
- **JWT Authentication**: Secure access and refresh token system powered by FastAPI
- **Protected Routes**: All sensitive data behind authentication
- **Session Management**: Automatic token refresh and secure logout
- **Password Hashing**: Secure bcrypt password hashing

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean interface with Tailwind CSS and shadcn/ui components
- **Smooth Animations**: Polished loading states and transitions
- **Intuitive Navigation**: Easy-to-use tabbed interface

## 🏗 Architecture

```
FinTraQ/
├── frontend/          # React 18 + Vite + TailwindCSS + shadcn/ui
└── backend/           # FastAPI (Data, Business Logic & Auth)
```

### Tech Stack
- **Frontend**: React 18, TailwindCSS, shadcn/ui, Lucide React Icons
- **Backend**: FastAPI, Python, Motor (Async MongoDB), JWT, Passlib
- **Database**: MongoDB Atlas
- **Development**: Hot reload, ESLint, Prettier

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/Justin-Titus/FinTraQ.git
cd FinTraQ
```

### 2. Setup FastAPI Backend
```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python -m uvicorn server:app --reload
```
*FastAPI runs on http://localhost:8000*

### 3. Setup React Frontend
```bash
cd frontend
npm install
npm run dev
```
*React app runs on http://localhost:3000*

### 4. Environment Configuration

FinTraQ requires environment variables for both components. Create the following `.env` files:

#### Frontend Environment (frontend/.env)
```env
# Backend API URL - points to the FastAPI server
VITE_BACKEND_URL=http://localhost:8000
```

#### Python Backend Environment (backend/.env)
```env
# MongoDB Connection (use your MongoDB Atlas connection string)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=FinTraQ
DB_NAME=FinTraQ

# JWT Auth Configuration (generate a secure random string)
SECRET_KEY=your-super-secure-random-string-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

#### Setting Up MongoDB Atlas

1. **Create MongoDB Atlas Account**: Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create a Cluster**: Follow the free tier setup
3. **Create Database User**:
   - Go to Database Access → Add New Database User
   - Choose "Password" authentication
   - Set username and strong password
   - Grant "Read and write to any database" privileges
4. **Get Connection String**:
   - Go to Database → Connect → Connect your application
   - Choose "Driver: Python" and copy the connection string
   - Replace `<username>` and `<password>` with your values
5. **Network Access**:
   - Go to Network Access → Add IP Address
   - For development: "Allow Access from Anywhere" (0.0.0.0/0)

#### Security Notes

- **Never commit `.env` files** to version control
- **Generate strong secrets**: Use tools like `openssl rand -hex 32` for `SECRET_KEY`

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Add Categories**: Set up income and expense categories
3. **Track Transactions**: Record your income and expenses
4. **View Analytics**: Check your monthly summaries and charts
5. **Manage Data**: Edit or delete transactions and categories

## 🔒 Security Features

- **Token-based Authentication**: JWT access tokens (30 min) + refresh tokens (7 days)
- **Auto Token Rotation**: Seamless token refresh via Axios interceptors
- **Protected API Routes**: All financial data behind `Depends(get_current_user)` authentication
- **Memory-only Access Tokens**: No sensitive access tokens stored in localStorage

## 🎯 API Endpoints (FastAPI - Port 8000)

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Token refresh
- `POST /api/auth/logout` - Secure logout
- `GET  /api/auth/me` - Get current user info

### Data API
- `GET/POST /api/transactions/` - Transaction management
- `DELETE   /api/transactions/{id}` - Delete transaction
- `GET      /api/transactions/summary/{month}` - Get monthly summary
- `GET/POST /api/categories/` - Category management
- `DELETE   /api/categories/{id}` - Delete category

## 🛠 Development

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
# Deploy with gunicorn/uvicorn
```

## 📁 Project Structure

```
FinTraQ/
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── auth/         # Authentication components
│   │   │   └── ...           # Feature components
│   │   ├── services/         # API services (axios interceptors)
│   │   ├── context/          # React Context (AuthContext)
│   │   └── hooks/            # Custom React hooks
│   ├── public/               # Static assets
│   ├── index.html            # Vite HTML entrypoint
│   └── vite.config.js        # Vite & dev proxy configuration
├── backend/
│   ├── models/               # Pydantic models & PyMongo schemas
│   ├── routes/               # FastAPI routers (auth, transactions, categories)
│   ├── utils/                # JWT and Password hashing utilities
│   ├── database.py           # MongoDB connection pooling
│   ├── dependencies.py       # FastAPI auth dependencies
│   └── server.py             # FastAPI entrypoint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Justin Titus**
- GitHub: [@Justin-Titus](https://github.com/Justin-Titus)
- LinkedIn: [Justin Titus](https://www.linkedin.com/in/justin-titus-j)

---

<div align="center">
  <p>Made with ❤️ for better financial management</p>
</div>
