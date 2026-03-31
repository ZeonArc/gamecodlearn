"use client";

import { useEffect } from "react";

export function SplashCursor() {
  useEffect(() => {
    // A lightweight implementation of a fluid/splash cursor using a canvas overlay
    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100vw";
    canvas.style.height = "100vh";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9998";
    canvas.id = "splash-cursor-canvas";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: any[] = [];
    const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981"]; // Light theme vibrant colors

    const addParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 2,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        addParticle(e.clientX, e.clientY);
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      const existing = document.getElementById("splash-cursor-canvas");
      if (existing) document.body.removeChild(existing);
    };
  }, []);

  return null;
}
