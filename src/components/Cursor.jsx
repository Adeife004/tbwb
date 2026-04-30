import { useEffect, useRef } from 'react'

export default function Cursor() {
  const outer = useRef(null)
  const dot   = useRef(null)
  let outerX = 0, outerY = 0
  let targetX = 0, targetY = 0
  let rafId

  useEffect(() => {
    const moveCursor = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      dot.current.style.left = targetX + 'px'
      dot.current.style.top  = targetY + 'px'
    }

    // Smooth lagging outer ring
    const animateOuter = () => {
      outerX += (targetX - outerX) * 0.12
      outerY += (targetY - outerY) * 0.12
      if (outer.current) {
        outer.current.style.left = outerX + 'px'
        outer.current.style.top  = outerY + 'px'
      }
      rafId = requestAnimationFrame(animateOuter)
    }
    rafId = requestAnimationFrame(animateOuter)

    const onEnter = () => {
      outer.current?.classList.add('hovered')
      dot.current?.classList.add('hovered')
    }
    const onLeave = () => {
      outer.current?.classList.remove('hovered')
      dot.current?.classList.remove('hovered')
    }
    const onDown = () => outer.current?.classList.add('clicking')
    const onUp   = () => outer.current?.classList.remove('clicking')

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)

    const attach = () => {
      document.querySelectorAll('a, button, [data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }
    attach()

    // Re-attach on DOM changes
    const observer = new MutationObserver(attach)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
      cancelAnimationFrame(rafId)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div className="cursor-dot"   ref={dot}   />
      <div className="cursor-outer" ref={outer} />
    </>
  )
}