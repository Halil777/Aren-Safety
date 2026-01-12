import { useEffect, useMemo, useState } from "react";
import snowPng from "@/assets/snow.png";

type Flake = {
  id: number;
  left: number; // vw
  size: number; // px
  opacity: number; // 0..1
  duration: number; // s
  delay: number; // s
  drift: number; // px
  blur: number; // px
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function makeFlakes(count: number): Flake[] {
  const flakes: Flake[] = [];
  for (let i = 0; i < count; i++) {
    const size = Math.random() * 10 + 10; // 10..20
    flakes.push({
      id: i,
      left: Math.random() * 100, // 0..100vw
      size,
      opacity: clamp(Math.random() * 0.6 + 0.25, 0.2, 0.9),
      duration: Math.random() * 10 + 10, // 10..20s
      delay: -(Math.random() * 20), // negative => başdan “already falling”
      drift: (Math.random() * 2 - 1) * 60, // -60..60px
      blur: Math.random() < 0.25 ? Math.random() * 1.5 : 0, // biraz depth
    });
  }
  return flakes;
}

export function Snowfall({
  density = 70,
  className,
}: {
  density?: number; // ekran ululygyna görä awto düzetilýär
  className?: string;
}) {
  const [count, setCount] = useState(density);

  useEffect(() => {
    const update = () => {
      // Ulurak ekran => köp flake, kiçi ekran => az
      const w = window.innerWidth;
      const h = window.innerHeight;
      const area = (w * h) / (1280 * 720); // normalized
      const next = Math.round(density * clamp(area, 0.6, 1.8));
      setCount(clamp(next, 30, 140));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [density]);

  const flakes = useMemo(() => makeFlakes(count), [count]);

  return (
    <div
      className={[
        "pointer-events-none absolute inset-0 overflow-hidden",
        className ?? "",
      ].join(" ")}
      aria-hidden="true"
    >
      {/* prefers-reduced-motion: hereketi azaltmak */}
      <style>{`
        @keyframes snow-fall {
          0% { transform: translate3d(var(--drift), -12vh, 0) rotate(0deg); }
          100% { transform: translate3d(calc(var(--drift) * -1), 112vh, 0) rotate(360deg); }
        }
        .snowflake {
          position: absolute;
          top: 0;
          left: 0;
          background-image: url(${snowPng});
          background-repeat: no-repeat;
          background-size: contain;
          will-change: transform;
          animation-name: snow-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .snowflake { animation: none !important; }
        }
      `}</style>

      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}vw`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
            filter: f.blur ? `blur(${f.blur}px)` : undefined,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            // drift üsti arkaly bir az saga-çepe süýşme
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            ["--drift" as any]: `${f.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
