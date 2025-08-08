"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { createEditor, Descendant, Editor, Element as SlateElement, Transforms, Text, Range as SlateRange } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { FloatingToolbar } from './floating-toolbar'
import { useElementor } from '@/lib/elementor-context'
import { CustomElement, CustomText } from '@/lib/editor-types'

interface EditableHeadlineProps {
  element: any
  isSelected: boolean
}

// Using shared types from @/lib/editor-types

// Define serializers to convert between Slate value and HTML
const serializeToHtml = (nodes: Descendant[]): string => {
  return nodes.map(node => {
    if (Text.isText(node)) {
      let string = node.text
      if (node.bold) {
        string = `<strong>${string}</strong>`
      }
      if (node.italic) {
        string = `<em>${string}</em>`
      }
      if (node.underline) {
        string = `<u>${string}</u>`
      }
      if (node.color) {
        string = `<span style="color:${node.color}">${string}</span>`
      }
      if (node.fontSize) {
        string = `<span style="font-size:${node.fontSize}">${string}</span>`
      }
      return string
    }

    const children = node.children.map((n: Descendant) => serializeToHtml([n])).join('')
    const element = node as CustomElement

    switch (element.type) {
      case 'heading1':
        return `<h1 style="text-align:${element.align || 'left'}">${children}</h1>`
      default:
        return `<p style="text-align:${element.align || 'left'}">${children}</p>`
    }
  }).join('')
}

const deserializeHtml = (html: string): Descendant[] => {
  // Simple HTML parsing - for production, use a proper HTML parser
  const div = document.createElement('div')
  div.innerHTML = html
  
  // Default content if parsing fails
  if (!div.textContent) {
    return [
      {
        type: 'heading1' as const,
        children: [{ text: 'Your Heading Here' }]
      }
    ] as CustomElement[]
  }
  
  // Try to extract formatting
  let align: 'left' | 'center' | 'right' = 'left'
  let bold = false
  let italic = false
  let color: string | undefined = undefined
  let fontSize: string | undefined = undefined
  
  // Check for alignment in h1 tag
  const h1 = div.querySelector('h1')
  if (h1) {
    const style = h1.getAttribute('style')
    if (style && style.includes('text-align')) {
      if (style.includes('center')) align = 'center'
      else if (style.includes('right')) align = 'right'
    }
  }
  
  // Check for formatting in the content
  if (div.querySelector('strong')) bold = true
  if (div.querySelector('em')) italic = true
  
  // Extract color and font size if possible
  const colorSpan = div.querySelector('span[style*="color"]')
  if (colorSpan) {
    const style = colorSpan.getAttribute('style')
    if (style) {
      const colorMatch = style.match(/color:\s*([^;]+)/)
      if (colorMatch) color = colorMatch[1]
    }
  }
  
  const fontSizeSpan = div.querySelector('span[style*="font-size"]')
  if (fontSizeSpan) {
    const style = fontSizeSpan.getAttribute('style')
    if (style) {
      const fontSizeMatch = style.match(/font-size:\s*([^;]+)/)
      if (fontSizeMatch) fontSize = fontSizeMatch[1]
    }
  }
  
  // Extract text content
  return [
    {
      type: 'heading1' as const,
      align,
      children: [{ 
        text: div.textContent || 'Your Heading Here',
        bold,
        italic,
        color,
        fontSize
      }]
    }
  ] as CustomElement[]
}

export function EditableHeadline({ element, isSelected }: EditableHeadlineProps) {
  const { updateElement } = useElementor()
  
  // Create a Slate editor
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  
  // Initialize with content from element
  const initialValue = useMemo(() => {
    if (element.content) {
      try {
        return deserializeHtml(element.content)
      } catch (err) {
        console.error('Error deserializing content:', err)
      }
    }
    
    // Default value
    return [
      {
        type: 'heading1' as const,
        align: (element.styles?.textAlign as 'left' | 'center' | 'right') || 'left',
        children: [{ 
          text: element.content || 'Your Heading Here',
          bold: element.styles?.fontWeight === 'bold',
          color: element.styles?.color,
          fontSize: element.styles?.fontSize
        }]
      }
    ] as Descendant[]
  }, [element.id]) // Only recreate when element ID changes
  
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
        setToolbarPosition({
          top: rect.top - 10 + window.scrollY,
          left: rect.left + rect.width / 2
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
      Editor.addMark(editor, format as keyof Omit<CustomText, 'text'>, value)
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
      Transforms.setNodes<CustomElement>(
        editor,
        { align: value as 'left' | 'center' | 'right' },
        { match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n) }
      )
    }
  }, [editor, selection])
  
  // Handle link insertion
  const insertLink = useCallback(() => {
    if (!selection) return
    
    const url = window.prompt('Enter the URL:')
    if (!url) return
    
    Transforms.select(editor, selection)
    
    // We're just wrapping the text with a link tag in HTML output
    // For a full implementation, you'd need to handle links as a custom element type
    const selectedText = Editor.string(editor, selection)
    const linkHtml = `<a href="${url}">${selectedText}</a>`
    
    Editor.deleteFragment(editor)
    Editor.insertText(editor, linkHtml)
  }, [editor, selection])
  
  return (
    <div className="relative">
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        <Editable
          className={`outline-none ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
          style={{
            fontSize: element.styles?.fontSize || '32px',
            fontWeight: element.styles?.fontWeight || 'bold',
            color: element.styles?.color || '#000000',
            textAlign: (element.styles?.textAlign as any) || 'left',
            margin: element.styles?.margin || '0 0 16px 0',
          }}
          readOnly={!isSelected}
          renderElement={(props) => {
            const { element, attributes, children } = props
            const customElement = element as CustomElement
            const style: React.CSSProperties = {
              textAlign: customElement.align || 'left',
            }
            
            return (
              <div style={style} {...attributes}>
                {children}
              </div>
            )
          }}
          renderLeaf={(props) => {
            const { attributes, children, leaf } = props
            const customLeaf = leaf as CustomText
            let el = <>{children}</>
            
            if (customLeaf.bold) {
              el = <strong>{el}</strong>
            }
            
            if (customLeaf.italic) {
              el = <em>{el}</em>
            }
            
            if (customLeaf.underline) {
              el = <u>{el}</u>
            }
            
            const style: React.CSSProperties = {}
            
            if (customLeaf.color) {
              style.color = customLeaf.color
            }
            
            if (customLeaf.fontSize) {
              style.fontSize = customLeaf.fontSize
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
