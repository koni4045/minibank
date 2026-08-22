import { useState, useEffect, useCallback } from "react";

interface Promo {
  id: number;
  title: string;
  subtitle: string;
  bg: string;
}

const promos: Promo[] = [
  {
    id: 1,
    title: "Earn 4.5% APY",
    subtitle: "Move your savings to a High-Yield account today",
    bg: "linear-gradient(135deg, #4f6cf5, #6a4ff5)",
  },
  {
    id: 2,
    title: "Zero Fee Transfers",
    subtitle: "Send money to anyone, anytime, no charges",
    bg: "linear-gradient(135deg, #14b8a6, #0891b2)",
  },
  {
    id: 3,
    title: "MiniBank Credit Card",
    subtitle: "2% cashback on every purchase, apply in minutes",
    bg: "linear-gradient(135deg, #f59e0b, #ef4444)",
  },
];

const AUTO_ADVANCE_MS = 4000;

function PromoCarousel() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    setIndex((i + promos.length) % promos.length);
  }, []);

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-advance, paused on hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % promos.length);
    }, AUTO_ADVANCE_MS);

    return () => clearInterval(timer);
  }, [isPaused]);

  const promo = promos[index];

  return (
    <div
      className="carousel"
      style={{ background: promo.bg }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <button className="carousel-arrow carousel-arrow-left" onClick={prev} aria-label="Previous">
        ‹
      </button>

      <div className="carousel-content">
        <h3>{promo.title}</h3>
        <p>{promo.subtitle}</p>
      </div>

      <button className="carousel-arrow carousel-arrow-right" onClick={next} aria-label="Next">
        ›
      </button>

      <div className="carousel-dots">
        {promos.map((p, i) => (
          <button
            key={p.id}
            className={`dot ${i === index ? "dot-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default PromoCarousel;