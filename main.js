// ========================================
// NEXUS PHONE - Three.js Experience
// Premium 3D showcase with smooth animations
// ========================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ========================================
// GLOBAL VARIABLES
// ========================================
let heroScene, heroCamera, heroRenderer, heroPhone, heroControls;
let displayScene, displayCamera, displayRenderer, displayPhone;
let ctaScene, ctaCamera, ctaRenderer, ctaPhone;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let scrollProgress = 0;
let isLoaded = false;

// Animation frame IDs
let heroAnimationId, displayAnimationId, ctaAnimationId;

// Clock for animations
const clock = new THREE.Clock();

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initHeroScene();
    initDisplayScene();
    initCtaScene();
    initScrollAnimations();
    initInteractiveDemo();
    initMouseTracking();
    
    // Load the 3D model
    loadPhoneModel();
});

// ========================================
// HERO SCENE SETUP
// ========================================
function initHeroScene() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;
    
    // Scene
    heroScene = new THREE.Scene();
    
    // Camera
    heroCamera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    heroCamera.position.set(0, 0, 5);
    
    // Renderer
    heroRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    heroRenderer.setSize(container.clientWidth, container.clientHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroRenderer.outputColorSpace = THREE.SRGBColorSpace;
    heroRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    heroRenderer.toneMappingExposure = 1.2;
    container.appendChild(heroRenderer.domElement);
    
    // Lighting
    setupHeroLighting();
    
    // Controls (limited)
    heroControls = new OrbitControls(heroCamera, heroRenderer.domElement);
    heroControls.enableZoom = false;
    heroControls.enablePan = false;
    heroControls.enableDamping = true;
    heroControls.dampingFactor = 0.05;
    heroControls.minPolarAngle = Math.PI / 3;
    heroControls.maxPolarAngle = Math.PI / 1.5;
    heroControls.autoRotate = true;
    heroControls.autoRotateSpeed = 0.5;
    
    // Handle resize
    window.addEventListener('resize', () => onResize(container, heroCamera, heroRenderer));
    
    // Start animation loop
    animateHero();
}

function setupHeroLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    heroScene.add(ambientLight);
    
    // Main key light (warm accent)
    const keyLight = new THREE.DirectionalLight(0xf5a623, 1.5);
    keyLight.position.set(5, 5, 5);
    keyLight.castShadow = true;
    heroScene.add(keyLight);
    
    // Fill light (cool)
    const fillLight = new THREE.DirectionalLight(0x00d4ff, 0.8);
    fillLight.position.set(-5, 3, 2);
    heroScene.add(fillLight);
    
    // Rim light
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(0, -3, -5);
    heroScene.add(rimLight);
    
    // Point lights for glow effect
    const glowLight1 = new THREE.PointLight(0xf5a623, 2, 10);
    glowLight1.position.set(2, 2, 3);
    heroScene.add(glowLight1);
    
    const glowLight2 = new THREE.PointLight(0x00d4ff, 1.5, 10);
    glowLight2.position.set(-2, -1, 3);
    heroScene.add(glowLight2);
}

// ========================================
// DISPLAY SCENE SETUP
// ========================================
function initDisplayScene() {
    const container = document.getElementById('display-phone');
    if (!container) return;
    
    displayScene = new THREE.Scene();
    
    displayCamera = new THREE.PerspectiveCamera(
        50,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    displayCamera.position.set(0, 0, 4);
    
    displayRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    displayRenderer.setSize(container.clientWidth, container.clientHeight);
    displayRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    displayRenderer.outputColorSpace = THREE.SRGBColorSpace;
    displayRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(displayRenderer.domElement);
    
    // Lighting
    setupDisplayLighting();
    
    window.addEventListener('resize', () => onResize(container, displayCamera, displayRenderer));
    
    animateDisplay();
}

function setupDisplayLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    displayScene.add(ambientLight);
    
    const frontLight = new THREE.DirectionalLight(0x00d4ff, 1.2);
    frontLight.position.set(0, 0, 5);
    displayScene.add(frontLight);
    
    const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topLight.position.set(0, 5, 2);
    displayScene.add(topLight);
    
    const sideLight = new THREE.DirectionalLight(0xf5a623, 0.6);
    sideLight.position.set(5, 0, 0);
    displayScene.add(sideLight);
}

