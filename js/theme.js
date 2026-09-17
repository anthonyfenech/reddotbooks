/**
 * Theme Manager - Dark Mode Support
 * Handles theme toggling with localStorage persistence
 * CRITICAL: Uses explicit backgrounds on all elements to prevent color leaking
 */

const THEME_KEY = 'reader_theme';
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

class ThemeManager {
    constructor() {
        this.currentTheme = this.getSavedTheme();
        this.themeToggle = null;
        this.init();
    }

    /**
     * Get saved theme from localStorage or default to light
     */
    getSavedTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === DARK_THEME || saved === LIGHT_THEME) {
            return saved;
        }
        // Default to light theme (no system preference check per user request)
        return LIGHT_THEME;
    }

    /**
     * Initialize theme on page load
     */
    init() {
        // Apply theme immediately to prevent flash
        this.applyTheme(this.currentTheme);

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupToggle());
        } else {
            this.setupToggle();
        }
    }

    /**
     * Apply theme to document
     */
    applyTheme(theme) {
        if (theme === DARK_THEME) {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        this.currentTheme = theme;
        localStorage.setItem(THEME_KEY, theme);

        // Update toggle button state if it exists
        if (this.themeToggle) {
            this.themeToggle.classList.toggle('active', theme === DARK_THEME);
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggle() {
        const newTheme = this.currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
        this.applyTheme(newTheme);
    }

    /**
     * Set up the theme toggle button
     */
    setupToggle() {
        this.themeToggle = document.getElementById('themeToggle');

        if (this.themeToggle) {
            // Set initial state
            this.themeToggle.classList.toggle('active', this.currentTheme === DARK_THEME);

            // Add click handler
            this.themeToggle.addEventListener('click', () => this.toggle());
        }
    }

    /**
     * Get current theme
     */
    getTheme() {
        return this.currentTheme;
    }

    /**
     * Check if dark mode is active
     */
    isDark() {
        return this.currentTheme === DARK_THEME;
    }
}

// Create and export singleton instance
const themeManager = new ThemeManager();

// Export for ES modules
export { themeManager, ThemeManager };

// Also expose on window for inline scripts
if (typeof window !== 'undefined') {
    window.themeManager = themeManager;
}
