"use client"

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { createEditor, Descendant, Editor, Element as SlateElement, Transforms, Text, Range as SlateRange } from 'slate'
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'
import { FloatingToolbar } from './floating-toolbar'
import { useElementor } from '@/lib/elementor-context'
import { CustomElement, CustomText } from '@/lib/editor-types'

interface EditableTextProps {
  element: any
  isSelected: boolean
  elementType?: 'headline' | 'text' | 'paragraph' | 'button'
  defaultTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'button'
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
      case 'button':
        return `<button style="text-align:${node.align || 'center'}">${children}</button>`
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
  const containerRef = useRef<HTMLDivElement>(null)
  
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
        type: elementType === 'headline' ? 'heading1' : 
              elementType === 'button' ? 'button' : 'text',
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
  
  // Calculate toolbar position relative to the editable element (viewport coords)
  const updateToolbarPosition = useCallback(() => {
    try {
      const rect = (containerRef.current?.getBoundingClientRect() || (ReactEditor.toDOMNode(editor, editor) as HTMLElement).getBoundingClientRect())

      const viewportWidth = window.innerWidth
      const toolbarWidth = 320 // width of toolbar
      const toolbarHeight = 40 // height of toolbar

      // Center horizontally above the editable element
      let leftPos = rect.left + (rect.width / 2) - (toolbarWidth / 2)
      leftPos = Math.max(10, Math.min(leftPos, viewportWidth - toolbarWidth - 10))

      // Prefer above; if not enough space, place below
      let topPos = rect.top - toolbarHeight - 8
      if (topPos < 8) {
        topPos = rect.bottom + 8
      }

      setToolbarPosition({ top: topPos, left: leftPos })
    } catch (e) {
      // no-op
    }
  }, [editor])
  
  // Update content when it changes
  const handleChange = (value: Descendant[]) => {
    const isAstChange = editor.operations.some(op => op.type !== 'set_selection')
    
    if (isAstChange) {
      // Convert Slate value to HTML and update element
      const htmlContent = serializeToHtml(value)
      updateElement(element.id, { content: htmlContent })
    }
    
    // Track selection for formatting
    setSelection(editor.selection ?? null)

    // Keep toolbar visible and positioned when element is selected
    if (isSelected) {
      setShowToolbar(true)
      updateToolbarPosition()
    } else {
      setShowToolbar(false)
    }
  }

  // Recalculate toolbar position whenever the element selection state changes
  useEffect(() => {
    if (isSelected) {
      setShowToolbar(true)
      updateToolbarPosition()
    } else {
      setShowToolbar(false)
    }
  }, [isSelected, updateToolbarPosition])

  // Reposition on scroll and resize while selected
  useEffect(() => {
    if (!isSelected) return
    const handler = () => updateToolbarPosition()
    window.addEventListener('scroll', handler, true)
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler, true)
      window.removeEventListener('resize', handler)
    }
  }, [isSelected, updateToolbarPosition])
  
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
    
    // Get the selected text
    const selectedText = Editor.string(editor, selection)
    
    // If no text is selected, insert the URL as text
    if (!selectedText) {
      Editor.insertText(editor, url)
      return
    }
    
    // Apply link formatting to the selected text
    Transforms.setNodes(
      editor,
      { link: url },
      { match: n => Text.isText(n), split: true }
    )
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
    } else if (elementType === 'button') {
      return {
        fontSize: element.styles?.fontSize || '16px',
        fontWeight: element.styles?.fontWeight || 'normal',
        color: element.styles?.color || '#ffffff',
        backgroundColor: element.styles?.backgroundColor || '#007bff',
        borderRadius: element.styles?.borderRadius || '4px',
        padding: element.styles?.padding || '12px 24px',
        border: 'none',
        cursor: 'pointer',
        display: 'inline-block',
        transition: 'all 0.3s ease',
        textAlign: (element.styles?.textAlign as any) || 'center',
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
    <div className="relative" ref={containerRef}>
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
            
            if (elementType === 'button') {
              return (
                <button 
                  style={{
                    ...style,
                    fontSize: element.styles?.fontSize || '16px',
                    fontWeight: element.styles?.fontWeight || 'normal',
                    color: element.styles?.color || '#ffffff',
                    backgroundColor: element.styles?.backgroundColor || '#007bff',
                    borderRadius: element.styles?.borderRadius || '4px',
                    padding: element.styles?.padding || '12px 24px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-block',
                    transition: 'all 0.3s ease'
                  }} 
                  {...attributes}
                >
                  {children}
                </button>
              )
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
            
            if (leaf.link) {
              el = (
                <a 
                  href={leaf.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#007bff', textDecoration: 'underline' }}
                  onClick={(e) => e.preventDefault()} // Prevent navigation in editor
                >
                  {el}
                </a>
              )
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
