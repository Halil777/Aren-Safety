import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Html, Environment } from '@react-three/drei'
import { useRef } from 'react'
import { Mesh } from 'three'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/Button'
import { Link } from 'react-router-dom'

function RotatingIcosahedron() {
  const ref = useRef<Mesh>(null)
  useFrame((_, d) => {
    if (!ref.current) return
    ref.current.rotation.y += d * 0.4
    ref.current.rotation.x += d * 0.15
  })
  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color={'#60a5fa'} roughness={0.3} metalness={0.2} wireframe={false} />
      </mesh>
    </Float>
  )
}

export function Hero3D() {
  const { t } = useTranslation()
  return (
    <section className="section" style={{ paddingTop: 48 }}>
      <div className="container hero-grid">
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: 'easeOut' }}
          style={{ display: 'grid', gap: 16 }}
        >
          <h1 style={{ fontSize: 48, lineHeight: 1.05, margin: 0 }}>{t('hero.title')}</h1>
          <p style={{ fontSize: 18, opacity: .85, margin: 0 }}>{t('hero.subtitle')}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/contact"><Button>{t('hero.cta')}</Button></Link>
          </div>
        </motion.div>
        <div className="card" style={{ height: 380, position: 'relative', overflow: 'hidden' }}>
          <Canvas camera={{ position: [0, 0, 4] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 3, 3]} intensity={1.1} />
            <Environment preset="city" />
            <RotatingIcosahedron />
          </Canvas>
          <Html center style={{ pointerEvents: 'none' }}>
            <div style={{ width: 0, height: 0 }} />
          </Html>
        </div>
      </div>
    </section>
  )
}
