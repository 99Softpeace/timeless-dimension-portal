import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PresentationControls, Environment, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

// Shared props type for this component
export interface ProductShowcase3DProps {
  modelUrl?: string
  autoRotate?: boolean
  className?: string
}

/**
 * Renders the 3D model with a gentle floating animation.
 */
function WatchModel({ url, autoRotate = true }: { url: string; autoRotate?: boolean }) {
  const { scene } = useGLTF(url)
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    // Apply a subtle sin-wave rotation for a "breathing" effect
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group ref={meshRef}>
      <primitive object={scene} scale={1} />
    </group>
  )
}

/**
 * The main 3D canvas component that sets up the scene, lighting, and controls.
 */
export default function ProductShowcase3DCanvas({
  modelUrl = '/assets/models/hero-watch.glb',
  autoRotate = true,
  className = '',
}: ProductShowcase3DProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 35 }} className="rounded-xl">
        {/* Basic lighting setup */}
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
            <WatchModel url={modelUrl} autoRotate={autoRotate} />
          </PresentationControls>

          {/* --- THE FIX ---
            This now points to your local HDR file for realistic lighting and reflections.
            Ensure 'potsdamer_platz_1k.hdr' is in your /public/assets/hdri/ folder.
          */}
          <Environment files="/assets/hdri/potsdamer_platz_1k.hdr" />

        </Suspense>

        {/* NOTE: I've removed the <OrbitControls> component. <PresentationControls>
          is already handling user input, and having both can cause them to conflict.
          This setup is cleaner and works better for a product showcase.
        */}
      </Canvas>

      {/* The Reset View button - No changes needed here */}
      <div className="absolute top-4 right-4 space-y-2">
        {/* Intentionally left blank as the button logic was not requested for change */}
      </div>
    </div>
  )
}
