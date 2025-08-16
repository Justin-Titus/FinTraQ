import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { PlusCircle, Tag, DollarSign, Minus } from 'lucide-react';

const CategoryManager = ({ categories = [], onAddCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('income'); // default type

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim(), newCategoryType);
      setNewCategoryName('');
      setNewCategoryType('income'); // reset
    }
  };

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <div className="space-y-6">
      {/* Add Custom Category */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 shadow-lg rounded-2xl">
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-purple-800 text-lg font-semibold">
      <PlusCircle className="h-5 w-5" />
      Add Custom Category
    </CardTitle>
  </CardHeader>

  <CardContent>
    <form onSubmit={handleAddCategory} className="flex gap-3">
      {/* Input + Radios */}
      <div className="flex-1 space-y-3">
        {/* Category name input */}
        <div>
          <Label htmlFor="categoryName" className="text-sm text-gray-700">
            Category Name
          </Label>
          <Input
            id="categoryName"
            placeholder="Enter category name..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
            className="mt-1 border-purple-200 focus:border-purple-500 focus:ring focus:ring-purple-300"
          />
        </div>

        {/* Category type radio */}
        <div className="flex gap-6 items-center">
          {[
            { label: "Income", value: "income", color: "text-green-700" },
            { label: "Expense", value: "expense", color: "text-red-700" },
          ].map((opt) => (
            <label
              key={opt.value}
              htmlFor={opt.value}
              className={`flex items-center gap-1 cursor-pointer ${opt.color}`}
            >
              <input
                type="radio"
                id={opt.value}
                name="categoryType"
                value={opt.value}
                checked={newCategoryType === opt.value}
                onChange={(e) => setNewCategoryType(e.target.value)}
                className="accent-purple-600"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Add Button */}
      <Button
        type="submit"
        className="self-end bg-purple-600 hover:bg-purple-700 text-white transition-all duration-200"
        disabled={!newCategoryName.trim()}
      >
        <PlusCircle className="h-4 w-4 mr-1" />
        Add
      </Button>
    </form>
  </CardContent>
</Card>


      {/* Categories Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <DollarSign className="h-5 w-5" />
              Income Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {incomeCategories.map(category => (
                <Badge 
                  key={category.id} 
                  variant="secondary" 
                  className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 transition-colors"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {category.name}
                </Badge>
              ))}
            </div>
            {incomeCategories.length === 0 && (
              <p className="text-green-600 text-sm italic">No income categories available</p>
            )}
          </CardContent>
        </Card>

        {/* Expense Categories */}
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Minus className="h-5 w-5" />
              Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {expenseCategories.map(category => (
                <Badge 
                  key={category.id} 
                  variant="secondary" 
                  className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 transition-colors"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {category.name}
                </Badge>
              ))}
            </div>
            {expenseCategories.length === 0 && (
              <p className="text-red-600 text-sm italic">No expense categories available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Stats */}
      <Card className="bg-white/60 backdrop-blur-sm border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800">Category Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-green-600">{incomeCategories.length}</p>
              <p className="text-sm text-gray-600">Income Categories</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-red-600">{expenseCategories.length}</p>
              <p className="text-sm text-gray-600">Expense Categories</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
              <p className="text-sm text-gray-600">Total Categories</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManager;