// ========================================
// CTA SCENE SETUP
// ========================================
function initCtaScene() {
    const container = document.getElementById('cta-canvas');
    if (!container) return;
    
    ctaScene = new THREE.Scene();
    
    ctaCamera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    ctaCamera.position.set(2, 1, 4);
    
    ctaRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    ctaRenderer.setSize(container.clientWidth, container.clientHeight);
    ctaRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    ctaRenderer.outputColorSpace = THREE.SRGBColorSpace;
    ctaRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(ctaRenderer.domElement);
    
    // Lighting
    setupCtaLighting();
    
    window.addEventListener('resize', () => onResize(container, ctaCamera, ctaRenderer));
    
    animateCta();
}

function setupCtaLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    ctaScene.add(ambientLight);
    
    const keyLight = new THREE.DirectionalLight(0xf5a623, 1.5);
    keyLight.position.set(3, 3, 5);
    ctaScene.add(keyLight);
    
    const fillLight = new THREE.DirectionalLight(0x00d4ff, 1);
    fillLight.position.set(-3, 2, 3);
    ctaScene.add(fillLight);
    
    const backLight = new THREE.PointLight(0xf5a623, 2, 10);
    backLight.position.set(0, 0, -3);
    ctaScene.add(backLight);
}

// ========================================
// LOAD 3D MODEL
// ========================================
function loadPhoneModel() {
    const loader = new GLTFLoader();
    
    // Try to load the model
    loader.load(
        'phone.glb', // The model file
        (gltf) => {
            const model = gltf.scene;
            
            // Adjust model scale and position
            model.scale.set(2, 2, 2);
            model.position.set(0, 0, 0);
            
            // Enhanced materials for premium look
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Check if it's the screen material
                    if (child.material && child.material.name && 
                        child.material.name.toLowerCase().includes('screen')) {
                        // Make screen emissive
                        child.material.emissive = new THREE.Color(0x1a1a2e);
                        child.material.emissiveIntensity = 0.3;
                    }
                    
                    // Enhance metallic materials
                    if (child.material) {
                        child.material.envMapIntensity = 1.5;
                        child.material.needsUpdate = true;
                    }
                }
            });
            
            // Clone for each scene
            heroPhone = model.clone();
            heroPhone.rotation.y = Math.PI / 6;
            heroScene.add(heroPhone);
            
            displayPhone = model.clone();
            displayPhone.rotation.y = 0;
            displayScene.add(displayPhone);
            
            ctaPhone = model.clone();
            ctaPhone.rotation.y = -Math.PI / 4;
            ctaScene.add(ctaPhone);
            
            // Model loaded successfully
            isLoaded = true;
            hideLoader();
            
            console.log('Phone model loaded successfully!');
        },
        (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            console.log(`Loading: ${percent.toFixed(0)}%`);
        },
        (error) => {
            console.warn('Could not load phone.glb, using fallback geometry');
            createFallbackPhone();
            isLoaded = true;
            hideLoader();
        }
    );
}

