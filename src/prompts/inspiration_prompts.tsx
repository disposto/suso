// inspiration_prompts.tsx
import React from "react";

/**
 * INSPIRATION_PROMPTS_SWISS
 *
 * Cada prompt contém metadados que guiam a geração no estilo "Swiss / Modern Global":
 * - label: rótulo curto
 * - icon: JSX SVG (mantive os originais)
 * - description: instrução curta e direta para a IA (estilo, tom, espaçamento, microinterações)
 * - styleTags: tags que devem sempre aparecer (usadas como constraints)
 * - layoutHints: dicas de layout (grid, margem, tipografia)
 * - density: quão "respirado" é o layout (low/medium/high) — Swiss tende a LOW (muito espaço)
 * - examples: referências de marcas/designs que definem o tone (Apple, Vercel, Notion, Stripe, Nike, Stellar)
 */

export const INSPIRATION_PROMPTS_SWISS = [
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    label: "TODO list app",
    description:
      "Generate a TODO list app UI in Swiss design: strong typographic hierarchy, left-aligned grid, lots of white space, subtle microinteractions (hover, focus), minimal color accents. Clean functional components, accessible forms.",
    styleTags: ["swiss", "minimal", "typography-first", "space", "microinteractions"],
    layoutHints:
      "Left column list, large negative space, 8–12pt scale for type, 12-column grid but large gutters, CTA accent color used sparingly.",
    density: "low",
    examples: ["Apple", "Notion", "Vercel"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-7m-6 0a1 1 0 00-1 1v3"
        />
      </svg>
    ),
    label: "Landing Page",
    description:
      "Create a hero-first landing page with Swiss aesthetics: large left-aligned headline, strong baseline grid, restrained color palette (black/gray + one accent), generous margins, animated scroll reveal for sections and subtle button micro-animations.",
    styleTags: ["swiss", "hero", "left-aligned", "bold-typography", "animated-scroll"],
    layoutHints:
      "Hero uses large type (80–120px desktop), 2-column content on desktop, single column mobile, wide gutters, slow ease-in scroll reveals.",
    density: "low",
    examples: ["Vercel", "Stripe", "Nike"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
    label: "Sign Up Form",
    description:
      "Design a sign-up form in Swiss style: minimal fields, large labels, clear visual focus states, use of system fonts or neutral sans, clear spacing between fields, microcopy and inline validation with gentle animations.",
    styleTags: ["swiss", "form", "accessible", "minimal-fields", "focus-states"],
    layoutHints:
      "Vertical form with roomy spacing, labels above fields, 1.25–1.5x line-height, animated focus ring, primary CTA full-width on mobile, subtle success micro-interaction.",
    density: "low",
    examples: ["Notion", "Stripe"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.5 3.5C13.5 4.33 12.83 5 12 5S10.5 4.33 10.5 3.5 11.17 2 12 2s1.5.67 1.5 1.5z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19.74 5.826a3.756 3.756 0 00-1.616-3.573 3.733 3.733 0 00-3.91-.27L12 3l-2.214-1.017a3.733 3.733 0 00-3.91.27 3.756 3.756 0 00-1.616 3.573l.284 5.294C4.858 13.8 6.83 16.269 9.5 17.5l.5.5.5.5 1.5-1 1.5 1 .5-.5.5-.5c2.67-1.231 4.642-3.7 4.956-6.38l.284-5.294z"
        />
      </svg>
    ),
    label: "Mood Journal & Tracker",
    description:
      "Build a calm, grid-based tracker UI with Swiss styling: neutral palette, clear status indicators, roomy timeline cards, simple onboarding microinteractions and animated progress transitions.",
    styleTags: ["swiss", "calm", "grid-cards", "animated-transitions", "neutral-palette"],
    layoutHints:
      "Card grid with large gaps, subtle shadows or no shadows, animated progress bars with eased transitions, consistent 16/24 spacing rhythm.",
    density: "low",
    examples: ["Apple", "Stellar"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
        />
      </svg>
    ),
    label: "Interactive Story Game",
    description:
      "Design a minimal interactive-story layout: left rail for choices, large readable text body, strong negative space, animated reveal of new chapters with smooth scroll and micro-interactions for choices.",
    styleTags: ["swiss", "reading-first", "large-type", "choice-microinteractions", "animated-reveal"],
    layoutHints:
      "Single-column reading area with left-aligned progress indicator, large margins, subtle typography animations on reveal.",
    density: "low",
    examples: ["Notion", "Nike"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
        />
      </svg>
    ),
    label: "Recipe Finder & Meal Planner",
    description:
      "Create a clean card-driven recipe finder: large imagery cropped in strict rectangles, clear typography, filter controls as subtle toggles, animated card hover and inexpensive transitions.",
    styleTags: ["swiss", "card-grid", "image-cropping", "filters", "subtle-animations"],
    layoutHints:
      "Centered grid with strong baseline, images aligned to grid, 24–32px gutters, lightweight hover scale on cards.",
    density: "low",
    examples: ["Vercel", "Apple"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    label: "Personal Finance Dashboard",
    description:
      "Design a finance dashboard focusing on clarity: strict grid, numeric typography, concise charts, minimal color usage to indicate states, smooth transitions when numbers update.",
    styleTags: ["swiss", "data-clarity", "numeric-typography", "smooth-updates", "strict-grid"],
    layoutHints:
      "Dashboard uses cards with clear headings, consistent gutter rhythm, animated number changes with easing, low visual noise.",
    density: "low",
    examples: ["Stellar", "Stripe"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    label: "Travel Memory Map",
    description:
      "Create a travel memory map UI with Swiss minimalism: map as background with clear pins, oversized typography for titles, list of memories in a left column, smooth scroll and pinned header microinteractions.",
    styleTags: ["swiss", "map", "pins", "left-column", "pinned-header"],
    layoutHints:
      "Split layout: narrow left column list, wide map area; keep heavy whitespace around list items; animated pin reveal on scroll.",
    density: "low",
    examples: ["Apple", "Vercel"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
        />
      </svg>
    ),
    label: "AI Writing Assistant",
    description:
      "Design an editor-first interface with Swiss clarity: roomy text area, strong typographic rhythm, unobtrusive toolbars, contextual microinteractions and smooth autosave feedback.",
    styleTags: ["swiss", "editor", "typography", "autosave", "contextual-toolbar"],
    layoutHints:
      "Single-column editor, left margin for line numbers or progress, minimal toolbar icons, animated save indicator in top bar.",
    density: "low",
    examples: ["Notion", "Vercel"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    label: "Habit Streak Tracker",
    description:
      "Design a streak tracker with Swiss cleanness: calendar grid with large spacing, clear success/fail states using subtle accent, animated streak increments.",
    styleTags: ["swiss", "calendar-grid", "streak", "animated-increment", "subtle-accent"],
    layoutHints:
      "Grid with consistent cell size, 24px gutters, minimal legend, microinteractions on hover and check.",
    density: "low",
    examples: ["Apple", "Notion"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    label: "Newsletter Creator",
    description:
      "Create a minimal editor/preview for newsletters: clear column width for readable line length, typographic scale tuned for reading, publish microinteractions and preview toggles.",
    styleTags: ["swiss", "editor-preview", "readable-width", "publish-microinteractions"],
    layoutHints:
      "Fixed-width preview column centered, large margins, animated publish flow with confirmation microcopy.",
    density: "low",
    examples: ["Stripe", "Notion"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
        />
      </svg>
    ),
    label: "Music Discovery App",
    description:
      "Design a discovery UI with Swiss minimalism: large cover art cropped to grid, left-aligned lists, subtle animated transitions when switching playlists or tracks.",
    styleTags: ["swiss", "discovery", "cover-grid", "animated-transitions"],
    layoutHints:
      "Card or list layout with strong baseline, oversized headings for featured items, micro-interactions for play controls.",
    density: "low",
    examples: ["Nike", "Apple"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
    label: "3D Portfolio Viewer",
    description:
      "Create a minimal 3D portfolio shell: large whitespace, subtle controls, left or top-aligned captioning, graceful loading skeletons and animated transitions between models.",
    styleTags: ["swiss", "3d", "skeleton", "large-whitespace", "subtle-controls"],
    layoutHints:
      "Canvas centered or right, left column for metadata, full-bleed hero optionally, minimal UI chrome.",
    density: "low",
    examples: ["Stellar", "Vercel"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    label: "AI Image Generator",
    description:
      "Design a clean generator interface: large canvas preview, minimal controls, clear prompt area, progress micro-animations and result gallery in a strict grid.",
    styleTags: ["swiss", "canvas-first", "strict-grid", "preview", "progress-animations"],
    layoutHints:
      "Preview pane large and centered/right, commands on left, generated result grid with consistent ratios.",
    density: "low",
    examples: ["Vercel", "Notion"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    label: "Pomodoro Focus Timer",
    description:
      "Design a calm Pomodoro UI with Swiss clarity: large central timer, simple control buttons, subtle animations on session change and progress rings.",
    styleTags: ["swiss", "timer", "focus", "progress-ring", "calm"],
    layoutHints:
      "Centered hero timer, minimal chrome, subtle animated ring and microcopy for state changes.",
    density: "low",
    examples: ["Apple"],
  },
  {
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    label: "Virtual Avatar Builder",
    description:
      "Design an avatar builder with Swiss minimal UI: big preview, simple steps, clear progress and subtle microinteractions for customization toggles.",
    styleTags: ["swiss", "avatar", "preview-first", "progress", "minimal-ui"],
    layoutHints:
      "Preview large and centered, controls in compact left/right rail, consistent spacing and easy undo microinteractions.",
    density: "low",
    examples: ["Nike", "Stellar"],
  },
] as const;

export type InspirationPrompt = typeof INSPIRATION_PROMPTS_SWISS[number];
export default INSPIRATION_PROMPTS_SWISS;
