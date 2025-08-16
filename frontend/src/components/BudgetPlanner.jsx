import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import { PlusCircle, Wallet, TrendingUp, TrendingDown, Calendar, PieChart, Loader2 } from 'lucide-react';
import { categoriesAPI, transactionsAPI, handleApiError } from '../services/api';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';
import CategoryManager from './CategoryManager';
import ChartDashboard from './ChartDashboard';
import TransactionList from './TransactionList';

const BudgetPlanner = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpenses: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load initial data from API
  useEffect(() => {
    loadInitialData();
  }, []);

  // Update summary when transactions or selected month changes
  useEffect(() => {
    calculateSummary();
  }, [transactions, selectedMonth]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load categories and transactions in parallel
      const [categoriesData, transactionsData] = await Promise.all([
        categoriesAPI.getAll(),
        transactionsAPI.getAll()
      ]);

      setCategories(categoriesData);
      setTransactions(transactionsData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast({
        title: "Error loading data",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    const monthTransactions = transactions.filter(t => 
      t.date && t.date.startsWith(selectedMonth)
    );
    
    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setSummary({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses
    });
  };

  const addTransaction = async (transactionData) => {
    try {
      const newTransaction = await transactionsAPI.create(transactionData);
      
      // Add to local state
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: "Transaction Added",
        description: `${transactionData.type === 'income' ? 'Income' : 'Expense'} of $${transactionData.amount} added successfully.`,
      });
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast({
        title: "Error adding transaction",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // replace existing addCategory with this
const addCategory = async (categoryName, categoryType) => {
  try {
    // send both name and type
    const newCategory = await categoriesAPI.create({ name: categoryName, type: categoryType });

    // update local state so dropdowns refresh immediately
    setCategories(prev => [...prev, newCategory]);

    toast({
      title: "Category Added",
      description: `Category "${categoryName}" created successfully.`,
    });
  } catch (err) {
    const errorMessage = handleApiError(err);
    toast({
      title: "Error",
      description: errorMessage,
    });
  }
};


  const deleteTransaction = async (transactionId) => {
    try {
      await transactionsAPI.delete(transactionId);
      
      // Remove from local state
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      
      toast({
        title: "Transaction Deleted",
        description: "Transaction removed successfully.",
      });
    } catch (err) {
      const errorMessage = handleApiError(err);
      toast({
        title: "Error deleting transaction",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800">Loading Budget Planner...</h2>
          <p className="text-gray-600">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold text-gray-800">Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={loadInitialData} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-yellow-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Wallet className="h-10 w-10 text-orange-500" />
            Budget Planner
          </h1>
          <p className="text-gray-600">Track your income and expenses with ease</p>
        </div>

        {/* Month Selector & Summary Cards */}
        <div className="grid gap-4">
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <Label htmlFor="month-select">View Month:</Label>
              <Input
                id="month-select"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-auto"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Income</p>
                    <p className="text-2xl font-bold text-green-800">${summary.totalIncome.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-red-100 to-pink-100 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-700">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-800">${summary.totalExpenses.toFixed(2)}</p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-gradient-to-r ${summary.balance >= 0 ? 'from-blue-100 to-cyan-100 border-blue-200' : 'from-orange-100 to-red-100 border-orange-200'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${summary.balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>Balance</p>
                    <p className={`text-2xl font-bold ${summary.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                      ${summary.balance.toFixed(2)}
                    </p>
                    <Badge variant={summary.balance >= 0 ? 'default' : 'destructive'} className="mt-1">
                      {summary.balance >= 0 ? 'Surplus' : 'Deficit'}
                    </Badge>
                  </div>
                  <PieChart className={`h-8 w-8 ${summary.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/60 backdrop-blur-sm">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-white">Transactions</TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-white">Add Entry</TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-white">Categories</TabsTrigger>
            <TabsTrigger value="charts" className="data-[state=active]:bg-white">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <TransactionList 
              transactions={transactions.filter(t => t.date && t.date.startsWith(selectedMonth))}
              categories={categories}
              onDelete={deleteTransaction}
            />
          </TabsContent>

          <TabsContent value="add">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <IncomeForm categories={categories} onSubmit={addTransaction} />
              <ExpenseForm categories={categories} onSubmit={addTransaction} />
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager categories={categories} onAddCategory={addCategory} />
          </TabsContent>

          <TabsContent value="charts">
            <ChartDashboard 
              transactions={transactions} 
              categories={categories}
              selectedMonth={selectedMonth}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BudgetPlanner;