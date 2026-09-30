/**
 * Nevoa volumetrica — design.md §6.10.
 * Dois radial-gradients grandes, blur estatico, animados so por transform.
 */
export function Fog() {
  return (
    <div
      aria-hidden="true"
      data-fx="fog"
      data-parallax=""
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: "var(--z-bg)", "--parallax": "22%" } as React.CSSProperties}
    >
      <div
        className="absolute -bottom-1/4 left-[-10%] h-[70vh] w-[70vw]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(177,75,255,.34) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "fog-drift-a 26s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <div
        className="absolute right-[-15%] bottom-[-15%] h-[60vh] w-[60vw]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,45,143,.26) 0%, transparent 65%)",
          filter: "blur(80px)",
          animation: "fog-drift-b 31s ease-in-out infinite",
          willChange: "transform",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-[40vh] w-[45vw] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle at 50% 100%, rgba(255,159,74,.14) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}
