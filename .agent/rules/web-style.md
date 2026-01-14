---
trigger: model_decision
description: when design ui style
---

<role>
Integrating a design system into an existing codebase requires a balance between visual rigor and technical pragmatism

Before proposing or writing any code, first build a clear mental model of the current system:

- Identify the tech stack (e.g. React, Next.js, Vue, Tailwind, shadcn/ui, etc.).
- Understand the existing design tokens (colors, spacing, typography, radii, shadows), global styles, and utility patterns.
- Review the current component architecture (atoms/molecules/organisms, layout primitives, etc.) and naming conventions.
- Note any constraints (legacy CSS, design library in use, performance or bundle-size considerations).

Ask the user focused questions to understand the user's goals. Do they want:

- a specific component or page redesigned in the new style,
- existing components refactored to the new system, or
- new pages/features built entirely in the new style?

Once you understand the context and scope, do the following:

- Propose a concise implementation plan that follows best practices, prioritizing:
  - centralizing design tokens (using CSS variables for efficient Light/Dark mode switching),
  - reusability and composability of components,
  - minimizing duplication and one-off styles,
  - long-term maintainability and clear naming.
- When writing code, match the user’s existing patterns (folder structure, naming, styling approach, and component patterns).
- Explain your reasoning briefly as you go, so the user understands _why_ you’re making certain architectural or design choices.

Always aim to:

- Preserve or improve accessibility (APCA/WCAG contrast ratios in both modes).
- Maintain visual consistency with the provided design system.
- Leave the codebase in a cleaner, more coherent state than you found it.
- Ensure layouts are responsive and usable across devices.
- Make deliberate, creative design choices (layout, motion, interaction details, and typography) that express the design system’s personality instead of producing a generic or boilerplate UI.
  </role>

<design-system>
# Design Style: Material You (Material Design 3) - Adaptive Light & Dark

## Design Philosophy

**Core Principles**: Personal, adaptive, and spirited. Material You (MD3) represents a shift from Material Design 2's rigid "paper and ink" metaphor to a more organic, expressive system. The design extracts color palettes from seed colors, emphasizes tonal surfaces, and ensures comfort in both high-light and low-light environments.

**Vibe**: Friendly, soft, rounded, colorful, and personal. The aesthetic feels modern yet approachable. In Dark Mode, it shifts from "airy and bright" to "deep and glowing," maintaining the same organic shapes but using lower luminance backgrounds to reduce eye strain while keeping vibrant accents.

**Enhanced Implementation Details**:
This implementation goes beyond the baseline Material Design 3 specifications by incorporating:

- **Layered depth**: Blur shapes and radial gradients create atmospheric backgrounds (subtle in Dark Mode).
- **Rich micro-interactions**: Hover states include scale transforms, shadow elevations (Light) or brightness shifts (Dark).
- **Asymmetric elevation**: Featured cards use vertical translation to create visual hierarchy.
- **Progressive disclosure**: Elements reveal depth on interaction.
- **Tactile feedback**: All interactive elements include active:scale-95 for press feedback.

## Design Token System (The DNA)

**Implementation Strategy**: Use CSS Variables (e.g., `--color-surface`, `--color-primary`) mapped to Tailwind config to handle mode switching seamlessly.

### Colors (Adaptive System)

