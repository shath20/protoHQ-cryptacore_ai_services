import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ReturnRequest } from '../types';
import { ReturnRow } from './ReturnRow';
import { Filter, ArrowUpDown } from 'lucide-react';

interface ReturnListProps {
  returns: ReturnRequest[];
  isLoading: boolean;
  filter: 'all' | 'low' | 'medium' | 'high';
  sortBy: 'score' | 'date' | 'amount';
  onFilterChange: (filter: 'all' | 'low' | 'medium' | 'high') => void;
  onSortChange: (sortBy: 'score' | 'date' | 'amount') => void;
  onReturnClick: (returnItem: ReturnRequest) => void;
}

export function ReturnList({ 
  returns, 
  isLoading, 
  filter, 
  sortBy, 
  onFilterChange, 
  onSortChange,
  onReturnClick 
}: ReturnListProps) {
  return (
    <Card className="bg-white border-2 border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Return Requests
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange('all')}
                className="text-xs"
              >
                All
              </Button>
              <Button
                variant={filter === 'low' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange('low')}
                className="text-xs"
              >
                Low
              </Button>
              <Button
                variant={filter === 'medium' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange('medium')}
                className="text-xs"
              >
                Medium
              </Button>
              <Button
                variant={filter === 'high' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onFilterChange('high')}
                className="text-xs"
              >
                High
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const nextSort = sortBy === 'score' ? 'date' : sortBy === 'date' ? 'amount' : 'score';
                onSortChange(nextSort);
              }}
              className="text-xs"
            >
              <ArrowUpDown className="w-3 h-3 mr-1" />
              {sortBy === 'score' ? 'Score' : sortBy === 'date' ? 'Date' : 'Amount'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-pulse">Loading return requests...</div>
          </div>
        ) : returns.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No return requests found
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {returns.map((returnItem) => (
              <ReturnRow
                key={returnItem.id}
                returnItem={returnItem}
                onClick={() => onReturnClick(returnItem)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}