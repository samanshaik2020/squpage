"use client"

import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { createEditor, Descendant, Editor, Element as SlateElement, Transforms, Text, Range as SlateRange } from 'slate'
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'
import { FloatingToolbar } from './floating-toolbar'
import { useElementor } from '@/lib/elementor-context'
import { CustomElement, CustomText } from '@/lib/editor-types'

interface EditableTextProps {
  element: any
  isSelected: boolean
  elementType?: 'headline' | 'text' | 'paragraph'
  defaultTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  placeholder?: string
}

// Using shared types from @/lib/editor-types

// Define serializers to convert between Slate value and HTML
const serializeToHtml = (nodes: Descendant[]): string => {
  return nodes.map((node: Descendant): string => {
    if (Text.isText(node)) {
      let string = node.text
      if (node.bold) {
        string = `<strong>${string}</strong>`
      }
      if (node.italic) {
        string = `<em>${string}</em>`
      }
      if (node.color) {
        string = `<span style="color:${node.color}">${string}</span>`
      }
      if (node.fontSize) {
        string = `<span style="font-size:${node.fontSize}">${string}</span>`
      }
      return string
    }

    const children: string = node.children.map((n: Descendant) => serializeToHtml([n])).join('')

    switch (node.type) {
      case 'heading1':
        return `<h1 style="text-align:${node.align || 'left'}">${children}</h1>`
      case 'heading2':
        return `<h2 style="text-align:${node.align || 'left'}">${children}</h2>`
      case 'heading3':
        return `<h3 style="text-align:${node.align || 'left'}">${children}</h3>`
      case 'text':
        return `<p style="text-align:${node.align || 'left'}">${children}</p>`
      default:
        return `<p style="text-align:${node.align || 'left'}">${children}</p>`
    }
  }).join('')
}

const deserializeHtml = (html: string, elementType: string = 'text'): Descendant[] => {
  // Simple HTML parsing - for production, use a proper HTML parser
  const div = document.createElement('div')
  div.innerHTML = html
  
  // Default content if parsing fails
  if (!div.textContent) {
    const defaultText = elementType === 'headline' ? 'Your Heading Here' : 'Your text content here'
    return [
      {
        type: elementType === 'headline' ? 'heading1' : 'text',
        children: [{ text: defaultText }]
      }
    ]
  }
  
  // Extract text and basic formatting
  return [
    {
      type: elementType === 'headline' ? 'heading1' : 'text',
      align: 'left',
      children: [{ text: div.textContent }]
    }
  ]
}

