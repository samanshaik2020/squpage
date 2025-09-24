// Theme system for pro templates
// Defines 5 distinct themes that can be applied to templates

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  heading: string;
  button: {
    background: string;
    text: string;
    hover: string;
  };
  card: {
    background: string;
    border: string;
  };
  footer: {
    background: string;
    text: string;
  };
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  fontSize: {
    base: string;
    heading1: string;
    heading2: string;
    heading3: string;
  };
}

export interface ThemeStyles {
  borderRadius: string;
  boxShadow: string;
  buttonStyle: 'rounded' | 'pill' | 'square' | 'minimal' | 'gradient';
  cardStyle: 'flat' | 'raised' | 'bordered' | 'floating';
  spacing: {
    section: string;
    element: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  styles: ThemeStyles;
  previewImage?: string;
}

// Define 5 distinct themes
export const themes: Theme[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean, minimalist design with ample white space and subtle accents',
    previewImage: '/themes/modern-minimal.jpg',
    colors: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#EAB308',
      background: '#FFFFFF',
      text: '#1F2937',
      heading: '#111827',
      button: {
        background: '#3B82F6',
        text: '#FFFFFF',
        hover: '#2563EB'
      },
      card: {
        background: '#FFFFFF',
        border: '#E5E7EB'
      },
      footer: {
        background: '#F9FAFB',
        text: '#6B7280'
      }
    },
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      fontSize: {
        base: '16px',
        heading1: '3rem',
        heading2: '2.25rem',
        heading3: '1.5rem'
      }
    },
    styles: {
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      buttonStyle: 'rounded',
      cardStyle: 'flat',
      spacing: {
        section: '5rem',
        element: '1.5rem'
      }
    }
  },
  {
    id: 'bold-vibrant',
    name: 'Bold & Vibrant',
    description: 'Eye-catching design with vibrant colors and strong contrast',
    previewImage: '/themes/bold-vibrant.jpg',
    colors: {
      primary: '#8B5CF6',
      secondary: '#6D28D9',
      accent: '#F97316',
      background: '#FFFFFF',
      text: '#1F2937',
      heading: '#111827',
      button: {
        background: '#8B5CF6',
        text: '#FFFFFF',
        hover: '#6D28D9'
      },
      card: {
        background: '#FFFFFF',
        border: '#E5E7EB'
      },
      footer: {
        background: '#111827',
        text: '#F9FAFB'
      }
    },
    typography: {
      headingFont: 'Poppins, sans-serif',
      bodyFont: 'Poppins, sans-serif',
      fontSize: {
        base: '16px',
        heading1: '3.5rem',
        heading2: '2.5rem',
        heading3: '1.75rem'
      }
    },
    styles: {
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      buttonStyle: 'gradient',
      cardStyle: 'floating',
      spacing: {
        section: '6rem',
        element: '2rem'
      }
    }
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    description: 'Sophisticated design with serif fonts and refined color palette',
    previewImage: '/themes/elegant-serif.jpg',
    colors: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#F59E0B',
      background: '#FFFBF5',
      text: '#4B5563',
      heading: '#1F2937',
      button: {
        background: '#10B981',
        text: '#FFFFFF',
        hover: '#059669'
      },
      card: {
        background: '#FFFFFF',
        border: '#E5E7EB'
      },
      footer: {
        background: '#F3F4F6',
        text: '#6B7280'
      }
    },
    typography: {
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Lora, serif',
      fontSize: {
        base: '18px',
        heading1: '3.25rem',
        heading2: '2.5rem',
        heading3: '1.75rem'
      }
    },
    styles: {
      borderRadius: '0.25rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      buttonStyle: 'minimal',
      cardStyle: 'bordered',
      spacing: {
        section: '6rem',
        element: '1.75rem'
      }
    }
  },
  {
    id: 'dark-mode',
    name: 'Dark Mode',
    description: 'Sleek dark interface with high contrast and vibrant accents',
    previewImage: '/themes/dark-mode.jpg',
    colors: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      accent: '#F59E0B',
      background: '#111827',
      text: '#F9FAFB',
      heading: '#F3F4F6',
      button: {
        background: '#3B82F6',
        text: '#FFFFFF',
        hover: '#2563EB'
      },
      card: {
        background: '#1F2937',
        border: '#374151'
      },
      footer: {
        background: '#0F172A',
        text: '#9CA3AF'
      }
    },
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      fontSize: {
        base: '16px',
        heading1: '3rem',
        heading2: '2.25rem',
        heading3: '1.5rem'
      }
    },
    styles: {
      borderRadius: '0.5rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
      buttonStyle: 'rounded',
      cardStyle: 'flat',
      spacing: {
        section: '5rem',
        element: '1.5rem'
      }
    }
  },
  {
    id: 'creative-playful',
    name: 'Creative & Playful',
    description: 'Fun and energetic design with playful elements and bright colors',
    previewImage: '/themes/creative-playful.jpg',
    colors: {
      primary: '#EC4899',
      secondary: '#DB2777',
      accent: '#8B5CF6',
      background: '#FFFFFF',
      text: '#4B5563',
      heading: '#111827',
      button: {
        background: '#EC4899',
        text: '#FFFFFF',
        hover: '#DB2777'
      },
      card: {
        background: '#FFFFFF',
        border: '#FECDD3'
      },
      footer: {
        background: '#FECDD3',
        text: '#9D174D'
      }
    },
    typography: {
      headingFont: 'Quicksand, sans-serif',
      bodyFont: 'Nunito, sans-serif',
      fontSize: {
        base: '16px',
        heading1: '3.25rem',
        heading2: '2.5rem',
        heading3: '1.75rem'
      }
    },
    styles: {
      borderRadius: '1.5rem',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      buttonStyle: 'pill',
      cardStyle: 'floating',
      spacing: {
        section: '5rem',
        element: '2rem'
      }
    }
  }
];

