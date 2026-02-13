import React, { useState } from 'react';
import { Comment } from '../../types';
import { getAIScoreColor, getCommentBackgroundColor } from '../../utils/format';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Shield, AlertTriangle, TrendingUp, Filter, Search, Eye, Check, X, Flag, Download } from 'lucide-react';
import { ReturnAnalysisRow } from '../../components/ui/ReturnAnalysisRow';
import { downloadCSV } from '../../utils/export';
import { useSettings } from '../../context/SettingsContext';

import { useReturnFilter } from '../../hooks/useReturnFilter';

interface ReturnAnalysisDashboardProps {
  comments: Comment[];
  isLoading: boolean;
}

export function ReturnAnalysisDashboard({ comments, isLoading }: ReturnAnalysisDashboardProps) {
  const { settings } = useSettings();
  const [selectedReturn, setSelectedReturn] = useState<Comment | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    riskFilter,
    setRiskFilter,
    selectedIds,
    filteredComments,
    highRiskReturns,
    mediumRiskReturns,
    lowRiskReturns,
    toggleSelection,
    toggleAll,
    clearSelection
  } = useReturnFilter({ comments, settings });

  const handleExportCSV = () => {
    downloadCSV(filteredComments, `return-analysis-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleBatchAction = (action: 'approve' | 'flag') => {
    // In a real app, this would verify the action with the backend
    // console.log(`Batch ${action} on ${selectedIds.size} items`);
    clearSelection();
  };

  if (isLoading) {
    return (
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading return analysis...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Filter Returns
              </div>
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 animate-in fade-in slide-in-from-left-4 duration-200">
                  <span className="text-sm font-medium text-blue-700">{selectedIds.size} Selected</span>
                  <div className="h-4 w-px bg-blue-200 mx-1" />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleBatchAction('approve')}
                    className="h-6 px-2 text-green-600 hover:text-green-700 hover:bg-green-100"
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleBatchAction('flag')}
                    className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-100"
                  >
                    Flag
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAll}
                className="hidden sm:flex"
              >
                {selectedIds.size === filteredComments.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by customer or product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={riskFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setRiskFilter('all')}
                className="px-4"
              >
                All ({filteredComments.length})
              </Button>
              <Button
                variant={riskFilter === 'high' ? 'default' : 'outline'}
                onClick={() => setRiskFilter('high')}
                className="px-4 border-red-200 text-red-700 hover:bg-red-50"
              >
                High ({highRiskReturns.length})
              </Button>
              <Button
                variant={riskFilter === 'medium' ? 'default' : 'outline'}
                onClick={() => setRiskFilter('medium')}
                className="px-4 border-orange-200 text-orange-700 hover:bg-orange-50"
              >
                Medium ({mediumRiskReturns.length})
              </Button>
              <Button
                variant={riskFilter === 'low' ? 'default' : 'outline'}
                onClick={() => setRiskFilter('low')}
                className="px-4 border-green-200 text-green-700 hover:bg-green-50"
              >
                Low ({lowRiskReturns.length})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Priority Returns */}
      {highRiskReturns.length > 0 && (
        <Card className="border-2 border-red-200 shadow-lg bg-gradient-to-br from-red-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              <AlertTriangle className="w-5 h-5 mr-2" />
              High Priority Returns - Immediate Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highRiskReturns.map((comment) => (
                <ReturnAnalysisRow
                  key={comment.id}
                  comment={comment}
                  onSelect={() => setSelectedReturn(comment)}
                  priority="high"
                  selected={selectedIds.has(comment.id)}
                  onToggleSelect={() => toggleSelection(comment.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medium Priority Returns */}
      {mediumRiskReturns.length > 0 && (
        <Card className="border-2 border-orange-200 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-orange-700">
              <TrendingUp className="w-5 h-5 mr-2" />
              Medium Priority Returns - Review Recommended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mediumRiskReturns.map((comment) => (
                <ReturnAnalysisRow
                  key={comment.id}
                  comment={comment}
                  onSelect={() => setSelectedReturn(comment)}
                  priority="medium"
                  selected={selectedIds.has(comment.id)}
                  onToggleSelect={() => toggleSelection(comment.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Low Priority Returns */}
      {lowRiskReturns.length > 0 && (
        <Card className="border-2 border-green-200 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <Shield className="w-5 h-5 mr-2" />
              Low Priority Returns - Standard Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowRiskReturns.map((comment) => (
                <ReturnAnalysisRow
                  key={comment.id}
                  comment={comment}
                  onSelect={() => setSelectedReturn(comment)}
                  priority="low"
                  selected={selectedIds.has(comment.id)}
                  onToggleSelect={() => toggleSelection(comment.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Return Detail Modal */}
      {selectedReturn && (
        <CommentDetailModal
          comment={selectedReturn}
          onClose={() => setSelectedReturn(null)}
          onAction={() => { }}
        />
      )}
    </div>
  );
}

// Import the modal component
import { CommentDetailModal } from '../comment-flagger/CommentDetailModal';