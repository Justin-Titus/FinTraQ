# Budget Planner - Backend Integration Contracts

## API Contracts

### 1. Categories API
- **GET /api/categories** - Get all categories (predefined + custom)
- **POST /api/categories** - Create custom category
  ```json
  Request: { "name": "Custom Category Name" }
  Response: { "id": "uuid", "name": "Custom Category Name", "type": "custom" }
  ```

### 2. Transactions API
- **GET /api/transactions** - Get all transactions with optional month filter
  - Query params: `?month=2025-08` (optional)
- **POST /api/transactions** - Create new transaction
  ```json
  Request: {
    "type": "income|expense",
    "amount": 250.50,
    "category": "Food & Dining",
    "description": "Coffee shop visit"
  }
  Response: {
    "id": "uuid",
    "type": "expense",
    "amount": 250.50,
    "category": "Food & Dining", 
    "description": "Coffee shop visit",
    "date": "2025-08-14"
  }
  ```
- **DELETE /api/transactions/:id** - Delete transaction

### 3. Summary API
- **GET /api/summary/:month** - Get monthly summary
  ```json
  Response: {
    "totalIncome": 6100.00,
    "totalExpenses": 1950.00,
    "balance": 4150.00,
    "month": "2025-08"
  }
  ```

## Mock Data to Replace

### From `mockData.js`:
1. **Categories array** - Replace with database-stored categories
2. **Transactions array** - Replace with database-stored transactions

### Frontend Components to Update:
1. **BudgetPlanner.jsx** - Replace localStorage with API calls
2. **IncomeForm.jsx** - Submit to `/api/transactions`
3. **ExpenseForm.jsx** - Submit to `/api/transactions`
4. **CategoryManager.jsx** - Use `/api/categories` endpoints
5. **TransactionList.jsx** - Fetch from `/api/transactions`
6. **ChartDashboard.jsx** - Use real transaction data

## Backend Implementation Plan

### Database Models:
1. **Category Model**
   - id: ObjectId
   - name: String (required)
   - type: String (enum: ['income', 'expense', 'custom'])
   - createdAt: Date

2. **Transaction Model**
   - id: ObjectId
   - type: String (enum: ['income', 'expense'])
   - amount: Number (required)
   - category: String (required)
   - description: String (optional)
   - date: Date (required)
   - createdAt: Date

### Data Seeding:
- Seed predefined categories on server startup
- Import sample transactions for demo purposes

## Frontend-Backend Integration Steps

1. **Replace localStorage operations** with axios API calls
2. **Update state management** to handle API responses
3. **Add loading states** for better UX
4. **Implement error handling** with toast notifications
5. **Remove mock data imports** and dependencies

## API Error Handling
- Standard HTTP status codes
- Consistent error response format:
  ```json
  {
    "error": "Error message",
    "details": "Detailed error description"
  }
  ```

## Local Storage Migration
- Keep local storage as fallback for offline functionality
- Sync with backend when connection available
- Clear mock data on first successful API connection