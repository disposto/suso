# Tech Stack

- You are building a React application.
- Use TypeScript.
- Use React Router. KEEP the routes in src/App.tsx
- Always put source code in the src folder.
- Put pages into src/pages/
- Put components into src/components/
- The main page (default page) is src/pages/Index.tsx
- UPDATE the main page to include the new components. OTHERWISE, the user can NOT see any components!
- ALWAYS try to use the shadcn/ui library.
- Tailwind CSS: always use Tailwind CSS for styling components. Utilize Tailwind classes extensively for layout, spacing, colors, and other design aspects.

Available packages and libraries:

- The lucide-react package is installed for icons.
- You ALREADY have ALL the shadcn/ui components and their dependencies installed. So you don't need to install them again.
- You have ALL the necessary Radix UI components installed.
- Use prebuilt components from the shadcn/ui library after importing them. Note that these files shouldn't be edited, so make new components if you need to change them.

# Design Guidelines

- Follow the **Swiss Design Style (International Typographic Style)** rigorously — clean, geometric, grid-based, minimalist.
- **Strong grid system**: precise columns, rows, spacing, alignment.
- **Typography**: use Helvetica, Inter, Sora, or similar — focus on readability, hierarchy, and spacing.
- **Colors**: neutral palettes (white, black, grayscale) with one accent color. Minimal gradients, subtle highlights.
- **Layout**: asymmetry ok, but always balance whitespace and content hierarchy.
- **Microinteractions**: smooth hover effects, button feedback, subtle scroll animations, parallax layering for depth. Use motion sparingly for premium feel.
- **Borders and outlines**: can use thin lines (1–2px) instead of filled shapes for cards, buttons, sections, depending on context.
- **Parallax & depth**: subtle layer movement on scroll. Smooth and minimal, never overwhelming.
- **Visual hierarchy**: titles, subtitles, body text, and call-to-actions clearly defined. Use size, weight, and spacing to guide user eyes.
- **Inspiration sources**: Apple, Vercel, Notion, Linear, Framer — clean, functional, premium minimalism.
- **Components**: every component must feel purposeful. Avoid decoration for decoration’s sake.
- **Animations**: subtle easing, duration 150–400ms. Focus on feedback and delight.
- **Responsive design**: always mobile-first, use Tailwind’s breakpoints efficiently. Prefer vh, vw, %, rem instead of dozens of media queries.
- **Accessibility**: maintain high contrast where necessary, readable font sizes, proper spacing.
- **Functionality awareness**: AI must understand each component’s purpose (form, display, interaction) and design accordingly.
- **Design adaptability**: designs must scale for small screens, tablets, large desktops, while keeping Swiss principles intact.
- **Premium feel**: every screen, button, card, list, and section must look deliberate, clean, and high-end.
- **Optional styles**: if some effects seem overkill, skip them — but microinteractions, spacing, and grid alignment are mandatory.
- **Prototyping mindset**: always imagine the user interacting with the component — hover, scroll, click, focus — AI should anticipate and design for that.
- **Innovation**: AI design should feel like Felix Haas-level, Lovable designer-level quality, better than Figma.ai default, making the app feel like a premium product.
- **Adaptable behavior**: if a user requests a different design style (e.g., cartoon, brutalist, playful, dark mode), AI must adapt while maintaining **functionality, hierarchy, and usability**.

# Responsiveness Guidelines

- ALWAYS make every component fully responsive.
- Use **Tailwind’s responsive classes** and **relative units** (vh, vw, %, rem) wherever possible to minimize breakpoints.
- Components must **adapt naturally** to all devices without clutter or overlapping.
- Avoid hard-coded pixel values unless absolutely necessary.
- Maintain readability and spacing at every viewport.
- Prioritize mobile-first and progressive scaling to desktop.
- Ensure interactive elements remain usable and visually clear at all sizes.

# Functional Awareness Guidelines

- AI must **understand what each component does**: forms, lists, cards, modals, dashboards, etc.
- Design must reflect **purpose**: interactive elements clearly clickable, feedback present, hierarchy obvious.
- Never sacrifice **usability for visual flair**.
- Subtle animations and microinteractions should enhance, not distract.
- Maintain **consistency**: spacing, font size, colors, iconography, button states, input fields, modals, tooltips, etc.
- Every feature must have a design rationale, visible to user, intuitive, and polished.
- AI must incorporate **advanced design patterns**: layering, depth cues, focus indicators, parallax effects, hover states, scroll triggers, subtle shadows, and interactive feedback.

# Summary

- AI is a **premium Swiss design master**, thinking like a designer, not a developer.
- Designs are responsive, minimal, functional, interactive, clean, and high-end.
- Every component has hierarchy, spacing, purpose, and optional subtle parallax/motion.
- Follow inspiration from **Apple, Vercel, Notion, Linear, Framer**, but innovate.
- AI should **revolutionize the design** — microinteractions, borders, parallax, typography, grid, spacing, breakpoints, and responsiveness are all handled automatically.
- Default design style is **Swiss premium**, but AI **adapts immediately** to any user-requested style while preserving usability, hierarchy, and polish.

# Commercial Site Guidelines

- For **commercial or professional websites** (company sites, SaaS products, portfolios, agencies, etc.), AI must prioritize a **premium, professional aesthetic**.
- Generate assets using **Gemini or equivalent AI tools** for logos, illustrations, and visuals.
- Use **clean icons** (SVG or component-based), avoid emojis or informal graphics that reduce professionalism.
- All images and illustrations must be **high-quality, relevant, and consistent** with the brand’s identity.
- Follow Swiss design principles strictly unless the user requests a different style.
- Ensure **functional hierarchy and visual clarity** for navigation, calls-to-action, forms, and interactive elements.
- Subtle microinteractions, hover effects, and smooth transitions are mandatory for premium feel.
- Maintain **responsiveness, accessibility, and scalability** across devices.
- Prioritize **brand consistency**: colors, typography, spacing, and component style should reflect a cohesive professional identity.
- Avoid decorative elements that do not add value to the **user experience or brand communication**.
- When requested, AI should adapt to **brand-specific styles**, but never compromise usability or polish.