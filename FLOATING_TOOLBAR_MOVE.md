# Floating Toolbar Component Move

## Overview
The FloatingToolbar component has been moved from the editor folder to the templates folder to better organize template-related components.

## Files Moved

### FloatingToolbar Component
- **From**: `squpage/components/editor/floating-toolbar.tsx`
- **To**: `squpage/components/templates/floating-toolbar.tsx`

## Updated Import References

### 1. EditableHeadline Component
- **File**: `squpage/components/editor/editable-headline.tsx`
- **Change**: Updated import from `'./floating-toolbar'` to `'../templates/floating-toolbar'`

### 2. EditableText Component
- **File**: `squpage/components/editor/editable-text.tsx`
- **Change**: Updated import from `'./floating-toolbar'` to `'../templates/floating-toolbar'`

## Component Features

The FloatingToolbar provides rich text editing capabilities including:

### Text Formatting
- **Bold**: Toggle bold formatting
- **Italic**: Toggle italic formatting

### Text Alignment
- **Left Align**: Align text to the left
- **Center Align**: Center align text
- **Right Align**: Align text to the right

### Advanced Features
- **Link Insertion**: Add hyperlinks to selected text
- **Color Picker**: Change text color with predefined colors or custom color picker
- **Font Size**: Adjust font size with slider or preset sizes (12px - 72px)

### Technical Features
- **Portal Rendering**: Renders outside component hierarchy to avoid clipping
- **Viewport Clamping**: Automatically positions within viewport bounds
- **Responsive Design**: Adapts to different screen sizes
- **Keyboard Support**: Supports keyboard interactions for accessibility

## Usage

The FloatingToolbar is used by editable text components to provide rich text editing capabilities:

```tsx
import { FloatingToolbar } from '../templates/floating-toolbar'

// In component
<FloatingToolbar
  selection={selection}
  isVisible={showToolbar}
  onBold={handleBold}
  onItalic={handleItalic}
  onAlign={handleAlign}
  onLink={handleLink}
  onColor={handleColor}
  onSize={handleSize}
  position={toolbarPosition}
/>
```

## Dependencies

The component relies on:
- **Slate.js**: For text selection and range handling
- **Radix UI**: For popover components
- **Lucide React**: For icons
- **Custom UI Components**: Button, Slider from the UI library

## Benefits of the Move

1. **Better Organization**: Template-related components are now grouped together
2. **Logical Structure**: Text editing tools are with template components
3. **Easier Maintenance**: Related functionality is co-located
4. **Cleaner Architecture**: Separates general editing from template-specific features

## Backward Compatibility

All existing functionality remains unchanged. Only the import paths have been updated to reflect the new location.