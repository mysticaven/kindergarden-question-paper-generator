# Kindergarten Question Paper Maker

## Overview

This is a web application designed to help educators create engaging kindergarten question papers with template-based content generation. The system allows teachers to input curriculum details, select question types, and automatically generate age-appropriate questions (for ages 4-6) with accompanying images. The application features a multi-step workflow from curriculum input to PDF/Word export, with customizable exam paper headers including school branding - all without using paid APIs.

The core functionality centers around:
- Template-based question generation with authentic kindergarten question patterns
- Custom image upload functionality for visual learning
- Multiple question types (counting, comparison, colors, shapes, numbers, patterns)
- Customizable exam paper templates matching real kindergarten worksheets
- PDF and Word document export capabilities
- Professional header fields (Academic Session, Class/Division, Topic, etc.)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool

**Routing**: Wouter for lightweight client-side routing

**UI Framework**: Radix UI primitives with shadcn/ui component system
- Material Design 3 inspired design system
- Custom theme system supporting light/dark modes via CSS variables
- Playful educational aesthetic using Fredoka font family for headings
- Professional Inter font for UI elements

**State Management**:
- React Query (TanStack Query) for server state management
- Local component state for UI interactions
- No global state management library (Redux/Zustand) - kept simple

**Styling Approach**:
- Tailwind CSS with custom design tokens
- CSS variables for theming (supports light/dark mode)
- Custom color palette focused on educational context (soft blues, warm yellows)
- Responsive design with mobile-first approach

**Component Structure**:
- Feature-based component organization
- Reusable UI components in `/components/ui`
- Feature components in `/components` (CurriculumInput, QuestionCard, etc.)
- Example components for development/testing in `/components/examples`

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Design**: RESTful API endpoints
- `/api/generate-questions` - Main endpoint for template-based question generation
- `/api/upload-image` - Custom image upload for questions
- `/api/export-word` - Word document export

**Development Server**: Vite middleware integration for HMR in development

**Storage Layer**: In-memory storage implementation (MemStorage class)
- Designed with interface (IStorage) for easy migration to persistent storage
- Currently stores users and question papers in Map structures
- Uses randomUUID for ID generation

**Database Preparation**:
- Drizzle ORM configured for PostgreSQL (via Neon serverless)
- Schema defined but not actively used (storage is in-memory)
- Migration setup ready for database integration
- User and exam paper schemas defined in shared/schema.ts

### External Dependencies

**Question Generation**:
- Template-based system using predefined kindergarten question patterns
- No paid APIs required - completely free to use
- Authentic question formats matching real kindergarten worksheets (Q. prefix, "Circle the...", "Match the...", "Fill in the blanks")
- Uses Picsum Photos for placeholder images (free service)

**Key Libraries**:
- `@tanstack/react-query` - Server state management
- `drizzle-orm` & `@neondatabase/serverless` - Database ORM (configured but not active)
- `zod` - Schema validation for API requests/responses
- `react-hook-form` with `@hookform/resolvers` - Form handling
- `wouter` - Lightweight routing
- `date-fns` - Date manipulation
- `multer` - File upload handling for custom images
- `docx` - Word document generation

**UI Component Libraries**:
- Radix UI primitives (@radix-ui/*) - Accessible component primitives
- Embla Carousel - Carousel functionality
- Lucide React - Icon system

**Development Tools**:
- TypeScript for type safety
- Vite for fast builds and HMR
- ESBuild for production bundling
- PostCSS with Autoprefixer for CSS processing

**Fonts** (Google Fonts):
- Fredoka - Display and playful elements
- Inter - Primary UI font
- JetBrains Mono - Code/monospace elements

**Notable Architecture Decisions**:

1. **Hybrid Storage Strategy**: Currently uses in-memory storage with an abstraction layer (IStorage interface) that allows seamless migration to PostgreSQL when needed. Drizzle ORM is configured but not actively used.

2. **Monorepo Structure**: Shared schema definitions between client and server in `/shared` directory, enabling type-safe API contracts.

3. **Free Template-Based Generation**: No paid APIs required. Uses predefined templates with authentic kindergarten question patterns based on real worksheets. Picsum Photos provides free placeholder images.

4. **Custom Image Upload**: Multer-based file upload system with validation (5MB limit, image types only). Uses shared `apiUpload` helper for consistent networking.

5. **Dual Export Formats**: Both PDF (browser print) and Word document export using the `docx` library. Headers and formatting match professional kindergarten worksheets.

6. **Authentic Question Paper Format**: Headers include all standard fields from real kindergarten worksheets (Academic Session, Class/Division, Topic, School Name, Logo, etc.). Questions use authentic patterns like "Q. Circle the...", "Match the following...", "Fill in the blanks...".

7. **Progressive Enhancement**: Multi-step form workflow (curriculum → question types → exam details → generation → preview) with state management at component level.

8. **Print-Optimized Output**: PDF preview component designed for direct browser printing with print-specific CSS styling.

9. **Theme System**: Comprehensive CSS variable-based theming supporting both educational (playful) and professional aesthetics with full light/dark mode support.

## Recent Updates (October 2025)

- **Migrated from OpenAI to free templates**: Removed all paid API dependencies. Now uses predefined question templates that match real kindergarten worksheet patterns.
- **Added image upload feature**: Teachers can upload custom images for any question using the Upload button on question cards.
- **Added Word export**: Questions can now be exported to both PDF (via print) and Word document (.docx) format.
- **Enhanced header fields**: Added Academic Session, Class/Division, and Topic fields to match authentic kindergarten worksheet formats.
- **Improved question templates**: Questions now use professional patterns from real kindergarten papers (Q. prefix, Circle/Match/Fill instructions).