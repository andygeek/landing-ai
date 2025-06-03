import { Template, FrameworkType, ProjectFile } from '../types';

const createFile = (name: string, content: string, type: ProjectFile['type'], icon: string): ProjectFile => ({
  name,
  content,
  type,
  icon,
});

export const templates: Record<FrameworkType, Template> = {
  vanilla: {
    id: 'vanilla-landing',
    name: 'Vanilla JS Landing',
    description: 'Modern landing page with pure JavaScript',
    framework: 'vanilla',
    tags: ['beginner', 'landing-page', 'responsive'],
    files: {
      'index.html': createFile(
        'index.html',
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LandingAI - Vanilla JS</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-brand">LandingAI</div>
            <div class="nav-links">
                <a href="#features">Features</a>
                <a href="#about">About</a>
                <button class="btn-primary" onclick="showDemo()">Try Demo</button>
            </div>
        </div>
    </nav>

    <main>
        <section class="hero">
            <div class="container">
                <h1 class="hero-title">Build Amazing Landing Pages</h1>
                <p class="hero-subtitle">Create stunning, responsive landing pages with our intuitive builder</p>
                <div class="hero-actions">
                    <button class="btn-primary btn-lg" onclick="getStarted()">Get Started</button>
                    <button class="btn-secondary btn-lg" onclick="watchDemo()">Watch Demo</button>
                </div>
            </div>
        </section>

        <section id="features" class="features">
            <div class="container">
                <h2>Why Choose LandingAI?</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">🚀</div>
                        <h3>Fast Performance</h3>
                        <p>Lightning-fast loading times with optimized code</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🎨</div>
                        <h3>Beautiful Design</h3>
                        <p>Modern, responsive designs that convert</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">⚡</div>
                        <h3>Easy to Use</h3>
                        <p>Intuitive interface for all skill levels</p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <script src="script.js"></script>
</body>
</html>`,
        'html',
        '📄'
      ),
      'style.css': createFile(
        'style.css',
        `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e5e5e5;
    z-index: 1000;
    transition: background 0.3s ease, box-shadow 0.3s ease;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: #666;
    font-weight: 500;
    transition: color 0.2s;
}

.nav-links a:hover {
    color: #667eea;
}

/* Buttons */
.btn-primary, .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
}

.btn-secondary:hover {
    background: #667eea;
    color: white;
}

.btn-lg {
    padding: 1rem 2rem;
    font-size: 1.1rem;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8rem 0 6rem;
    text-align: center;
    margin-top: 70px; /* Height of navbar */
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Features Section */
.features {
    padding: 6rem 0;
    background: #f8fafc; /* Light gray background for contrast */
}

.features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #1a202c;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
    opacity: 0; /* For scroll animation */
    transform: translateY(30px); /* For scroll animation */
}

.feature-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #667eea; /* Primary color for icons */
}

.feature-card h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #1a202c;
}

.feature-card p {
    color: #666;
    line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.1rem;
    }
    
    .hero-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .nav-links {
        gap: 1rem;
    }

    .nav-container {
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
    }
    
    .features h2 {
        font-size: 2rem;
    }
}`,
        'css',
        '🎨'
      ),
      'script.js': createFile(
        'script.js',
        `// LandingAI - Vanilla JavaScript

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) { // Adjusted threshold
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Interactive functions
function showDemo() {
    alert('🎉 Demo feature coming soon! This would show a live preview of the landing page builder.');
    console.log('Demo button clicked');
}

function getStarted() {
    alert('🚀 Welcome to LandingAI! This would redirect to the signup page.');
    console.log('Get Started button clicked');
}

function watchDemo() {
    alert('📹 Demo video would play here. Stay tuned for amazing features!');
    console.log('Watch Demo button clicked');
}

// Feature cards animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Optional: Stop observing after animation
        }
    });
}, observerOptions);

