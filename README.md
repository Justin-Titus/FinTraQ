# FinTraQ - Personal Budget Planner & Expense Tracker

<div align="center">
  <img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" />
</div>

A modern, secure personal finance tracking application built with React, FastAPI, and Node.js. FinTraQ helps you manage your income and expenses with an intuitive interface, comprehensive charts, and secure authentication.

## ✨ Features

### 💰 Financial Management
- **Income & Expense Tracking**: Add, edit, and categorize transactions
- **Category Management**: Create custom categories for better organization
- **Monthly View**: Filter transactions by month for detailed analysis
- **Real-time Balance**: Automatic calculation of income, expenses, and balance
- **Visual Dashboard**: Interactive charts and graphs for spending insights

### 🔐 Security & Authentication
- **JWT Authentication**: Secure access and refresh token system
- **Protected Routes**: All sensitive data behind authentication
- **Session Management**: Automatic token refresh and secure logout
- **httpOnly Cookies**: Refresh tokens stored securely

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean interface with Tailwind CSS and shadcn/ui components
- **Smooth Animations**: Polished loading states and transitions
- **Intuitive Navigation**: Easy-to-use tabbed interface

## 🏗 Architecture

```
FinTraQ/
├── frontend/          # React 18 + TailwindCSS + shadcn/ui
├── backend/           # FastAPI (Data & Business Logic)
├── backend-node/      # Node.js + Express (Authentication Gateway)
└── tests/            # Test suite
```

### Tech Stack
- **Frontend**: React 18, TailwindCSS, shadcn/ui, Lucide React Icons
- **Backend Data**: FastAPI, Python, SQLite/PostgreSQL
- **Backend Auth**: Node.js, Express, JWT
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
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
python server.py
```
*FastAPI runs on http://localhost:8000*

### 3. Setup Node.js Auth Gateway
```bash
cd backend-node
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux
# Edit .env and set a strong ACCESS_TOKEN_SECRET
npm install
npm run dev
```
*Auth gateway runs on http://localhost:5001*

### 4. Setup React Frontend
```bash
cd frontend
npm install
npm start
```
*React app runs on http://localhost:3000*

### 5. Environment Configuration

FinTraQ requires environment variables for each component. Create the following `.env` files:

#### Frontend Environment (frontend/.env)
```env
# Backend API URL - points to the Node.js auth gateway
REACT_APP_BACKEND_URL=http://localhost:5001
```

#### Python Backend Environment (backend/.env)
```env
# MongoDB Connection (use your MongoDB Atlas connection string)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=FinTraQ
DB_NAME=FinTraQ

# CORS Configuration
CORS_ORIGINS=http://localhost:3000
```

#### Node.js Auth Backend Environment (backend-node/.env)
```env
# Environment
NODE_ENV=development

# Server Configuration
PORT=5001

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# MongoDB Connection (same as Python backend)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority&appName=FinTraQ

# JWT Configuration (generate secure random strings)
ACCESS_TOKEN_SECRET=your-super-secure-random-string-here
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=7

# Python Backend URL (for proxying data requests)
PYTHON_BACKEND_URL=http://localhost:8000
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
   - Choose "Driver: Node.js" and copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your values
5. **Network Access**:
   - Go to Network Access → Add IP Address
   - For development: "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add specific IP addresses

#### Environment Variables Guide

| Variable | Component | Description | Example |
|----------|-----------|-------------|---------|
| `REACT_APP_BACKEND_URL` | Frontend | URL to Node.js auth gateway | `http://localhost:5001` |
| `MONGO_URL` | Python Backend | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
| `MONGO_URI` | Node.js Backend | Same MongoDB connection for auth | `mongodb+srv://user:pass@cluster.mongodb.net/...` |
| `DB_NAME` | Python Backend | Database name in MongoDB | `FinTraQ` |
| `ACCESS_TOKEN_SECRET` | Node.js Backend | JWT signing secret (generate secure) | `your-secure-random-string` |
| `PYTHON_BACKEND_URL` | Node.js Backend | URL to Python FastAPI service | `http://localhost:8000` |
| `PORT` | Node.js Backend | Port for auth gateway | `5001` |
| `CORS_ORIGIN` | Node.js Backend | Frontend URL for CORS | `http://localhost:3000` |
| `CORS_ORIGINS` | Python Backend | Frontend URL for CORS | `http://localhost:3000` |

#### Security Notes

- **Never commit `.env` files** to version control
- **Generate strong secrets**: Use tools like `openssl rand -base64 32` for `ACCESS_TOKEN_SECRET`
- **Use different secrets** for development and production
- **Rotate secrets regularly** in production environments

#### Development vs Production

**Development** (localhost):
- Use `http://localhost:*` URLs
- Allow access from anywhere in MongoDB Atlas
- Shorter token expiration for testing

**Production** (Render/Vercel):
- Use HTTPS URLs (`https://your-app.onrender.com`)
- Restrict MongoDB Atlas to specific IP ranges
- Longer token expiration for better UX
- Use environment variables in hosting platform

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Add Categories**: Set up income and expense categories
3. **Track Transactions**: Record your income and expenses
4. **View Analytics**: Check your monthly summaries and charts
5. **Manage Data**: Edit or delete transactions and categories

## 🔒 Security Features

- **Token-based Authentication**: JWT access tokens (15 min) + refresh tokens (7 days)
- **Secure Storage**: Refresh tokens in httpOnly cookies with SameSite protection
- **Auto Token Rotation**: Seamless token refresh without user intervention
- **Protected API Routes**: All financial data behind authentication
- **Memory-only Access Tokens**: No sensitive data in localStorage

## 🎯 API Endpoints

### Authentication (Node.js - Port 5001)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - Secure logout

### Data API (FastAPI - Port 8000, Proxied via Node.js)
- `GET/POST /api/transactions` - Transaction management
- `GET/POST /api/categories` - Category management
- `DELETE /api/transactions/:id` - Delete transaction
- `DELETE /api/categories/:id` - Delete category

## 🛠 Development

### Running Tests
```bash
cd tests
python -m pytest
```

### Code Style
- **Frontend**: ESLint + Prettier for React/JavaScript
- **Backend**: Black + Flake8 for Python
- **Commits**: Conventional commits preferred

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
# Deploy with gunicorn/uvicorn

# Node Gateway
cd backend-node
npm run start
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
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom React hooks
│   │   └── utils/            # Utility functions
│   └── public/               # Static assets
├── backend/
│   ├── models/               # Data models
│   ├── routes/               # API routes
│   └── database.py           # Database configuration
├── backend-node/
│   ├── src/
│   │   ├── routes/           # Auth routes
│   │   ├── models/           # User models
│   │   └── middleware/       # JWT middleware
│   └── server.js             # Express server
└── tests/                    # Test files
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

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Lucide](https://lucide.dev/) for clean, modern icons
- [TailwindCSS](https://tailwindcss.com/) for utility-first styling
- [FastAPI](https://fastapi.tiangolo.com/) for the powerful Python backend
- [React](https://reactjs.org/) for the frontend framework

---

<div align="center">
  <p>Made with ❤️ for better financial management</p>
</div>