// ========================================
// FALLBACK PHONE GEOMETRY
// ========================================
function createFallbackPhone() {
    // Create a stylized phone using primitive geometry
    const phoneGroup = new THREE.Group();
    
    // Phone body
    const bodyGeometry = new THREE.BoxGeometry(1.2, 2.4, 0.12);
    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.9,
        roughness: 0.2,
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    
    // Rounded corners using edge beveling simulation
    const frameGeometry = new THREE.BoxGeometry(1.24, 2.44, 0.14);
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.95,
        roughness: 0.1,
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.z = -0.01;
    
    // Screen
    const screenGeometry = new THREE.PlaneGeometry(1.1, 2.2);
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x0f0f1a,
        emissive: 0x1a1a2e,
        emissiveIntensity: 0.5,
        metalness: 0.1,
        roughness: 0.3,
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    screen.position.z = 0.061;
    
    // Screen content (gradient effect)
    const gradientCanvas = document.createElement('canvas');
    gradientCanvas.width = 512;
    gradientCanvas.height = 1024;
    const ctx = gradientCanvas.getContext('2d');
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f0f1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 1024);
    
    // Add time display
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '120px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('12:45', 256, 300);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '32px sans-serif';
    ctx.fillText('Thursday, January 22', 256, 360);
    
    const screenTexture = new THREE.CanvasTexture(gradientCanvas);
    screenMaterial.map = screenTexture;
    screenMaterial.emissiveMap = screenTexture;
    screenMaterial.needsUpdate = true;
    
    // Notch
    const notchGeometry = new THREE.BoxGeometry(0.4, 0.08, 0.02);
    const notchMaterial = new THREE.MeshStandardMaterial({
        color: 0x000000,
        metalness: 0.5,
        roughness: 0.5,
    });
    const notch = new THREE.Mesh(notchGeometry, notchMaterial);
    notch.position.set(0, 1.05, 0.07);
    
    // Camera bump
    const cameraBumpGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.04, 32);
    const cameraBumpMaterial = new THREE.MeshStandardMaterial({
        color: 0x2a2a2a,
        metalness: 0.9,
        roughness: 0.2,
    });
    const cameraBump = new THREE.Mesh(cameraBumpGeometry, cameraBumpMaterial);
    cameraBump.rotation.x = Math.PI / 2;
    cameraBump.position.set(-0.35, 0.85, -0.08);
    
    // Camera lens
    const lensGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 32);
    const lensMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.95,
        roughness: 0.1,
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(-0.35, 0.85, -0.095);
    
    // Assemble phone
    phoneGroup.add(frame);
    phoneGroup.add(body);
    phoneGroup.add(screen);
    phoneGroup.add(notch);
    phoneGroup.add(cameraBump);
    phoneGroup.add(lens);
    
    // Clone for each scene
    heroPhone = phoneGroup.clone();
    heroPhone.rotation.y = Math.PI / 6;
    heroScene.add(heroPhone);
    
    displayPhone = phoneGroup.clone();
    displayPhone.rotation.y = 0;
    displayScene.add(displayPhone);
    
    ctaPhone = phoneGroup.clone();
    ctaPhone.rotation.y = -Math.PI / 4;
    ctaScene.add(ctaPhone);
}

// ========================================
// ANIMATION LOOPS
// ========================================
function animateHero() {
    heroAnimationId = requestAnimationFrame(animateHero);
    
    const elapsedTime = clock.getElapsedTime();
    
    if (heroPhone) {
        // Smooth floating animation
        heroPhone.position.y = Math.sin(elapsedTime * 0.5) * 0.1;
        
        // Mouse-influenced rotation
        heroPhone.rotation.x += (targetRotationY * 0.3 - heroPhone.rotation.x) * 0.05;
        heroPhone.rotation.y += (targetRotationX * 0.3 + Math.PI / 6 - heroPhone.rotation.y) * 0.05;
    }
    
    if (heroControls) {
        heroControls.update();
    }
    
    heroRenderer.render(heroScene, heroCamera);
}

function animateDisplay() {
    displayAnimationId = requestAnimationFrame(animateDisplay);
    
    const elapsedTime = clock.getElapsedTime();
    
    if (displayPhone) {
        // Gentle oscillation
        displayPhone.rotation.y = Math.sin(elapsedTime * 0.3) * 0.2;
        displayPhone.position.y = Math.sin(elapsedTime * 0.4) * 0.05;
    }
    
    displayRenderer.render(displayScene, displayCamera);
}

function animateCta() {
    ctaAnimationId = requestAnimationFrame(animateCta);
    
    const elapsedTime = clock.getElapsedTime();
    
    if (ctaPhone) {
        // Continuous slow rotation
        ctaPhone.rotation.y = elapsedTime * 0.2;
        ctaPhone.position.y = Math.sin(elapsedTime * 0.5) * 0.08;
    }
    
    ctaRenderer.render(ctaScene, ctaCamera);
}