// Apply animation to feature cards
document.addEventListener('DOMContentLoaded', () => {
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        // Initial styles are set in CSS, transition applied here for staggered effect
        card.style.transition = \`opacity 0.6s ease \${index * 0.15}s, transform 0.6s ease \${index * 0.15}s\`;
        observer.observe(card);
    });
    
    console.log('LandingAI Vanilla JS loaded successfully! 🎉');
});`,
        'js',
        '⚡'
      ),
    },
  },

  react: {
    id: 'react-landing',
    name: 'React Landing',
    description: 'Interactive landing page built with React hooks',
    framework: 'react',
    tags: ['react', 'hooks', 'interactive'],
    files: {
      'index.html': createFile(
        'index.html',
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LandingAI - React</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="root"></div>
    <script type="text/babel" src="script.js"></script>
</body>
</html>`,
        'html',
        '📄'
      ),
      'style.css': createFile(
        'style.css',
        `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

.app {
    min-height: 100vh;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e5e5e5;
    z-index: 1000;
    transition: all 0.3s ease;
}

.navbar.scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #61dafb 0%, #21568c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.nav-link {
    color: #666;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    cursor: pointer;
}

.nav-link:hover {
    color: #61dafb;
}

/* Buttons */
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: linear-gradient(135deg, #61dafb 0%, #21568c 100%);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(97, 218, 251, 0.3);
}

.btn-secondary {
    background: transparent;
    color: #61dafb;
    border: 2px solid #61dafb;
}

.btn-secondary:hover {
    background: #61dafb;
    color: white;
}

.btn-lg {
    padding: 1rem 2rem;
    font-size: 1.1rem;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, #61dafb 0%, #21568c 100%);
    color: white;
    padding: 8rem 0 6rem;
    text-align: center;
    margin-top: 70px; /* Navbar height */
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.8s ease forwards;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.8s ease 0.2s forwards;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    opacity: 0;
    transform: translateY(30px);
    animation: fadeInUp 0.8s ease 0.4s forwards;
}

/* Counter Section */
.counter-section {
    padding: 4rem 0;
    background: #f8fafc;
    text-align: center;
}

.counter-section h2 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #1a202c;
}

.counter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.counter-item {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s;
}

.counter-item:hover {
    transform: translateY(-4px);
}

.counter-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #61dafb; /* React color */
    margin-bottom: 0.5rem;
}

.counter-label {
    color: #666;
    font-weight: 500;
}

/* Features Section */
.features {
    padding: 6rem 0;
    background: white;
}

.features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #1a202c;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    background: #f8fafc;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.feature-card:hover {
    background: white;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
}

.feature-card.active {
    background: linear-gradient(135deg, #61dafb 0%, #21568c 100%);
    color: white;
}

.feature-card.active h3, .feature-card.active p {
    color: white;
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #1a202c;
}

.feature-card p {
    line-height: 1.6;
    opacity: 0.8;
    color: #666;
}

/* Animations */
@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    .hero-subtitle {
        font-size: 1.1rem;
    }
    .hero-actions {
        flex-direction: column;
        align-items: center;
    }
    .nav-container {
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
    }
    .nav-links {
        gap: 1rem;
    }
    .counter-section h2, .features h2 {
        font-size: 2rem;
    }
}`,
        'css',
        '🎨'
      ),
      'script.js': createFile(
        'script.js',
        `const { useState, useEffect, useRef } = React;

// Counter Hook
function useCounter(end, duration = 2000) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => observer.disconnect();
    }, []);


    useEffect(() => {
        if (!isVisible) return;
        
        let startTime;
        let animationFrame;

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            
            setCount(Math.floor(progress * end));
            
            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        
        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [end, duration, isVisible]);

    return [count, ref];
}

