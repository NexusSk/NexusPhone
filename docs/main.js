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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    displayScene.add(ambientLight);
    
    // Warm front light instead of blue
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.0);
    frontLight.position.set(0, 0, 5);
    displayScene.add(frontLight);
    
    const topLight = new THREE.DirectionalLight(0xffffff, 0.7);
    topLight.position.set(0, 5, 2);
    displayScene.add(topLight);
    
    // Subtle warm accent from the side
    const sideLight = new THREE.DirectionalLight(0xf5a623, 0.3);
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
        35,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    ctaCamera.position.set(0, 0, 6);
    
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    ctaScene.add(ambientLight);
    
    // Strong front light to illuminate the screen
    const frontLight = new THREE.DirectionalLight(0xffffff, 1.2);
    frontLight.position.set(0, 0, 5);
    ctaScene.add(frontLight);
    
    // Subtle warm accent from the side
    const sideLight = new THREE.DirectionalLight(0xf5a623, 0.4);
    sideLight.position.set(3, 2, 2);
    ctaScene.add(sideLight);
    
    // Top light
    const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
    topLight.position.set(0, 5, 2);
    ctaScene.add(topLight);
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
            displayPhone.rotation.x = 0;
            displayPhone.rotation.y = Math.PI / 2; // Rotate to face camera with screen visible
            displayPhone.rotation.z = 0;
            displayScene.add(displayPhone);
            
            ctaPhone = model.clone();
            ctaPhone.rotation.x = 0;
            ctaPhone.rotation.y = Math.PI / 2; // Face forward showing screen
            ctaPhone.rotation.z = 0;
            ctaPhone.position.set(0, 0, 0);
            ctaPhone.scale.set(2.0, 2.0, 2.0);
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
    displayPhone.rotation.y = Math.PI / 2; // Rotate to face camera with screen visible
    displayScene.add(displayPhone);
    
    ctaPhone = phoneGroup.clone();
    ctaPhone.rotation.y = 0; // Fallback phone faces forward by default
    ctaPhone.position.set(0, 0, 0);
    ctaPhone.scale.set(1.1, 1.1, 1.1);
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
        
        // Mouse-influenced rotation with smoother lerp
        heroPhone.rotation.x = lerp(heroPhone.rotation.x, targetRotationY * 0.3, 0.08);
        heroPhone.rotation.y = lerp(heroPhone.rotation.y, targetRotationX * 0.3 + Math.PI / 6, 0.08);
    }
    
    if (heroControls) {
        heroControls.update();
    }
    
    heroRenderer.render(heroScene, heroCamera);
}

// Store target values for smooth lerping
let displayTargetRotY = Math.PI / 2;
let displayTargetRotX = 0;
let displayTargetPosY = 0;

function animateDisplay() {
    displayAnimationId = requestAnimationFrame(animateDisplay);
    
    const elapsedTime = clock.getElapsedTime();
    
    if (displayPhone) {
        // Calculate target values
        displayTargetRotY = Math.PI / 2 + Math.sin(elapsedTime * 0.2) * 0.03;
        displayTargetRotX = Math.sin(elapsedTime * 0.3) * 0.02;
        displayTargetPosY = Math.sin(elapsedTime * 0.4) * 0.05;
        
        // Smooth lerp to targets
        displayPhone.rotation.y = lerp(displayPhone.rotation.y, displayTargetRotY, 0.1);
        displayPhone.rotation.x = lerp(displayPhone.rotation.x, displayTargetRotX, 0.1);
        displayPhone.position.y = lerp(displayPhone.position.y, displayTargetPosY, 0.1);
        
        // Subtle scale pulse for "breathing" effect
        const targetScale = 2 + Math.sin(elapsedTime * 0.5) * 0.02;
        const currentScale = displayPhone.scale.x;
        const newScale = lerp(currentScale, targetScale, 0.1);
        displayPhone.scale.set(newScale, newScale, newScale);
    }
    
    displayRenderer.render(displayScene, displayCamera);
}

// Store target values for CTA phone
let ctaTargetRotY = Math.PI / 2;
let ctaTargetRotX = 0;
let ctaTargetPosY = 0;

function animateCta() {
    ctaAnimationId = requestAnimationFrame(animateCta);
    
    const elapsedTime = clock.getElapsedTime();
    
    if (ctaPhone) {
        // Calculate target values
        ctaTargetRotY = Math.PI / 2 + Math.sin(elapsedTime * 0.3) * 0.03;
        ctaTargetRotX = Math.sin(elapsedTime * 0.4) * 0.015;
        ctaTargetPosY = Math.sin(elapsedTime * 0.5) * 0.03;
        
        // Smooth lerp to targets
        ctaPhone.rotation.y = lerp(ctaPhone.rotation.y, ctaTargetRotY, 0.08);
        ctaPhone.rotation.x = lerp(ctaPhone.rotation.x, ctaTargetRotX, 0.08);
        ctaPhone.position.y = lerp(ctaPhone.position.y, ctaTargetPosY, 0.08);
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
    const sections = document.querySelectorAll('.features-header, .display-content, .specs-header, .cta-content, .story-content');
    
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
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        sectionObserver.observe(section);
    });
}

// ========================================
// PRE-ORDER UI
// ========================================
function initInteractiveDemo() {
    initPreorderUI();
}

function initPreorderUI() {
    const storageOptions = document.querySelectorAll('input[name="storage"]');
    const priceDisplay = document.getElementById('total-price');
    
    const prices = {
        '256': 1199,
        '512': 1399,
        '1024': 1599
    };
    
    if (!storageOptions.length || !priceDisplay) return;
    
    storageOptions.forEach(option => {
        option.addEventListener('change', () => {
            const selectedValue = option.value;
            const price = prices[selectedValue];
            priceDisplay.textContent = `$${price.toLocaleString()}`;
            
            // Add a subtle animation to the price
            priceDisplay.style.transform = 'scale(1.05)';
            setTimeout(() => {
                priceDisplay.style.transform = 'scale(1)';
            }, 100);
        });
    });
    
    // Pre-order button click
    const preorderBtn = document.querySelector('.preorder-btn');
    if (preorderBtn) {
        preorderBtn.addEventListener('click', () => {
            // Show confirmation animation
            preorderBtn.innerHTML = '<span>✓ Added to Cart</span>';
            preorderBtn.style.background = 'var(--color-accent)';
            preorderBtn.style.transition = 'background 0.3s ease';
            
            setTimeout(() => {
                preorderBtn.innerHTML = '<span>Pre-order Now</span>';
                preorderBtn.style.background = '';
            }, 1500);
        });
    }
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
// SMOOTH SCROLLING (Native)
// ========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

