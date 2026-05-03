# Cordée.IA — Design System

## 1. Visual Theme & Atmosphere

**Goal**: Cabinet de conseil IA premium qui inspire confiance aux CTO et dirigeants. Sérieux mais pas froid. Expert mais pas arrogant.

**Atmosphere**: Hauteur de montagne en fin d'après-midi. Granite + neige + chaleur cuivrée du feu de camp. Le site doit ressentir l'altitude : épuré, calme, précis, mais avec un point chaud qui donne envie de s'asseoir autour d'une décision importante.

**Density**: Generous whitespace. Le luxe = ce qu'on enlève, pas ce qu'on ajoute.

**Reference sites** (étudie l'approche, ne copie pas) :
- linear.app — précision typographique, dark mode parfait
- vercel.com — premium dev, hierarchies typographiques fortes
- stripe.com — crédibilité enterprise, pas un seul élément superflu
- resend.com — FR-feeling moderne, animations subtiles

## 2. Color Palette & Roles

```css
:root {
  /* Granite — sérieux, expertise, structure */
  --color-primary: #1A2B3C;
  --color-primary-hover: #243748;
  --color-primary-foreground: #F8F7F4;

  /* Cuivre — chaleur humaine, points focaux, CTA */
  --color-accent: #D4824A;
  --color-accent-hover: #C4723A;
  --color-accent-foreground: #1A2B3C;

  /* Neige — fond, respiration */
  --color-background: #F8F7F4;
  --color-foreground: #0A1521;
  --color-muted: #8B9BA8;
  --color-muted-foreground: #4A5A6B;

  /* Sapin — succès, validation */
  --color-success: #6B8B6E;

  /* Brouillard — bordures, séparateurs */
  --color-border: #E5E2DA;
  --color-input: #E5E2DA;
}

.dark {
  /* Nuit en altitude — par défaut, les CTO bossent en dark */
  --color-background: #0A1521;
  --color-foreground: #F8F7F4;
  --color-card: #131F2E;
  --color-primary: #D4824A;
  --color-primary-foreground: #0A1521;
  --color-muted: #4A5A6B;
  --color-border: #1F2D3F;
}
```

**Rationale**: Le couple granite/cuivre est cohérent avec la métaphore montagne sans tomber dans le cliché "outdoor brand". Le cuivre devient hero en dark mode car le granite deviendrait invisible.

## 3. Typography Rules

```css
--font-display: 'Fraunces', Georgia, serif;
--font-body: 'Inter', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

**Scale** (mobile / desktop):
- H1: 48px / 80px, Fraunces 600, tracking -2%, line-height 1.0
- H2: 36px / 48px, Fraunces 600, tracking -1%, line-height 1.1
- H3: 24px / 28px, Inter 600, line-height 1.3
- Body: 16px / 18px, Inter 400, line-height 1.6
- Small: 14px, Inter 500
- Caption: 12px, Inter 500, uppercase, tracking +5%

**Rationale**: Fraunces (serif) en display marque l'expertise — Inter sans-serif partout = générique. Inter en body car imbattable lisibilité écran. JetBrains Mono pour les snippets de code des case studies.

## 4. Component Stylings

### Button (Primary — granite)
- Background: `var(--color-primary)` → hover: `var(--color-primary-hover)`
- Foreground: `var(--color-primary-foreground)`
- Padding: 12px 24px
- Border-radius: 8px
- Font: Inter 500, 15px
- Transition: all 200ms ease-out
- Focus: ring 2px `var(--color-accent)` offset 2px
- Active: scale(0.98)
- Disabled: opacity 0.5, cursor not-allowed

### Button (Accent — copper, hero CTA)
Mêmes specs mais background `var(--color-accent)` → utilisé pour "Réserver 30min" et autres CTA conversion (1-2 par page max).

### Button (Ghost / outline)
- Background: transparent
- Border: 1px solid `var(--color-border)`
- Foreground: `var(--color-foreground)`
- Hover: background `var(--color-muted-foreground)` / 5%

### Card
- Background: `var(--color-background)` (light) / `var(--color-card)` (dark)
- Border: 1px solid `var(--color-border)`
- Border-radius: 12px
- Padding: 32px
- Hover: border-color → `var(--color-accent)`, transition 250ms
- Shadow-sm uniquement au hover si carte cliquable

### Input
- Background: transparent
- Border: 1px solid `var(--color-border)`
- Padding: 10px 16px
- Border-radius: 8px
- Focus: border `var(--color-accent)`, ring 3px `var(--color-accent)/20%`

### Badge
- Padding: 4px 10px
- Border-radius: 999px
- Font: caption (12px uppercase tracking +5%)
- Background: `var(--color-muted-foreground)/10%`
- Color: `var(--color-foreground)`

## 5. Layout Principles

- **Container max-width**: 1200px, centered
- **Section padding**: py-32 desktop / py-20 mobile
- **Grid**: 12 cols desktop, 1 col mobile, gap-8
- **Spacing scale**: 4 / 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 (px)
- **Whitespace asymétrique**: alignements gauche/droite alternés pour casser le rythme et créer du focus

## 6. Depth & Elevation

```css
--shadow-sm: 0 1px 2px rgba(10, 21, 33, 0.04);
--shadow-md: 0 4px 12px rgba(10, 21, 33, 0.06);
--shadow-lg: 0 16px 40px rgba(10, 21, 33, 0.08);
```

**Rule**: shadows ultra-subtiles. Le site doit donner "premium qui ne crie pas". Aucun shadow > 0.1 opacity.

**Surface hierarchy**:
- Background plat (no shadow)
- Card = border-only par défaut
- Card élevée (modale, dropdown) = shadow-lg
- Pas de glassmorphism, pas de gradients de fond

## 7. Do's and Don'ts

✅ **Do**:
- Generous whitespace (sections py-32)
- Topographic contour lines (style cartes IGN) en background hero @ 5% opacity
- Photos B&W montagne / cordée / haute altitude (Unsplash type Eberhard Grossgasteiger, Tobias Reich)
- Icons line-style Lucide, 1.5px stroke
- Une animation signature : timeline 5 phases qui se révèle au scroll comme une ascension
- Compteurs animés sur les stats hero (2-10×, 113%, etc.)
- Asymétries volontaires (alignements gauche/droite)

❌ **Don't**:
- Gradient violet→rose (cliché AI startup 2024)
- Glassmorphism / blobs colorés
- Stock photos corporate ("happy diverse team in office")
- Illustrations type "robot mignon" ou "cerveau humain stylisé"
- Lottie animations exagérées
- Emojis dans le contenu marketing
- Anglicismes inutiles ("framework" → "méthode", "team" → "équipe")
- Plus d'un CTA accent par fold
- Border-radius full-rounded (sauf avatars)
- Typographies neutres partout (Inter only) — perdre le caractère Fraunces

## 8. Responsive Behavior

**Breakpoints**:
- Mobile: 0-640px
- Tablet: 641-1024px
- Desktop: 1025px+

**Touch targets**: 44px minimum

**Collapse rules**:
- Hero stats: 4 colonnes desktop → 2x2 mobile
- Timeline 5 phases: verticale sur tous breakpoints (pas de switch)
- Cards expertise: 2 colonnes desktop → 1 mobile
- Personas: 3 colonnes desktop → carousel horizontal mobile
- Navigation: liens desktop → burger sheet Shadcn mobile

## 9. Agent Prompt Guide

**Nouveau composant**:
> "Crée un composant [X] selon le design system Cordée.IA. Utilise les tokens CSS. Border-radius 8-12px. Hover state avec accent copper subtle. Mode sombre par défaut. Mobile-first."

**Nouvelle section page**:
> "Crée une section [X] dans le style Cordée.IA. H1 Fraunces 80px. Whitespace généreux py-32. Une stat impactante animée au scroll. CTA accent copper en bas. Évite les gradients."

**Nouveau case study card**:
> "Crée une card case study Cordée.IA : métrique principale en gros (Fraunces 64px), un paragraphe contexte en Inter, badge industrie en caption uppercase tracking +5%, CTA secondaire 'Lire le cas'."
