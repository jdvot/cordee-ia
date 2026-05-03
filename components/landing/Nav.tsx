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
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
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
          <Link href="/generator" className="btn btn-accent">
            {t("ctaBook")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
