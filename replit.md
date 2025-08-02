# Media Tracker

## Overview

This is a personal media tracking platform designed to help users manage and track their entertainment consumption. The platform focuses on four main media types (Movies, TV Shows, Anime, and Books/Manga) with extensible support for additional categories like novels, manhwa, manhua, pornhwa, etc. The application provides comprehensive tracking capabilities with progress monitoring, statistics, achievements, and planned AI guidance using Claude. Future features include streaming service integration (Netflix, Prime, etc.) and deployment to CoolestNewGuy.xyz domain.

## User Preferences

Preferred communication style: Simple, everyday language.
Main media focus: Movies, TV Shows, Anime, Books/Manga (primary), with additional extensible categories
Preferred AI: Claude for non-invasive guidance
Domain: CoolestNewGuy.xyz
Interface preference: Catalog view over random picker for browsing content
Streaming integration: Netflix, Prime Video, and other major providers (planned)

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript running on Vite for fast development and optimized builds
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with custom dark theme and CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for REST API endpoints
- **Database ORM**: Drizzle ORM for type-safe database operations and migrations
- **Database**: PostgreSQL (configured for Neon serverless) with connection pooling
- **API Design**: RESTful endpoints with JSON responses and error handling middleware
- **Development**: Hot reloading with Vite integration for seamless development experience

### Data Storage Solutions
- **Primary Database**: PostgreSQL with tables for users, media items, achievements, and user statistics
- **Schema Design**: Normalized schema with support for multiple media types and flexible progress tracking
- **Connection**: Neon serverless PostgreSQL with WebSocket support for optimal performance
- **Migrations**: Drizzle Kit for schema migrations and database versioning

### Authentication and Authorization
- **Session Management**: Basic user session handling (currently using demo user for development)
- **Future Implementation**: Designed to support proper authentication with user registration/login
- **Authorization**: User-scoped data access with userId filtering on all media operations

### External Dependencies
- **UI Framework**: Radix UI primitives for accessible, unstyled components
- **Database**: Neon PostgreSQL serverless database with WebSocket connections
- **Validation**: Zod for runtime type validation and schema definition
- **Development Tools**: ESBuild for production builds, TSX for development server
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and formatting

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with automatic scaling and connection pooling
- **Replit Environment**: Development and hosting platform with integrated tooling

### Development Dependencies
- **Vite**: Build tool and development server with HMR and optimized bundling
- **TypeScript**: Type safety across the entire application stack
- **Drizzle Kit**: Database migration tool and schema management

### UI/UX Libraries
- **Radix UI**: Comprehensive component library for accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Feather-inspired icon library

### Data Management
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **Zod**: Schema validation for API inputs and type safety
- **React Hook Form**: Form management with validation integration

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx/tailwind-merge**: Conditional className utilities
- **class-variance-authority**: Type-safe variant API for components