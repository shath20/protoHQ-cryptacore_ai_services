import React from 'react';
import { Comment } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { FraudScoreCard } from '../comment-flagger/FraudScoreCard';
import { Shield, TrendingUp, AlertTriangle, Users, DollarSign, Clock } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface ReturnMetricsPanelProps {
  comments: Comment[];
}

export function ReturnMetricsPanel({ comments }: ReturnMetricsPanelProps) {
  const { settings } = useSettings();
  const totalReturns = comments.length;
  const highRiskReturns = comments.filter(c => c.aiScore > settings.highRiskThreshold).length;
  const mediumRiskReturns = comments.filter(c => c.aiScore > settings.mediumRiskThreshold && c.aiScore <= settings.highRiskThreshold).length;
  const lowRiskReturns = comments.filter(c => c.aiScore <= settings.mediumRiskThreshold).length;

  const avgFraudScore = comments.length > 0
    ? Math.round(comments.reduce((sum, c) => sum + c.aiScore, 0) / comments.length)
    : 0;

  const verifiedReturns = comments.filter(c => c.verifiedPurchase).length;
  const unverifiedReturns = comments.filter(c => !c.verifiedPurchase).length;

  // Calculate top fraud pattern
  const fraudPatterns = comments.reduce((patterns, comment) => {
    comment.indicators.forEach(indicator => {
      patterns[indicator] = (patterns[indicator] || 0) + 1;
    });
    return patterns;
  }, {} as Record<string, number>);

  const topPattern = Object.entries(fraudPatterns)
    .sort(([, a], [, b]) => b - a)[0];

  const topPatternPercentage = topPattern
    ? Math.round((topPattern[1] / totalReturns) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FraudScoreCard
            title="Total Returns"
            value={totalReturns}
            icon={<Users className="w-6 h-6 text-white" />}
            trend={12}
            color="blue"
          />

          <FraudScoreCard
            title="High Risk %"
            value={totalReturns > 0 ? Math.round((highRiskReturns / totalReturns) * 100) : 0}
            icon={<AlertTriangle className="w-6 h-6 text-white" />}
            trend={-5}
            color="red"
          />

          <FraudScoreCard
            title="Avg Fraud Score"
            value={avgFraudScore}
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            trend={8}
            color="purple"
          />
        </CardContent>
      </Card>

      {/* Risk Distribution */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-red-700">High Risk</span>
              <span className="text-sm font-bold text-red-700">{highRiskReturns}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalReturns > 0 ? (highRiskReturns / totalReturns) * 100 : 0}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-700">Medium Risk</span>
              <span className="text-sm font-bold text-orange-700">{mediumRiskReturns}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalReturns > 0 ? (mediumRiskReturns / totalReturns) * 100 : 0}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Low Risk</span>
              <span className="text-sm font-bold text-green-700">{lowRiskReturns}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalReturns > 0 ? (lowRiskReturns / totalReturns) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Fraud Pattern */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Top Fraud Pattern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-700 mb-2">
              {topPattern ? topPattern[0] : 'No patterns detected'}
            </div>
            <div className="text-sm text-gray-600">
              {topPatternPercentage}% of all returns
            </div>
            <div className="mt-3 flex justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-purple-200 flex items-center justify-center">
                <span className="text-lg font-bold text-purple-700">{topPatternPercentage}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Verification */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-600" />
            Purchase Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-700">Verified</span>
              <span className="text-sm font-bold text-green-700">{verifiedReturns}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalReturns > 0 ? (verifiedReturns / totalReturns) * 100 : 0}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-700">Unverified</span>
              <span className="text-sm font-bold text-orange-700">{unverifiedReturns}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalReturns > 0 ? (unverifiedReturns / totalReturns) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-2 border-gray-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-600" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {comments.slice(0, 5).map((comment) => (
              <div key={comment.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 truncate">{comment.author}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${comment.aiScore > settings.highRiskThreshold ? 'bg-red-100 text-red-700' :
                    comment.aiScore > settings.mediumRiskThreshold ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                  }`}>
                  {comment.aiScore}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}