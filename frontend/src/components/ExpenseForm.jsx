import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { TrendingDown, IndianRupee } from 'lucide-react';

const ExpenseForm = ({ categories, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: ''
  });

  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.category) {
      onSubmit({
        type: 'expense',
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description
      });
      setFormData({ amount: '', category: '', description: '' });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-red-800">
          <TrendingDown className="h-5 w-5" />
          Add Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expense-amount" className="text-red-700">Amount</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-600" />
              <Input
                id="expense-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="pl-10 border-red-200 focus:border-red-400 focus:ring-red-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-category" className="text-red-700">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="border-red-200 focus:border-red-400 focus:ring-red-400">
                <SelectValue placeholder="Select expense category" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expense-description" className="text-red-700">Description (Optional)</Label>
            <Textarea
              id="expense-description"
              placeholder="Add a note about this expense..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="border-red-200 focus:border-red-400 focus:ring-red-400 resize-none"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            disabled={!formData.amount || !formData.category}
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;