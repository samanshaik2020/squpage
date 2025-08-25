# AI-Powered Template Generation Feature

## Overview
This feature implements AI-powered template generation for paid templates. When users select a paid template that uses AI generation, they are presented with a blank page and a modal asking what they want to generate.

## How It Works

### 1. Template Selection
- Users browse templates on the `/templates` page
- Paid AI templates are marked with a special "AI" badge
- The button text shows "Generate with AI" for premium templates

### 2. AI Generation Flow
When a user clicks on a paid AI template:

1. **Blank Page**: Shows a clean page with AI branding
2. **Generation Modal**: Popup appears asking for user input
3. **Loading Animation**: Shows AI generation progress with animated steps
4. **Generated Template**: Displays the AI-generated content in the editor

### 3. Supported AI Templates
- `ai-generated-blog-post`: Blog post generation
- `product-landing-page`: Product landing page generation  
- `ai-portfolio`: Portfolio website generation
- `ai-blog-page`: Blog website generation
- `ai-dental-health-landing`: Health product landing page

## Components

### AIGenerationModal (`components/editor/ai-generation-modal.tsx`)
- Collects user input for AI generation
- Different prompts based on template type
- Handles form submission and validation
- Shows loading state during generation

### AIGenerationLoading (`components/editor/ai-generation-loading.tsx`)
- Animated loading screen during AI generation
- Shows progress steps specific to each template type
- Engaging animations and progress indicators
- Template-specific messaging

### CarrdEditor Updates (`components/editor/carrd-editor.tsx`)
- Detects paid AI templates
- Shows blank page + modal for ungenerated templates
- Handles AI generation workflow
- Provides regeneration option after initial generation

## User Experience

1. **Template Discovery**: Clear AI badges and "Generate with AI" buttons
2. **Input Collection**: Contextual prompts based on template type
3. **Generation Feedback**: Engaging loading animation with progress steps
4. **Result**: Fully generated template ready for editing
5. **Regeneration**: Option to regenerate content with new input

## Technical Implementation

- State management for generation flow
- Modal and loading screen components
- Integration with existing AI generation API
- Responsive design for all screen sizes
- Error handling and fallback states

## Benefits

- **Clear Value Proposition**: Users understand they're getting AI-generated content
- **Engaging Experience**: Beautiful animations and progress feedback
- **Flexible Input**: Different prompts for different template types
- **Professional Results**: High-quality generated templates
- **Easy Regeneration**: Users can iterate on their content