# This Day in History - Indian Heritage & Personalities

## Overview

This is a full-stack web application that provides daily historical facts focused on Indian heritage, culture, and notable personalities. The application generates and serves AI-powered historical facts for the current date, covering categories like independence movements, science and innovation, sports achievements, celebrity birthdays, political leaders, mathematics, and arts & literature. Users can explore different fact categories, refresh for new content, and share interesting discoveries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent design
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Custom CSS variables for theming with light/dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Language**: TypeScript for type safety across the entire stack
- **API Design**: RESTful API structure with Express route handlers
- **Development**: Hot module replacement via Vite integration
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon serverless PostgreSQL for cloud deployment
- **Schema Management**: Drizzle migrations for version-controlled database changes
- **In-Memory Caching**: Map-based caching system for facts and duplicate prevention
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL storage
- **User Storage**: In-memory user storage with UUID-based identification
- **Schema Validation**: Zod schemas for runtime type validation

### AI Integration Architecture
- **Primary Service**: Hugging Face API for AI-powered fact generation
- **Fallback Strategy**: Multiple prompt categories to ensure diverse content
- **Anti-Duplicate System**: Tracking used facts to prevent repetition
- **Caching Strategy**: 1-hour cache duration with daily cache resets
- **Error Handling**: Retry logic with graceful degradation

### Component Architecture
- **Design System**: Radix UI primitives with custom styling via class-variance-authority
- **Theme System**: Context-based theme provider with CSS custom properties
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: ARIA compliance through Radix UI components

### Development and Build Process
- **Development Server**: Vite dev server with HMR for frontend, tsx for backend
- **Build Process**: Vite for client bundling, esbuild for server compilation
- **Type Checking**: TypeScript compiler for static analysis
- **Code Organization**: Monorepo structure with shared types and utilities

## External Dependencies

### Core Runtime Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver for Neon database
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **express**: Web framework for the backend API server
- **@tanstack/react-query**: Server state management for React

### UI and Design Dependencies
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives
- **tailwindcss**: Utility-first CSS framework for rapid UI development
- **class-variance-authority**: Utility for creating type-safe component variants
- **clsx**: Conditional className utility for dynamic styling

### Development and Build Tools
- **vite**: Fast build tool and development server
- **@vitejs/plugin-react**: Vite plugin for React support
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution engine for development

### External Services
- **Hugging Face API**: AI service for generating historical facts
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit**: Development environment with integrated deployment

### Session and State Management
- **connect-pg-simple**: PostgreSQL session store for Express
- **wouter**: Minimalist routing library for React
- **react-hook-form**: Form state management with validation

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **nanoid**: URL-safe unique string ID generator
- **zod**: Runtime type validation and schema definition