import React, { useState, useEffect } from 'react';
import { MessageSquare, TrendingUp, Activity, Shield } from 'lucide-react';
import { Comment } from './types';
import { generateMockComments } from './data/mockReturns';
import { DashboardHeader } from './components/layout/DashboardHeader';
import { CommentFlaggerModule } from './features/comment-flagger/CommentFlaggerModule';
import { ReturnAnalysisModule } from './features/return-analysis/ReturnAnalysisModule';
import { SettingsPanel } from './features/settings/SettingsPanel';
import { useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
// import { useSettings } from './context/SettingsContext';

function App() {
  // const { settings } = useSettings(); // Not used directly in this file
  const [comments, setComments] = useState<Comment[]>([]);
  const [activeTab, setActiveTab] = useState<'comment-flagger' | 'return-analysis'>('comment-flagger');
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const { user, loading } = useAuth();

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockComments = generateMockComments();
      setComments(mockComments);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={() => { }} />;
  }

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
        <DashboardHeader onOpenSettings={() => setShowSettings(true)} />

        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl transform transition-all scale-100">
              <SettingsPanel onClose={() => setShowSettings(false)} />
            </div>
          </div>
        )}

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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
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

export default App;