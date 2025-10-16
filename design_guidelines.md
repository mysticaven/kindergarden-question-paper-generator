# Design Guidelines: Kindergarten Question Paper Maker

## Design Approach

**Selected Approach**: Design System (Material Design 3) + Playful Educational Elements

**Justification**: This educational productivity tool requires a clean, intuitive interface for educators while incorporating playful, child-friendly visual elements suitable for kindergarten content. Material Design 3 provides excellent form handling, clear hierarchy, and accessibility - perfect for educator workflows.

**Key Design Principles**:
- Professional efficiency for educators
- Playful, child-friendly aesthetics for preview content
- Clear visual hierarchy for complex workflows
- Instant feedback for AI generation processes

---

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Primary: 240 65% 55% (Soft educational blue)
- Primary Variant: 240 60% 65%
- Secondary: 45 90% 60% (Warm yellow for accents)
- Background: 210 20% 98%
- Surface: 0 0% 100%
- Success: 142 70% 45%
- Warning: 38 92% 50%

**Dark Mode**:
- Primary: 240 70% 65%
- Primary Variant: 240 60% 75%
- Secondary: 45 85% 65%
- Background: 220 15% 12%
- Surface: 220 15% 16%
- Text Primary: 210 15% 95%

### B. Typography

**Font Families**:
- Primary: 'Inter' (UI, forms, buttons) - Google Fonts
- Display: 'Fredoka' (headings, playful elements) - Google Fonts
- Monospace: 'JetBrains Mono' (code/curriculum input)

**Scale**:
- Display: text-5xl to text-6xl, font-bold (Fredoka)
- Headings: text-2xl to text-4xl, font-semibold (Inter)
- Body: text-base to text-lg (Inter)
- Small: text-sm (Inter)

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16 for consistent rhythm
- Compact spacing: p-2, gap-2 (form elements)
- Standard spacing: p-4, gap-4 (cards, sections)
- Generous spacing: p-8, gap-8 (main containers)
- Section breaks: py-12 to py-16

**Container Strategy**:
- Max-width: max-w-7xl for main content
- Form containers: max-w-3xl centered
- Preview area: max-w-6xl with overflow handling

### D. Component Library

**Core Navigation**:
- Top navigation bar with logo, active step indicator, and action buttons
- Breadcrumb trail showing: Curriculum → Questions → Preview → Export
- Sticky header on scroll with condensed view

**Input Components**:
- Large textarea for curriculum paste (rounded-xl, border-2, focus:ring-4)
- File upload dropzone with drag-and-drop (dashed border, hover state with bg-primary/5)
- Question type multi-select chips (rounded-full, interactive states)
- Number stepper for question count (large touch targets)

**Question Preview Cards**:
- Two-column grid layout (lg:grid-cols-2)
- Card design: rounded-2xl, shadow-lg, border
- Image placeholder with loading skeleton (aspect-square)
- Question text in Fredoka font, large and readable
- Edit/regenerate buttons per question (icon buttons, hover:bg-primary/10)

**Generation Controls**:
- Large primary CTA: "Generate Question Paper" (px-8 py-4, rounded-full, shadow-xl)
- Loading state with animated progress indicator
- AI generation status chips (generating image 1/10, animated pulse)

**PDF Preview & Export**:
- Split view: PDF preview (left 60%) + metadata panel (right 40%)
- Download button (fixed bottom-right, rounded-full, shadow-2xl)
- Print preview toggle
- Share options dropdown

### E. Animations

**Minimal, Purposeful Animations**:
- AI generation: Pulsing glow effect on cards being generated
- Success states: Subtle scale bounce (scale-105) on completion
- Page transitions: Fade-in with 200ms duration
- NO scroll-triggered or parallax effects

---

## Page-Specific Design

### Curriculum Input Page
- Clean, centered form layout (max-w-3xl)
- Prominent textarea with placeholder examples
- Quick templates sidebar (common kindergarten curricula)
- Upload alternative with file icon visualization

### Question Configuration
- Grid of question type cards (3 columns on desktop)
- Each card: Icon (Heroicons), title, brief description
- Selected state: border-primary, bg-primary/5
- Quick settings panel: question count, difficulty, image style

### Generation & Preview
- Masonry grid showing questions as they generate
- Real-time AI status indicator (top-right corner)
- Regenerate individual questions without losing others
- Bulk actions: Regenerate all, shuffle order

### Export Screen
- Full-page PDF preview with zoom controls
- Sidebar: Paper settings (size, margins, header/footer)
- One-click "Download & Print" primary action
- Save to library for reuse

---

## Images

**Hero Section**: Vibrant illustration showing diverse kindergarten children engaging with colorful educational materials (counting blocks, shapes, fruit illustrations). Should feel welcoming and energetic. Place at top of landing/home page, full-width, height: 60vh on desktop.

**Question Previews**: AI-generated images will be the primary visual content. Ensure consistent aspect ratio (1:1 square), rounded corners (rounded-xl), and loading states with animated skeleton screens.

**Empty States**: Friendly illustrations for empty curriculum input, no questions generated yet - use soft pastel colors matching the color palette.

---

## Accessibility & Dark Mode

- WCAG AA contrast ratios maintained in both modes
- All form inputs have visible focus rings (ring-4 ring-primary)
- Dark mode toggle in top-right navigation (sun/moon icon)
- Consistent dark mode for ALL inputs, textareas, and form fields
- High contrast mode option for text-heavy sections