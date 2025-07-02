// Initialize when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader after content loaded
    const loader = document.querySelector('.loader');
    const loaderProgress = document.querySelector('.loader-progress');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                initAnimations();
                initThreeJS(); // Initialize ThreeJS after loader hides
            }, 500);
        }
        loaderProgress.style.width = `${progress}%`;
    }, 100);

    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorDot = document.querySelector('.cursor-dot');

    document.addEventListener('mousemove', (e) => {
        cursor.style.opacity = '1';
        cursorDot.style.opacity = '1';
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorDot.style.opacity = '0';
    });

    // Links and buttons hover effect
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(1.5)`;
            cursor.style.border = '1px solid var(--accent)';
            cursorDot.style.opacity = '0';
        });

        link.addEventListener('mouseleave', () => {
            cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(1)`;
            cursor.style.border = '2px solid var(--accent)';
            cursorDot.style.opacity = '1';
        });
    });

    // Mobile navigation (menu-toggle is now for vertical-nav on smaller screens)
    const mobileNavToggle = document.querySelector('.menu-toggle'); // Corrected selector to match index.html
    const navLinks = document.querySelector('.nav-links'); // This is the horizontal nav

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                mobileNavToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }


    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileNavToggle) { // Check if mobileNavToggle exists
                    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // Scroll to the target element
            gsap.to(window, {
                scrollTo: {
                    y: targetElement.offsetTop - 80, // Offset for fixed header
                    autoKill: false
                },
                duration: 1,
                ease: 'power3.out',
                onComplete: () => {
                    // Update active nav links (both horizontal and vertical) after scroll
                    updateActiveNavLinks(targetId);
                }
            });
        });
    });

    // Function to update active navigation links
    function updateActiveNavLinks(currentHash) {
        // Horizontal navigation
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });

        // Vertical navigation
        document.querySelectorAll('.vertical-nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentHash) {
                link.classList.add('active');
            }
        });
    }

    // Nav scroll behavior - Update active links on scroll
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 80) {
            header.classList.add('nav-scrolled');
        } else {
            header.classList.remove('nav-scrolled');
        }

        const sections = document.querySelectorAll('.page-section'); // Target all page sections
        let currentHash = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust current section detection to trigger slightly before center of screen
            if (scrollY >= sectionTop - window.innerHeight / 3 && scrollY < sectionTop + sectionHeight - window.innerHeight / 3) {
                currentHash = `#${section.id}`;
            }
        });
        updateActiveNavLinks(currentHash);
    });

    // Initial active link setup
    updateActiveNavLinks(window.location.hash || '#hero-page');
});

// Initialize animations (using GSAP for scroll-triggered animations)
function initAnimations() {
    // Register ScrollTrigger if not already registered (should be from CDN)
    gsap.registerPlugin(ScrollTrigger);

    // Hero content animation
    gsap.from(".hero-content h1", { opacity: 0, y: 50, duration: 1, ease: "power3.out", delay: 0.5 });
    gsap.from(".hero-content p", { opacity: 0, y: 50, duration: 1, ease: "power3.out", delay: 0.7 });
    gsap.from(".hero-buttons", { opacity: 0, y: 50, duration: 1, ease: "power3.out", delay: 0.9 });

    // Page section entrance animations
    document.querySelectorAll('.page-section:not(#hero-page)').forEach((section, index) => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: section,
                start: "top 80%", // When top of section hits 80% from top of viewport
                end: "bottom top",
                toggleActions: "play none none reverse", // Play on enter, reverse on leave back
                // markers: true // For debugging
            }
        });
    });

    // About Me poster image animation
    gsap.from(".poster-image", {
        opacity: 0,
        scale: 0.5,
        rotation: 180,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
            trigger: ".poster-image",
            start: "top 75%",
            toggleActions: "play none none reverse"
        }
    });

    // Skills grid items animation
    gsap.utils.toArray(".skill-item").forEach(item => {
        gsap.from(item, {
            opacity: 0,
            y: 20,
            scale: 0.8,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.1,
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Project cards animation
    gsap.utils.toArray(".project-card").forEach(card => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            }
        });

        // Add 3D tilt effect to project cards (already existing, but ensure it's here)
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            gsap.to(this, {
                rotationX: -deltaY * 5, // Reduced tilt for subtlety
                rotationY: deltaX * 5,
                scale: 1.02,
                duration: 0.3,
                ease: "power1.out"
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.75)"
            });
        });
    });

    // Certificates and Achievements animation
    gsap.utils.toArray(".cert-achieve-item").forEach(item => {
        gsap.from(item, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        });
    });

    // Contact form animation
    gsap.from(".contact-form", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".contact-form",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });
}

