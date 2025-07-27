# Modern Resume Application

## Overview

This is a full-stack web application built as a modern, mobile-first digital resume with a revolutionary swipeable tile interface. The application showcases professional information through an iOS-inspired design with intelligent mobile detection and reward-based user engagement. Mobile users enjoy a gamified swipe-through experience with a "Hire Me Now" reward at completion, while desktop users get traditional navigation. Built using React with TypeScript on the frontend, Express.js on the backend, and uses Drizzle ORM with PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Design**: iOS-inspired mobile-first interface with clean, card-based layouts
- **State Management**: React Query (TanStack Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for RESTful API
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: In-memory storage with planned database integration
- **API Design**: RESTful endpoints with JSON responses

### Revolutionary Mobile Interface
- **Intelligent Device Detection**: Accurate user agent detection to identify mobile devices and optimize experience
- **Swipeable Tile System**: Touch-optimized horizontal carousel with smooth gesture navigation
- **Reward-Based UX**: Gamified experience where users unlock a "Hire Me Now" button after viewing all sections
- **Transparency Effects**: Advanced backdrop blur and translucent overlays for modern iOS aesthetic
- **Progress Tracking**: Visual progress indicators and section completion tracking
- **Touch Gestures**: Native swipe left/right with desktop mouse fallback support

## Key Components

### Frontend Components
- **MobileHeader**: Sticky header with personal info and quick contact
- **NavigationTabs**: Horizontal tab navigation for different resume sections
- **Section Components**: Modular components for Summary, Experience, Projects, Skills, Education, and Contact
- **UI Components**: Complete shadcn/ui component library for consistent styling

### Backend Structure
- **Routes**: Express router handling API endpoints
- **Storage**: Abstracted storage interface with in-memory implementation
- **Database Schema**: User and resume data models with Drizzle ORM
- **Middleware**: Request logging and error handling

### Data Models
- **Users**: Basic user authentication structure
- **Resume Data**: JSON-based storage for flexible resume content including:
  - Personal information and contact details
  - Professional summary and current focus
  - Work experience with achievements
  - Projects with technologies and links
  - Skills categorized by type
  - Education and certifications

## Data Flow

### Client-Server Communication
1. React components fetch data through React Query
2. API requests use fetch with credential inclusion
3. Express routes handle requests and return JSON responses
4. Error handling with proper HTTP status codes

### Content Management
- Static JSON data currently serves resume content
- Planned migration to database-driven content
- Modular component structure allows easy data source switching

### State Management
- React Query manages server state and caching
- Local component state for UI interactions
- Toast notifications for user feedback

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Framework**: Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom iOS-inspired design tokens
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx, class-variance-authority for styling utilities

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM with Neon serverless PostgreSQL
- **Validation**: Zod for runtime type validation
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build**: Vite with React plugin and runtime error overlay
- **Database**: Drizzle Kit for migrations and schema management
- **TypeScript**: Strict configuration with path mapping
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Development Environment
- Vite dev server with HMR for frontend development
- tsx for backend TypeScript execution
- Integrated development with Replit-specific tooling

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: esbuild creates bundled Node.js application
- Static file serving through Express in production

### Database Strategy
- Currently using in-memory storage for development
- Configured for Neon PostgreSQL with connection pooling
- Drizzle migrations for schema management
- Environment variable configuration for database connections

### Hosting Considerations
- Designed for serverless deployment (Neon database)
- Static asset optimization through Vite
- Environment-specific configuration management
- Health check endpoints for monitoring