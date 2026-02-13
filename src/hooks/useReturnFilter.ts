import { useState, useMemo } from 'react';
import { Comment, RiskSettings } from '../types';

interface UseReturnFilterProps {
    comments: Comment[];
    settings: RiskSettings;
}

export function useReturnFilter({ comments, settings }: UseReturnFilterProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const filteredComments = useMemo(() => {
        return comments.filter(comment => {
            const matchesSearch = comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                comment.product.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRisk = riskFilter === 'all' ||
                (riskFilter === 'high' && comment.aiScore > settings.highRiskThreshold) ||
                (riskFilter === 'medium' && comment.aiScore > settings.mediumRiskThreshold && comment.aiScore <= settings.highRiskThreshold) ||
                (riskFilter === 'low' && comment.aiScore <= settings.mediumRiskThreshold);

            return matchesSearch && matchesRisk;
        });
    }, [comments, searchTerm, riskFilter, settings]);

    const highRiskReturns = useMemo(() =>
        filteredComments.filter(c => c.aiScore > settings.highRiskThreshold),
        [filteredComments, settings.highRiskThreshold]
    );

    const mediumRiskReturns = useMemo(() =>
        filteredComments.filter(c => c.aiScore > settings.mediumRiskThreshold && c.aiScore <= settings.highRiskThreshold),
        [filteredComments, settings.mediumRiskThreshold, settings.highRiskThreshold]
    );

    const lowRiskReturns = useMemo(() =>
        filteredComments.filter(c => c.aiScore <= settings.mediumRiskThreshold),
        [filteredComments, settings.mediumRiskThreshold]
    );

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
        if (selectedIds.size === filteredComments.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredComments.map(c => c.id)));
        }
    };

    const clearSelection = () => {
        setSelectedIds(new Set());
    };

    return {
        searchTerm,
        setSearchTerm,
        riskFilter,
        setRiskFilter,
        selectedIds,
        filteredComments,
        highRiskReturns,
        mediumRiskReturns,
        lowRiskReturns,
        toggleSelection,
        toggleAll,
        clearSelection
    };
}
