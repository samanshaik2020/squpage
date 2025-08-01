"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEditorStore } from "@/lib/editor-store"
import Image from "next/image"

interface EditableElementProps {
  id: string
  type: "text" | "heading" | "button" | "badge" | "image"
  className?: string
  isSelected: boolean
  onSelect: (id: string) => void
  defaultContent: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "sm" | "default" | "lg"
  children?: React.ReactNode
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
}: EditableElementProps) {
  const { elements, updateElement } = useEditorStore()

  // Get element data from store or use default
  const element = elements.find((el) => el.id === id)
  const content = element?.content || defaultContent
  const styles = element?.styles || {}
  const url = element?.url || ""

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect(id)
  }

  const baseClasses = `
    ${className}
    ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1"}
    transition-all duration-200 cursor-pointer relative
  `

  // Apply text alignment from styles
  const alignmentClass = styles.textAlign ? `text-${styles.textAlign}` : ""
  const finalClassName = `${baseClasses} ${alignmentClass}`.trim()

  const commonProps = {
    "data-editable": true,
    onClick: handleClick,
    className: finalClassName,
    style: {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontSize: styles.fontSize ? `${styles.fontSize}px` : undefined,
      fontWeight: styles.fontWeight,
      position: styles.position || "relative",
      left: styles.xPosition ? `${styles.xPosition}px` : undefined,
      top: styles.yPosition ? `${styles.yPosition}px` : undefined,
      ...styles,
    },
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (url && !isSelected) {
      window.open(url, "_blank")
    } else {
      onSelect(id)
    }
  }

  switch (type) {
    case "heading":
      return (
        <h1 {...commonProps}>
          {content}
          {isSelected && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">Heading</div>
          )}
        </h1>
      )

    case "button":
      return (
        <Button {...commonProps} variant={variant as any} size={size as any} onClick={handleButtonClick}>
          {content}
          {isSelected && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">Button</div>
          )}
        </Button>
      )

    case "badge":
      return (
        <Badge {...commonProps} variant={variant as any} onClick={handleClick}>
          {content}
          {isSelected && (
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
          {isSelected && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">Image</div>
          )}
        </div>
      )

    default: // text
      return (
        <div {...commonProps}>
          {content}
          {isSelected && (
            <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded z-10">Text</div>
          )}
        </div>
      )
  }
}
