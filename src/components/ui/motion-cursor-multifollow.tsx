"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react"
import { motion, useMotionValue, useSpring, type Variants } from "motion/react"
import "./motion-cursor-multifollow-utils/index.css"

/**
 * Cursor com rastro de anéis (motion) — integrado a partir do componente
 * `motion-cursor-multifollow`.
 *
 * Adaptações para valer no site inteiro, e não dentro de uma caixa de demo:
 * - O Stage virou uma camada fixa sobre a página, sem capturar clique; por
 *   isso os eventos são ouvidos na janela em vez de no próprio div.
 * - Fica invisível até o primeiro movimento (senão nasce parado no meio da
 *   tela) e some quando o ponteiro sai da janela.
 * - Só monta com mouse (pointer: fine) e sem movimento reduzido; enquanto
 *   montado, esconde o cursor nativo (classe em <html>, ver index.css).
 */

function usePointerPosition() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [x, y])

  return { x, y }
}

type Kind = "default" | "text" | "magnetic"

type CursorState = {
  stageRef: RefObject<HTMLDivElement | null>
  kind: Kind
  caret: number
  targetBoundingBox: DOMRect | null
  pressed: boolean
  zone: string | null
  visible: boolean
}

const CursorCtx = createContext<CursorState | null>(null)

function useCursorState() {
  const ctx = useContext(CursorCtx)
  if (!ctx) throw new Error("Cursor must render inside Stage")
  return ctx
}

function Stage({
  children,
  className = "cursor-stage",
}: {
  children: ReactNode
  className?: string
}) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [kind, setKind] = useState<Kind>("default")
  const [caret, setCaret] = useState(18)
  const [targetBoundingBox, setTarget] = useState<DOMRect | null>(null)
  const [pressed, setPressed] = useState(false)
  const [zone, setZone] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeave = () => {
      setPressed(false)
      setKind("default")
      setTarget(null)
      setZone(null)
      setVisible(false)
    }
    const onMove = (e: PointerEvent) => {
      setVisible(true)
      const el = e.target
      if (!(el instanceof Element)) return
      const zoneEl = el.closest<HTMLElement>("[data-cursor-zone]")
      setZone(zoneEl?.dataset.cursorZone ?? null)
      const mag = el.closest<HTMLElement>("[data-magnetic]")
      if (mag) {
        setKind("magnetic")
        setTarget(mag.getBoundingClientRect())
        return
      }
      const text = el.closest<HTMLElement>("[data-cursor-text]")
      if (text) {
        const lh = parseFloat(getComputedStyle(text).lineHeight)
        setCaret(Number.isFinite(lh) ? lh : 18)
        setKind("text")
        setTarget(text.getBoundingClientRect())
        return
      }
      setKind("default")
      setTarget(null)
    }

    const root = document.documentElement
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
    root.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      root.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return (
    <CursorCtx.Provider
      value={{ stageRef, kind, caret, targetBoundingBox, pressed, zone, visible }}
    >
      <div
        ref={stageRef}
        aria-hidden="true"
        data-visible={visible}
        className={className}
      >
        {children}
      </div>
    </CursorCtx.Provider>
  )
}

