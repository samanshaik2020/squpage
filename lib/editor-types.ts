import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

// Define custom types for our Slate editor
export type CustomElement = {
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'text' | 'button'
  align?: 'left' | 'center' | 'right'
  children: CustomText[]
  styles?: {
    fontSize?: string
    fontWeight?: string
    color?: string
    backgroundColor?: string
    borderRadius?: string
    padding?: string
    textAlign?: string
    lineHeight?: string
    margin?: string
  }
}

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  color?: string
  fontSize?: string
  underline?: boolean
  link?: string
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}
