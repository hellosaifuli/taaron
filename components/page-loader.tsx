'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

function StitchOverlay({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>()

  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let offset = 0

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Background
      ctx.fillStyle = '#F7F4EF'
      ctx.fillRect(0, 0, w, h)

      // Full-page outer stitch border
      const m = Math.min(w, h) * 0.04
      ctx.setLineDash([20, 13])
      ctx.lineDashOffset = -offset
      ctx.strokeStyle = '#9B6F47'
      ctx.lineWidth = 2.5
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.rect(m, m, w - m * 2, h - m * 2)
      ctx.stroke()

      // Inner stitch (counter-running)
      const m2 = m + 14
      ctx.setLineDash([12, 8])
      ctx.lineDashOffset = offset
      ctx.strokeStyle = '#C4A882'
      ctx.lineWidth = 1.2
      ctx.beginPath()
      ctx.rect(m2, m2, w - m2 * 2, h - m2 * 2)
      ctx.stroke()

      // Centered "TAARON" wordmark
      const pulse = 0.7 + 0.3 * Math.sin(offset * 0.15)
      ctx.globalAlpha = 0.18 * pulse
      ctx.fillStyle = '#9B6F47'
      const fontSize = Math.min(w * 0.09, 80)
      ctx.font = `400 ${fontSize}px 'Playfair Display', Georgia, serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('TAARON', w / 2, h / 2)

      // Subtitle
      ctx.globalAlpha = 0.35 * pulse
      ctx.fillStyle = '#9B6F47'
      ctx.font = `400 ${Math.min(w * 0.018, 13)}px 'Inter', sans-serif`
      ctx.letterSpacing = '0.4em'
      ctx.fillText('LOADING', w / 2, h / 2 + fontSize * 0.75)
      ctx.globalAlpha = 1

      offset += 0.6
      if (offset > 33) offset = 0
      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [visible])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`fixed inset-0 z-[9999] transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    />
  )
}

export default function PageLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const prevPath = useRef(pathname)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname
      setLoading(true)
      clearTimeout(timer.current)
      // Give the new page 600ms to render, then fade out
      timer.current = setTimeout(() => setLoading(false), 600)
    }
    return () => clearTimeout(timer.current)
  }, [pathname])

  return <StitchOverlay visible={loading} />
}