function Cursor({
  follow = false,
  offset = { x: 0, y: 0 },
  spring: springCfg,
  magnetic,
  variants = {},
  style,
  className,
  children,
}: {
  follow?: boolean
  offset?: { x: number; y: number }
  spring?: { stiffness?: number; damping?: number }
  magnetic?: boolean | { morph?: boolean; snap?: number }
  variants?: Variants
  style?: CSSProperties
  className?: string
  children?: ReactNode
}) {
  const { stageRef, kind, caret, targetBoundingBox, pressed } = useCursorState()
  const pointer = usePointerPosition()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const baseW = Number(style?.width ?? 16)
  const baseH = Number(style?.height ?? 16)
  const w = useMotionValue(baseW)
  const h = useMotionValue(baseH)
  const opts =
    springCfg ??
    (follow ? { stiffness: 140, damping: 18 } : { stiffness: 900, damping: 55 })
  const x = useSpring(rawX, opts)
  const y = useSpring(rawY, opts)
  const snap = typeof magnetic === "object" ? (magnetic.snap ?? 1) : 1
  const morph = typeof magnetic === "object" ? magnetic.morph !== false : Boolean(magnetic)
  const magneticOn = Boolean(magnetic)

  useEffect(() => {
    const sync = () => {
      const stage = stageRef.current
      if (!stage) return
      const sr = stage.getBoundingClientRect()
      const px = pointer.x.get() - sr.left + offset.x
      const py = pointer.y.get() - sr.top + offset.y
      if (magneticOn && kind === "magnetic" && targetBoundingBox) {
        const tx = targetBoundingBox.left + targetBoundingBox.width / 2 - sr.left
        const ty = targetBoundingBox.top + targetBoundingBox.height / 2 - sr.top
        rawX.set(px + (tx - px) * snap)
        rawY.set(py + (ty - py) * snap)
        if (morph) {
          w.set(targetBoundingBox.width)
          h.set(targetBoundingBox.height)
        } else {
          w.set(baseW)
          h.set(baseH)
        }
        return
      }
      if (kind === "text") {
        rawX.set(px)
        rawY.set(py)
        w.set(2)
        h.set(caret)
        return
      }
      rawX.set(pointer.x.get() ? px : sr.width / 2)
      rawY.set(pointer.y.get() ? py : sr.height / 2)
      w.set(baseW)
      h.set(baseH)
    }

    const stage = stageRef.current
    if (stage) {
      const sr = stage.getBoundingClientRect()
      rawX.set(sr.width / 2)
      rawY.set(sr.height / 2)
    }

    const ux = pointer.x.on("change", sync)
    const uy = pointer.y.on("change", sync)
    return () => {
      ux()
      uy()
    }
  }, [
    baseH,
    baseW,
    caret,
    kind,
    magneticOn,
    morph,
    offset.x,
    offset.y,
    pointer.x,
    pointer.y,
    rawX,
    rawY,
    snap,
    stageRef,
    targetBoundingBox,
    w,
    h,
  ])

  const variantKey =
    pressed && variants.pressed
      ? "pressed"
      : magneticOn && kind === "magnetic" && variants.magnetic
        ? "magnetic"
        : kind === "text" && variants.text
          ? "text"
          : "default"

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width: _ignoredW, height: _ignoredH, ...restStyle } = style ?? {}

  return (
    <motion.div
      className={className}
      data-cursor=""
      initial={false}
      animate={variantKey}
      variants={variants}
      style={{
        ...restStyle,
        position: "absolute",
        top: 0,
        left: 0,
        x,
        y,
        width: w,
        height: h,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        zIndex: 30,
      }}
    >
      {children}
    </motion.div>
  )
}

/** Monta só com mouse e sem movimento reduzido; troca de dispositivo remonta. */
function usePodeMostrar() {
  const [pode, setPode] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)")
    const aplicar = () => setPode(mq.matches)
    aplicar()
    mq.addEventListener("change", aplicar)
    return () => mq.removeEventListener("change", aplicar)
  }, [])

  useEffect(() => {
    if (!pode) return
    const root = document.documentElement
    root.classList.add("cursor-custom")
    return () => root.classList.remove("cursor-custom")
  }, [pode])

  return pode
}

export function CursorMultifollow() {
  const pode = usePodeMostrar()
  if (!pode) return null

  return (
    <Stage>
      <Cursor
        style={{ backgroundColor: "white", width: 5, height: 5 }}
        variants={{ pressed: { scale: 0.5 } }}
      />
      <Cursor
        style={{
          borderRadius: 20,
          border: "2px solid #ff0088",
          backgroundColor: "transparent",
          width: 13,
          height: 13,
        }}
        variants={{ pressed: { scale: 0.6, borderColor: "#dd00ee" } }}
        spring={{ stiffness: 1000, damping: 50 }}
      />
      <Cursor
        style={{
          borderRadius: 20,
          border: "2px solid #dd00ee",
          backgroundColor: "transparent",
          width: 21,
          height: 21,
        }}
        variants={{ pressed: { scale: 0.7, borderColor: "#9911ff" } }}
        spring={{ stiffness: 800, damping: 70 }}
      />
      <Cursor
        style={{
          borderRadius: 20,
          border: "2px solid #9911ff",
          backgroundColor: "transparent",
          width: 29,
          height: 29,
        }}
        variants={{ pressed: { scale: 0.8, borderColor: "#1e75f7" } }}
        spring={{ stiffness: 700, damping: 90 }}
      />
    </Stage>
  )
}

export default CursorMultifollow
