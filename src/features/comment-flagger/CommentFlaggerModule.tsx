import React, { useState } from 'react';
import { Comment } from '../../types';
import { CommentFlagger } from './CommentFlagger';
import { AuditTrail } from './AuditTrail';

interface CommentFlaggerModuleProps {
    comments: Comment[];
    isLoading: boolean;
    onCommentAction: (action: 'approve' | 'remove' | 'flag', comment: Comment) => void;
    onAddComment: (comment: Comment) => void;
}

export function CommentFlaggerModule({
    comments,
    isLoading,
    onCommentAction,
    onAddComment
}: CommentFlaggerModuleProps) {
    const [auditActions, setAuditActions] = useState<Array<{
        id: string;
        commentId: string;
        author: string;
        action: string;
        timestamp: string;
        score: number;
    }>>([]);

    const handleCommentAction = (action: 'approve' | 'remove' | 'flag', comment: Comment) => {
        onCommentAction(action, comment);

        const auditEntry = {
            id: `audit-${Date.now()}`,
            commentId: comment.id,
            author: comment.author,
            action: action === 'approve' ? 'Approved' : action === 'remove' ? 'Removed' : 'Flagged',
            timestamp: new Date().toISOString(),
            score: comment.aiScore
        };
        setAuditActions(prev => [auditEntry, ...prev].slice(0, 10));
    };

    const stats = {
        total: comments.length,
        flagged: comments.filter(c => c.flagged).length,
        aiGenerated: comments.filter(c => c.aiScore > 70).length,
        verified: comments.filter(c => c.verifiedPurchase).length
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
                <CommentFlagger
                    comments={comments}
                    isLoading={isLoading}
                    onCommentAction={handleCommentAction}
                    onAddComment={onAddComment}
                    stats={stats}
                />
            </div>
            <div className="lg:col-span-1">
                <AuditTrail actions={auditActions} />
            </div>
        </div>
    );
}
