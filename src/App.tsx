import React, { useState, useEffect } from 'react';
import { Shield, MessageSquare, TrendingUp, Activity } from 'lucide-react';
import { Comment } from './types';
import { generateMockComments } from './data/mockReturns';
import { AuditTrail } from './components/AuditTrail';
import { CommentFlagger } from './components/CommentFlagger';
import { DashboardHeader } from './components/DashboardHeader';
import { ReturnAnalysisDashboard } from './components/ReturnAnalysisDashboard';
import { ReturnMetricsPanel } from './components/ReturnMetricsPanel';

function App() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<'comment-flagger' | 'return-analysis'>('comment-flagger');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockComments = generateMockComments();
      setComments(mockComments);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCommentAction = (action: 'approve' | 'remove' | 'flag', comment: Comment) => {
    setComments(prev => prev.map(c =>
      c.id === comment.id
        ? { ...c, flagged: action === 'flag', aiScore: action === 'approve' ? Math.min(c.aiScore - 20, 30) : c.aiScore }
        : c
    ));
  };

  const handleAddComment = (comment: Comment) => {
    setComments(prev => [comment, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <DashboardHeader />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-1">
              <nav className="flex space-x-1" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('comment-flagger')}
                  className={`flex-1 flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'comment-flagger'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  AI Comment Flagger
                </button>
                <button
                  onClick={() => setActiveTab('return-analysis')}
                  className={`flex-1 flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'return-analysis'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Return Analysis
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-in fade-in duration-300">
            {activeTab === 'comment-flagger' ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    AI Comment Flagger
                  </h1>
                  <p className="text-gray-600 flex items-center justify-center gap-2">
                    <Activity className="w-4 h-4" />
                    Detect and flag suspicious comments with CryptacoreAI (TM)
                  </p>
                </div>
                <CommentFlaggerModule
                  comments={comments}
                  isLoading={isLoading}
                  onCommentAction={handleCommentAction}
                  onAddComment={handleAddComment}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    Return Analysis Dashboard
                  </h1>
                  <p className="text-gray-600 flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    Comprehensive fraud detection for e-commerce returns
                  </p>
                </div>
                <ReturnAnalysisModule comments={comments} isLoading={isLoading} />
              </div>
            )}
          </div>
        </main>
      </div>


    </div>
  );
}

// Separate module for Comment Flagger
function CommentFlaggerModule({
  comments,
  isLoading,
  onCommentAction,
  onAddComment
}: {
  comments: Comment[];
  isLoading: boolean;
  onCommentAction: (action: 'approve' | 'remove' | 'flag', comment: Comment) => void;
  onAddComment: (comment: Comment) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'verified'>('all');
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

  const filteredComments = comments.filter(comment => {
    if (filter === 'flagged') return comment.flagged;
    if (filter === 'verified') return comment.verifiedPurchase;
    return true;
  });

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
          comments={filteredComments}
          isLoading={isLoading}
          filter={filter}
          onFilterChange={setFilter}
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

// Separate module for Return Analysis
function ReturnAnalysisModule({
  comments,
  isLoading
}: {
  comments: Comment[];
  isLoading: boolean;
}) {
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


export default App;