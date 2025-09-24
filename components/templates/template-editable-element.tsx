"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useContext } from "react"
import { TemplateEditorContext } from "@/lib/template-editor-context"
import { getAnimationClass, getTransitionStyles, getAnimationStyles } from "@/lib/button-animations"

interface TemplateEditableElementProps {
  id: string
  type: "text" | "heading" | "button" | "badge" | "image" | "video" | "section"
  className?: string
  isSelected: boolean
  onSelect: (id: string) => void
  defaultContent: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "sm" | "default" | "lg"
  children?: React.ReactNode
  isEditable: boolean
  url?: string
  style?: React.CSSProperties
}

export function TemplateEditableElement({
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
  url: defaultUrl = "",
  style: defaultStyle = {},
}: TemplateEditableElementProps) {
  let content = defaultContent
  let elementUrl = defaultUrl
  let styles: any = defaultStyle

  const editorContext = useContext(TemplateEditorContext)

  if (isEditable && editorContext) {
    const { elements } = editorContext
    const element = elements.find((el) => el.id === id)
    
    // Handle content and URL based on element type
    if (type === "image" || type === "video" || type === "section") {
      // For images/videos/sections, prioritize URL from element, then defaultContent as URL, then defaultUrl
      elementUrl = element?.url || (defaultContent.startsWith('http') || defaultContent.startsWith('/') ? defaultContent : defaultUrl)
      content = element?.content || (type === "image" ? "Image" : defaultContent)
    } else {
      // For text elements, use content normally
      content = element?.content || defaultContent
      elementUrl = element?.url || defaultUrl
    }
    
    styles = element?.styles || defaultStyle
  } else if (type === "image" || type === "video" || type === "section") {
    // Handle non-editable images - use defaultContent as URL if it looks like a URL
    if (defaultContent.startsWith('http') || defaultContent.startsWith('/')) {
      elementUrl = defaultContent
      content = type === "image" ? "Image" : defaultContent
    }
  }

  const handleClick = () => {
    if (isEditable) {
      onSelect(id)
    }
  }

  const combinedStyles = {
    ...defaultStyle,
    ...styles,
    ...(isSelected && isEditable ? { outline: "2px solid #3b82f6", outlineOffset: "2px" } : {}),
  }

  const combinedClassName = `${className} ${
    isEditable ? "cursor-pointer hover:outline hover:outline-2 hover:outline-blue-300 hover:outline-offset-2" : ""
  } ${isSelected && isEditable ? "outline outline-2 outline-blue-500 outline-offset-2" : ""}`

  switch (type) {
    case "text":
      // Get animation and transition styles for text
      const textElement = editorContext?.elements.find((el) => el.id === id);
      
      // Try to get animation from styles first, then fall back to root level (deprecated)
      const textAnimation = textElement?.styles?.animation || textElement?.animation;
      const textTransition = textElement?.styles?.transition || textElement?.transition;
      
      const textAnimationClass = getAnimationClass(textAnimation);
      const textTransitionStyles = getTransitionStyles(textTransition);
      const textAnimationStyles = getAnimationStyles(textAnimation);
      
      const textClassName = `${combinedClassName} ${textAnimationClass}`.trim();
      const textStyles = {
        ...combinedStyles,
        ...textTransitionStyles,
        ...textAnimationStyles
      };
      
      return (
        <p
          className={textClassName}
          style={textStyles}
          onClick={handleClick}
          data-editable={isEditable}
        >
          {content}
        </p>
      )

    case "heading":
      // Get animation and transition styles for headings
      const headingElement = editorContext?.elements.find((el) => el.id === id);
      
      // Try to get animation from styles first, then fall back to root level (deprecated)
      const headingAnimation = headingElement?.styles?.animation || headingElement?.animation;
      const headingTransition = headingElement?.styles?.transition || headingElement?.transition;
      
      const headingAnimationClass = getAnimationClass(headingAnimation);
      const headingTransitionStyles = getTransitionStyles(headingTransition);
      const headingAnimationStyles = getAnimationStyles(headingAnimation);
      
      const headingClassName = `${combinedClassName} ${headingAnimationClass}`.trim();
      const headingStyles = {
        ...combinedStyles,
        ...headingTransitionStyles,
        ...headingAnimationStyles
      };
      
      return (
        <h1
          className={headingClassName}
          style={headingStyles}
          onClick={handleClick}
          data-editable={isEditable}
        >
          {content}
        </h1>
      )

    case "button":
      // Get animation and transition styles for buttons
      const buttonElement = editorContext?.elements.find((el) => el.id === id)
      
      // Try to get animation from styles first, then fall back to root level (deprecated)
      const buttonAnimation = buttonElement?.styles?.animation || buttonElement?.animation;
      const buttonTransition = buttonElement?.styles?.transition || buttonElement?.transition;
      
      const animationClass = getAnimationClass(buttonAnimation)
      const transitionStyles = getTransitionStyles(buttonTransition)
      const animationStyles = getAnimationStyles(buttonAnimation)
      
      const buttonClassName = `${combinedClassName} ${animationClass}`.trim()
      const buttonStyles = {
        ...combinedStyles,
        ...transitionStyles,
        ...animationStyles
      }
      
      // If we're in edit mode, make the button clickable for editing
      // If not in edit mode and we have a URL, make it a link
      if (isEditable) {
        return (
          <Button
            variant={variant}
            size={size}
            className={buttonClassName}
            style={buttonStyles}
            onClick={handleClick}
            data-editable={isEditable}
          >
            {content}
          </Button>
        )
      } else {
        // When not in edit mode, make the button a link if URL is provided
        return (
          <Button
            variant={variant}
            size={size}
            className={buttonClassName}
            style={buttonStyles}
            onClick={elementUrl ? undefined : handleClick}
            data-editable={isEditable}
            asChild={!!elementUrl}
          >
            {elementUrl ? (
              <a href={elementUrl} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              content
            )}
          </Button>
        )
      }

    case "badge":
      return (
        <Badge
          className={combinedClassName}
          style={combinedStyles}
          onClick={handleClick}
          data-editable={isEditable}
        >
          {content}
        </Badge>
      )

    case "image":
      return (
        <div
          className={combinedClassName}
          style={combinedStyles}
          onClick={handleClick}
          data-editable={isEditable}
        >
          {elementUrl ? (
            <Image
              src={elementUrl}
              alt={content || "Image"}
              width={500}
              height={300}
              className="w-full h-auto"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
              {content || "Click to add image"}
            </div>
          )}
        </div>
      )

    case "video":
      return (
        <div
          className={combinedClassName}
          style={combinedStyles}
          onClick={handleClick}
          data-editable={isEditable}
        >
          {elementUrl ? (
            <video controls className="w-full h-auto">
              <source src={elementUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
              {content || "Click to add video"}
            </div>
          )}
        </div>
      )

    case "section":
      return (
        <section
          className={combinedClassName}
          style={{
            ...combinedStyles,
            backgroundImage: elementUrl ? `url(${elementUrl})` : undefined,
          }}
          onClick={handleClick}
          data-editable={isEditable}
        >
          {children}
        </section>
      )

    default:
      return (
        <div
          className={combinedClassName}
          style={combinedStyles}
          onClick={handleClick}
          data-editable={isEditable}
        >
          {content}
        </div>
      )
  }
}
