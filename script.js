// JavaScript for Linko Website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Create particle background
    createParticles();
    
    // Cookie banner functionality
    const cookieBanner = document.querySelector('.cookie-banner');
    const acceptButton = document.querySelector('.btn-accept');
    
    if (acceptButton && cookieBanner) {
        acceptButton.addEventListener('click', function() {
            cookieBanner.style.display = 'none';
            // Here you would typically set a cookie to remember the user's choice
            localStorage.setItem('cookiesAccepted', 'true');
        });
        
        // Check if user has already accepted cookies
        if (localStorage.getItem('cookiesAccepted') === 'true') {
            cookieBanner.style.display = 'none';
        }
    }
    
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Tab functionality for solutions section
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding content
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-content`).classList.add('active');
        });
    });
    
    // Form submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For now, we'll just show an alert
            alert(`شكراً ${name} على تواصلك معنا! سنقوم بالرد عليك قريباً.`);
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default if the href is not just "#"
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Scroll to the element
                    window.scrollTo({
                        top: targetElement.offsetTop - 100, // Offset for header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Video background fallback
    const video = document.getElementById('hero-video');
    if (video) {
        video.addEventListener('error', function() {
            // If video fails to load, show fallback image
            video.style.display = 'none';
            const fallbackImage = document.createElement('img');
            fallbackImage.src = 'network-bg.jpg';
            fallbackImage.alt = 'Network Background';
            fallbackImage.style.width = '100%';
            fallbackImage.style.height = '100%';
            fallbackImage.style.objectFit = 'cover';
            video.parentNode.appendChild(fallbackImage);
        });
    }
    
    // Animation on scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .stat-item, .solution-content, .about-content, .contact-content');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initial call and event listener for scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Add typing effect to hero heading
    const heroHeading = document.querySelector('.hero-content h1');
    if (heroHeading) {
        heroHeading.classList.add('typing-effect');
    }
    
    // Add floating effect to some elements
    const floatingElements = document.querySelectorAll('.service-icon, .stat-number');
    floatingElements.forEach(element => {
        element.classList.add('floating');
    });
    
    // Add glow effect to buttons
    const buttons = document.querySelectorAll('.cta-button, .contact-btn');
    buttons.forEach(button => {
        button.classList.add('glow-effect');
    });
});

// Create particle background
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size
        const size = Math.random() * 5 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        particle.style.animationDuration = `${duration}s`;
        
        // Random animation delay
        const delay = Math.random() * 10;
        particle.style.animationDelay = `${delay}s`;
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        particlesContainer.appendChild(particle);
    }
}

// Add dynamic tech background effect
window.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    document.documentElement.style.setProperty('--mouse-x', mouseX);
    document.documentElement.style.setProperty('--mouse-y', mouseY);
    
    // Move particles slightly based on mouse position
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
        const speed = 0.05;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        particle.style.transform = `translate(${x * 100}px, ${y * 100}px)`;
    });
});
