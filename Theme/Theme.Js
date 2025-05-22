const { useState, useEffect, useRef } = React;

// Theme hook for managing theme state and persistence
function useTheme() {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first, then system preference, default to light
        const savedTheme = localStorage.getItem('react-practice-theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        
        return 'light';
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        
        // Save to localStorage
        localStorage.setItem('react-practice-theme', theme);
        
        // Dispatch custom event for cross-page communication
        window.dispatchEvent(new CustomEvent('themeChange', { detail: theme }));
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
}

// Theme toggle button component
function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="theme-toggle">
            <span className="toggle-label">
                {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </span>
            <button
                className={`toggle-button ${theme === 'dark' ? 'active' : ''}`}
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                type="button"
            >
                <span className="toggle-slider">
                    {theme === 'light' ? '☀️' : '🌙'}
                </span>
            </button>
        </div>
    );
}


// Main theme application component
function ThemeApp() {
    const { theme } = useTheme();

    return (
        <div className="theme-container">
            <section className="theme-section">
                <h2>🎨 Theme Switcher</h2>
                <p>
                    Toggle between light and dark modes. Your preference will be saved 
                    and applied across all pages of the React Practice website.
                </p>
                
                <ThemeToggle />
              
            </section>
        </div>
    );
}

// Initialize theme on page load (for non-React pages)
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('react-practice-theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('react-practice-theme', 'dark');
    }
});

// Listen for theme changes from other pages
window.addEventListener('themeChange', (e) => {
    document.documentElement.setAttribute('data-theme', e.detail);
});

// Render the app
ReactDOM.render(<ThemeApp />, document.getElementById('theme-app'));