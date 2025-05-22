//this file makes sure that theme stays pristence with other pages

(function() {
    'use strict';
    
    // Function to apply theme
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('react-practice-theme', theme);
    }
    
    // Function to get current theme
    function getCurrentTheme() {
        // Check localStorage first
        const savedTheme = localStorage.getItem('react-practice-theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    }
    
    // Apply theme immediately (before DOM loads to prevent flash)
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme);
    
    // Listen for theme changes from other pages
    window.addEventListener('themeChange', function(e) {
        applyTheme(e.detail);
    });
    
    // Listen for storage changes (when theme is changed in another tab)
    window.addEventListener('storage', function(e) {
        if (e.key === 'react-practice-theme') {
            applyTheme(e.newValue || 'light');
        }
    });
    
    window.ReactPracticeTheme = {
        getCurrentTheme: getCurrentTheme,
        setTheme: applyTheme,
        toggleTheme: function() {
            const current = getCurrentTheme();
            const newTheme = current === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
            
            // Dispatch event for React components
            window.dispatchEvent(new CustomEvent('themeChange', { detail: newTheme }));
            
            return newTheme;
        }
    };
    
    // Initialize theme on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            applyTheme(getCurrentTheme());
        });
    }
})();