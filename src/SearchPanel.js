import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import './SearchPanel.css';

const SearchPanel = ({ onClose }) => {
  const [query, setQuery] = useState('');

  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isRFPMode, setIsRFPMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchBoxHeight, setSearchBoxHeight] = useState(130); // Default height
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartY, setResizeStartY] = useState(0);
  const [resizeStartHeight, setResizeStartHeight] = useState(130);
  const textareaRef = useRef(null);

  // Mock data for audience segments
  const mockSegments = [
    // Device categories
    { id: 1, name: "tablet", description: "Users accessing content on tablet devices", type: "Device" },
    { id: 2, name: "desktop", description: "Users accessing content on desktop computers", type: "Device" },
    { id: 3, name: "phone", description: "Users accessing content on mobile phones", type: "Device" },
    { id: 4, name: "unknown", description: "Users with unidentified device types", type: "Device" },
    
    // Newsletter categories
    { id: 5, name: "DealBook", description: "Subscribers to the DealBook newsletter", type: "Newsletter" },
    
    // Subsection categories
    { id: 6, name: "design", description: "Content related to design topics", type: "Subsection" },
    { id: 7, name: "dealbook", description: "DealBook section content", type: "Subsection" },
    
    // First Party Audience - Decision Makers
    { id: 8, name: "Decision Makers (BDMs)", description: "Business decision makers across various industries", type: "1P Audience" },
    { id: 9, name: "Financial Decision Maker", description: "Individuals responsible for financial decisions", type: "1P Audience" },
    { id: 10, name: "Decision Makers (BDMs)_USA", description: "Business decision makers in the United States", type: "1P Audience" },
    { id: 11, name: "Decision Makers (BDMs)_APAC", description: "Business decision makers in Asia-Pacific region", type: "1P Audience" },
    { id: 12, name: "Financial Decision Maker_USA", description: "Financial decision makers in the United States", type: "1P Audience" },
    { id: 13, name: "Europe: Decision Makers (BDMs)", description: "Business decision makers in Europe", type: "1P Audience" },
    { id: 14, name: "Small Business Decision Makers", description: "Decision makers at small businesses", type: "1P Audience" },
    { id: 15, name: "Decision Makers (BDMs)_International", description: "International business decision makers", type: "1P Audience" },
    { id: 16, name: "Dealbook", description: "Dealbook audience segment", type: "1P Audience" },
    
    // Topic categories
    { id: 17, name: "Home Depot DIY", description: "Home improvement and DIY enthusiasts", type: "Topic" },
    { id: 18, name: "Technology Innovation", description: "Users interested in tech innovation", type: "Topic" },
    { id: 19, name: "Sustainable Living", description: "Environmentally conscious consumers", type: "Topic" },
    
    // Sales Category
    { id: 20, name: "Destinations", description: "Travel and destination content", type: "Sales Category Name" },
    
    // Audio categories
    { id: 21, name: "The Daily Podcast", description: "Daily news podcast listeners", type: "Audio" },
    { id: 22, name: "Business Audio Content", description: "Business-focused audio content consumers", type: "Audio" },
    
    // Cooking categories
    { id: 23, name: "Recipe Enthusiasts", description: "Users who engage with cooking and recipe content", type: "Cooking" },
    { id: 24, name: "Gourmet Cooking", description: "High-end cooking and fine dining interest", type: "Cooking" },
    
    // The Athletic categories
    { id: 25, name: "Sports Analytics", description: "Users interested in sports data and analytics", type: "The Athletic" },
    { id: 26, name: "Professional Sports Fans", description: "Followers of professional sports", type: "The Athletic" },
    
    // Games categories
    { id: 27, name: "Gaming Hardware Buyers", description: "Recent purchasers of gaming equipment", type: "Games" },
    { id: 28, name: "Mobile Game Players", description: "Active mobile gaming audience", type: "Games" },
    
    // Section categories
    { id: 29, name: "Business Section", description: "Business news and content readers", type: "Section" },
    { id: 30, name: "Technology Section", description: "Technology news and content readers", type: "Section" },
    
    // Keyword categories
    { id: 31, name: "artificial intelligence", description: "Content related to AI and machine learning", type: "Keyword" },
    { id: 32, name: "climate change", description: "Environmental and climate-related content", type: "Keyword" },
    
    // Motivation Targeting
    { id: 33, name: "Career Advancement", description: "Users motivated by professional growth", type: "Motivation Targeting" },
    { id: 34, name: "Financial Security", description: "Users motivated by financial stability", type: "Motivation Targeting" },
    
    // Perspective Targeting
    { id: 35, name: "Optimistic Outlook", description: "Users with positive perspective on future trends", type: "Perspective Targeting" },
    { id: 36, name: "Analytical Mindset", description: "Data-driven decision makers", type: "Perspective Targeting" },
    
    // Local time of day
    { id: 37, name: "Morning Readers", description: "Users most active in morning hours", type: "Local time of day" },
    { id: 38, name: "Evening Browsers", description: "Users most active in evening hours", type: "Local time of day" },
    
    // Region categories
    { id: 39, name: "Northeast Region", description: "Users located in northeastern United States", type: "Region" },
    { id: 40, name: "California Market", description: "Users located in California", type: "Region" },
    { id: 41, name: "European Market", description: "Users located in European markets", type: "Region" }
  ];

  // Helper function to highlight matching text
  const highlightMatch = (text, query) => {
    if (!query || query.length < 2) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? <strong key={index}>{part}</strong> : part
    );
  };

  // Helper function to generate valid CSS class names
  const getCategoryClass = (type) => {
    const typeMap = {
      '1P Audience': 'first-party-audience',
      'Device': 'device',
      'Audio': 'audio',
      'Cooking': 'cooking',
      'The Athletic': 'the-athletic',
      'Games': 'games',
      'Topic': 'topic',
      'Keyword': 'keyword',
      'Section': 'section',
      'Subsection': 'subsection',
      'Motivation Targeting': 'motivation-targeting',
      'Perspective Targeting': 'perspective-targeting',
      'Local time of day': 'local-time-of-day',
      'Region': 'region',
      'Newsletter': 'newsletter',
      'Sales Category Name': 'sales-category-name'
    };
    return typeMap[type] || type.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-');
  };

  // Helper function to get 1P Audience segments only
  const get1PAudienceSegments = () => {
    return mockSegments.filter(segment => segment.type === '1P Audience');
  };

  // Helper function to score relevance for RFP matching
  const scoreRelevance = (segment, searchQuery) => {
    const query = searchQuery.toLowerCase();
    const name = segment.name.toLowerCase();
    const description = segment.description.toLowerCase();
    
    let score = 0;
    
    // Exact name matches get highest score
    if (name.includes(query)) score += 100;
    
    // Keyword matches in name
    const queryWords = query.split(/\s+/);
    queryWords.forEach(word => {
      if (word.length > 2) { // Skip short words
        if (name.includes(word)) score += 50;
        if (description.includes(word)) score += 25;
      }
    });
    
    // Specific keyword bonuses for common RFP terms
    if (query.includes('business decision') && name.includes('decision')) score += 75;
    if (query.includes('bdm') && name.includes('bdm')) score += 75;
    if (query.includes('enterprise') && name.includes('business')) score += 50;
    if (query.includes('professional') && name.includes('decision')) score += 40;
    if (query.includes('financial') && name.includes('financial')) score += 75;
    
    return score;
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 130; // Match CSS max-height
      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
  }, [query]);

  // Auto-focus the search input when panel opens
  useEffect(() => {
    if (textareaRef.current) {
      // Small delay to ensure the panel animation has started
      const timer = setTimeout(() => {
        textareaRef.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const performSearch = async (searchQuery = query) => {
    if (searchQuery.length === 0) {
      setSearchResults([]);
      setShowSuggestions(false);
      setHasSearched(false);
      setIsRFPMode(false);
      return;
    }

    setHasSearched(true);
    setShowSuggestions(false);
    resetFeedback(); // Reset all feedback for new search

    // Check if this is RFP mode (100+ characters)
    const isRFP = searchQuery.length >= 100;
    setIsRFPMode(isRFP);

    if (isRFP) {
      // RFP Mode: Show loading sequence and filter to 1P Audience only
      setIsLoading(true);
      
      // Glow loading for 3 seconds to match animation
      setTimeout(() => {
        const audienceSegments = get1PAudienceSegments();
        const scoredResults = audienceSegments
          .map(segment => ({
            ...segment,
            relevanceScore: scoreRelevance(segment, searchQuery)
          }))
          .filter(segment => segment.relevanceScore > 0)
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, 8); // Cap at 8 results
        
        setSearchResults(scoredResults.map(s => ({ type: 'segment', ...s })));
        setIsLoading(false);
      }, 3000);
    } else {
      // Normal Mode: Regular search across all segments
      const semanticResults = mockSegments.filter(segment => 
        segment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        segment.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(semanticResults.map(s => ({ type: 'segment', ...s })));
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // If user starts typing after search, reset all modes
    if (hasSearched) {
      setHasSearched(false);
      setIsRFPMode(false);
      setIsLoading(false);
      setLoadingStage(0);
    }
    
    // Show suggestions for queries with 2+ characters (real-time) - but not if it's RFP length
    if (value.length >= 2 && value.length < 100) {
      setShowSuggestions(true);
      // Filter segments that match the query
      const filteredSuggestions = mockSegments.filter(segment => 
        segment.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filteredSuggestions.map(s => ({ 
        type: 'suggestion', 
        name: s.name, 
        category: s.type,
        query: value 
      })));
    } else if (value.length < 2 || value.length >= 100) {
      setSearchResults([]);
      setShowSuggestions(false);
      setHasSearched(false);
      setIsRFPMode(false);
      setIsLoading(false);
    }


  };

  const handlePaste = (e) => {
    // Handle RFP paste - typically longer content
    setTimeout(() => {
      if (textareaRef.current.value.length > 100) {
        setShowSuggestions(false);
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      performSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    performSearch(suggestion.name);
  };

  // Helper function to count words in query
  const getWordCount = (text) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Clear search input
  const handleClear = () => {
    setQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
    setHasSearched(false);
    setIsRFPMode(false);
    setIsLoading(false);
    resetFeedback(); // Reset all feedback when clearing
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Resize handlers
  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStartY(e.clientY);
    setResizeStartHeight(searchBoxHeight);
    
    const handleResizeMove = (e) => {
      const deltaY = e.clientY - resizeStartY; // 1:1 movement with mouse
      const newHeight = Math.max(80, Math.min(resizeStartHeight + deltaY, 400)); // Reasonable limits
      setSearchBoxHeight(newHeight);
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
    
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  // Track if resize handle should be shown
  const [showResizeHandle, setShowResizeHandle] = useState(false);
  // Track feedback state
  const [feedback, setFeedback] = useState(null); // 'thumbs-up', 'thumbs-down', or null
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const [detailedReasons, setDetailedReasons] = useState([]);
  const [detailedComments, setDetailedComments] = useState('');

  // Check if content overflows current height
  const hasOverflowingContent = () => {
    if (textareaRef.current && query.trim().length > 0) {
      return textareaRef.current.scrollHeight > textareaRef.current.clientHeight + 5; // 5px buffer
    }
    return false;
  };

  // Update resize handle visibility when content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowResizeHandle(hasOverflowingContent());
    }, 100); // Small delay to ensure textarea has updated
    
    return () => clearTimeout(timer);
  }, [query, searchBoxHeight]);

  // Handle initial feedback submission
  const handleFeedback = (type) => {
    setFeedback(type);
    console.log(`Initial feedback submitted: ${type} for semantic search`);
    // Show detailed feedback popup for more insights
    setShowDetailedFeedback(true);
  };

  // Handle detailed feedback reasons
  const toggleDetailedReason = (reason) => {
    setDetailedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  // Handle detailed feedback submission
  const handleDetailedFeedbackSubmit = () => {
    console.log(`Detailed feedback:`, {
      initialRating: feedback,
      reasons: detailedReasons,
      comments: detailedComments
    });
    // TODO: Send detailed feedback to analytics/backend
    setShowDetailedFeedback(false);
  };

  // Handle skipping detailed feedback
  const handleSkipDetailedFeedback = () => {
    console.log(`User skipped detailed feedback for: ${feedback}`);
    setShowDetailedFeedback(false);
  };

  // Reset all feedback state
  const resetFeedback = () => {
    setFeedback(null);
    setShowDetailedFeedback(false);
    setDetailedReasons([]);
    setDetailedComments('');
  };

  return (
        <motion.div
      className="search-panel"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{
        type: 'tween',
        duration: 0.3,
        ease: 'easeInOut'
      }}
    >
              <div className={`search-panel-content ${isLoading ? 'loading-outline' : ''}`}>
        {/* Header */}
        <div className="search-header">
          <h2>Search</h2>
          <button 
            className="close-button"
            onClick={onClose}
            aria-label="Close search"
          >
            ×
          </button>
        </div>

        {/* Search Input */}
        <div className="search-input-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <textarea
              ref={textareaRef}
              className="search-input"
              placeholder="Search keywords or paste RFP..."
              value={query}
              onChange={handleInputChange}
              onPaste={handlePaste}
              onKeyDown={handleKeyDown}
              rows={1}
              style={{ 
                height: `${searchBoxHeight}px`, 
                maxHeight: 'none',
                transition: isResizing ? 'none' : 'height 0.2s ease'
              }}
            />
            {query.trim().length >= 2 && (
              <button 
                className="clear-button"
                onClick={handleClear}
                aria-label="Clear search"
                title="Clear"
              >
                Clear
              </button>
            )}
            {query.length > 0 && (
              <button 
                className="search-button"
                onClick={() => performSearch()}
                aria-label="Search"
                title="Search (or press Enter)"
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="18" fill="#F7F7F7"/>
                  <path d="M16 17L11.9761 20.2191C11.4757 20.6195 11.4757 21.3805 11.9761 21.7809L16 25" stroke="#333333" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M22 12V19C22 20.1046 21.1046 21 20 21H13" stroke="#333333" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
            {/* Invisible resize area - only when content overflows */}
            {showResizeHandle && (
              <div 
                className="resize-handle"
                onMouseDown={handleResizeStart}
              />
            )}
          </div>
        </div>

        {/* Results */}
        <div className="search-results">
          {isLoading && (
            <div className="loading-section">
              {/* SPARKLES + SHIMMER TEXT ONLY */}
              <div className="glow-loading-container">
                <motion.div 
                  className="shimmer-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="sparkles-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M17 3.75a1 1 0 0 1 1 1c0 .257.13.577.402.848.271.271.59.402.848.402a1 1 0 1 1 0 2c-.257 0-.577.13-.848.402-.271.271-.402.59-.402.848a1 1 0 1 1-2 0c0-.257-.13-.577-.402-.848-.271-.271-.59-.402-.848-.402a1 1 0 1 1 0-2c.257 0 .577-.13.848-.402.271-.271.402-.59.402-.848a1 1 0 0 1 1-1Zm0 10a1 1 0 0 1 1 1c0 .257.13.577.402.848.271.271.59.402.848.402a1 1 0 1 1 0 2c-.257 0-.577.13-.848.402-.271.271-.402.59-.402.848a1 1 0 1 1-2 0c0-.257-.13-.577-.402-.848-.271-.271-.59-.402-.848-.402a1 1 0 1 1 0-2c.257 0 .577-.13.848-.402.271-.271.402-.59.402-.848a1 1 0 0 1 1-1Zm-8-7a1 1 0 0 1 1 1c0 .767.376 1.587 1.02 2.23.643.644 1.463 1.02 2.23 1.02a1 1 0 1 1 0 2c-.767 0-1.587.376-2.23 1.02-.644.643-1.02 1.463-1.02 2.23a1 1 0 1 1-2 0c0-.767-.376-1.587-1.02-2.23C6.337 13.376 5.517 13 4.75 13a1 1 0 1 1 0-2c.767 0 1.587-.376 2.23-1.02C7.624 9.337 8 8.517 8 7.75a1 1 0 0 1 1-1Zm0 3.934A5.859 5.859 0 0 1 7.684 12 5.86 5.86 0 0 1 9 13.316 5.867 5.867 0 0 1 10.316 12 5.871 5.871 0 0 1 9 10.684Z" 
                      fill="#0101E2"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="search-text">Searching for 1P Audiences</span>
                </motion.div>
              </div>

              {/* GLOW TEXT LOADING (commented out - positioning issues)
              <motion.div 
                className="glow-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glow-text">Matching 1P Audiences</div>
              </motion.div>
              */}

              {/* SPARKLE LOADING ANIMATION (commented out)
              <motion.div 
                className="sparkle-loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="loader-card">
                  <div className="loader-content">
                    <div className="sparkle-icon">
                      <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path clipRule="evenodd" d="M17 3.75a1 1 0 0 1 1 1c0 .257.13.577.402.848.271.271.59.402.848.402a1 1 0 1 1 0 2c-.257 0-.577.13-.848.402-.271.271-.402.59-.402.848a1 1 0 1 1-2 0c0-.257-.13-.577-.402-.848-.271-.271-.59-.402-.848-.402a1 1 0 1 1 0-2c.257 0 .577-.13.848-.402.271-.271.402-.59.402-.848a1 1 0 0 1 1-1Zm0 10a1 1 0 0 1 1 1c0 .257.13.577.402.848.271.271.59.402.848.402a1 1 0 1 1 0 2c-.257 0-.577.13-.848.402-.271.271-.402.59-.402.848a1 1 0 1 1-2 0c0-.257-.13-.577-.402-.848-.271-.271-.59-.402-.848-.402a1 1 0 1 1 0-2c.257 0 .577-.13.848-.402.271-.271.402-.59.402-.848a1 1 0 0 1 1-1Zm-8-7a1 1 0 0 1 1 1c0 .767.376 1.587 1.02 2.23.643.644 1.463 1.02 2.23 1.02a1 1 0 1 1 0 2c-.767 0-1.587.376-2.23 1.02-.644.643-1.02 1.463-1.02 2.23a1 1 0 1 1-2 0c0-.767-.376-1.587-1.02-2.23C6.337 13.376 5.517 13 4.75 13a1 1 0 1 1 0-2c.767 0 1.587-.376 2.23-1.02C7.624 9.337 8 8.517 8 7.75a1 1 0 0 1 1-1Zm0 3.934A5.859 5.859 0 0 1 7.684 12 5.86 5.86 0 0 1 9 13.316 5.867 5.867 0 0 1 10.316 12 5.871 5.871 0 0 1 9 10.684Z" fillRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="loader-title">Matching 1P Audiences</div>
                  </div>
                </div>
                <div className="loader-gradient"></div>
              </motion.div>
              */}
            </div>
          )}

          {!isLoading && showSuggestions && searchResults.length > 0 && (
            <div className="suggestions-section">
              <h3>Suggested Results</h3>
              <div className="suggestions-list">
                {searchResults.map((result, index) => (
                  <motion.button
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(result)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Search size={14} />
                    <span>
                      {highlightMatch(result.name, result.query)}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {!isLoading && !showSuggestions && searchResults.length > 0 && (
            <div className="results-section">
              <h3>Search Results ({searchResults.length})</h3>
              <div className="results-list">
                {searchResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    className="result-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="result-header">
                      <h4>{result.name}</h4>
                      <span className={`result-type ${getCategoryClass(result.type)}`}>
                        {result.type}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback for semantic search results */}
          {!isLoading && isRFPMode && searchResults.length > 0 && !showSuggestions && (
            <div className="feedback-section">
              <div className="feedback-container">
                <p className="feedback-question">How well do these audiences match your search?</p>
                <div className="feedback-buttons">
                  <button 
                    className={`feedback-btn ${feedback === 'thumbs-up' ? 'selected' : ''}`}
                    onClick={() => handleFeedback('thumbs-up')}
                    aria-label="Good"
                  >
                    <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#thumbs-up-clip)">
                        <path d="M9.5 21.5H18.5C19.33 21.5 20.04 21 20.34 20.28L23.36 13.23C23.45 13 23.5 12.76 23.5 12.5V10.5C23.5 9.4 22.6 8.5 21.5 8.5H15.19L16.14 3.93L16.17 3.61C16.17 3.2 16 2.82 15.73 2.55L14.67 1.5L8.08 8.09C7.72 8.45 7.5 8.95 7.5 9.5V19.5C7.5 20.6 8.4 21.5 9.5 21.5ZM9.5 9.5L13.84 5.16L12.5 10.5H21.5V12.5L18.5 19.5H9.5V9.5ZM1.5 9.5H5.5V21.5H1.5V9.5Z" fill="currentColor"/>
                      </g>
                      <defs>
                        <clipPath id="thumbs-up-clip">
                          <rect width="24" height="24" fill="white" transform="translate(0.5 0.5)"/>
                        </clipPath>
                      </defs>
                    </svg>
                    Good
                  </button>
                  <button 
                    className={`feedback-btn ${feedback === 'thumbs-down' ? 'selected' : ''}`}
                    onClick={() => handleFeedback('thumbs-down')}
                    aria-label="Poor"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g clipPath="url(#thumbs-down-clip)">
                        <path d="M15 3.5H6C5.17 3.5 4.46 4 4.16 4.72L1.14 11.77C1.05 12 1 12.24 1 12.5V14.5C1 15.6 1.9 16.5 3 16.5H9.31L8.36 21.07L8.33 21.39C8.33 21.8 8.5 22.18 8.77 22.45L9.83 23.5L16.42 16.91C16.78 16.55 17 16.05 17 15.5V5.5C17 4.4 16.1 3.5 15 3.5ZM15 15.5L10.66 19.84L12 14.5H3V12.5L6 5.5H15V15.5ZM19 3.5H23V15.5H19V3.5Z" fill="currentColor"/>
                      </g>
                      <defs>
                        <clipPath id="thumbs-down-clip">
                          <rect width="24" height="24" fill="white" transform="translate(0 0.5)"/>
                        </clipPath>
                      </defs>
                    </svg>
                    Poor
                  </button>
                </div>
                {feedback && !showDetailedFeedback && (
                  <p className="feedback-thanks">Thanks for your feedback!</p>
                )}
              </div>
            </div>
          )}

          {/* Detailed Feedback Modal */}
          {showDetailedFeedback && (
            <div className="feedback-modal-overlay">
              <div className="feedback-modal">
                <div className="feedback-modal-header">
                  <h3>Help us improve</h3>
                  <p>What specifically made this a {feedback === 'thumbs-up' ? 'good' : 'poor'} match?</p>
                </div>

                <div className="feedback-modal-content">
                  {feedback === 'thumbs-down' && (
                    <div className="feedback-reasons">
                      <h4>Common issues:</h4>
                      <div className="reason-options">
                        {[
                          'Audiences too broad',
                          'Missing key demographics',
                          'Wrong interests/behaviors',
                          'Irrelevant segments',
                          'Missing niche audiences'
                        ].map(reason => (
                          <button
                            key={reason}
                            className={`reason-btn ${detailedReasons.includes(reason) ? 'selected' : ''}`}
                            onClick={() => toggleDetailedReason(reason)}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {feedback === 'thumbs-up' && (
                    <div className="feedback-reasons">
                      <h4>What worked well:</h4>
                      <div className="reason-options">
                        {[
                          'Accurate targeting',
                          'Relevant demographics',
                          'Good audience variety',
                          'Helpful suggestions',
                          'Complete coverage'
                        ].map(reason => (
                          <button
                            key={reason}
                            className={`reason-btn ${detailedReasons.includes(reason) ? 'selected' : ''}`}
                            onClick={() => toggleDetailedReason(reason)}
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="feedback-comments">
                    <h4>Additional comments (optional):</h4>
                    <textarea
                      value={detailedComments}
                      onChange={(e) => setDetailedComments(e.target.value)}
                      placeholder="Tell us more about your experience..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="feedback-modal-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={handleSkipDetailedFeedback}
                  >
                    Skip
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={handleDetailedFeedbackSubmit}
                  >
                    Submit feedback
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isLoading && query.length > 0 && searchResults.length === 0 && hasSearched && (
            <div className="no-results">
              <p>No segments found. Try adjusting your search terms or paste an RFP for semantic matching.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchPanel;
