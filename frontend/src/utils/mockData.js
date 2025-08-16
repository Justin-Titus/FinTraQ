export const mockData = {
  categories: [
    // Predefined Income Categories
    { id: '1', name: 'Salary', type: 'income' },
    { id: '2', name: 'Freelance', type: 'income' },
    { id: '3', name: 'Investment', type: 'income' },
    { id: '4', name: 'Business', type: 'income' },
    { id: '5', name: 'Other Income', type: 'income' },
    
    // Predefined Expense Categories
    { id: '6', name: 'Food & Dining', type: 'expense' },
    { id: '7', name: 'Transportation', type: 'expense' },
    { id: '8', name: 'Shopping', type: 'expense' },
    { id: '9', name: 'Entertainment', type: 'expense' },
    { id: '10', name: 'Bills & Utilities', type: 'expense' },
    { id: '11', name: 'Healthcare', type: 'expense' },
    { id: '12', name: 'Education', type: 'expense' },
    { id: '13', name: 'Travel', type: 'expense' },
    { id: '14', name: 'Home & Garden', type: 'expense' },
    { id: '15', name: 'Personal Care', type: 'expense' },
    { id: '16', name: 'Gifts & Donations', type: 'expense' },
    { id: '17', name: 'Other Expenses', type: 'expense' }
  ],
  
  transactions: [
    // Current month transactions
    { id: 'tx1', type: 'income', amount: 5000, category: 'Salary', description: 'Monthly salary', date: new Date().toISOString().split('T')[0] },
    { id: 'tx2', type: 'income', amount: 800, category: 'Freelance', description: 'Web design project', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'tx3', type: 'expense', amount: 1200, category: 'Bills & Utilities', description: 'Rent payment', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'tx4', type: 'expense', amount: 350, category: 'Food & Dining', description: 'Groceries', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'tx5', type: 'expense', amount: 80, category: 'Transportation', description: 'Gas & parking', date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'tx6', type: 'expense', amount: 120, category: 'Entertainment', description: 'Movie tickets', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'tx7', type: 'expense', amount: 200, category: 'Shopping', description: 'Clothing', date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { id: 'tx8', type: 'income', amount: 300, category: 'Investment', description: 'Dividend payout', date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    
    // Previous month transactions for trend analysis
    { id: 'tx9', type: 'income', amount: 5000, category: 'Salary', description: 'Monthly salary', date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0] },
    { id: 'tx10', type: 'expense', amount: 1200, category: 'Bills & Utilities', description: 'Rent payment', date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0] },
    { id: 'tx11', type: 'expense', amount: 400, category: 'Food & Dining', description: 'Monthly groceries', date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0] },
    { id: 'tx12', type: 'expense', amount: 150, category: 'Transportation', description: 'Monthly transit', date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0] },
    
    // Two months ago for better trend visualization
    { id: 'tx13', type: 'income', amount: 4800, category: 'Salary', description: 'Monthly salary', date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0] },
    { id: 'tx14', type: 'expense', amount: 1200, category: 'Bills & Utilities', description: 'Rent payment', date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0] },
    { id: 'tx15', type: 'expense', amount: 380, category: 'Food & Dining', description: 'Monthly groceries', date: new Date(new Date().setMonth(new Date().getMonth() - 2)).toISOString().split('T')[0] }
  ]
};