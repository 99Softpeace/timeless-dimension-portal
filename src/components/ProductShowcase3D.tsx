'use client'

import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PresentationControls, Environment, Html, useGLTF, Center, ContactShadows, Float } from '@react-three/drei'
import * as THREE from 'three'

export interface ProductShowcase3DProps {
  modelUrl?: string
  autoRotate?: boolean
  className?: string
}

function WatchModel({ url, autoRotate = true }: { url: string; autoRotate?: boolean }) {
  const { scene } = useGLTF(url)
  const { viewport } = useThree()

  // Oura style: Large, dominant, clear.
  const isMobile = viewport.width < 5
  // Increase scale slightly more for that "macro" feel
  const responsiveScale = Math.min(viewport.width / (isMobile ? 1.4 : 2.2), 2)

  useFrame((state) => {
    if (autoRotate) {
      // Slower, heavy, premium rotation
      scene.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <primitive object={scene} scale={responsiveScale} />
  )
}

export default function ProductShowcase3D({
  modelUrl = '/assets/models/hero-watch.glb',
  autoRotate = true,
  className = '',
}: ProductShowcase3DProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }} className="rounded-xl">
        {/* Studio Lighting Setup to mimic Oura's crisp look */}

        {/* soft fill light */}
        <ambientLight intensity={0.7} />

        {/* Key light - strong, creates definition */}
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
          castShadow
        />

        {/* Rim light - highlights edges, separating from background */}
        <pointLight position={[-10, 5, -10]} intensity={2} color="#ffffff" />

        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </Html>
          }
        >
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
            config={{ mass: 2, tension: 400 }} // Heavy feel
            snap={{ mass: 4, tension: 400 }} // Snap back to center
          >
            <Float
              speed={2}
              rotationIntensity={0.2}
              floatIntensity={0.5}
              floatingRange={[-0.1, 0.1]}
            >
              <Center>
                <WatchModel url={modelUrl} autoRotate={autoRotate} />
              </Center>
            </Float>
          </PresentationControls>

          {/* Realistic grounded shadow */}
          <ContactShadows
            position={[0, -1.4, 0]}
            opacity={0.7}
            scale={10}
            blur={2.5}
            far={4}
            color="#000000"
          />

          {/* "City" preset gives great metallic reflections (gold/silver looking real) */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}
