import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CyberGlobe() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // Scene setup - Adding some subtle fog for depth
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0a0a0f, 0.05);

        const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / mount.clientHeight, 0.1, 100);
        camera.position.z = 8; // Move camera back slightly to see particles

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        // --- Lighting ---
        // Brighter ambient light to lift the darkness
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        scene.add(ambientLight);

        // Stronger directional lights with saturated colors
        const dirLight1 = new THREE.DirectionalLight(0x00ff41, 3.0); // Neon Green
        dirLight1.position.set(5, 5, 5);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0xa855f7, 2.0); // Neon Purple
        dirLight2.position.set(-5, -5, 2);
        scene.add(dirLight2);

        const dirLight3 = new THREE.DirectionalLight(0x00b4d8, 1.5); // Neon Blue
        dirLight3.position.set(0, 0, -5);
        scene.add(dirLight3);

        // --- Objects ---

        // 1. Inner glowing solid core
        const coreGeometry = new THREE.SphereGeometry(2.1, 32, 32);
        const coreMaterial = new THREE.MeshPhongMaterial({
            color: 0x00ff41,
            emissive: 0x001108, // Much darker emissive
            transparent: true,
            opacity: 0.15, // Drastically reduced opacity so text is readable
            shininess: 30
        });
        const core = new THREE.Mesh(coreGeometry, coreMaterial);
        scene.add(core);

        // 2. Main Distorted/Wireframe Sphere
        const wireframeGeometry = new THREE.SphereGeometry(2.5, 48, 48);
        const wireframeMaterial = new THREE.MeshStandardMaterial({
            color: 0xa855f7,
            emissive: 0x220033,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        });
        const wireframeSphere = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        scene.add(wireframeSphere);

        // 3. Outer rotating rings/shell for a "technical" look
        const outerGeometry = new THREE.SphereGeometry(2.8, 24, 24);
        const outerMaterial = new THREE.MeshBasicMaterial({
            color: 0x00b4d8,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });
        const outerSphere = new THREE.Mesh(outerGeometry, outerMaterial);
        scene.add(outerSphere);

        // 4. Floating Data Particles (Dust/Stars)
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);
        const colorArray = new Float32Array(particlesCount * 3);

        const color1 = new THREE.Color(0x00ff41);
        const color2 = new THREE.Color(0xa855f7);

        for (let i = 0; i < particlesCount * 3; i += 3) {
            // Random positions in a sphere volume
            const r = 10 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);

            posArray[i] = r * Math.sin(phi) * Math.cos(theta);
            posArray[i + 1] = r * Math.sin(phi) * Math.sin(theta);
            posArray[i + 2] = r * Math.cos(phi);

            // Mix colors for particles
            const mixedColor = color1.clone().lerp(color2, Math.random());
            colorArray[i] = mixedColor.r;
            colorArray[i + 1] = mixedColor.g;
            colorArray[i + 2] = mixedColor.b;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // --- Resize Handler ---
        const handleResize = () => {
            if (!mount) return;
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        // --- Animation Loop ---
        let animationFrameId;
        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Dynamic Rotations
            core.rotation.y = elapsedTime * 0.1;

            wireframeSphere.rotation.x = elapsedTime * 0.15;
            wireframeSphere.rotation.y = elapsedTime * 0.2;

            outerSphere.rotation.x = -elapsedTime * 0.1;
            outerSphere.rotation.z = elapsedTime * 0.05;

            particlesMesh.rotation.y = elapsedTime * 0.03;

            // Breathing scale effect on the core
            const scaleOffset = 1.0 + Math.sin(elapsedTime * 2.0) * 0.03;
            core.scale.set(scaleOffset, scaleOffset, scaleOffset);

            renderer.render(scene, camera);
        };

        animate();

        // --- Cleanup ---
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            mount.removeChild(renderer.domElement);

            coreGeometry.dispose();
            coreMaterial.dispose();
            wireframeGeometry.dispose();
            wireframeMaterial.dispose();
            outerGeometry.dispose();
            outerMaterial.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();

            renderer.dispose();
        };
    }, []);

    // Pointer-events-none prevents the canvas from blocking clicks to underlying HTML elements
    return <div ref={mountRef} className="w-full h-full pointer-events-none" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />;
}