// Helper function to get a theme by ID
export const getThemeById = (themeId: string): Theme => {
  const theme = themes.find(t => t.id === themeId);
  if (!theme) {
    // Return default theme if not found
    return themes[0];
  }
  return theme;
};

// Helper function to apply theme to CSS variables
export const applyThemeToDocument = (theme: Theme) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  // Apply colors
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-accent', theme.colors.accent);
  root.style.setProperty('--color-background', theme.colors.background);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-heading', theme.colors.heading);
  root.style.setProperty('--color-button-bg', theme.colors.button.background);
  root.style.setProperty('--color-button-text', theme.colors.button.text);
  root.style.setProperty('--color-button-hover', theme.colors.button.hover);
  root.style.setProperty('--color-card-bg', theme.colors.card.background);
  root.style.setProperty('--color-card-border', theme.colors.card.border);
  root.style.setProperty('--color-footer-bg', theme.colors.footer.background);
  root.style.setProperty('--color-footer-text', theme.colors.footer.text);
  
  // Apply typography
  root.style.setProperty('--font-heading', theme.typography.headingFont);
  root.style.setProperty('--font-body', theme.typography.bodyFont);
  root.style.setProperty('--font-size-base', theme.typography.fontSize.base);
  root.style.setProperty('--font-size-h1', theme.typography.fontSize.heading1);
  root.style.setProperty('--font-size-h2', theme.typography.fontSize.heading2);
  root.style.setProperty('--font-size-h3', theme.typography.fontSize.heading3);
  
  // Apply styles
  root.style.setProperty('--border-radius', theme.styles.borderRadius);
  root.style.setProperty('--box-shadow', theme.styles.boxShadow);
  root.style.setProperty('--spacing-section', theme.styles.spacing.section);
  root.style.setProperty('--spacing-element', theme.styles.spacing.element);
  
  // Add theme-specific classes
  root.classList.remove(
    'theme-modern-minimal',
    'theme-bold-vibrant',
    'theme-elegant-serif',
    'theme-dark-mode',
    'theme-creative-playful'
  );
  root.classList.add(`theme-${theme.id}`);
  
  // Add button style class
  root.classList.remove(
    'button-rounded',
    'button-pill',
    'button-square',
    'button-minimal',
    'button-gradient'
  );
  root.classList.add(`button-${theme.styles.buttonStyle}`);
  
  // Add card style class
  root.classList.remove(
    'card-flat',
    'card-raised',
    'card-bordered',
    'card-floating'
  );
  root.classList.add(`card-${theme.styles.cardStyle}`);
};