// ========================================
// RESIZE HANDLER
// ========================================
function onResize(container, camera, renderer) {
    if (!container || !camera || !renderer) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// ========================================
// MOUSE TRACKING
// ========================================
function initMouseTracking() {
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        
        targetRotationX = mouseX * Math.PI * 0.2;
        targetRotationY = mouseY * Math.PI * 0.1;
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    // Intersection Observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach((card) => {
        observer.observe(card);
    });
    
    // Observe spec categories
    document.querySelectorAll('.spec-category').forEach((category) => {
        observer.observe(category);
    });
    
    // Scroll progress for parallax effects
    window.addEventListener('scroll', () => {
        scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        // Update display phone rotation based on scroll
        if (displayPhone) {
            const displaySection = document.getElementById('display');
            if (displaySection) {
                const rect = displaySection.getBoundingClientRect();
                const sectionProgress = 1 - (rect.top / window.innerHeight);
                
                if (sectionProgress > 0 && sectionProgress < 2) {
                    displayPhone.rotation.x = (sectionProgress - 0.5) * 0.3;
                }
            }
        }
    });
    
    // Smooth reveal for sections
    const sections = document.querySelectorAll('.features-header, .display-content, .demo-header, .specs-header, .cta-content');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach((section) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(40px)';
        section.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        sectionObserver.observe(section);
    });
}

// ========================================
// INTERACTIVE DEMO
// ========================================
function initInteractiveDemo() {
    const phoneScreen = document.querySelector('.phone-screen');
    const controlBtns = document.querySelectorAll('.control-btn');
    const appIcons = document.querySelectorAll('.app-icon');
    const dockIcons = document.querySelectorAll('.dock-icon');
    
    // Theme toggle
    controlBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            controlBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            
            const theme = btn.dataset.theme;
            if (theme === 'light') {
                phoneScreen.classList.add('light-theme');
            } else {
                phoneScreen.classList.remove('light-theme');
            }
        });
    });
    
    // App icon interactions
    appIcons.forEach((icon) => {
        icon.addEventListener('click', () => {
            const iconInner = icon.querySelector('.app-icon-inner');
            
            // Ripple effect
            iconInner.style.transform = 'scale(0.9)';
            setTimeout(() => {
                iconInner.style.transform = 'scale(1)';
            }, 150);
            
            // Show app launch animation
            showAppLaunch(icon.dataset.app);
        });
    });
    
    // Dock icon interactions
    dockIcons.forEach((icon) => {
        icon.addEventListener('click', () => {
            icon.style.transform = 'scale(0.9)';
            setTimeout(() => {
                icon.style.transform = '';
            }, 150);
        });
    });
}

function showAppLaunch(appName) {
    const phoneScreen = document.querySelector('.phone-screen');
    
    // Create app launch overlay
    const overlay = document.createElement('div');
    overlay.className = 'app-launch-overlay';
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${getAppColor(appName)};
        border-radius: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-weight: 600;
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 100;
    `;
    overlay.textContent = appName.charAt(0).toUpperCase() + appName.slice(1);
    
    phoneScreen.appendChild(overlay);
    
    // Animate in
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        overlay.style.transform = 'scale(1)';
    });
    
    // Animate out after delay
    setTimeout(() => {
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(1.1)';
        setTimeout(() => overlay.remove(), 300);
    }, 1000);
}

function getAppColor(appName) {
    const colors = {
        weather: 'linear-gradient(135deg, #48b2fe 0%, #0779e4 100%)',
        camera: 'linear-gradient(135deg, #666 0%, #333 100%)',
        music: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)',
        settings: 'linear-gradient(135deg, #8e8e93 0%, #636366 100%)'
    };
    return colors[appName] || colors.settings;
}

// ========================================
// LOADER
// ========================================
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// ========================================
// GSAP-LIKE SMOOTH SCROLLING (Vanilla)
// ========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
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

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================
let isTabActive = true;

document.addEventListener('visibilitychange', () => {
    isTabActive = !document.hidden;
    
    if (!isTabActive) {
        // Pause animations when tab is not visible
        if (heroAnimationId) cancelAnimationFrame(heroAnimationId);
        if (displayAnimationId) cancelAnimationFrame(displayAnimationId);
        if (ctaAnimationId) cancelAnimationFrame(ctaAnimationId);
    } else {
        // Resume animations
        animateHero();
        animateDisplay();
        animateCta();
    }
});

// ========================================
// EXPORT FOR DEBUGGING
// ========================================
window.NexusDebug = {
    heroScene,
    heroCamera,
    heroPhone,
    displayPhone,
    ctaPhone
};

console.log('%c NEXUS PHONE ', 'background: linear-gradient(135deg, #f5a623, #00d4ff); color: #000; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
console.log('%c 3D Experience Initialized ', 'color: #f5a623; font-size: 12px;');