Derived from Seed Color: **Purple/Violet** (#6750A4).

| Token                      | Light Mode Value (Hex)     | Dark Mode Value (Hex)               | Usage/Role                                                          |
| :------------------------- | :------------------------- | :---------------------------------- | :------------------------------------------------------------------ |
| **Background**             | `#FFFBFE` (Warm off-white) | `#141218` (Darkest charcoal)        | The absolute base layer. Never use pure black `#000000`.            |
| **On Background**          | `#1C1B1F` (Near black)     | `#E6E1E5` (Off-white)               | Text and icons on background.                                       |
| **Surface**                | `#FFFBFE`                  | `#141218`                           | Base surface color.                                                 |
| **Surface Container**      | `#F3EDF7` (Lavender tint)  | `#211F26` (Dark Grey + Violet tint) | Default card/container background.                                  |
| **Surface Container Low**  | `#E7E0EC`                  | `#1D1B20`                           | Inputs, muted areas.                                                |
| **Surface Container High** | `#ECE6F0`                  | `#2B2930`                           | Modals, elevated cards.                                             |
| **Primary**                | `#6750A4` (Deep Purple)    | `#D0BCFF` (Pastel Violet)           | **Crucial**: Dark mode primary is lighter/desaturated for contrast. |
| **On Primary**             | `#FFFFFF` (White)          | `#381E72` (Deep Indigo)             | Text on Primary button.                                             |
| **Secondary Container**    | `#E8DEF8`                  | `#4A4458`                           | Pills, chips, active states.                                        |
| **On Sec. Container**      | `#1D192B`                  | `#E8DEF8`                           | Text on Secondary Container.                                        |
| **Tertiary**               | `#7D5260`                  | `#EFB8C8`                           | Accents, FABs.                                                      |
| **Outline (Border)**       | `#79747E`                  | `#938F99`                           | Borders, dividers.                                                  |

**Color Relationship Rules**:

- **Dark Mode Primary**: Note that Primary changes from Deep Purple to Pastel Violet. This prevents eye strain and vibration against dark backgrounds.
- **Elevation in Dark Mode**: Do not rely on shadows. Use lighter surface colors to indicate elevation (e.g., Surface Container High is lighter than Surface Container).
- **Transparency**: On colored backgrounds, use white/black opacity overlays.
  - Light Mode: `bg-black/5` or `bg-primary/5`
  - Dark Mode: `bg-white/5` or `bg-primary/10`

### Typography

**Font Family**: **Roboto** (Google Fonts)

- Weights: 400 (Regular), 500 (Medium), 700 (Bold)

**Type Scale**:

- **Display Large**: 3.5rem / 56px
- **Headline Large**: 3rem / 48px
- **Title Large**: 1.5rem / 24px (Card titles)
- **Body Large**: 1.25rem / 20px
- **Body Medium**: 1rem / 16px
- **Label Medium**: 0.875rem / 14px (Button text)

**Dark Mode Typography Adjustments**:

- Ensure text contrast passes WCAG AA/AAA.
- Slightly relax font-weight if text looks too bold due to light bleed on dark backgrounds (optional, usually Roboto is fine).
- Muted text in Dark Mode should use `#CAC4D0` (On Surface Variant), never pure grey.

### Radius & Borders

**Radius Values**:

- **Small**: `12px` (Inputs)
- **Medium**: `16px`
- **Large**: `24px` (Cards)
- **Extra Large**: `48px` (Hero, Large Containers)
- **Full**: `9999px` (Buttons, Pills)

**Borders**:

- **Light Mode**: Use sparingly.
- **Dark Mode**: Use more frequently to define edges since shadows are invisible.
- **Glass/Translucent**: `border-white/10` is excellent for Dark Mode cards to create subtle separation.

### Shadows, Elevation & Glows

**Philosophy**:

- **Light Mode**: Uses **Shadows** (`shadow-sm`, `shadow-md`) + Tonal Surfaces.
- **Dark Mode**: Uses **Surface Lightness** + **Subtle Borders** + **Glows**. Shadows are ineffective.

**Elevation System**:

1. **Level 0 (Base)**: Background color.
2. **Level 1 (Default Card)**:
   - Light: `shadow-sm`, Surface Container color.
   - Dark: Surface Container color, `border border-white/5` (optional).
3. **Level 2 (Hover/Active)**:
   - Light: `shadow-md`, Scale up.
   - Dark: Lighter Surface (overlay white/5), Scale up, potential subtle glow (`shadow-[0_0_15px_rgba(208,188,255,0.1)]`).

**Atmospheric Effects (The "Bold" Factor)**:

- **Blur Shapes**:
  - Light: Colored blobs (Primary/Tertiary) at 10-20% opacity, `blur-3xl`.
  - Dark: Colored blobs must be more opaque (15-25%) but darker colors, or use the Light Mode Primary color at very low opacity (5-10%) to create a "nebula" effect.
- **Glass-morphism**:
  - Light: `bg-white/50 backdrop-blur-md`
  - Dark: `bg-[#141218]/60 backdrop-blur-md border border-white/10`

### Component Styling Principles

#### Buttons (Pill-Shaped)

- **Structure**: Always `rounded-full`.
- **Primary Button**:
  - Light: `bg-[#6750A4] text-white`
  - Dark: `bg-[#D0BCFF] text-[#381E72]` (Note the text color inversion!)
- **Hover States**:
  - Light: Overlay black/10.
  - Dark: Overlay white/10 or brightness boost.
- **Active State**: `scale-95` on both modes.

#### Inputs (Material 3 Filled)

- **Style**: Rounded top (`rounded-t-lg`), square bottom, bottom border only.
- **Background**:
  - Light: Surface Container Low (`#E7E0EC`).
  - Dark: Surface Container Low (`#1D1B20`).
- **Border**:
  - Base: Outline color.
  - Focus: Primary color (Light: Purple, Dark: Pastel Violet).

#### Interactive States (State Layers)

Instead of changing the base color hex, use opacity layers.

1. **Hover**:
   - Light: `bg-primary/10` or `bg-black/10`
   - Dark: `bg-primary/10` or `bg-white/10`
2. **Focus**:
   - Ring Color: Primary (Adaptive).
   - `focus-visible:ring-2 focus-visible:ring-offset-2`
   - **Important**: Dark mode ring offset should match dark background (`ring-offset-[#141218]`).

## Layout & "Bold" Factors

1.  **Organic Blur Shapes**: Essential for the MD3 vibe. In Dark Mode, these look like glowing auras or nebulae behind content.
2.  **Tonal Surfaces**: Never use pure black/white. The hierarchy must be maintained via surface tones.
3.  **Asymmetric Elevation**: `md:-translate-y-4` works in both modes to create hierarchy.
4.  **Micro-Interactions**:
    - `group-hover:scale-[1.02]`
    - Transitions: `duration-300 ease-[cubic-bezier(0.2,0,0,1)]`

## Anti-Patterns (What to Avoid)

**Don't:**

- ❌ Use pure black `#000000` in Dark Mode (causes smearing on OLEDs and harsh contrast).
- ❌ Use the Light Mode Primary color (`#6750A4`) for text/buttons in Dark Mode (contrast failure). Use the Pastel variant (`#D0BCFF`).
- ❌ Rely solely on shadows for depth in Dark Mode (they disappear). Use surface lightness or borders.
- ❌ Invert colors blindly (e.g., turning a light shadow into a dark glow indiscriminately).
- ❌ Forget to update the `ring-offset-color` in Dark Mode (creates a white halo around focused elements).

---

## Implementation Checklist

**Core System**:

- [ ] **CSS Variables Setup**: Define primitives (`--color-md-sys-primary`, etc.) that switch values based on `.dark` class or system preference.
- [ ] **Backgrounds**: Ensure base is `#FFFBFE` (Light) and `#141218` (Dark).
- [ ] **Typography**: Verify text contrast in Dark Mode (Primary text should be Pastel Violet).

**Components**:

- [ ] **Buttons**: Check `rounded-full`. Verify Primary Button text color is dark (`#381E72`) when in Dark Mode (on pastel background).
- [ ] **Cards**: Verify Surface Container colors. Dark mode cards should be slightly lighter than the background (`#211F26`).
- [ ] **Inputs**: Filled style. Check placeholder text contrast in Dark Mode.

**Interactions & FX**:

- [ ] **Hover**: Verify `white/10` overlay in Dark Mode vs `black/10` in Light Mode.
- [ ] **Active**: `scale-95` works in both.
- [ ] **Blur/Glow**: Ensure background blur shapes are visible but not overwhelming in Dark Mode.
- [ ] **Borders**: Add `border-white/5` or `border-white/10` to Dark Mode cards if separation is poor.

</design-system>
