'use client'

import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PresentationControls, Environment, Html, useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'

// The props interface is now in the same file
export interface ProductShowcase3DProps {
  modelUrl?: string
  autoRotate?: boolean
  className?: string
}

/**
 * Renders the 3D watch model with a gentle floating animation and responsive scaling.
 */
function WatchModel({ url, autoRotate = true }: { url: string; autoRotate?: boolean }) {
  const { scene } = useGLTF(url)
  const meshRef = useRef<THREE.Group>(null)
  const { viewport } = useThree() // Hook to get viewport dimensions for responsiveness

  // Calculate a responsive scale based on the viewport width, with a maximum size cap.
  // This makes the model smaller on mobile and larger on desktop.
  const responsiveScale = Math.min(viewport.width / 3.5, 1.2)

  useFrame((state) => {
    // Apply a subtle sin-wave rotation for a "breathing" effect
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      {/* Apply the calculated responsive scale to the model */}
      <primitive object={scene} scale={responsiveScale} />
    </group>
  )
}

/**
 * The main 3D showcase component.
 * This now contains all logic and is the component you'll import into your pages.
 */
export default function ProductShowcase3D({
  modelUrl = '/assets/models/hero-watch.glb',
  autoRotate = true,
  className = '',
}: ProductShowcase3DProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 35 }} className="rounded-xl">
        {/* Lighting setup for the scene */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />

        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-gray-400 text-sm">Loading Model...</span>
              </div>
            </Html>
          }
        >
          {/* Controls for user interaction (drag to rotate) */}
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]} // Vertical rotation limits
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]} // Horizontal rotation limits
          >
            {/* The Center component automatically positions the model in the middle, fixing the upward shift. */}
            <Center>
              <WatchModel url={modelUrl} autoRotate={autoRotate} />
            </Center>
          </PresentationControls>

          {/* Environment for realistic lighting and reflections.
            Ensure 'potsdamer_platz_1k.hdr' is in your /public/assets/hdri/ folder.
          */}
          <Environment files="/assets/hdri/potsdamer_platz_1k.hdr" />

        </Suspense>
      </Canvas>
    </div>
  )
}
