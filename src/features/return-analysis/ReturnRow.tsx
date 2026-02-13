import React from 'react';
import { ReturnRequest } from '../../types';
import { formatCurrency, getScoreColor, formatRelativeTime } from '../../utils/format';
import { AlertCircle, Package, Clock } from 'lucide-react';

interface ReturnRowProps {
  returnItem: ReturnRequest;
  onClick: () => void;
}

export function ReturnRow({ returnItem, onClick }: ReturnRowProps) {
  const scoreColor = getScoreColor(returnItem.fraudScore);

  return (
    <div
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${scoreColor.bg}`}>
              {returnItem.fraudScore}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {returnItem.customerName}
                </span>
                <span className="text-sm text-gray-500">
                  • Order #{returnItem.orderId}
                </span>
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-600">
                  {formatCurrency(returnItem.amount)}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatRelativeTime(returnItem.timestamp)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-2 ml-15">
            {returnItem.riskTags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {returnItem.fraudScore > 70 && (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Package className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}