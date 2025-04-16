// Enhanced background animation that more closely matches the RDT website
document.addEventListener('DOMContentLoaded', function() {
    // Create canvas element for the digital grid background
    const canvas = document.createElement('canvas');
    canvas.id = 'digital-grid-bg';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-2';
    canvas.style.backgroundColor = '#000000';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    // Set canvas size
    const setCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Get canvas context
    const ctx = canvas.getContext('2d');

    // Digital grid parameters
    const gridSize = 30;
    const gridDotSize = 1;
    const gridLineOpacity = 0.1;
    const gridDotOpacity = 0.2;

    // Particle class for the orange/red dots
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5; // Smaller particles
            this.speedX = (Math.random() - 0.5) * 0.3; // Slower movement
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.color = this.getColor();
            this.opacity = Math.random() * 0.5 + 0.2;
            this.blinking = Math.random() > 0.7;
            this.blinkSpeed = Math.random() * 0.01 + 0.002; // Slower blinking
            this.blinkDirection = 1;
            this.hasTrail = Math.random() > 0.9; // Only some particles have trails
            this.trailLength = Math.floor(Math.random() * 5) + 3;
            this.trail = [];
        }

        getColor() {
            // More accurate colors from RDT site
            const colors = [
                [255, 80, 30],   // Bright orange
                [255, 60, 20],   // Orange-red
                [200, 50, 20]    // Darker red
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            // Save previous position for trail
            if (this.hasTrail) {
                this.trail.unshift({x: this.x, y: this.y});
                if (this.trail.length > this.trailLength) {
                    this.trail.pop();
                }
            }

            this.x += this.speedX;
            this.y += this.speedY;

            // Boundary check
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }

            // Blinking effect
            if (this.blinking) {
                this.opacity += this.blinkDirection * this.blinkSpeed;
                if (this.opacity > 0.7) {
                    this.opacity = 0.7;
                    this.blinkDirection = -1;
                } else if (this.opacity < 0.1) {
                    this.opacity = 0.1;
                    this.blinkDirection = 1;
                }
            }
        }

        draw() {
            // Draw trail
            if (this.hasTrail) {
                for (let i = 0; i < this.trail.length; i++) {
                    const trailOpacity = this.opacity * (1 - i / this.trail.length) * 0.5;
                    const trailSize = this.size * (1 - i / this.trail.length);
                    
                    ctx.beginPath();
                    ctx.arc(this.trail[i].x, this.trail[i].y, trailSize, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${trailOpacity})`;
                    ctx.fill();
                }
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
            ctx.fill();

            // Add glow effect for some particles
            if (Math.random() > 0.95) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity * 0.3})`;
                ctx.fill();
            }
        }
    }

    // Create particles
    const particles = [];
    const particleCount = Math.min(window.innerWidth / 4, 200); // More particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Create connections between particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 80) { // Shorter connection distance
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 80, 30, ${0.05 * (1 - distance / 80)})`; // More accurate color
                    ctx.lineWidth = 0.3; // Thinner lines
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Draw digital grid
    function drawGrid() {
        // Draw horizontal and vertical lines
        ctx.strokeStyle = `rgba(255, 80, 30, ${gridLineOpacity})`; // Orange-red color
        ctx.lineWidth = 0.2;
        
        // Vertical lines
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        
        // Draw grid dots at intersections
        ctx.fillStyle = `rgba(255, 80, 30, ${gridDotOpacity})`;
        for (let x = 0; x < canvas.width; x += gridSize) {
            for (let y = 0; y < canvas.height; y += gridSize) {
                ctx.beginPath();
                ctx.arc(x, y, gridDotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // Create floating elements
    function createFloatingElements() {
        // Create random floating elements that resemble digital data
        const floatingElements = [];
        const elementCount = 15;
        
        for (let i = 0; i < elementCount; i++) {
            // Skip creating the large orange rectangle element
            const size = Math.random() * 10 + 5; // Limit size to smaller elements
            
            floatingElements.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: size,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2,
                type: Math.floor(Math.random() * 3), // 0: square, 1: plus, 2: cross
                opacity: Math.random() * 0.2 + 0.1,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.01
            });
        }
        
        return floatingElements;
    }
    
    const floatingElements = createFloatingElements();
    
    // Draw floating elements
    function drawFloatingElements() {
        floatingElements.forEach(element => {
            // Update position
            element.x += element.speedX;
            element.y += element.speedY;
            element.rotation += element.rotationSpeed;
            
            // Boundary check
            if (element.x < -50) element.x = canvas.width + 50;
            if (element.x > canvas.width + 50) element.x = -50;
            if (element.y < -50) element.y = canvas.height + 50;
            if (element.y > canvas.height + 50) element.y = -50;
            
            // Skip drawing the central orange rectangle (the ".508" element)
            if (element.size > 40 && element.opacity > 0.5) {
                return;
            }
            
            // Draw element
            ctx.save();
            ctx.translate(element.x, element.y);
            ctx.rotate(element.rotation);
            
            ctx.strokeStyle = `rgba(255, 80, 30, ${element.opacity})`;
            ctx.lineWidth = 1;
            
            switch (element.type) {
                case 0: // Square
                    ctx.strokeRect(-element.size/2, -element.size/2, element.size, element.size);
                    break;
                case 1: // Plus
                    ctx.beginPath();
                    ctx.moveTo(0, -element.size/2);
                    ctx.lineTo(0, element.size/2);
                    ctx.moveTo(-element.size/2, 0);
                    ctx.lineTo(element.size/2, 0);
                    ctx.stroke();
                    break;
                case 2: // Cross
                    ctx.beginPath();
                    ctx.moveTo(-element.size/2, -element.size/2);
                    ctx.lineTo(element.size/2, element.size/2);
                    ctx.moveTo(element.size/2, -element.size/2);
                    ctx.lineTo(-element.size/2, element.size/2);
                    ctx.stroke();
                    break;
            }
            
            ctx.restore();
        });
    }

    // Create glowing text effect
    function createGlowingText() {
        const heroText = document.querySelector('.hero-content h1');
        if (heroText) {
            heroText.style.textShadow = '0 0 10px rgba(255, 80, 30, 0.5), 0 0 20px rgba(255, 80, 30, 0.3)';
            heroText.style.animation = 'textGlow 3s infinite alternate';
            
            // Add keyframes for glowing text
            if (!document.querySelector('#glow-keyframes')) {
                const style = document.createElement('style');
                style.id = 'glow-keyframes';
                style.textContent = `
                    @keyframes textGlow {
                        0% { text-shadow: 0 0 10px rgba(255, 80, 30, 0.5), 0 0 20px rgba(255, 80, 30, 0.3); }
                        100% { text-shadow: 0 0 15px rgba(255, 80, 30, 0.7), 0 0 30px rgba(255, 80, 30, 0.5); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

    // Function for central glow removed as requested by client

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw digital grid
        drawGrid();
        
        // Draw floating elements
        drawFloatingElements();
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        drawConnections();
        
        requestAnimationFrame(animate);
    }

    // Initialize
    createGlowingText();
    // createCentralGlow(); // Removed as requested by client
    animate();

    // Add mouse interaction
    let mouse = {
        x: null,
        y: null,
        radius: 100
    };

    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
        
        // Add subtle movement to particles near mouse
        particles.forEach(particle => {
            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                particle.speedX += dx * force * 0.005;
                particle.speedY += dy * force * 0.005;
                
                // Limit speed
                const maxSpeed = 1.5;
                const speed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
                if (speed > maxSpeed) {
                    particle.speedX = (particle.speedX / speed) * maxSpeed;
                    particle.speedY = (particle.speedY / speed) * maxSpeed;
                }
            }
        });
    });

    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('mousemove', function(event) {
            const x = event.clientX / window.innerWidth;
            const y = event.clientY / window.innerHeight;
            
            heroSection.style.backgroundPositionX = `${x * 20}px`;
            heroSection.style.backgroundPositionY = `${y * 20}px`;
        });
    }
});

// Language switcher functionality removed from here as it's now handled by language_switcher.js
