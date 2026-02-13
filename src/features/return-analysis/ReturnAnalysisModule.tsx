import React from 'react';
import { Comment } from '../../types';
import { ReturnAnalysisDashboard } from './ReturnAnalysisDashboard';
import { ReturnMetricsPanel } from './ReturnMetricsPanel';

interface ReturnAnalysisModuleProps {
    comments: Comment[];
    isLoading: boolean;
}

export function ReturnAnalysisModule({
    comments,
    isLoading
}: ReturnAnalysisModuleProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <ReturnAnalysisDashboard comments={comments} isLoading={isLoading} />
            </div>
            <div className="lg:col-span-1">
                <ReturnMetricsPanel comments={comments} />
            </div>
        </div>
    );
}
