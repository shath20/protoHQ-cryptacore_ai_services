import React from 'react';
import { Check, X, Flag, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface AuditTrailProps {
  actions: Array<{
    id: string;
    commentId: string;
    author: string;
    action: string;
    timestamp: string;
    score: number;
  }>;
}

export function AuditTrail({ actions }: AuditTrailProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Approved':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'Removed':
        return <X className="w-4 h-4 text-red-600" />;
      case 'Flagged':
        return <Flag className="w-4 h-4 text-orange-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Approved':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'Removed':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'Flagged':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <Card className="sticky top-24 border-2 border-gray-200 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Clock className="w-5 h-5 mr-2 text-gray-600" />
          Audit Trail
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 max-h-96 overflow-y-auto">
        {actions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No actions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {actions.map((action, index) => (
              <div
                key={action.id}
                className={`p-3 rounded-lg border transition-all duration-300 hover:shadow-md ${index === 0 ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                  }`}
                style={{
                  animation: index === 0 ? 'slideIn 0.3s ease-out' : 'none'
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getActionIcon(action.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(action.action)}`}>
                        {action.action}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(action.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {action.author}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">Score: {action.score}</span>
                      {index === 0 && (
                        <span className="text-xs text-blue-600 font-medium">Latest</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}