import React from 'react';
import { Comment } from '../../types';
import { getAIScoreColor } from '../../utils/format';
import { Button } from './button';
import { Eye, Check, X, Flag } from 'lucide-react';

interface ReturnAnalysisRowProps {
    comment: Comment;
    onSelect: () => void;
    priority: 'high' | 'medium' | 'low';
    selected?: boolean;
    onToggleSelect?: () => void;
}

export function ReturnAnalysisRow({
    comment,
    onSelect,
    priority,
    selected = false,
    onToggleSelect
}: ReturnAnalysisRowProps) {
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
            <div className="flex items-start gap-4">
                {onToggleSelect && (
                    <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                        <input
                            type="checkbox"
                            checked={selected}
                            onChange={onToggleSelect}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                    </div>
                )}
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
