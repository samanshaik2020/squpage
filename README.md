# Squpage - Website Builder Platform

## Overview

Squpage is a modern website builder platform built with Next.js, React, TypeScript, and Tailwind CSS. It features two distinct editing experiences:

1. **Template Editor**: A simplified editor for creating websites from pre-designed templates
2. **Elementor-inspired Editor**: A drag-and-drop page builder with advanced elements and styling options

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS, Shadcn UI components
- **State Management**: React Context API

## Database Architecture

The application uses Supabase as its database backend with the following tables:

### Projects Table

Stores the main project metadata:

- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to auth.users)
- `name`: String
- `description`: String
- `type`: String (Template or Elementor)
- `template_id`: String (for template-based projects)
- `status`: String (draft, published)
- `settings`: JSON
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Project Elements Table

Stores the elements that make up each project:

- `id`: UUID (primary key)
- `project_id`: UUID (foreign key to projects)
- `element_id`: String (unique ID within the project)
- `type`: String (heading, text, image, etc.)
- `content`: JSON
- `styles`: JSON
- `parent_id`: String (for nested elements)
- `position`: Integer
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Analytics Events Table

Tracks user interactions with published websites:

- `id`: UUID (primary key)
- `project_id`: UUID (foreign key to projects)
- `event_type`: String (view, click, form_submit, etc.)
- `event_data`: JSON
- `ip_address`: String
- `user_agent`: String
- `referrer`: String
- `created_at`: Timestamp

### Form Submissions Table

Stores form submissions from published websites:

- `id`: UUID (primary key)
- `project_id`: UUID (foreign key to projects)
- `form_data`: JSON
- `source`: String
- `ip_address`: String
- `user_agent`: String
- `created_at`: Timestamp

## Data Flow

1. **Project Creation/Editing**:
   - User creates/edits a project in the UI
   - Changes are sent to API routes
   - API routes use `projectsStore` methods to save to Supabase
   - Elements are saved separately in the project_elements table

2. **Project Loading**:
   - UI requests project data from API routes
   - API routes fetch data from Supabase using `projectsStore`
   - Project and its elements are returned to the UI

3. **Analytics & Form Submissions**:
   - Tracked via API routes that save to Supabase
   - Dashboard retrieves analytics data for visualization

## Environment Variables

The following environment variables are required:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install` or `pnpm install`
3. Set up environment variables
4. Run the development server: `npm run dev` or `pnpm dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Files

- `lib/projects-store.ts`: Core logic for project CRUD operations with Supabase
- `lib/supabase.ts`: Supabase client configuration
- `lib/supabase-auth.ts`: Authentication services
- `lib/supabase-analytics.ts`: Analytics tracking and reporting
- `app/api/*`: API routes for data operations
- `components/editor/*`: Template editor components
- `components/elementor/*`: Elementor-inspired editor components

## Authentication

The application uses Supabase Authentication with email/password and social login options. All database operations verify the authenticated user before proceeding.
