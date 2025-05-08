import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { BudgetCategory } from '../../types';
import { 
  DollarSign, 
  PieChart, 
  Plus, 
  Trash2, 
  Edit2 
} from 'lucide-react';
import { Button } from '../ui/Button';

export const BudgetOverview: React.FC = () => {
  const { selectedEvent, updateBudget, addBudgetCategory, updateBudgetCategory, removeBudgetCategory } = useEvent();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<BudgetCategory>>({
    name: '',
    allocated: 0,
    spent: 0,
  });
  
  if (!selectedEvent) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Select an event to view budget</p>
      </div>
    );
  }
  
  const { budget } = selectedEvent;
  const totalBudget = budget.total;
  const totalSpent = budget.spent;
  const remainingBudget = totalBudget - totalSpent;
  const budgetProgress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  const handleUpdateBudgetTotal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTotal = parseFloat(e.target.value);
    if (!isNaN(newTotal) && newTotal >= 0) {
      updateBudget(selectedEvent.id, { total: newTotal });
    }
  };
  
  const handleAddCategory = () => {
    if (newCategory.name && typeof newCategory.allocated === 'number') {
      addBudgetCategory(selectedEvent.id, newCategory);
      setNewCategory({ name: '', allocated: 0, spent: 0 });
      setIsAddingCategory(false);
    }
  };
  
  const handleEditCategory = (category: BudgetCategory) => {
    setNewCategory({
      name: category.name,
      allocated: category.allocated,
      spent: category.spent,
    });
    setEditingCategoryId(category.id);
  };
  
  const handleUpdateCategory = () => {
    if (editingCategoryId && newCategory.name && typeof newCategory.allocated === 'number') {
      updateBudgetCategory(selectedEvent.id, editingCategoryId, newCategory);
      setNewCategory({ name: '', allocated: 0, spent: 0 });
      setEditingCategoryId(null);
    }
  };
  
  const handleCancelEdit = () => {
    setNewCategory({ name: '', allocated: 0, spent: 0 });
    setEditingCategoryId(null);
    setIsAddingCategory(false);
  };
  
  const handleRemoveCategory = (categoryId: string) => {
    removeBudgetCategory(selectedEvent.id, categoryId);
  };
  
  const getBudgetStatusColor = () => {
    if (budgetProgress > 90) return 'text-red-600';
    if (budgetProgress > 75) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  // Calculate category percentages for the chart
  const categories = selectedEvent.budget.categories;
  const categoryColors = [
    'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
    'bg-red-500', 'bg-purple-500', 'bg-teal-500',
    'bg-indigo-500', 'bg-pink-500', 'bg-orange-500',
  ];
  
  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Budget Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <DollarSign size={16} className="text-gray-400 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Total Budget</h3>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-800 mr-2">
                ${totalBudget.toFixed(2)}
              </span>
              <input
                type="number"
                min="0"
                className="w-32 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={totalBudget}
                onChange={handleUpdateBudgetTotal}
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <DollarSign size={16} className="text-gray-400 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Spent</h3>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              ${totalSpent.toFixed(2)}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <DollarSign size={16} className="text-gray-400 mr-2" />
              <h3 className="text-sm font-medium text-gray-700">Remaining</h3>
            </div>
            <div className={`text-2xl font-bold ${getBudgetStatusColor()}`}>
              ${remainingBudget.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-700">Budget Progress</h3>
            <span className="text-sm text-gray-500">{budgetProgress.toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                budgetProgress > 90 ? 'bg-red-500' : 
                budgetProgress > 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetProgress, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Plus size={14} />}
          onClick={() => setIsAddingCategory(true)}
          className="mt-2"
          disabled={isAddingCategory || editingCategoryId !== null}
        >
          Add Budget Category
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Budget Categories</h3>
            
            {(isAddingCategory || editingCategoryId) && (
              <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium mb-3">
                  {editingCategoryId ? 'Edit Category' : 'Add Category'}
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={newCategory.name || ''}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Allocated Amount</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={newCategory.allocated || 0}
                      onChange={(e) => setNewCategory({ ...newCategory, allocated: parseFloat(e.target.value) })}
                    />
                  </div>
                  
                  {editingCategoryId && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Spent Amount</label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={newCategory.spent || 0}
                        onChange={(e) => setNewCategory({ ...newCategory, spent: parseFloat(e.target.value) })}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={editingCategoryId ? handleUpdateCategory : handleAddCategory}
                      disabled={!newCategory.name || typeof newCategory.allocated !== 'number'}
                    >
                      {editingCategoryId ? 'Update' : 'Add'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {categories.length > 0 ? (
              <div className="space-y-3">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-2 ${categoryColors[index % categoryColors.length]}`}
                        ></div>
                        <h4 className="font-medium text-gray-800">{category.name}</h4>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          className="p-1 text-gray-400 hover:text-purple-600 focus:outline-none"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="p-1 text-gray-400 hover:text-red-600 focus:outline-none"
                          onClick={() => handleRemoveCategory(category.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Allocated:</span>
                        <span className="ml-1 font-medium">${category.allocated.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Spent:</span>
                        <span className="ml-1 font-medium">${category.spent.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-gray-500">
                          ${category.spent.toFixed(2)} of ${category.allocated.toFixed(2)}
                        </span>
                        <span className="text-gray-500">
                          {category.allocated > 0
                            ? ((category.spent / category.allocated) * 100).toFixed(0)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            category.spent > category.allocated
                              ? 'bg-red-500'
                              : category.spent > category.allocated * 0.75
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              (category.spent / category.allocated) * 100,
                              100
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <PieChart className="mx-auto mb-2 text-gray-400" size={24} />
                <p className="text-gray-500 mb-1">No budget categories</p>
                <p className="text-xs text-gray-400">
                  Add categories to track your expenses
                </p>
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Budget Distribution</h3>
            
            {categories.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="relative aspect-square mb-4">
                  {/* Simple visual representation of budget distribution */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full rounded-full overflow-hidden shadow-inner flex flex-wrap">
                      {categories.map((category, index) => {
                        const percentage = (category.allocated / totalBudget) * 100;
                        return (
                          <div 
                            key={category.id}
                            className={`h-full ${categoryColors[index % categoryColors.length]}`}
                            style={{ width: `${percentage}%` }}
                            title={`${category.name}: $${category.allocated} (${percentage.toFixed(1)}%)`}
                          ></div>
                        );
                      })}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3/5 h-3/5 bg-white rounded-full flex flex-col items-center justify-center shadow-lg">
                        <span className="text-sm font-medium text-gray-500">Total Budget</span>
                        <span className="text-lg font-bold text-gray-800">${totalBudget.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {categories.map((category, index) => {
                    const percentage = (category.allocated / totalBudget) * 100;
                    return (
                      <div key={category.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${categoryColors[index % categoryColors.length]}`}
                          ></div>
                          <span className="text-gray-800">{category.name}</span>
                        </div>
                        <div className="text-gray-600">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <PieChart className="mx-auto mb-2 text-gray-400" size={24} />
                <p className="text-gray-500 mb-1">No budget data to display</p>
                <p className="text-xs text-gray-400">
                  Add categories to see budget distribution
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};