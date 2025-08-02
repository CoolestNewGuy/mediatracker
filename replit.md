# MediaTracker

## Overview

This is a comprehensive media tracking platform with gamification features designed to help users manage and track their entertainment consumption. The platform focuses on six main media types (Anime, Manhwa, Pornhwa, Novels, Movies, and TV Shows) with a modern, visually appealing UI. The application provides comprehensive tracking capabilities with progress monitoring, statistics, achievements with leaderboards, and a points/coins system with daily login rewards. Key features include Google login integration, right-click context menus, user profiles with nickname editing, and a wider UI design (1600px max-width) for broader appeal.

## User Preferences

Preferred communication style: Simple, everyday language.
Main media focus: Movies, TV Shows, Anime, Books/Manga (primary), with additional extensible categories
Preferred AI: Claude for non-invasive guidance
Domain: CoolestNewGuy.xyz
Interface preference: Catalog view over random picker for browsing content
Streaming integration: Netflix, Prime Video, and other major providers (planned)
Authentication: Simplified for development (Replit Auth removed for GitHub transition 2025-01-02)

### GitHub Transition (2025-01-02)
- Project prepared for GitHub repository with comprehensive documentation
- All authentication simplified to demo mode for easier deployment
- Enhanced context menus with platform-specific links implemented
- Ready for production deployment on multiple platforms

### Development Focus (Updated 2025-01-02)
- **Practical over fancy**: Focus on working functionality with every button working
- **Performance first**: Optimize images, add pagination, proper indexing
- **Real APIs**: Use AniList (no key needed), TMDB (free key), avoid mock data
- **Keyboard shortcuts**: A (add), L (library), Space (quick update), / (search), ? (help)
- **Quick operations**: Bulk select, fuzzy search, smart continue watching, right-click context menus
- **Import/Export**: Support MAL XML, AniList JSON, Goodreads CSV formats
- **Gamification**: Points/coins system, daily login rewards (20→30→50→100→150→200→300), achievements with leaderboards
- **UI Design**: Wider layout (1600px max-width) with gradient purple/pink branding, image-filled squares in Currently Watched section

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
- **Primary Database**: PostgreSQL with tables for users, media items, achievements, user statistics, sessions, and dailyLoginRewards
- **Schema Design**: Normalized schema with support for multiple media types, flexible progress tracking, and Replit Auth integration
- **User Management**: Automatic user creation/update via OpenID Connect claims with profile data storage, points tracking, and nickname support
- **Session Storage**: PostgreSQL-backed session store with automatic cleanup and secure cookie management
- **Connection**: Neon serverless PostgreSQL with WebSocket support for optimal performance
- **Migrations**: Drizzle Kit for schema migrations and database versioning
- **Gamification Storage**: Daily login rewards tracking with weekly cycles, user points system, achievement unlocking with timestamps

### Authentication and Authorization
- **Session Management**: Replit Auth implementation with secure session handling using PostgreSQL session store
- **Authentication Provider**: OpenID Connect via Replit for seamless user authentication
- **Session Storage**: Database-backed sessions with 7-day TTL and automatic refresh token handling
- **Authorization**: User-scoped data access with userId filtering on all media operations
- **User Interface**: Landing page for unauthenticated users, dashboard for authenticated users
- **Security**: All API routes protected with authentication middleware, proper error handling for unauthorized access

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