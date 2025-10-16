# Kindergarten Question Paper Maker

## Overview

This is a web application designed to help educators create engaging kindergarten question papers with AI-generated content. The system allows teachers to input curriculum details, select question types, and automatically generate age-appropriate questions (for ages 4-6) with accompanying images. The application features a multi-step workflow from curriculum input to PDF export, with customizable exam paper headers including school branding.

The core functionality centers around:
- AI-powered question generation based on curriculum input
- Automatic image generation for visual learning
- Multiple question types (counting, comparison, colors, shapes, numbers, patterns)
- Customizable exam paper templates with school branding
- PDF export and print capabilities

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
- `/api/generate-questions` - Main endpoint for question generation

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

**AI Services**:
- OpenAI GPT-4o for question generation
- Configured for creating age-appropriate kindergarten content
- Uses structured JSON responses for question data
- Image generation prompts included in question structure (not yet implemented)

**Key Libraries**:
- `@tanstack/react-query` - Server state management
- `drizzle-orm` & `@neondatabase/serverless` - Database ORM (configured but not active)
- `zod` - Schema validation for API requests/responses
- `react-hook-form` with `@hookform/resolvers` - Form handling
- `wouter` - Lightweight routing
- `date-fns` - Date manipulation
- `cmdk` - Command menu component

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

3. **AI-First Generation**: OpenAI integration is central to the application, handling both question text generation and image prompt creation (image generation to be implemented).

4. **Progressive Enhancement**: Multi-step form workflow (curriculum → question types → exam details → generation → preview) with state management at component level.

5. **Print-Optimized Output**: PDF preview component designed for direct browser printing with print-specific CSS styling.

6. **Theme System**: Comprehensive CSS variable-based theming supporting both educational (playful) and professional aesthetics with full light/dark mode support.