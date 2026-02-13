import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Comment } from '../types';
import { CommentRow } from './CommentRow';
import { CommentDetailModal } from './CommentDetailModal';
import { FraudScoreCard } from './FraudScoreCard';
import { DemoAnalysis } from './DemoAnalysis';
import { analyzeComment, generateIndicators } from '../lib/commentAnalysis';
import { MessageSquare, AlertTriangle, Star, Check, Play, Plus, Shield } from 'lucide-react';

interface CommentFlaggerProps {
  comments: Comment[];
  isLoading: boolean;
  filter: 'all' | 'flagged' | 'verified';
  onFilterChange: (filter: 'all' | 'flagged' | 'verified') => void;
  onCommentAction: (action: 'approve' | 'remove' | 'flag', comment: Comment) => void;
  onAddComment: (comment: Comment) => void;
  stats: {
    total: number;
    flagged: number;
    aiGenerated: number;
    verified: number;
  };
}

export function CommentFlagger({ 
  comments, 
  isLoading, 
  filter, 
  onFilterChange,
  onCommentAction,
  onAddComment,
  stats
}: CommentFlaggerProps) {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [sortBy, setSortBy] = useState<'aiScore' | 'date' | 'rating'>('aiScore');
  
  // Demo state
  const [demoAuthor, setDemoAuthor] = useState('');
  const [demoProduct, setDemoProduct] = useState('');
  const [demoRating, setDemoRating] = useState(5);
  const [demoContent, setDemoContent] = useState('');
  const [demoVerified, setDemoVerified] = useState(false);
  const [demoAnalysis, setDemoAnalysis] = useState<Comment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'aiScore') return b.aiScore - a.aiScore;
    if (sortBy === 'date') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const handleAnalyzeDemo = async () => {
    if (!demoAuthor || !demoProduct || !demoContent) {
      alert('Please fill in all fields');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay for realism
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const score = analyzeComment({
      id: 'temp',
      author: demoAuthor,
      product: demoProduct,
      rating: demoRating,
      content: demoContent,
      timestamp: new Date().toISOString(),
      verifiedPurchase: demoVerified,
      aiScore: 0,
      flagged: false,
      indicators: []
    });

    const demoComment: Comment = {
      id: `demo-${Date.now()}`,
      author: demoAuthor,
      product: demoProduct,
      rating: demoRating,
      content: demoContent,
      timestamp: new Date().toISOString(),
      verifiedPurchase: demoVerified,
      aiScore: score,
      flagged: score > 50,
      indicators: generateIndicators({
        id: 'temp',
        author: demoAuthor,
        product: demoProduct,
        rating: demoRating,
        content: demoContent,
        timestamp: new Date().toISOString(),
        verifiedPurchase: demoVerified,
        aiScore: score,
        flagged: false,
        indicators: []
      }, score)
    };
    
    setDemoAnalysis(demoComment);
    setIsAnalyzing(false);
  };

  const handleAddToList = () => {
    if (demoAnalysis) {
      onAddComment(demoAnalysis);
      // Reset demo form
      setDemoAuthor('');
      setDemoProduct('');
      setDemoRating(5);
      setDemoContent('');
      setDemoVerified(false);
      setDemoAnalysis(null);
      setShowDemo(false);
    }
  };

  const handleResetDemo = () => {
    setDemoAuthor('');
    setDemoProduct('');
    setDemoRating(5);
    setDemoContent('');
    setDemoVerified(false);
    setDemoAnalysis(null);
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards for Comments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FraudScoreCard
          title="Total Comments"
          value={stats.total}
          icon={<MessageSquare className="w-5 h-5" />}
          trend={15}
          color="blue"
        />
        <FraudScoreCard
          title="Flagged Comments"
          value={stats.flagged}
          icon={<AlertTriangle className="w-5 h-5" />}
          trend={8}
          color="red"
        />
        <FraudScoreCard
          title="Suspicious Content"
          value={stats.aiGenerated}
          icon={<Star className="w-5 h-5" />}
          trend={12}
          color="purple"
        />
        <FraudScoreCard
          title="Verified Purchases"
          value={stats.verified}
          icon={<Check className="w-5 h-5" />}
          trend={-3}
          color="green"
        />
      </div>

      {/* Demo Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <Play className="w-5 h-5 mr-2 text-blue-600" />
              CryptacoreAI™ Live Demo - New Scoring System
            </CardTitle>
            <Button
              onClick={() => setShowDemo(!showDemo)}
              variant={showDemo ? 'default' : 'outline'}
              className="text-sm"
            >
              {showDemo ? 'Hide Demo' : 'Test AI Flagger'}
            </Button>
          </div>
        </CardHeader>
        
        {showDemo && (
          <CardContent className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>New Scoring System:</strong> Focuses on unverified bias, product name injection, extreme sentiment without evidence, and AI patterns.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author" className="text-sm font-medium text-gray-700">
                  Author Name
                </Label>
                <Input
                  id="author"
                  value={demoAuthor}
                  onChange={(e) => setDemoAuthor(e.target.value)}
                  placeholder="e.g., JohnDoe123 or PremiumBuyer"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="product" className="text-sm font-medium text-gray-700">
                  Product Name
                </Label>
                <Input
                  id="product"
                  value={demoProduct}
                  onChange={(e) => setDemoProduct(e.target.value)}
                  placeholder="e.g., SmartTech™ Pro Max"
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rating" className="text-sm font-medium text-gray-700">
                  Rating
                </Label>
                <div className="flex items-center space-x-2 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setDemoRating(star)}
                      className="text-2xl transition-colors"
                    >
                      <span className={star <= demoRating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({demoRating} stars)</span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  Purchase Status
                </Label>
                <div className="flex items-center space-x-3 mt-2">
                  <button
                    onClick={() => setDemoVerified(true)}
                    className={`flex items-center px-3 py-2 rounded-lg border-2 transition-all ${
                      demoVerified 
                        ? 'bg-green-50 border-green-300 text-green-700' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Verified Purchase
                  </button>
                  <button
                    onClick={() => setDemoVerified(false)}
                    className={`flex items-center px-3 py-2 rounded-lg border-2 transition-all ${
                      !demoVerified 
                        ? 'bg-orange-50 border-orange-300 text-orange-700' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Unverified Purchase
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {demoVerified 
                    ? 'Verified purchases have lower fraud risk' 
                    : 'Unverified purchases get higher scrutiny for extreme emotions'
                  }
                </p>
              </div>
            </div>
            
            <div>
              <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                Comment Content
              </Label>
              <Textarea
                id="content"
                value={demoContent}
                onChange={(e) => setDemoContent(e.target.value)}
                placeholder="Write a comment to test the new detection patterns..."
                className="mt-1 min-h-[100px]"
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-medium mb-2">💡 Test Scenarios:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div>
                  <strong>High Risk (90+):</strong> Unverified + Trademark + Extreme praise
                </div>
                <div>
                  <strong>Medium Risk (50-70):</strong> Unverified + Generic corporate phrases
                </div>
                <div>
                  <strong>Low Risk (0-30):</strong> Verified + Specific usage details
                </div>
                <div>
                  <strong>No Risk:</strong> Verified + Balanced feedback
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleAnalyzeDemo}
                disabled={isAnalyzing || !demoAuthor || !demoProduct || !demoContent}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Star className="w-4 h-4 mr-2" />
                    Analyze with CryptacoreAI
                  </>
                )}
              </Button>
              
              {demoAnalysis && (
                <>
                  <Button
                    onClick={handleAddToList}
                    variant="outline"
                    className="border-green-300 text-green-600 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to List
                  </Button>
                  <Button
                    onClick={handleResetDemo}
                    variant="ghost"
                  >
                    Reset
                  </Button>
                </>
              )}
            </div>
            
            {/* Demo Analysis Results */}
            {demoAnalysis && (
              <DemoAnalysis comment={demoAnalysis} />
            )}
          </CardContent>
        )}
      </Card>

      {/* Comment List */}
      <Card className="bg-white border-2 border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Customer Comments Analysis
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={filter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onFilterChange('all')}
                  className="text-xs"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'flagged' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onFilterChange('flagged')}
                  className="text-xs"
                >
                  Flagged
                </Button>
                <Button
                  variant={filter === 'verified' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onFilterChange('verified')}
                  className="text-xs"
                >
                  Verified
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const nextSort = sortBy === 'aiScore' ? 'date' : sortBy === 'date' ? 'rating' : 'aiScore';
                  setSortBy(nextSort);
                }}
                className="text-xs"
              >
                {sortBy === 'aiScore' ? 'Risk Score' : sortBy === 'date' ? 'Date' : 'Rating'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-pulse">Analyzing comments with CryptacoreAI...</div>
            </div>
          ) : comments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No comments found
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sortedComments.map((comment) => (
                <CommentRow
                  key={comment.id}
                  comment={comment}
                  onClick={() => setSelectedComment(comment)}
                  onAction={(action) => onCommentAction(action, comment)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comment Detail Modal */}
      {selectedComment && (
        <CommentDetailModal
          comment={selectedComment}
          onClose={() => setSelectedComment(null)}
          onAction={(action) => onCommentAction(action, selectedComment)}
        />
      )}
    </div>
  );
}