"use client"

import React from 'react'
import { SimplifiedElementorEditor } from './simplified-elementor-editor'
import { useElementor } from '@/lib/elementor-context'

export function EditorTest() {
  const { elements, addElement, updateElement, deleteElement } = useElementor()

  // Function to add test elements
  const addTestElements = () => {
    // Add a section
    const sectionId = `section_${Date.now()}`
    addElement({
      id: sectionId,
      type: 'section',
      parentId: undefined,
      children: []
    })

    // Add a row to the section
    const rowId = `row_${Date.now()}`
    addElement({
      id: rowId,
      type: 'row',
      parentId: sectionId,
      children: []
    })

    // Add columns to the row
    const column1Id = `column_${Date.now()}_1`
    const column2Id = `column_${Date.now()}_2`
    
    addElement({
      id: column1Id,
      type: 'column',
      parentId: rowId,
      styles: {
        width: '50%'
      },
      children: []
    })
    
    addElement({
      id: column2Id,
      type: 'column',
      parentId: rowId,
      styles: {
        width: '50%'
      },
      children: []
    })

    // Add heading to column 1
    const headingId = `heading_${Date.now()}`
    addElement({
      id: headingId,
      type: 'heading',
      parentId: column1Id,
      content: 'Welcome to Squpage Editor',
      styles: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#333333',
        textAlign: 'left',
        margin: '0 0 16px 0'
      }
    })

    // Add text to column 1
    const textId = `text_${Date.now()}`
    addElement({
      id: textId,
      type: 'text',
      parentId: column1Id,
      content: 'This is a paragraph of text that demonstrates the rich text editing capabilities with the floating toolbar.',
      styles: {
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#666666',
        textAlign: 'left',
        lineHeight: '1.6',
        margin: '0 0 16px 0'
      }
    })

    // Add button to column 1
    const buttonId = `button_${Date.now()}`
    addElement({
      id: buttonId,
      type: 'button',
      parentId: column1Id,
      content: 'Click Me',
      styles: {
        fontSize: '16px',
        fontWeight: 'normal',
        color: '#ffffff',
        backgroundColor: '#007bff',
        borderRadius: '4px',
        padding: '12px 24px',
        textAlign: 'center'
      }
    })

    // Add image to column 2
    const imageId = `image_${Date.now()}`
    addElement({
      id: imageId,
      type: 'image',
      parentId: column2Id,
      settings: {
        imageUrl: '/placeholder-logo.png',
        alt: 'Placeholder Image'
      },
      styles: {
        width: '100%',
        borderRadius: '8px'
      }
    })

    // Add form to column 2
    const formId = `form_${Date.now()}`
    addElement({
      id: formId,
      type: 'form',
      parentId: column2Id,
      content: 'Contact Form',
      formFields: [
        { 
          id: `field_${Date.now()}_1`,
          type: 'text',
          label: 'Name',
          placeholder: 'Enter your name',
          required: true
        },
        { 
          id: `field_${Date.now()}_2`,
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
          required: true
        },
        { 
          id: `field_${Date.now()}_3`,
          type: 'textarea',
          label: 'Message',
          placeholder: 'Enter your message',
          required: true
        }
      ],
      settings: {
        submitButtonText: 'Send Message'
      },
      styles: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e2e8f0'
      }
    })
  }

  // Function to clear all elements
  const clearElements = () => {
    elements.forEach(element => {
      deleteElement(element.id)
    })
  }

  return (
    <div className="p-4">
      <div className="flex gap-4 mb-6">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={addTestElements}
        >
          Add Test Elements
        </button>
        <button 
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={clearElements}
        >
          Clear Elements
        </button>
      </div>

      <div className="border border-gray-300 rounded-lg">
        <SimplifiedElementorEditor />
      </div>
    </div>
  )
}