// Initialize ThreeJS elements
function initThreeJS() {
    // Main 3D Scene for Hero and object transitions
    const main3DContainer = document.querySelector('.globe-container'); // This is the container in the Hero section
    
    if (!main3DContainer) {
        console.error("Main 3D container not found. Three.js initialization aborted.");
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, main3DContainer.offsetWidth / main3DContainer.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(main3DContainer.offsetWidth, main3DContainer.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    main3DContainer.appendChild(renderer.domElement);

    // Dynamic Main 3D Object
    let currentObject = null;
    const objects = {}; // To store different 3D meshes

    // Function to add and scale a mesh
    function createAndAddMesh(name, geometry, material) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.visible = false; // Start hidden
        scene.add(mesh);
        objects[name] = mesh;
        return mesh;
    }

    // Materials
    const mainMaterial = new THREE.MeshPhongMaterial({
        color: 0xEA553B, // Accent color
        shininess: 100,
        specular: 0xcccccc,
        transparent: true,
        opacity: 0.9
    });

    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88, // Greenish glow
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });

    // Create 3D objects for each section
    // Hero: Sphere
    const sphere = createAndAddMesh('hero-sphere', new THREE.SphereGeometry(1.5, 32, 32), mainMaterial.clone());
    sphere.userData.targetRotation = new THREE.Euler(0.2, 0.5, 0);

    // About: Box
    const box = createAndAddMesh('about-box', new THREE.BoxGeometry(2, 2, 2), mainMaterial.clone());
    box.userData.targetRotation = new THREE.Euler(0.5, 0.2, 0.3);

    // Skills: TorusKnot
    const torusKnot = createAndAddMesh('skills-torusknot', new THREE.TorusKnotGeometry(1, 0.3, 100, 16), mainMaterial.clone());
    torusKnot.userData.targetRotation = new THREE.Euler(0.8, 0.1, 0.4);

    // Projects: Cone
    const cone = createAndAddMesh('projects-cone', new THREE.ConeGeometry(1.2, 2.5, 32), mainMaterial.clone());
    cone.userData.targetRotation = new THREE.Euler(0.6, 0.9, 0.2);

    // Certificates: Cylinder
    const cylinder = createAndAddMesh('certificates-cylinder', new THREE.CylinderGeometry(1, 1, 2.5, 32), mainMaterial.clone());
    cylinder.userData.targetRotation = new THREE.Euler(0.1, 0.7, 0.9);

    // Achievements: Dodecahedron
    const dodecahedron = createAndAddMesh('achievements-dodecahedron', new THREE.DodecahedronGeometry(1.5), mainMaterial.clone());
    dodecahedron.userData.targetRotation = new THREE.Euler(0.4, 0.3, 0.6);

    // Contact: Sphere (using wireframe for distinction)
    const contactSphere = createAndAddMesh('contact-sphere', new THREE.SphereGeometry(1.5, 32, 32), wireframeMaterial.clone());
    contactSphere.userData.targetRotation = new THREE.Euler(0.2, 0.5, 0); 


    // Add Lights
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    camera.position.z = 5;

    // Stars Dropping from the Sky
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000;
    const starPositions = new Float32Array(starCount * 3);
    const starVelocities = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 50; // X
        starPositions[i * 3 + 1] = Math.random() * 50 - 25; // Y (starts higher up, goes lower)
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 50; // Z
        starVelocities[i] = 0.05 + Math.random() * 0.1; // Slower or faster drop
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending // For a glowing effect
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = main3DContainer.offsetWidth;
        const height = main3DContainer.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // Mouse interaction for main object
    let mouseX = 0;
    let mouseY = 0;
    main3DContainer.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / main3DContainer.offsetWidth) * 2 - 1;
        mouseY = -(event.clientY / main3DContainer.offsetHeight) * 2 + 1;
    });

    // GSAP ScrollTrigger for object transitions
    const sections = document.querySelectorAll('.page-section');
    const sectionMap = {
        'hero-page': 'hero-sphere',
        'about-page': 'about-box',
        'skills-page': 'skills-torusknot',
        'projects-page': 'projects-cone',
        'certificates-page': 'certificates-cylinder',
        'achievements-page': 'achievements-dodecahedron',
        'contact-page': 'contact-sphere'
    };

    sections.forEach((section, index) => {
        ScrollTrigger.create({
            trigger: section,
            start: "top center", // When the top of the section hits the center of the viewport
            end: "bottom center", // When the bottom of the section leaves the center of the viewport
            // markers: true, // Uncomment for debugging scroll triggers
            onEnter: () => {
                activateObject(section.id);
            },
            onEnterBack: () => {
                activateObject(section.id);
            }
        });
    });

    function activateObject(sectionId) {
        const newObjectKey = sectionMap[sectionId];
        const newObject = objects[newObjectKey];

        if (newObject && newObject !== currentObject) {
            if (currentObject) {
                // Animate out current object
                gsap.to(currentObject.scale, { x: 0, y: 0, z: 0, duration: 0.7, ease: "power2.in" });
                gsap.to(currentObject.material, { opacity: 0, duration: 0.7, ease: "power2.in", onComplete: () => {
                    currentObject.visible = false;
                }});
            }

            // Animate in new object
            newObject.visible = true;
            newObject.scale.set(0, 0, 0); // Start from small
            newObject.material.opacity = 0;
            gsap.to(newObject.scale, { x: 1, y: 1, z: 1, duration: 1, ease: "back.out(1.7)" });
            gsap.to(newObject.material, { opacity: 0.9, duration: 1, ease: "power2.out" });
            
            // Set initial rotation to target, then let animate loop handle it
            newObject.rotation.set(0, 0, 0); // Reset rotation to start fresh
            currentObject = newObject;
        }
    }

    // Initial activation for the hero section object
    activateObject('hero-page');


    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Stars dropping animation
        const positions = stars.geometry.attributes.position.array;
        for (let i = 0; i < starCount; i++) {
            positions[i * 3 + 1] -= starVelocities[i]; // Move downwards

            // If a star falls below -25, reset it to the top (25)
            if (positions[i * 3 + 1] < -25) {
                positions[i * 3 + 1] = 25;
            }
        }
        stars.geometry.attributes.position.needsUpdate = true; // Tell Three.js to update buffer

        // Main object rotation based on target and mouse
        if (currentObject) {
            // Smoothly move towards target rotation
            currentObject.rotation.x += (currentObject.userData.targetRotation.x - currentObject.rotation.x) * 0.05;
            currentObject.rotation.y += (currentObject.userData.targetRotation.y - currentObject.rotation.y) * 0.05;

            // Add subtle continuous rotation
            currentObject.rotation.y += 0.002;
            currentObject.rotation.x += 0.001;
            
            // Apply mouse influence on rotation (subtler effect)
            currentObject.rotation.y += mouseX * 0.005;
            currentObject.rotation.x += mouseY * 0.005;
        }

        renderer.render(scene, camera);
    }

    animate();
}
