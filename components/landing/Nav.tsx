"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CordeeMark } from "./atoms";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DarkToggle } from "@/components/generator/DarkToggle";

export function Nav() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape when the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={"nav " + (scrolled ? "scrolled" : "")}>
        <div className="container nav-inner">
          <Link href="/" className="nav-logo" aria-label={t("ariaLabel")}>
            <span className="mark">
              <CordeeMark size={26} />
            </span>
            <span>
              Cordée<span style={{ color: "var(--color-accent)" }}>.</span>IA
            </span>
          </Link>
          <div className="nav-links">
            <Link href="/#methode">{t("method")}</Link>
            <Link href="/#expertise">{t("expertise")}</Link>
            <Link href="/#personas">{t("personas")}</Link>
            <Link href="/#use-cases">{t("useCases")}</Link>
            <Link href="/#faq">{t("faq")}</Link>
            <Link href="/generator">{t("generator")}</Link>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <DarkToggle />
            <LanguageSwitcher variant="nav" />
            <Link href="/generator" className="btn btn-accent nav-cta">
              {t("ctaBook")} <ArrowRight size={14} />
            </Link>
            <button
              type="button"
              className="nav-mobile-toggle"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="nav-mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        id="nav-mobile-menu"
        className={"nav-mobile-menu " + (menuOpen ? "open" : "")}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal={menuOpen}
        aria-label={t("ariaLabel")}
      >
        <div className="nav-mobile-links">
          <Link href="/#methode" onClick={closeMenu}>{t("method")}</Link>
          <Link href="/#expertise" onClick={closeMenu}>{t("expertise")}</Link>
          <Link href="/#personas" onClick={closeMenu}>{t("personas")}</Link>
          <Link href="/#use-cases" onClick={closeMenu}>{t("useCases")}</Link>
          <Link href="/#faq" onClick={closeMenu}>{t("faq")}</Link>
          <Link href="/generator" onClick={closeMenu}>{t("generator")}</Link>
        </div>
        <Link
          href="/generator"
          className="btn btn-accent nav-mobile-cta"
          onClick={closeMenu}
        >
          {t("ctaBook")} <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
