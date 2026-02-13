import React from 'react';
import { Comment } from '../types';
import { getAIScoreColor } from '../utils/format';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { X, Check, Trash2, Flag, AlertTriangle, Star, Shield, Clock } from 'lucide-react';

interface CommentDetailModalProps {
  comment: Comment;
  onClose: () => void;
  onAction: (action: 'approve' | 'remove' | 'flag', comment: Comment) => void;
}

export function CommentDetailModal({ comment, onClose, onAction }: CommentDetailModalProps) {
  const scoreColor = getAIScoreColor(comment.aiScore);
  const isHighRisk = comment.aiScore > 85;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 scale-100 animate-in">
        {/* Header */}
        <div className={`bg-gradient-to-r ${isHighRisk ? 'from-red-500 to-red-600' : comment.aiScore > 70 ? 'from-orange-500 to-orange-600' : 'from-blue-500 to-blue-600'} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Comment Analysis</h2>
                <p className="text-white/80 text-sm">CryptacoreAI™ Fraud Detection</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Score Overview */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center font-bold text-white text-2xl shadow-xl ${scoreColor.bg}`}>
                {comment.aiScore}
              </div>
              <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-medium text-white ${scoreColor.bg}`}>
                {scoreColor.label}
              </div>
            </div>
          </div>

          {/* Comment Details */}
          <Card className="mb-6 border-2 border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                Comment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Author</p>
                  <p className="font-medium">{comment.author}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Product</p>
                  <p className="font-medium">{comment.product}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center">
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
                <div>
                  <p className="text-sm text-gray-500">Purchase Status</p>
                  <div className="flex items-center">
                    {comment.verifiedPurchase ? (
                      <div className="flex items-center text-green-600">
                        <Check className="w-4 h-4 mr-1" />
                        Verified
                      </div>
                    ) : (
                      <div className="flex items-center text-orange-600">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Unverified
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Content</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{comment.content}</p>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {new Date(comment.timestamp).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Risk Indicators */}
          <Card className="mb-6 border-2 border-orange-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-orange-600">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Risk Indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {comment.indicators.map((indicator, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 rounded-lg border ${
                      indicator.includes('Trademark') || indicator.includes('Paid')
                        ? 'bg-red-50 border-red-200 text-red-700'
                        : indicator.includes('Extreme') || indicator.includes('Unverified')
                        ? 'bg-orange-50 border-orange-200 text-orange-700'
                        : 'bg-yellow-50 border-yellow-200 text-yellow-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">{indicator}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scoring Breakdown */}
          <Card className="border-2 border-blue-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-blue-600">
                <Shield className="w-5 h-5 mr-2" />
                Scoring Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {comment.aiScore > 85 && (
                  <div className="flex justify-between p-2 bg-red-50 rounded">
                    <span className="font-medium text-red-700">Trademark Injection</span>
                    <span className="font-bold text-red-700">+40 pts</span>
                  </div>
                )}
                {!comment.verifiedPurchase && (
                  <div className="flex justify-between p-2 bg-orange-50 rounded">
                    <span className="font-medium text-orange-700">Unverified Purchase Bias</span>
                    <span className="font-bold text-orange-700">+{10 + (comment.aiScore > 70 ? 25 : 15)} pts</span>
                  </div>
                )}
                {comment.aiScore > 50 && (
                  <div className="flex justify-between p-2 bg-yellow-50 rounded">
                    <span className="font-medium text-yellow-700">Extreme Sentiment</span>
                    <span className="font-bold text-yellow-700">+15-25 pts</span>
                  </div>
                )}
                {comment.aiScore > 40 && (
                  <div className="flex justify-between p-2 bg-purple-50 rounded">
                    <span className="font-medium text-purple-700">AI Writing Patterns</span>
                    <span className="font-bold text-purple-700">+5-20 pts</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onAction('approve', comment)}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => onAction('flag', comment)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Flag className="w-4 h-4 mr-2" />
              Flag for Review
            </Button>
            <Button
              onClick={() => onAction('remove', comment)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}