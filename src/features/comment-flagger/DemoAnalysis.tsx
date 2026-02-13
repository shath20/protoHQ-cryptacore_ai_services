import React from 'react';
import { Comment } from '../../types';
import { getAIScoreColor } from '../../utils/format';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Check, X, Star, AlertTriangle, Shield, TrendingUp } from 'lucide-react';

interface DemoAnalysisProps {
  comment: Comment;
}

export function DemoAnalysis({ comment }: DemoAnalysisProps) {
  const scoreColor = getAIScoreColor(comment.aiScore);
  const isLikelyPaid = comment.aiScore > 85;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card className={`border-2 shadow-xl transform transition-all duration-300 hover:scale-[1.02] ${isLikelyPaid ? 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50' :
          comment.aiScore > 70 ? 'border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50' :
            'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
        }`}>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center">
            <div className={`p-2 rounded-lg mr-3 ${isLikelyPaid ? 'bg-red-100' : comment.aiScore > 70 ? 'bg-orange-100' : 'bg-green-100'
              }`}>
              {isLikelyPaid ? (
                <X className="w-5 h-5 text-red-600" />
              ) : comment.aiScore > 70 ? (
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              ) : (
                <Check className="w-5 h-5 text-green-600" />
              )}
            </div>
            <div>
              <div className="flex items-center">
                CryptacoreAI Analysis Results
                <Shield className="w-4 h-4 ml-2 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Advanced Fraud Detection System
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Score Display */}
          <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-inner">
            <div className="flex items-center space-x-4">
              <div className={`relative w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg ${scoreColor.bg} transform transition-transform hover:scale-110`}>
                {comment.aiScore}
                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${scoreColor.bg}`}></div>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {scoreColor.label}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Risk Level Assessment
                </p>
              </div>
            </div>

            {/* Risk Meter */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${scoreColor.bg}`}
                  style={{ width: `${comment.aiScore}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-1">Risk Meter</span>
            </div>
          </div>

          {/* Alert Banner */}
          {comment.flagged && (
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-red-100 to-pink-100 border border-red-200 rounded-xl animate-pulse">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <span className="text-sm font-semibold text-red-800">
                  ⚠️ High Risk Detected
                </span>
                <p className="text-xs text-red-700 mt-0.5">
                  This comment requires immediate review
                </p>
              </div>
            </div>
          )}

          {/* Detection Patterns */}
          {comment.indicators.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-blue-600" />
                Detection Patterns
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {comment.indicators.map((indicator, index) => (
                  <div
                    key={index}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium border transform transition-all duration-300 hover:scale-105 hover:shadow-md ${indicator.includes('Trademark') || indicator.includes('Likely Paid')
                        ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
                        : indicator.includes('Unverified + Extreme') || indicator.includes('Extreme Opinion')
                          ? 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 border-orange-200'
                          : indicator.includes('Corporate') || indicator.includes('AI')
                            ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-purple-200'
                            : 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200'
                      }`}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {indicator.includes('Trademark') && <Star className="w-4 h-4 mr-2" />}
                    {indicator.includes('Extreme') && <AlertTriangle className="w-4 h-4 mr-2" />}
                    {indicator}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scoring Breakdown */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
              Scoring Breakdown
            </p>
            <div className="space-y-2">
              {comment.aiScore > 85 && (
                <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg border border-red-100">
                  <span className="text-sm font-medium text-red-700">🎯 Trademark/Product Name Injection</span>
                  <span className="text-sm font-bold text-red-700">+40 pts</span>
                </div>
              )}
              {!comment.verifiedPurchase && (
                <div className="flex justify-between items-center p-2 bg-orange-50 rounded-lg border border-orange-100">
                  <span className="text-sm font-medium text-orange-700">⚠️ Unverified Purchase Bias</span>
                  <span className="text-sm font-bold text-orange-700">+{10 + (comment.aiScore > 70 ? 25 : 15)} pts</span>
                </div>
              )}
              {comment.aiScore > 50 && (
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg border border-yellow-100">
                  <span className="text-sm font-medium text-yellow-700">💬 Extreme Sentiment Without Evidence</span>
                  <span className="text-sm font-bold text-yellow-700">+15-25 pts</span>
                </div>
              )}
              {comment.aiScore > 40 && (
                <div className="flex justify-between items-center p-2 bg-purple-50 rounded-lg border border-purple-100">
                  <span className="text-sm font-medium text-purple-700">🤖 AI/Corporate Language Patterns</span>
                  <span className="text-sm font-bold text-purple-700">+5-20 pts</span>
                </div>
              )}
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                <span className="text-sm font-medium text-gray-700">📝 Author & Format Patterns</span>
                <span className="text-sm font-bold text-gray-700">+5-10 pts</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}