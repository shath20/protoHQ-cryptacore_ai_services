import React from 'react';
import { Comment } from '../types';
import { getAIScoreColor, getCommentBackgroundColor } from '../utils/format';
import { Button } from './ui/button';
import { Star, AlertTriangle, Check, X, Flag, Eye } from 'lucide-react';

interface CommentRowProps {
  comment: Comment;
  onClick: () => void;
  onAction: (action: 'approve' | 'remove' | 'flag', comment: Comment) => void;
}

export function CommentRow({ comment, onClick, onAction }: CommentRowProps) {
  const scoreColor = getAIScoreColor(comment.aiScore);
  const backgroundColor = getCommentBackgroundColor(comment.aiScore, comment.flagged);
  const isHighRisk = comment.aiScore > 85;

  return (
    <div 
      className={`group relative p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 ${
        isHighRisk ? 'border-red-500 bg-red-50' : 
        comment.aiScore > 70 ? 'border-orange-500 bg-orange-50' : 
        comment.aiScore > 40 ? 'border-yellow-500 bg-yellow-50' : 
        'border-green-500 bg-green-50'
      } hover:bg-opacity-80 transform hover:scale-[1.02]`}
      onClick={onClick}
    >
      {/* Risk Indicator Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${scoreColor.bg} opacity-60 group-hover:opacity-100 transition-opacity`}></div>
      
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3 mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {comment.author}
              </h3>
              {comment.verifiedPurchase && (
                <div className="flex items-center px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  <Check className="w-3 h-3 mr-1" />
                  Verified
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < comment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-2 line-clamp-2 group-hover:text-gray-900 transition-colors">
            {comment.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">{comment.product}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.timestamp).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {comment.indicators.slice(0, 2).map((indicator, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    indicator.includes('Trademark') || indicator.includes('Paid')
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : indicator.includes('Extreme') || indicator.includes('Unverified')
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                  }`}
                >
                  {indicator.includes('Trademark') && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {indicator}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2 ml-4">
          <div className={`relative group/score`}>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-white shadow-lg transform group-hover/score:scale-110 transition-all duration-300 ${scoreColor.bg}`}>
              {comment.aiScore}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${isHighRisk ? 'bg-red-500' : comment.aiScore > 70 ? 'bg-orange-500' : 'bg-green-500'} animate-pulse`}></div>
          </div>
          
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2 text-xs hover:bg-green-50 hover:border-green-300 hover:text-green-700"
              onClick={(e) => {
                e.stopPropagation();
                onAction('approve', comment);
              }}
            >
              <Check className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2 text-xs hover:bg-red-50 hover:border-red-300 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onAction('remove', comment);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2 text-xs hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700"
              onClick={(e) => {
                e.stopPropagation();
                onAction('flag', comment);
              }}
            >
              <Flag className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}