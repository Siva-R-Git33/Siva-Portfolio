import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';

export default function CyberGlobe() {
    const sphereRef = useRef();

    // Rotate slowly 
    useFrame((state) => {
        if (sphereRef.current) {
            sphereRef.current.rotation.x = state.clock.elapsedTime * 0.1;
            sphereRef.current.rotation.y = state.clock.elapsedTime * 0.15;
        }
    });

    return (
        <group>
            {/* Soft ambient light */}
            <ambientLight intensity={0.5} />

            {/* Directional light pointing at the globe */}
            <directionalLight position={[5, 3, 5]} intensity={1.5} color="#00ff41" />
            <directionalLight position={[-5, -3, -5]} intensity={0.5} color="#a855f7" />

            {/* The main distorted cyber-sphere */}
            <Sphere ref={sphereRef} args={[1, 64, 64]} scale={2.5}>
                <MeshDistortMaterial
                    color="#000000"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                    wireframe={true}
                />
            </Sphere>

            {/* A subtle glowing core inside the wireframe */}
            <Sphere args={[0.9, 32, 32]} scale={2.5}>
                <meshBasicMaterial color="#00ff41" transparent opacity={0.1} />
            </Sphere>
        </group>
    );
}
