// Language Switcher for Linko Website

document.addEventListener('DOMContentLoaded', function() {
    // Set initial language based on localStorage or default to Hebrew
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'he';
    setLanguage(savedLanguage);
    
    // Add event listeners to language buttons (will be created by mobile_menu.js)
    document.addEventListener('languageSwitcherCreated', function() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(button => {
            button.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                setLanguage(lang);
                localStorage.setItem('selectedLanguage', lang);
            });
        });
    });
});

// Set the language
function setLanguage(lang) {
    // Set HTML lang and dir attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = 'rtl'; // Both Arabic and Hebrew are RTL
    
    // Update active state on buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(button => {
        if (button.getAttribute('data-lang') === lang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Add smooth transition effect for language change
    const contentElements = document.querySelectorAll('[data-lang-ar], [data-lang-he]');
    contentElements.forEach(element => {
        element.style.transition = 'opacity 0.3s ease-in-out';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 300);
    });
}

// Add animation for language change
function animateLanguageChange() {
    const pageContent = document.querySelector('body');
    pageContent.classList.add('language-transition');
    
    setTimeout(() => {
        pageContent.classList.remove('language-transition');
    }, 500);
}