export function EditableText({ 
  element, 
  isSelected, 
  elementType = 'text',
  defaultTag = 'p',
  placeholder = 'Your text content here'
}: EditableTextProps) {
  const { updateElement } = useElementor()
  
  // Create a Slate editor
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  
  // Initialize with content from element
  const initialValue = useMemo(() => {
    if (element.content) {
      try {
        return deserializeHtml(element.content, elementType)
      } catch (err) {
        console.error('Error deserializing content:', err)
      }
    }
    
    // Default value
    return [
      {
        type: (elementType === 'headline' ? 'heading1' : 'text') as 'heading1' | 'text',
        align: (element.styles?.textAlign || 'left') as 'left' | 'center' | 'right',
        children: [{ 
          text: element.content || placeholder,
          bold: element.styles?.fontWeight === 'bold',
          color: element.styles?.color,
          fontSize: element.styles?.fontSize
        }]
      }
    ] as Descendant[]
  }, [element.id, elementType, placeholder]) // Only recreate when element ID changes
  
  // State for toolbar
  const [selection, setSelection] = useState<SlateRange | null>(null)
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null)
  const [showToolbar, setShowToolbar] = useState(false)
  
  // Update content when it changes
  const handleChange = (value: Descendant[]) => {
    const isAstChange = editor.operations.some(op => op.type !== 'set_selection')
    
    if (isAstChange) {
      // Convert Slate value to HTML and update element
      const htmlContent = serializeToHtml(value)
      updateElement(element.id, { content: htmlContent })
    }
    
    // Update selection for toolbar positioning
    const { selection } = editor
    if (selection && !SlateRange.isCollapsed(selection)) {
      const domSelection = window.getSelection()
      if (domSelection && domSelection.rangeCount > 0) {
        const domRange = domSelection.getRangeAt(0)
        const rect = domRange.getBoundingClientRect()
        
        // Get the editor element's position
        const editorElement = ReactEditor.toDOMNode(editor, editor)
        const editorRect = editorElement.getBoundingClientRect()
        
        // Calculate position ensuring the toolbar stays within viewport
        const viewportWidth = window.innerWidth
        const toolbarWidth = 320 // Approximate width of toolbar
        const toolbarHeight = 40 // Approximate height of toolbar
        
        // Calculate left position to ensure toolbar doesn't go off-screen
        // Center it on the selection
        let leftPos = rect.left + (rect.width / 2) - (toolbarWidth / 2)
        
        // Ensure toolbar doesn't go off left edge
        leftPos = Math.max(10, leftPos)
        
        // Ensure toolbar doesn't go off right edge
        leftPos = Math.min(leftPos, viewportWidth - toolbarWidth - 10)
        
        // Always position the toolbar above the selection
        let topPos = rect.top - toolbarHeight - 10 + window.scrollY
        
        // If there's not enough space at the very top of the page, add minimum padding
        if (topPos < window.scrollY) {
          topPos = window.scrollY + 5
        }
        
        setToolbarPosition({
          top: topPos,
          left: leftPos
        })
        setShowToolbar(true)
        setSelection(selection)
      }
    } else {
      setShowToolbar(false)
    }
  }
  
  // Format text with the toolbar actions
  const formatText = useCallback((format: string, value: any = true) => {
    if (!selection) return
    
    Transforms.select(editor, selection)
    
    if (['bold', 'italic', 'underline'].includes(format)) {
      Editor.addMark(editor, format, value)
    } else if (format === 'color') {
      Editor.addMark(editor, 'color', value)
    } else if (format === 'fontSize') {
      Editor.addMark(editor, 'fontSize', `${value}px`)
    }
  }, [editor, selection])
  
  // Format block with the toolbar actions
  const formatBlock = useCallback((format: string, value: any) => {
    if (!selection) return
    
    Transforms.select(editor, selection)
    
    if (format === 'align') {
      Transforms.setNodes(
        editor,
        { align: value },
        { match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
      )
    }
  }, [editor, selection])
  
  // Handle link insertion
  const insertLink = useCallback((url: string) => {
    if (!selection) return
    if (!url) return
    
    Transforms.select(editor, selection)
    
    // We're just wrapping the text with a link tag in HTML output
    // For a full implementation, you'd need to handle links as a custom element type
    const selectedText = Editor.string(editor, selection)
    const linkHtml = `<a href="${url}">${selectedText}</a>`
    
    Editor.deleteFragment(editor)
    Editor.insertText(editor, linkHtml)
  }, [editor, selection])

  // Get default styles based on element type
  const getDefaultStyles = () => {
    if (elementType === 'headline') {
      return {
        fontSize: element.styles?.fontSize || '32px',
        fontWeight: element.styles?.fontWeight || 'bold',
        color: element.styles?.color || '#000000',
        textAlign: (element.styles?.textAlign as any) || 'left',
        margin: element.styles?.margin || '0 0 16px 0',
      }
    } else {
      return {
        fontSize: element.styles?.fontSize || '16px',
        fontWeight: element.styles?.fontWeight || 'normal',
        color: element.styles?.color || '#000000',
        textAlign: (element.styles?.textAlign as any) || 'left',
        lineHeight: element.styles?.lineHeight || '1.6',
        margin: element.styles?.margin || '0 0 16px 0'
      }
    }
  }
  
  return (
    <div className="relative">
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        <Editable
          className={`outline-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          style={getDefaultStyles()}
          readOnly={!isSelected}
          placeholder={placeholder}
          renderElement={(props) => {
            const { element, attributes, children } = props
            const style: React.CSSProperties = {
              textAlign: element.align || 'left',
            }
            
            return (
              <div style={style} {...attributes}>
                {children}
              </div>
            )
          }}
          renderLeaf={(props) => {
            const { attributes, children, leaf } = props
            let el = <>{children}</>
            
            if (leaf.bold) {
              el = <strong>{el}</strong>
            }
            
            if (leaf.italic) {
              el = <em>{el}</em>
            }
            
            if (leaf.underline) {
              el = <u>{el}</u>
            }
            
            const style: React.CSSProperties = {}
            
            if (leaf.color) {
              style.color = leaf.color
            }
            
            if (leaf.fontSize) {
              style.fontSize = leaf.fontSize
            }
            
            return (
              <span {...attributes} style={style}>
                {el}
              </span>
            )
          }}
        />
        
        {isSelected && showToolbar && (
          <FloatingToolbar
            selection={selection}
            isVisible={showToolbar}
            position={toolbarPosition}
            onBold={() => formatText('bold')}
            onItalic={() => formatText('italic')}
            onAlign={(align) => formatBlock('align', align)}
            onLink={insertLink}
            onColor={(color) => formatText('color', color)}
            onSize={(size) => formatText('fontSize', size)}
          />
        )}
      </Slate>
    </div>
  )
}
