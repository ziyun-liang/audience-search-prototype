import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './LoadingPlayground.css';

const LoadingPlayground = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [animationType, setAnimationType] = useState('steps'); // 'steps' or 'glow'

  const startAnimation = () => {
    setIsLoading(true);
    setLoadingStage(0);
    
    if (animationType === 'steps') {
      // Original 1,2,3 steps animation
      setTimeout(() => setLoadingStage(1), 500);
      setTimeout(() => setLoadingStage(2), 1500);
      setTimeout(() => {
        setLoadingStage(3);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }, 2500);
    } else {
      // New glow animation - runs for 4 seconds
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    }
  };

  const resetAnimation = () => {
    setIsLoading(false);
    setLoadingStage(0);
  };

  return (
    <div className="loading-playground">
      <div className="playground-header">
        <h1>Loading Animation Playground</h1>
        <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
          Experiment with loading animations without affecting the main app |{' '}
          <a href="/" style={{ color: '#0101E2', textDecoration: 'none' }}>
            ← Back to Main App
          </a>
        </p>
        <div className="controls">
          <div className="animation-selector">
            <label>Animation Type:</label>
            <select 
              value={animationType} 
              onChange={(e) => setAnimationType(e.target.value)}
              disabled={isLoading}
            >
              <option value="steps">1,2,3 Steps</option>
              <option value="glow">Blue Glow Border</option>
            </select>
          </div>
          <button onClick={startAnimation} disabled={isLoading}>
            Start Animation
          </button>
          <button onClick={resetAnimation}>
            Reset
          </button>
        </div>
      </div>

      <div className={`animation-container ${isLoading && animationType === 'glow' ? 'glow-border-active' : ''} ${isLoading ? 'loading-outline' : ''}`}>
        {isLoading && animationType === 'steps' && (
          <div className="loading-section">
            {/* Current 1,2,3 Steps Loading */}
            <motion.div 
              className="ai-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="loading-steps">
                <div className="loading-step">
                  <div className="step-number-container">
                    <div className={`step-number ${
                      loadingStage === 0 ? 'pending' : 
                      loadingStage === 1 ? 'active' : 
                      'completed'
                    }`}>
                      1
                    </div>
                    <div className={`step-progress-ring ${loadingStage === 1 ? 'active' : ''}`}></div>
                  </div>
                  <div className="step-content">
                    <div className={`step-text ${
                      loadingStage === 1 ? 'active' : 
                      loadingStage > 1 ? 'completed' : ''
                    }`}>
                      Analyze the input
                    </div>
                  </div>
                </div>

                <div className="loading-step">
                  <div className="step-number-container">
                    <div className={`step-number ${
                      loadingStage < 2 ? 'pending' : 
                      loadingStage === 2 ? 'active' : 
                      'completed'
                    }`}>
                      2
                    </div>
                    <div className={`step-progress-ring ${loadingStage === 2 ? 'active' : ''}`}></div>
                  </div>
                  <div className="step-content">
                    <div className={`step-text ${
                      loadingStage === 2 ? 'active' : 
                      loadingStage > 2 ? 'completed' : ''
                    }`}>
                      Match 1P Audience Segments
                    </div>
                  </div>
                </div>

                <div className="loading-step">
                  <div className="step-number-container">
                    <div className={`step-number ${
                      loadingStage < 3 ? 'pending' : 
                      loadingStage === 3 ? 'active' : 
                      'completed'
                    }`}>
                      3
                    </div>
                    <div className={`step-progress-ring ${loadingStage === 3 ? 'active' : ''}`}></div>
                  </div>
                  <div className="step-content">
                    <div className={`step-text ${
                      loadingStage === 3 ? 'active' : 
                      loadingStage > 3 ? 'completed' : ''
                    }`}>
                      Show results
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isLoading && animationType === 'glow' && (
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
        )}

        {!isLoading && (
          <div className="idle-state">
            <p>Click "Start Animation" to test the loading sequence</p>
          </div>
        )}
      </div>

      <div className="playground-info">
        <h3>Current State:</h3>
        <ul>
          <li>Animation Type: {animationType === 'steps' ? '1,2,3 Steps' : 'Blue Glow Border'}</li>
          <li>Loading: {isLoading ? 'true' : 'false'}</li>
          {animationType === 'steps' && <li>Stage: {loadingStage}</li>}
        </ul>
      </div>
    </div>
  );
};

export default LoadingPlayground;
