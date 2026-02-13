import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ReturnRequest } from '../types';
import { formatCurrency, getScoreColor, formatRelativeTime } from '../utils/format';
import { X, CheckCircle, XCircle, Flag } from 'lucide-react';

interface ActionModalProps {
  returnItem: ReturnRequest;
  onClose: () => void;
  onAction: (action: 'approve' | 'deny' | 'flag') => void;
}

export function ActionModal({ returnItem, onClose, onAction }: ActionModalProps) {
  const scoreColor = getScoreColor(returnItem.fraudScore);
  
  const fraudFactors = [
    returnItem.returnHistory > 3 && `${returnItem.returnHistory} returns in last 90 days`,
    returnItem.accountAge < 30 && 'New account (less than 30 days)',
    returnItem.amount > 500 && 'High-value return',
    returnItem.packagingCondition === 'mismatched' && 'Packaging condition mismatch',
    returnItem.itemCategory === 'electronics' && 'High-risk category',
    returnItem.returnReason === 'damaged' && 'Frequent return reason'
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900">
                Review Return Request
              </CardTitle>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="font-medium text-gray-900">{returnItem.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-medium text-gray-900">#{returnItem.orderId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Return Amount</p>
                      <p className="font-medium text-gray-900">{formatCurrency(returnItem.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Submitted</p>
                      <p className="font-medium text-gray-900">{formatRelativeTime(returnItem.timestamp)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fraud Score */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Fraud Risk Assessment</h3>
                <div className="flex items-center space-x-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl text-white ${scoreColor.bg}`}>
                    {returnItem.fraudScore}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      Risk Level: <span className={`font-semibold ${scoreColor.text}`}>{scoreColor.label}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      CryptacoreAI™ Fraud Score (0-100)
                    </p>
                  </div>
                </div>
              </div>

              {/* Contributing Factors */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Contributing Factors</h3>
                <div className="space-y-2">
                  {fraudFactors.map((factor, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <p className="text-sm text-gray-700">{factor}</p>
                    </div>
                  ))}
                  {fraudFactors.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No significant risk factors detected</p>
                  )}
                </div>
              </div>

              {/* Risk Tags */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Risk Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {returnItem.riskTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4 border-t">
                <Button
                  onClick={() => onAction('approve')}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Return
                </Button>
                <Button
                  onClick={() => onAction('deny')}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Deny Return
                </Button>
                <Button
                  onClick={() => onAction('flag')}
                  variant="outline"
                  className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Flag for Audit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}