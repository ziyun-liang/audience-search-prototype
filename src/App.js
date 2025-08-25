import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import SearchPanel from './SearchPanel';
import './App.css';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  return (
    <div className="App">
      {/* Figma Design Background */}
      <div className="figma-background">
        {/* Kaleidoscope Header */}
        <div className="figma-header">
          <div className="logo-section">
            <span className="kaleidoscope-title">Kaleidoscope</span>
            <span className="powered-by">powered by Stela Platform</span>
          </div>
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          <div className="dropdown-section">
            <div className="dropdown-group">
              <label>Insight Type</label>
              <div className="dropdown">
                <span>Audience Insights</span>
                <ChevronDown size={16} />
              </div>
            </div>
            <div className="dropdown-group">
              <label>Search By</label>
              <div className="dropdown">
                <span>Audience</span>
                <ChevronDown size={16} />
              </div>
            </div>
            <div className="dropdown-group">
              <label>Select an Audience</label>
              <div className="dropdown">
                <span>Select...</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Central Content Area */}
        <div className="central-area">
          <div className="chart-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <rect x="8" y="32" width="8" height="24" fill="#D1D5DB" />
              <rect x="20" y="24" width="8" height="32" fill="#D1D5DB" />
              <rect x="32" y="16" width="8" height="40" fill="#D1D5DB" />
              <rect x="44" y="28" width="8" height="28" fill="#D1D5DB" />
              <path d="M52 20L56 16L60 20" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="central-message">Select a campaign to start creating your report.</p>
        </div>

        {/* Search Trigger Overlay */}
        <motion.div 
          className="search-trigger-overlay"
          onClick={openSearch}
        >
          <Search size={16} className="search-icon" />
          <span className="search-placeholder">Search keywords or paste RFP...</span>
        </motion.div>
      </div>

      {/* Search Panel Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="search-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeSearch}
            />
            
            {/* Search Panel */}
            <SearchPanel onClose={closeSearch} />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
