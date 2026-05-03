"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "./atoms";

const HREF = "/generator";

export function UseCases() {
  const t = useTranslations("UseCases");
  const items = t.raw("items") as Array<{
    persona: string;
    title: string;
    desc: string;
    cta: string;
  }>;
  const CASES = items.map((c, i) => ({
    n: String(i + 1).padStart(2, "0"),
    persona: c.persona,
    title: c.title,
    desc: c.desc,
    cta: c.cta,
  }));

  return (
    <section id="use-cases">
      <div className="container">
        <div className="section-eyebrow">
          <span className="num">{t("eyebrow")}</span>
          <span className="rule" />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr)",
            gap: 64,
            marginBottom: 64,
          }}
        >
          <Reveal>
            <h2 className="display h2" style={{ margin: 0 }}>
              {t("titlePart1")}
              <br />
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--color-accent)",
                }}
              >
                {t("titleEm")}
              </em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p
              className="body-lg"
              style={{ margin: 0, alignSelf: "end", maxWidth: "52ch" }}
            >
              {t("introPart1")}{" "}
              <a
                href="https://github.com/jdvot/cordee-ia/issues/new?template=feature_request.md"
                style={{
                  color: "var(--color-accent)",
                  textDecoration: "underline",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "3px",
                }}
              >
                {t("introLink")}
              </a>
              {t("introPart2")}
            </p>
          </Reveal>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {CASES.map((c, i) => (
            <Reveal
              key={c.n}
              delay={i * 60}
              className="card hoverable"
              style={{
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 18,
                minHeight: 320,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  className="display"
                  style={{
                    fontSize: 36,
                    color: "var(--color-accent)",
                    fontStyle: "italic",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {c.n}
                </span>
                <span
                  className="caption"
                  style={{ textAlign: "right", maxWidth: "60%" }}
                >
                  {c.persona}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  margin: 0,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                {c.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "var(--color-muted-foreground)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  flexGrow: 1,
                }}
              >
                {c.desc}
              </p>

              <a
                href={HREF}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-accent)",
                  borderTop: "1px solid var(--color-border)",
                  paddingTop: 16,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                }}
              >
                {c.cta}
                <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div
            style={{
              marginTop: 64,
              paddingTop: 32,
              borderTop: "1px solid var(--color-border)",
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              className="body"
              style={{ margin: 0, color: "var(--color-muted-foreground)" }}
            >
              {t("footnotePart1")}{" "}
              <a
                href="https://github.com/jdvot/cordee-ia/blob/main/USE_CASES.md"
                style={{
                  color: "var(--color-accent)",
                  textDecoration: "underline",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "3px",
                }}
              >
                {t("footnoteLink")}
              </a>
              {t("footnotePart2")}
            </span>
            <a
              href={HREF}
              className="btn btn-accent btn-arrow"
              style={{ marginLeft: "auto" }}
            >
              {t("ctaBottom")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