// Navbar Component
function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className={\`navbar \${isScrolled ? 'scrolled' : ''}\`}>
            <div className="nav-container">
                <div className="nav-brand">LandingAI</div>
                <div className="nav-links">
                    <span className="nav-link" onClick={() => scrollToSection('features')}>
                        Features
                    </span>
                    <span className="nav-link" onClick={() => scrollToSection('stats')}>
                        Stats
                    </span>
                    <button className="btn btn-primary" onClick={() => alert('🚀 Starting demo!')}>
                        Try Demo
                    </button>
                </div>
            </div>
        </nav>
    );
}

// Hero Component
function Hero() {
    const handleGetStarted = () => {
        alert('🎉 Welcome to LandingAI! Let\\'s build something amazing!');
    };

    const handleWatchDemo = () => {
        alert('📹 Demo video would play here. Get ready for amazing features!');
    };

    return (
        <section className="hero">
            <div className="container">
                <h1 className="hero-title">Build with React & AI</h1>
                <p className="hero-subtitle">
                    Create stunning, interactive landing pages with the power of React and artificial intelligence
                </p>
                <div className="hero-actions">
                    <button className="btn btn-primary btn-lg" onClick={handleGetStarted}>
                        Get Started
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={handleWatchDemo}>
                        Watch Demo
                    </button>
                </div>
            </div>
        </section>
    );
}

// Counter Item Component
function CounterItem({ end, label }) {
    const [count, ref] = useCounter(end, 2000);
    return (
        <div ref={ref} className="counter-item">
            <div className="counter-number">{count.toLocaleString()}+</div>
            <div className="counter-label">{label}</div>
        </div>
    );
}

// Stats Section Component
function StatsSection() {
    return (
        <section id="stats" className="counter-section">
            <div className="container">
                <h2>Trusted by Developers Worldwide</h2>
                <div className="counter-grid">
                    <CounterItem end={50000} label="Projects Created" />
                    <CounterItem end={15000} label="Happy Developers" />
                    <CounterItem end={99} label="Uptime Percentage" />
                </div>
            </div>
        </section>
    );
}

// Features Component
function Features() {
    const [activeFeature, setActiveFeature] = useState(0);
    const featureSectionRef = useRef(null);

    const featuresData = [
        {
            icon: '⚛️',
            title: 'React Powered',
            description: 'Built with the latest React features and hooks for maximum performance'
        },
        {
            icon: '🤖',
            title: 'AI Assisted',
            description: 'Intelligent suggestions and automated optimizations powered by AI'
        },
        {
            icon: '📱',
            title: 'Responsive Design',
            description: 'Automatically responsive layouts that work on all devices'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature(prev => (prev + 1) % featuresData.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [featuresData.length]);
    
    useEffect(() => {
        const currentRef = featureSectionRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        if (currentRef) {
            observer.observe(currentRef);
        }
        return () => {
            if (currentRef) {
                 observer.unobserve(currentRef);
            }
        };
    }, []);


    return (
        <section id="features" className="features" ref={featureSectionRef}>
            <div className="container">
                <h2>Powerful Features</h2>
                <div className="features-grid">
                    {featuresData.map((feature, index) => (
                        <div
                            key={index}
                            className={\`feature-card \${index === activeFeature ? 'active' : ''}\`}
                            onClick={() => setActiveFeature(index)}
                            style={{ transitionDelay: \`\${index * 0.1}s\` }}
                        >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// Main App Component
function App() {
    useEffect(() => {
        console.log('🎉 LandingAI React App loaded successfully!');
    }, []);

    return (
        <div className="app">
            <Navbar />
            <Hero />
            <StatsSection />
            <Features />
        </div>
    );
}

// Render the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
        'js',
        '⚡'
      ),
    },
  },

  vue: {
    id: 'vue-landing',
    name: 'Vue.js Landing',
    description: 'Reactive landing page with Vue.js composition API',
    framework: 'vue',
    tags: ['vue', 'composition-api', 'reactive'],
    files: {
      'index.html': createFile(
        'index.html',
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LandingAI - Vue.js</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="app">
        <navbar 
            :is-scrolled="isScrolled"
            @navigate="scrollToSection"
            @demo="showDemo"
        ></navbar>
        
        <hero-section 
            @get-started="handleGetStarted" 
            @watch-demo="handleWatchDemo"
        ></hero-section>
        
        <stats-section></stats-section>
        
        <features-section 
            :active-feature-index="activeFeatureIndex" 
            @feature-click="setActiveFeature"
        ></features-section>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`,
        'html',
        '📄'
      ),
      'style.css': createFile(
        'style.css',
        `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

#app {
    min-height: 100vh;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e5e5e5;
    z-index: 1000;
    transition: all 0.3s ease;
}

.navbar.scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.nav-link {
    color: #666;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    cursor: pointer;
}

.nav-link:hover {
    color: #42b883;
}

/* Buttons */
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(66, 184, 131, 0.3);
}

.btn-secondary {
    background: transparent;
    color: #42b883;
    border: 2px solid #42b883;
}

.btn-secondary:hover {
    background: #42b883;
    color: white;
}

.btn-lg {
    padding: 1rem 2rem;
    font-size: 1.1rem;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
    color: white;
    padding: 8rem 0 6rem;
    text-align: center;
    margin-top: 70px; /* Navbar height */
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Fade-in animation for hero elements */
.hero-title, .hero-subtitle, .hero-actions {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.8s ease forwards;
}
.hero-subtitle { animation-delay: 0.2s; }
.hero-actions { animation-delay: 0.4s; }

/* Counter Section */
.counter-section {
    padding: 4rem 0;
    background: #f8fafc;
    text-align: center;
}

.counter-section h2 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #1a202c;
}

.counter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.counter-item {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s;
}

.counter-item:hover {
    transform: translateY(-4px);
}

.counter-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #42b883; /* Vue color */
    margin-bottom: 0.5rem;
}

.counter-label {
    color: #666;
    font-weight: 500;
}

/* Features Section */
.features {
    padding: 6rem 0;
    background: white;
}

.features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #1a202c;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    background: #f8fafc;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.feature-card:hover {
    background: white;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
}

.feature-card.active {
    background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
    color: white;
}
.feature-card.active h3, .feature-card.active p {
    color: white;
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #1a202c;
}

.feature-card p {
    line-height: 1.6;
    opacity: 0.8;
    color: #666;
}

/* Animations */
@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Vue Transitions */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    .hero-subtitle {
        font-size: 1.1rem;
    }
    .hero-actions {
        flex-direction: column;
        align-items: center;
    }
    .nav-container {
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
    }
    .nav-links {
        gap: 1rem;
    }
    .counter-section h2, .features h2 {
        font-size: 2rem;
    }
}`,
        'css',
        '🎨'
      ),
      'script.js': createFile(
        'script.js',
        `const { createApp, ref, onMounted, onUnmounted, computed, defineComponent } = Vue;

// Composable for animated counter
function useCounter(targetValue, duration = 2000) {
    const count = ref(0);
    const elementRef = ref(null);
    let animationFrameId;

    const animateCount = (timestamp) => {
        let startTime = timestamp;
        const step = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            count.value = Math.floor(progress * targetValue);
            if (progress < 1) {
                animationFrameId = requestAnimationFrame(step);
            }
        };
        animationFrameId = requestAnimationFrame(step);
    };

    onMounted(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    animateCount(performance.now());
                    observer.unobserve(elementRef.value);
                }
            },
            { threshold: 0.5 }
        );
        if (elementRef.value) {
            observer.observe(elementRef.value);
        }
    });
    
    onUnmounted(() => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    });

    return { count, elementRef };
}

const app = createApp({
    setup() {
        const isScrolled = ref(false);
        const activeFeatureIndex = ref(0);
        
        const featuresData = [
            { icon: '🌲', title: 'Vue Powered', description: 'Built with Vue 3 Composition API for a reactive and modern experience.' },
            { icon: '💡', title: 'AI Suggestions', description: 'Smart code completion and design tips powered by AI.' },
            { icon: '📱', title: 'Fully Responsive', description: 'Ensures your landing page looks great on all devices, from mobile to desktop.' }
        ];

        const handleScroll = () => {
            isScrolled.value = window.scrollY > 50;
        };

        onMounted(() => {
            window.addEventListener('scroll', handleScroll);
            const interval = setInterval(() => {
                activeFeatureIndex.value = (activeFeatureIndex.value + 1) % featuresData.length;
            }, 3000);
            onUnmounted(() => {
                clearInterval(interval);
                window.removeEventListener('scroll', handleScroll);
            });
            console.log('🎉 LandingAI Vue App loaded successfully!');
        });

        const scrollToSection = (sectionId) => {
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        };

        const showDemo = () => alert('🚀 Vue Demo Coming Soon!');
        const handleGetStarted = () => alert('🎉 Welcome to Vue LandingAI!');
        const handleWatchDemo = () => alert('📹 Vue Demo Video Placeholder!');
        const setActiveFeature = (index) => activeFeatureIndex.value = index;

        return {
            isScrolled,
            activeFeatureIndex,
            featuresData,
            scrollToSection,
            showDemo,
            handleGetStarted,
            handleWatchDemo,
            setActiveFeature
        };
    }
});

// Components
app.component('navbar', {
    props: ['isScrolled'],
    emits: ['navigate', 'demo'],
    template: \`
        <nav :class="['navbar', { scrolled: isScrolled }]">
            <div class="nav-container">
                <div class="nav-brand">LandingAI</div>
                <div class="nav-links">
                    <span class="nav-link" @click="$emit('navigate', 'features')">Features</span>
                    <span class="nav-link" @click="$emit('navigate', 'stats')">Stats</span>
                    <button class="btn btn-primary" @click="$emit('demo')">Try Demo</button>
                </div>
            </div>
        </nav>
    \`
});

app.component('hero-section', {
    emits: ['getStarted', 'watchDemo'],
    template: \`
        <section class="hero">
            <div class="container">
                <h1 class="hero-title">Vue.js & AI Synergy</h1>
                <p class="hero-subtitle">Craft beautiful, reactive landing pages with Vue.js, enhanced by AI.</p>
                <div class="hero-actions">
                    <button class="btn btn-primary btn-lg" @click="$emit('getStarted')">Get Started</button>
                    <button class="btn btn-secondary btn-lg" @click="$emit('watchDemo')">Watch Demo</button>
                </div>
            </div>
        </section>
    \`
});

app.component('counter-item', {
    props: ['end', 'label'],
    setup(props) {
        const { count, elementRef } = useCounter(props.end);
        return { count, elementRef };
    },
    template: \`
        <div class="counter-item" ref="elementRef">
            <div class="counter-number">{{ count.toLocaleString() }}+</div>
            <div class="counter-label">{{ label }}</div>
        </div>
    \`
});

app.component('stats-section', {
    template: \`
        <section id="stats" class="counter-section">
            <div class="container">
                <h2>Trusted by Vue Developers</h2>
                <div class="counter-grid">
                    <counter-item :end="75000" label="Vue Projects"></counter-item>
                    <counter-item :end="20000" label="Happy Coders"></counter-item>
                    <counter-item :end="100" label="Satisfaction Rate"></counter-item>
                </div>
            </div>
        </section>
    \`
});

app.component('features-section', {
    props: ['activeFeatureIndex'],
    emits: ['featureClick'],
    setup(props, { root }) { // Access root context for featuresData
      return { featuresData: root.featuresData };
    },
    template: \`
        <section id="features" class="features">
            <div class="container">
                <h2>Vue-tiful Features</h2>
                <div class="features-grid">
                    <div
                        v-for="(feature, index) in featuresData"
                        :key="index"
                        :class="['feature-card', { active: index === activeFeatureIndex }]"
                        @click="$emit('featureClick', index)"
                    >
                        <div class="feature-icon">{{ feature.icon }}</div>
                        <h3>{{ feature.title }}</h3>
                        <p>{{ feature.description }}</p>
                    </div>
                </div>
            </div>
        </section>
    \`
});

app.mount('#app');`,
        'js',
        '⚡'
      ),
    },
  },
  
  svelte: {
    id: 'svelte-landing',
    name: 'Svelte Landing',
    description: 'Blazing fast landing page with Svelte',
    framework: 'svelte',
    tags: ['svelte', 'compiler', 'performant'],
    files: {
      'index.html': createFile(
        'index.html',
        `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LandingAI - Svelte</title>
    <link rel="stylesheet" href="style.css">
    <!-- Svelte compiles to JS, so no runtime CDN is typically used like React/Vue for this. -->
    <!-- The script.js will contain/import the compiled Svelte app. -->
</head>
<body>
    <div id="app"></div>
    <!-- type="module" is important for Svelte's typical output that uses ES modules -->
    <script type="module" src="main.js"></script>
</body>
</html>`,
        'html',
        '📄'
      ),
      'style.css': createFile(
        'style.css',
        `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #fff; /* Svelte apps often have a clean look */
}

#app {
    min-height: 100vh;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e0e0e0;
    z-index: 1000;
    transition: all 0.3s ease;
}

.navbar.scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: 700;
    /* Svelte Orange Gradient */
    background: linear-gradient(135deg, #ff3e00 0%, #ff7e00 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 2rem;
}

.nav-link {
    color: #555;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    cursor: pointer;
}

.nav-link:hover {
    color: #ff3e00; /* Svelte Orange */
}

/* Buttons */
.btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: linear-gradient(135deg, #ff3e00 0%, #ff7e00 100%);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 62, 0, 0.3);
}

.btn-secondary {
    background: transparent;
    color: #ff3e00;
    border: 2px solid #ff3e00;
}

.btn-secondary:hover {
    background: #ff3e00;
    color: white;
}

.btn-lg {
    padding: 1rem 2rem;
    font-size: 1.1rem;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, #ff3e00 0%, #ff7e00 100%);
    color: white;
    padding: 8rem 0 6rem;
    text-align: center;
    margin-top: 70px; /* Navbar height */
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    line-height: 1.2;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Counter Section */
.counter-section {
    padding: 4rem 0;
    background: #f7f7f7; /* Slightly different light gray */
    text-align: center;
}

.counter-section h2 {
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #222;
}

.counter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.counter-item {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
    transition: transform 0.2s;
}

.counter-item:hover {
    transform: translateY(-4px);
}

.counter-number {
    font-size: 2.5rem;
    font-weight: 700;
    color: #ff3e00; /* Svelte Orange */
    margin-bottom: 0.5rem;
}

.counter-label {
    color: #555;
    font-weight: 500;
}

/* Features Section */
.features {
    padding: 6rem 0;
    background: white;
}

.features h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
    color: #222;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.feature-card {
    background: #f7f7f7;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.07);
}

.feature-card:hover {
    background: white;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
}

.feature-card.active {
    background: linear-gradient(135deg, #ff3e00 0%, #ff7e00 100%);
    color: white;
}
.feature-card.active h3, .feature-card.active p {
    color: white;
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: #222;
}

.feature-card p {
    line-height: 1.6;
    opacity: 0.8;
    color: #555;
}

/* Responsive */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    .hero-subtitle {
        font-size: 1.1rem;
    }
    .hero-actions {
        flex-direction: column;
        align-items: center;
    }
    .nav-container {
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
    }
    .nav-links {
        gap: 1rem;
    }
    .counter-section h2, .features h2 {
        font-size: 2rem;
    }
}`,
        'css',
        '🎨'
      ),
      'App.svelte': createFile(
        'App.svelte',
        `<script>
    import { onMount, onDestroy } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    // Navbar state
    let isScrolled = false;
    
    const handleScroll = () => {
        isScrolled = window.scrollY > 50;
    };

    onMount(() => {
        window.addEventListener('scroll', handleScroll);
        const featureInterval = setInterval(() => {
            activeFeatureIndex = (activeFeatureIndex + 1) % featuresData.length;
        }, 3000);
        
        // Intersection observers for counters
        const counterElements = document.querySelectorAll('.counter-item-hook');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetStat = entry.target.dataset.stat;
                    if (targetStat === 'projects') projectsCount.set(100000, { duration: 2000, easing: cubicOut });
                    if (targetStat === 'developers') developersCount.set(25000, { duration: 2000, easing: cubicOut });
                    if (targetStat === 'performance') performanceScore.set(98, { duration: 2000, easing: cubicOut });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => observer.observe(el));
        
        console.log('🎉 LandingAI Svelte App loaded successfully!');
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(featureInterval);
            observer.disconnect();
        };
    });

    // Hero actions
    const handleGetStarted = () => alert('🚀 Get ready for Svelte speed!');
    const handleWatchDemo = () => alert('📹 Svelte Demo: See the magic!');
    const showDemo = () => alert('✨ Svelte Demo: Interactive Preview!');

    // Navigation
    const scrollToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    // Stats section counters
    const projectsCount = tweened(0);
    const developersCount = tweened(0);
    const performanceScore = tweened(0);

    // Features section
    let activeFeatureIndex = 0;
    const featuresData = [
        { icon: '⚡️', title: 'Blazing Fast', description: 'Svelte compiles your code to tiny, highly optimized JavaScript.' },
        { icon: '✍️', title: 'Write Less Code', description: 'Achieve more with less boilerplate thanks to Sveltes reactivity.' },
        { icon: '🎨', title: 'Truly Reactive', description: 'No virtual DOM, updates are surgical and efficient.' }
    ];
    const setActiveFeature = (index) => activeFeatureIndex = index;

</script>

<main>
    <!-- Navbar -->
    <nav class="navbar" class:scrolled={isScrolled}>
        <div class="nav-container">
            <div class="nav-brand">LandingAI</div>
            <div class="nav-links">
                <span class="nav-link" on:click={() => scrollToSection('features')}>Features</span>
                <span class="nav-link" on:click={() => scrollToSection('stats')}>Stats</span>
                <button class="btn btn-primary" on:click={showDemo}>Try Demo</button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1 class="hero-title">Svelte: Cybernetically Enhanced Web Apps</h1>
            <p class="hero-subtitle">Build dazzling, high-performance user interfaces with the Svelte compiler.</p>
            <div class="hero-actions">
                <button class="btn btn-primary btn-lg" on:click={handleGetStarted}>Get Started</button>
                <button class="btn btn-secondary btn-lg" on:click={handleWatchDemo}>Watch Demo</button>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section id="stats" class="counter-section">
        <div class="container">
            <h2>Impressive Svelte Stats</h2>
            <div class="counter-grid">
                <div class="counter-item counter-item-hook" data-stat="projects">
                    <div class="counter-number">{Math.floor($projectsCount).toLocaleString()}+</div>
                    <div class="counter-label">Svelte Apps Built</div>
                </div>
                <div class="counter-item counter-item-hook" data-stat="developers">
                    <div class="counter-number">{Math.floor($developersCount).toLocaleString()}+</div>
                    <div class="counter-label">Svelte Devs</div>
                </div>
                <div class="counter-item counter-item-hook" data-stat="performance">
                    <div class="counter-number">{Math.floor($performanceScore)}%</div>
                    <div class="counter-label">Performance Score</div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
        <div class="container">
            <h2>Why Svelte Shines</h2>
            <div class="features-grid">
                {#each featuresData as feature, index}
                    <div 
                        class="feature-card" 
                        class:active={index === activeFeatureIndex}
                        on:click={() => setActiveFeature(index)}
                        style="transition-delay: {index * 0.1}s;"
                    >
                        <div class="feature-icon">{feature.icon}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                {/each}
            </div>
        </div>
    </section>
</main>

<style>
    /* Styles for App.svelte can be here or in global style.css */
    /* For this example, global styles are in style.css */
    /* We can add component-specific transition styles here if needed */
    .feature-card {
        opacity: 0;
        transform: translateY(20px);
        animation: svelteFadeInUp 0.5s ease forwards;
    }

    @keyframes svelteFadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
`,
        'svelte',
        '🧡' // Svelte icon
      ),
      'main.js': createFile(
        'main.js',
        `import App from './App.svelte';

const app = new App({
    target: document.getElementById('app'),
    props: {
        // You can pass initial props here if needed
    }
});

export default app;
`,
        'js',
        '⚡'
      ),
    },
  },
};

export function getTemplateByFramework(framework: FrameworkType): Template {
  const template = templates[framework];
  if (!template) {
    console.warn("No template found for framework:", framework);
    return templates.vanilla;
  }
  return template;
}