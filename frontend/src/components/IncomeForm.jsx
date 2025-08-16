import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { TrendingUp, IndianRupee } from 'lucide-react';

const IncomeForm = ({ categories, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: ''
  });

  const incomeCategories = categories.filter(cat => cat.type === 'income');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount && formData.category) {
      onSubmit({
        type: 'income',
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
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-green-800">
          <TrendingUp className="h-5 w-5" />
          Add Income
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income-amount" className="text-green-700">Amount</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
              <Input
                id="income-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="pl-10 border-green-200 focus:border-green-400 focus:ring-green-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-category" className="text-green-700">Category</Label>
            <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
              <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-400">
                <SelectValue placeholder="Select income category" />
              </SelectTrigger>
              <SelectContent>
                {incomeCategories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="income-description" className="text-green-700">Description (Optional)</Label>
            <Textarea
              id="income-description"
              placeholder="Add a note about this income..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="border-green-200 focus:border-green-400 focus:ring-green-400 resize-none"
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            disabled={!formData.amount || !formData.category}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Add Income
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IncomeForm;