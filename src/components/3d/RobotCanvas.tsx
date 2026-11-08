'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import RobotModel, { RobotAnimationType } from './RobotModel';
import RobotLoading from './RobotLoading';

interface RobotCanvasProps {
  currentAnimation: RobotAnimationType;
  onAnimationEnd: () => void;
  primaryColor?: string;
  enableMouseTracking?: boolean;
  onRobotClick?: () => void;
  scale?: number;
  cameraPosition?: [number, number, number];
}

export default function RobotCanvas({
  currentAnimation,
  onAnimationEnd,
  primaryColor = '#6D5DF1',
  enableMouseTracking = true,
  onRobotClick,
  scale = 0.52,
  cameraPosition = [0, 0.1, 5.2],
}: RobotCanvasProps) {
  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] md:min-h-[480px]">
      <Canvas
        camera={{ position: cameraPosition, fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        shadows={{ type: THREE.PCFShadowMap }}
        onCreated={({ gl }) => {
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
        className="w-full h-full"
      >
        {/* Studio Lighting Setup */}
        <ambientLight intensity={0.7} />

        {/* Directional Key Light */}
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={0.5}
          shadow-camera-far={15}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
          shadow-bias={-0.0001}
        />

        {/* Cyber Rim Light matching portfolio primary accent */}
        <directionalLight
          position={[-4, 4, -4]}
          intensity={2.2}
          color={primaryColor}
        />

        {/* Fill light from front-left */}
        <pointLight position={[-3, 2, 3]} intensity={0.8} color="#93c5fd" />

        {/* Subtle ground reflection / bounce */}
        <pointLight position={[0, -2, 2]} intensity={0.5} color={primaryColor} />

        <Suspense fallback={null}>
          <RobotModel
            currentAnimation={currentAnimation}
            onAnimationEnd={onAnimationEnd}
            primaryColor={primaryColor}
            enableMouseTracking={enableMouseTracking}
            onRobotClick={onRobotClick}
            scale={scale}
            position={[0, -0.45, 0]}
          />

          <Environment preset="city" />

          {/* Soft Ground Contact Shadows */}
          <ContactShadows
            position={[0, -1.72, 0]}
            opacity={0.5}
            scale={6}
            blur={2.5}
            far={3.5}
            color="#000000"
          />
        </Suspense>

        {/* Smooth OrbitControls with constrained angles */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.06}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 3.5}
          maxAzimuthAngle={Math.PI / 3.5}
          rotateSpeed={0.6}
        />
      </Canvas>
    </div>
  );
}

