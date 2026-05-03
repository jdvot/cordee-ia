"use client";

import { useEffect, useState } from "react";
import { ArrowRight, CordeeMark } from "./atoms";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={"nav " + (scrolled ? "scrolled" : "")}>
      <div className="container nav-inner">
        <a href="#" className="nav-logo" aria-label="Cordée.IA">
          <span className="mark">
            <CordeeMark size={26} />
          </span>
          <span>
            Cordée<span style={{ color: "var(--color-accent)" }}>.</span>IA
          </span>
        </a>
        <div className="nav-links">
          <a href="#methode">Méthode</a>
          <a href="#expertise">Expertise</a>
          <a href="#personas">Pour qui</a>
          <a href="#use-cases">Cas d&apos;usage</a>
          <a href="#faq">FAQ</a>
          <a href="/generator">Générateur</a>
        </div>
        <a href="#cta" className="btn btn-accent">
          Réserver 30 min <ArrowRight size={14} />
        </a>
      </div>
    </nav>
  );
}