// Generate CSS for a theme
export const generateThemeCSS = (theme: Theme): string => {
  return `
    :root {
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-accent: ${theme.colors.accent};
      --color-background: ${theme.colors.background};
      --color-text: ${theme.colors.text};
      --color-heading: ${theme.colors.heading};
      --color-button-bg: ${theme.colors.button.background};
      --color-button-text: ${theme.colors.button.text};
      --color-button-hover: ${theme.colors.button.hover};
      --color-card-bg: ${theme.colors.card.background};
      --color-card-border: ${theme.colors.card.border};
      --color-footer-bg: ${theme.colors.footer.background};
      --color-footer-text: ${theme.colors.footer.text};
      
      --font-heading: ${theme.typography.headingFont};
      --font-body: ${theme.typography.bodyFont};
      --font-size-base: ${theme.typography.fontSize.base};
      --font-size-h1: ${theme.typography.fontSize.heading1};
      --font-size-h2: ${theme.typography.fontSize.heading2};
      --font-size-h3: ${theme.typography.fontSize.heading3};
      
      --border-radius: ${theme.styles.borderRadius};
      --box-shadow: ${theme.styles.boxShadow};
      --spacing-section: ${theme.styles.spacing.section};
      --spacing-element: ${theme.styles.spacing.element};
    }
    
    body {
      font-family: var(--font-body);
      font-size: var(--font-size-base);
      color: var(--color-text);
      background-color: var(--color-background);
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-heading);
      color: var(--color-heading);
    }
    
    h1 {
      font-size: var(--font-size-h1);
    }
    
    h2 {
      font-size: var(--font-size-h2);
    }
    
    h3 {
      font-size: var(--font-size-h3);
    }
    
    .button, button[data-editable="true"] {
      background-color: var(--color-button-bg);
      color: var(--color-button-text);
      border-radius: var(--border-radius);
      transition: all 0.2s ease;
    }
    
    .button:hover, button[data-editable="true"]:hover {
      background-color: var(--color-button-hover);
    }
    
    .card {
      background-color: var(--color-card-bg);
      border: 1px solid var(--color-card-border);
      border-radius: var(--border-radius);
    }
    
    footer {
      background-color: var(--color-footer-bg);
      color: var(--color-footer-text);
    }
    
    /* Button styles */
    .button-rounded button {
      border-radius: 0.5rem;
    }
    
    .button-pill button {
      border-radius: 9999px;
    }
    
    .button-square button {
      border-radius: 0;
    }
    
    .button-minimal button {
      background: transparent;
      border: 1px solid var(--color-primary);
      color: var(--color-primary);
    }
    
    .button-gradient button {
      background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-secondary) 100%);
    }
    
    /* Card styles */
    .card-flat .card {
      box-shadow: none;
    }
    
    .card-raised .card {
      box-shadow: var(--box-shadow);
    }
    
    .card-bordered .card {
      border: 2px solid var(--color-card-border);
    }
    
    .card-floating .card {
      box-shadow: var(--box-shadow);
      transform: translateY(0);
      transition: transform 0.3s ease;
    }
    
    .card-floating .card:hover {
      transform: translateY(-5px);
    }
  `;
};
