import React, { useEffect, useState, useRef } from "react";

export const CursorFollower: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [followerPos, setFollowerPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef<number | null>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const followerRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable on fine pointer devices (desktop / mouse)
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if target is interactive (button, link, input, etc.)
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("textarea") ||
          target.closest("select") ||
          target.closest("[role='button']") ||
          target.closest(".clickable"))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Silky smooth dribble trailing lerp loop
    const animateFollower = () => {
      const ease = 0.15;
      followerRef.current.x += (mousePos.current.x - followerRef.current.x) * ease;
      followerRef.current.y += (mousePos.current.y - followerRef.current.y) * ease;
      setFollowerPos({ x: followerRef.current.x, y: followerRef.current.y });
      requestRef.current = requestAnimationFrame(animateFollower);
    };

    requestRef.current = requestAnimationFrame(animateFollower);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-9999 select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Precision Core Dot - Softens and shrinks on hover to never obscure button text */}
      <div
        className="pointer-events-none fixed rounded-full transition-transform duration-100 ease-out"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isHovering ? "4px" : "6px",
          height: isHovering ? "4px" : "6px",
          background: "var(--zx-primary)",
          transform: "translate(-50%, -50%)",
          opacity: isHovering ? 0.6 : 1,
        }}
      />

      {/* Smooth Dribble Trailing Ring - Expands as a non-occluding delicate halo without blur */}
      <div
        className="pointer-events-none fixed rounded-full border transition-all duration-200 ease-out"
        style={{
          left: `${followerPos.x}px`,
          top: `${followerPos.y}px`,
          width: isHovering ? "44px" : "26px",
          height: isHovering ? "44px" : "26px",
          borderColor: isHovering ? "rgba(163, 4, 2, 0.4)" : "rgba(163, 4, 2, 0.25)",
          background: "transparent",
          backdropFilter: "none", // Never blur text underneath
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>
  );
};
