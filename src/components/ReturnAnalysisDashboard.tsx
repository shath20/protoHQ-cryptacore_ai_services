import React, { useState } from 'react';
import { Comment } from '../types';
import { getAIScoreColor, getCommentBackgroundColor } from '../utils/format';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, AlertTriangle, TrendingUp, Filter, Search, Eye, Check, X, Flag } from 'lucide-react';

interface ReturnAnalysisDashboardProps {
  comments: Comment[];
  isLoading: boolean;
}

export function ReturnAnalysisDashboard({ comments, isLoading }: ReturnAnalysisDashboardProps) {
  const [selectedReturn, setSelectedReturn] = useState<Comment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.product.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRisk = riskFilter === 'all' || 
                       (riskFilter === 'high' && comment.aiScore > 70) ||
                       (riskFilter === 'medium' && comment.aiScore > 40 && comment.aiScore <= 70) ||
                       (riskFilter === 'low' && comment.aiScore <= 40);
    
    return matchesSearch && matchesRisk;
  });

  const highRiskReturns = filteredComments.filter(c => c.aiScore > 70);
  const mediumRiskReturns = filteredComments.filter(c => c.aiScore > 40 && c.aiScore <= 70);
  const lowRiskReturns = filteredComments.filter(c => c.aiScore <= 40);

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
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-600" />
            Filter Returns
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
          onAction={() => {}}
        />
      )}
    </div>
  );
}

// Return Analysis Row Component
function ReturnAnalysisRow({ 
  comment, 
  onSelect, 
  priority 
}: { 
  comment: Comment; 
  onSelect: () => void; 
  priority: 'high' | 'medium' | 'low';
}) {
  const scoreColor = getAIScoreColor(comment.aiScore);
  const priorityColors = {
    high: 'border-red-500 bg-red-50',
    medium: 'border-orange-500 bg-orange-50',
    low: 'border-green-500 bg-green-50'
  };

  return (
    <div
      className={`p-4 border-l-4 ${priorityColors[priority]} hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-[1.02]`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="font-semibold text-gray-900">{comment.author}</h3>
            {comment.verifiedPurchase && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Verified
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-700 mb-2 line-clamp-2">{comment.content}</p>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{comment.product}</span>
            <span>•</span>
            <span>{new Date(comment.timestamp).toLocaleDateString()}</span>
            <span>•</span>
            <span>Rating: {comment.rating}/5</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${scoreColor.bg}`}>
            {comment.aiScore}
          </div>
          
          <div className="flex space-x-1">
            <Button size="sm" variant="outline" className="h-8 px-2">
              <Eye className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-2 text-green-600 hover:bg-green-50">
              <Check className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-2 text-red-600 hover:bg-red-50">
              <X className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-2 text-orange-600 hover:bg-orange-50">
              <Flag className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import the modal component
import { CommentDetailModal } from './CommentDetailModal';