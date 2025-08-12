"use client"

import { ElementorElement } from "./elementor-context"

export interface ElementorPage {
  id: string
  title: string
  elements: ElementorElement[]
  createdAt: string
  updatedAt: string
}

// Simple localStorage-based storage for development
// In production, you'd want to use a proper database
export class ElementorStorage {
  private static STORAGE_KEY = 'elementor_pages'

  static savePage(page: ElementorPage): void {
    try {
      const pages = this.getAllPages()
      const existingIndex = pages.findIndex(p => p.id === page.id)
      
      if (existingIndex >= 0) {
        pages[existingIndex] = { ...page, updatedAt: new Date().toISOString() }
      } else {
        pages.push({ ...page, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(pages))
    } catch (error) {
      console.error('Failed to save page:', error)
    }
  }

  static getPage(id: string): ElementorPage | null {
    try {
      const pages = this.getAllPages()
      return pages.find(p => p.id === id) || null
    } catch (error) {
      console.error('Failed to get page:', error)
      return null
    }
  }

  static getAllPages(): ElementorPage[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Failed to get all pages:', error)
      return []
    }
  }

  static deletePage(id: string): void {
    try {
      const pages = this.getAllPages()
      const filtered = pages.filter(p => p.id !== id)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error('Failed to delete page:', error)
    }
  }

  static generatePageId(): string {
    return `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Sample data for testing
export const createSamplePage = (): ElementorPage => {
  const pageId = ElementorStorage.generatePageId()
  const sectionId = `section_${Date.now()}_1`
  const rowId = `row_${Date.now()}_1`
  const col1Id = `col_${Date.now()}_1`
  const col2Id = `col_${Date.now()}_2`
  const headline1Id = `headline_${Date.now()}_1`
  const headline2Id = `headline_${Date.now()}_2`
  const text1Id = `text_${Date.now()}_1`
  const text2Id = `text_${Date.now()}_2`

  return {
    id: pageId,
    title: 'Sample Elementor Page',
    elements: [
      // Section
      {
        id: sectionId,
        type: 'section',
        children: [rowId],
        styles: {
          backgroundColor: '#ffffff',
          padding: '40px',
          margin: '0px',
          height: '400px'
        },
        settings: {
          contentWidth: 'boxed',
          backgroundType: 'color'
        }
      },
      // Row with 2 columns
      {
        id: rowId,
        type: 'row',
        parentId: sectionId,
        children: [col1Id, col2Id],
        styles: {
          padding: '10px'
        },
        settings: {
          columnGap: '20px',
          columnCount: 2
        }
      },
      // Column 1
      {
        id: col1Id,
        type: 'column',
        parentId: rowId,
        children: [headline1Id, text1Id],
        styles: {
          width: '50%',
          padding: '15px'
        },
        settings: {
          alignment: 'left'
        }
      },
      // Column 2
      {
        id: col2Id,
        type: 'column',
        parentId: rowId,
        children: [headline2Id, text2Id],
        styles: {
          width: '50%',
          padding: '15px'
        },
        settings: {
          alignment: 'left'
        }
      },
      // Headlines
      {
        id: headline1Id,
        type: 'heading',
        parentId: col1Id,
        content: 'Your Heading Here',
        styles: {
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#000000',
          textAlign: 'left',
          margin: '0 0 16px 0'
        }
      },
      {
        id: headline2Id,
        type: 'heading',
        parentId: col2Id,
        content: 'Your Heading Here',
        styles: {
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#000000',
          textAlign: 'left',
          margin: '0 0 16px 0'
        }
      },
      // Text elements
      {
        id: text1Id,
        type: 'text',
        parentId: col1Id,
        content: 'Your text content here. Click to edit this text and add your own content.',
        styles: {
          fontSize: '16px',
          fontWeight: 'normal',
          color: '#000000',
          textAlign: 'left',
          lineHeight: '1.6',
          margin: '0 0 16px 0'
        }
      },
      {
        id: text2Id,
        type: 'text',
        parentId: col2Id,
        content: 'Your text content here. Click to edit this text and add your own content.',
        styles: {
          fontSize: '16px',
          fontWeight: 'normal',
          color: '#000000',
          textAlign: 'left',
          lineHeight: '1.6',
          margin: '0 0 16px 0'
        }
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}
