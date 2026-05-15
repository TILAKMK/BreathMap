'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export function EarthVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      canvas: document.createElement('canvas')
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0.1);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create Earth
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Create gradient canvas texture for Earth
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Draw gradient Earth
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
    gradient.addColorStop(0, '#050816');
    gradient.addColorStop(0.5, '#0a0e27');
    gradient.addColorStop(1, '#050816');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 1024);

    // Add some random landmass noise
    for (let i = 0; i < 1500; i++) {
      ctx.fillStyle = `rgba(34, 211, 238, ${Math.random() * 0.05})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * 2048,
        Math.random() * 1024,
        Math.random() * 80 + 20,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshPhongMaterial({ 
      map: texture,
      shininess: 5,
      specular: new THREE.Color(0x22d3ee),
    });
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);

    // Add atmospheric glow
    const glowGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.05
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Lighting
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(5, 3, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Animation loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      earth.rotation.y += 0.0002;
      glow.rotation.y -= 0.0003;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      glowMaterial.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="w-full h-96 relative rounded-2xl overflow-hidden border border-white/20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    />
  );
}
