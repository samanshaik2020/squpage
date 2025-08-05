"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useContext } from "react"
import { EditorContext } from "@/lib/editor-context"

interface EditableElementProps {
  id: string
  type: "text" | "heading" | "button" | "badge" | "image" | "section" // Added "section" type
  className?: string
  isSelected: boolean
  onSelect: (id: string) => void
  defaultContent: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "sm" | "default" | "lg"
  children?: React.ReactNode
  isEditable: boolean // New prop to indicate if the element is in an editable context
  url?: string // Keep url prop for buttons/images/sections (e.g., background image)
  style?: React.CSSProperties // Allow passing through custom styles
}

export function EditableElement({
  id,
  type,
  className = "",
  isSelected,
  onSelect,
  defaultContent,
  variant = "default",
  size = "default",
  children,
  isEditable,
  url: defaultUrl = "", // Use defaultUrl for the prop
  style: defaultStyle = {}, // Use defaultStyle for the prop
}: EditableElementProps) {
  let content = defaultContent
  let elementUrl = defaultUrl
  let styles: any = defaultStyle

  const editorContext = useContext(EditorContext)

  if (isEditable && editorContext) {
    const { elements } = editorContext
    console.log(`EditableElement ${id}: Looking for element in context`, { elements });
    const element = elements.find((el) => el.id === id)
    console.log(`EditableElement ${id}: Found element:`, element);
    content = element?.content || defaultContent
    styles = element?.styles || defaultStyle
    elementUrl = element?.url || defaultUrl
    console.log(`EditableElement ${id}: Using content:`, content);
  }

  const handleClick = (e: React.MouseEvent) => {
    if (isEditable) {
      e.stopPropagation()
      onSelect(id)
    } else if (type === "button" && elementUrl) {
      window.open(elementUrl, "_blank")
    }
  }

  const baseClasses = `
    ${className}
    ${isEditable ? (isSelected ? "ring-2 ring-blue-500 ring-offset-2" : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1") : ""}
    ${isEditable ? "cursor-pointer relative" : ""}
  `

  const alignmentClass = isEditable && styles.textAlign ? `text-${styles.textAlign}` : ""
  const finalClassName = `${baseClasses} ${alignmentClass}`.trim()

  const commonProps: React.HTMLAttributes<HTMLElement> = {
    onClick: handleClick,
    className: finalClassName,
    style: isEditable
      ? {
          color: styles.color,
          backgroundColor: styles.backgroundColor,
          fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
          fontWeight: styles.fontWeight,
          position: styles.position || "relative",
          left: styles.xPosition ? `${styles.xPosition}px` : undefined,
          top: styles.yPosition ? `${styles.yPosition}px` : undefined,
          ...styles,
        }
      : defaultStyle, // Use defaultStyle in preview mode
  }

  if (isEditable) {
    ;(commonProps as any)["data-editable"] = true
  }

  switch (type) {
    case "heading":
      return (
        <h1 {...commonProps}>
          {content}
          {isEditable && isSelected && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">Heading</div>
          )}
        </h1>
      )

    case "button":
      return (
        <Button {...commonProps} variant={variant as any} size={size as any}>
          {content}
          {isEditable && isSelected && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">Button</div>
          )}
        </Button>
      )

    case "badge":
      return (
        <Badge {...commonProps} variant={variant as any}>
          {content}
          {isEditable && isSelected && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">Badge</div>
          )}
        </Badge>
      )

    case "image":
      return (
        <div {...commonProps}>
          {content.startsWith("/placeholder") || content.startsWith("http") ? (
            <Image
              src={content || "/placeholder.svg"}
              alt="Editable image"
              width={480}
              height={320}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center text-gray-500">
              {content || "Click to add image"}
            </div>
          )}
          {isEditable && isSelected && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">Image</div>
          )}
        </div>
      )

    case "section": // New case for section elements
      return (
        <div {...commonProps}>
          {children}
          {isEditable && isSelected && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">Section</div>
          )}
        </div>
      )

    default: // text
      return (
        <div {...commonProps}>
          {content}
          {isEditable && isSelected && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">Text</div>
          )}
        </div>
      )
  }
}
