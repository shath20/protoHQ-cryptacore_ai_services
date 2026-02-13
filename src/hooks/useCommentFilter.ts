import { useState, useMemo } from 'react';
import { Comment } from '../types';

interface UseCommentFilterProps {
    comments: Comment[];
}

export function useCommentFilter({ comments }: UseCommentFilterProps) {
    const [filter, setFilter] = useState<'all' | 'flagged' | 'verified'>('all');
    const [sortBy, setSortBy] = useState<'aiScore' | 'date' | 'rating'>('aiScore');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const filteredComments = useMemo(() => {
        return comments.filter(comment => {
            if (filter === 'flagged') return comment.flagged;
            if (filter === 'verified') return comment.verifiedPurchase;
            return true;
        });
    }, [comments, filter]);

    const sortedComments = useMemo(() => {
        return [...filteredComments].sort((a, b) => {
            if (sortBy === 'aiScore') return b.aiScore - a.aiScore;
            if (sortBy === 'date') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            if (sortBy === 'rating') return b.rating - a.rating;
            return 0;
        });
    }, [filteredComments, sortBy]);

    const toggleSelection = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const toggleAll = () => {
        if (selectedIds.size === sortedComments.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(sortedComments.map(c => c.id)));
        }
    };

    const clearSelection = () => {
        setSelectedIds(new Set());
    };

    return {
        filter,
        setFilter,
        sortBy,
        setSortBy,
        selectedIds,
        sortedComments,
        toggleSelection,
        toggleAll,
        clearSelection
    };
}
