"use client"

import React from "react"

interface ElementorPreviewRendererProps {
  elements: any[]
}

export function ElementorPreviewRenderer({ elements }: ElementorPreviewRendererProps) {
  if (!elements || elements.length === 0) {
    return null
  }

  const renderElement = (element: any, keyPrefix: string = '') => {
    if (!element || typeof element !== 'object') {
      console.warn('Invalid element:', element)
      return null
    }

    const { type, content, styles = {}, properties = {}, settings = {} } = element

    // Merge settings into properties for backward compatibility
    const mergedProperties = { ...settings, ...properties }

    switch (type) {
      case "section":
        return (
          <div
            style={{
              backgroundColor: styles.backgroundColor || "transparent",
              padding: styles.padding || "0px",
              margin: styles.margin || "0px",
              borderRadius: styles.borderRadius || "0px",
              display: 'flex',
              flexDirection: 'column',
              gap: 0
            }}
          >
            {element.children?.map((child: any, index: number) => (
              <React.Fragment key={`${keyPrefix}section-child-${index}`}>
                {renderElement(child, `${keyPrefix}section-${index}-`)}
              </React.Fragment>
            ))}
          </div>
        )

      case "row":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: styles.gap || "0px",
              padding: styles.padding || "0px",
              margin: styles.margin || "0px",
              backgroundColor: styles.backgroundColor || "transparent",
              borderRadius: styles.borderRadius || "0px",
            }}
          >
            {element.children?.map((child: any, index: number) => (
              <React.Fragment key={`${keyPrefix}row-child-${index}`}>
                {renderElement(child, `${keyPrefix}row-${index}-`)}
              </React.Fragment>
            ))}
          </div>
        )

      case "column":
        return (
          <div
            style={{
              padding: styles.padding || "0px",
              width: styles.width || "100%",
              flex: styles.flex || "1",
              display: 'flex',
              flexDirection: 'column',
              gap: 0
            }}
          >
            {element.children?.map((child: any, index: number) => (
              <React.Fragment key={`${keyPrefix}column-child-${index}`}>
                {renderElement(child, `${keyPrefix}column-${index}-`)}
              </React.Fragment>
            ))}
          </div>
        )

      case "headline":
      case "heading":
        const HeadingLevel = mergedProperties.level || styles.level || 2
        const headingProps = {
          style: {
            color: styles.color || "inherit",
            fontSize: styles.fontSize || "inherit",
            fontWeight: styles.fontWeight || "bold",
            textAlign: styles.textAlign || "left",
            margin: styles.margin || "0px",
          },
          dangerouslySetInnerHTML: { __html: content || "" }
        }
        
        // Render the appropriate heading level
        switch (HeadingLevel) {
          case 1: return <h1 {...headingProps} />
          case 2: return <h2 {...headingProps} />
          case 3: return <h3 {...headingProps} />
          case 4: return <h4 {...headingProps} />
          case 5: return <h5 {...headingProps} />
          case 6: return <h6 {...headingProps} />
          default: return <h2 {...headingProps} />
        }

      case "text":
        return (
          <div
            style={{
              color: styles.color || "inherit",
              fontSize: styles.fontSize || "inherit",
              textAlign: styles.textAlign || "left",
              margin: styles.margin || "0px",
            }}
            dangerouslySetInnerHTML={{ __html: content || "" }}
          />
        )

      case "image":
        return (
          <div style={{ textAlign: styles.textAlign || "left" }}>
            {mergedProperties.src ? (
              <img
                src={mergedProperties.src}
                alt={mergedProperties.alt || ""}
                style={{
                  width: styles.width || "100%",
                  height: styles.height || "auto",
                  borderRadius: styles.borderRadius || "0px",
                }}
              />
            ) : (
              <div
                style={{
                  width: styles.width || "100%",
                  height: "200px",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: styles.borderRadius || "0px",
                }}
              >
                <span>No Image</span>
              </div>
            )}
          </div>
        )

      case "button":
        return (
          <div 
            style={{ 
              display: "flex", 
              justifyContent: styles.justifyContent || "flex-start",
              width: "100%"
            }}
          >
            <a
              href={mergedProperties.link || "#"}
              target={mergedProperties.target || "_self"}
              style={{
                backgroundColor: styles.backgroundColor || "#4F46E5",
                color: styles.color || "white",
                padding: styles.padding || "5px 10px",
                borderRadius: styles.borderRadius || "4px",
                textDecoration: "none",
                display: "inline-block",
                fontSize: styles.fontSize || "16px",
                fontWeight: styles.fontWeight || "normal",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              {content || "Button"}
            </a>
          </div>
        )

      case "video":
        const aspectRatio = styles.aspectRatio || "16/9"
        const width = styles.width || "100%"
        
        return (
          <div style={{ width }}>
            {mergedProperties.videoUrl ? (
              <div style={{ 
                position: "relative",
                paddingBottom: aspectRatio === "16/9" ? "56.25%" : 
                              aspectRatio === "4/3" ? "75%" : 
                              aspectRatio === "1/1" ? "100%" : "56.25%",
                height: 0,
                overflow: "hidden",
                borderRadius: styles.borderRadius || "0px",
              }}>
                <iframe
                  src={mergedProperties.videoUrl}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div style={{ 
                width: "100%",
                paddingBottom: aspectRatio === "16/9" ? "56.25%" : 
                              aspectRatio === "4/3" ? "75%" : 
                              aspectRatio === "1/1" ? "100%" : "56.25%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: styles.borderRadius || "0px",
                position: "relative"
              }}>
                <span style={{ position: "absolute" }}>No Video</span>
              </div>
            )}
          </div>
        )

      case "spacer":
        return (
          <div
            style={{
              height: styles.height || "50px",
              width: styles.width || "100%",
            }}
          />
        )

      case "form":
        return (
          <div
            style={{
              width: styles.width || "100%",
            }}
          >
            <form style={{ width: "100%" }}>
              {mergedProperties.fields?.map((field: any, index: number) => (
                <div key={`${keyPrefix}form-field-${index}`} style={{ marginBottom: "15px" }}>
                  <label style={{ display: "block", marginBottom: "5px" }}>
                    {field.label || `Field ${index + 1}`}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      placeholder={field.placeholder || ""}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                      rows={4}
                      disabled
                    />
                  ) : (
                    <input
                      type={field.type || "text"}
                      placeholder={field.placeholder || ""}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                      disabled
                    />
                  )}
                </div>
              ))}
              <button
                style={{
                  backgroundColor: mergedProperties.buttonColor || "#4F46E5",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
                disabled
              >
                {mergedProperties.buttonText || "Submit"}
              </button>
            </form>
          </div>
        )

      case "pricing-table":
        return (
          <div
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: styles.borderRadius || "8px",
              overflow: "hidden",
              width: styles.width || "100%",
            }}
          >
            {/* Header */}
            <div style={{ 
              padding: "20px", 
              backgroundColor: mergedProperties.headerBgColor || "#f9fafb",
              textAlign: "center",
              position: "relative"
            }}>
              {mergedProperties.showRibbon && (
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "-30px",
                  transform: "rotate(45deg)",
                  backgroundColor: mergedProperties.ribbonColor || "#10b981",
                  color: "white",
                  padding: "5px 40px",
                  fontSize: "14px"
                }}>
                  {mergedProperties.ribbonText || "Popular"}
                </div>
              )}
              <h3 style={{ 
                margin: "0 0 10px 0", 
                fontSize: "20px", 
                fontWeight: "bold" 
              }}>
                {mergedProperties.title || "Basic Plan"}
              </h3>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>
                {mergedProperties.price || "$0"}
                <span style={{ fontSize: "16px", fontWeight: "normal" }}>
                  {mergedProperties.period || "/month"}
                </span>
              </div>
            </div>
            
            {/* Features */}
            <div style={{ padding: "20px" }}>
              <ul style={{ 
                listStyle: "none", 
                padding: 0, 
                margin: 0 
              }}>
                {mergedProperties.features?.map((feature: string, index: number) => (
                  <li key={`${keyPrefix}pricing-feature-${index}`} style={{ 
                    padding: "10px 0",
                    borderBottom: index < (mergedProperties.features?.length - 1) ? "1px solid #e5e7eb" : "none",
                    display: "flex",
                    alignItems: "center"
                  }}>
                    <span style={{ 
                      marginRight: "10px", 
                      color: "#10b981" 
                    }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Footer */}
            <div style={{ padding: "20px", textAlign: "center" }}>
              <button style={{
                backgroundColor: mergedProperties.buttonColor || "#4F46E5",
                color: "white",
                padding: "10px 20px",
                borderRadius: "4px",
                border: "none",
                width: "100%",
                cursor: "pointer",
              }}>
                {mergedProperties.buttonText || "Get Started"}
              </button>
            </div>
          </div>
        )

      case "testimonial-carousel":
        // In preview mode, just show the first testimonial
        const testimonial = mergedProperties.testimonials?.[0] || {
          content: "This is a sample testimonial content.",
          author: "John Doe",
          position: "CEO",
          rating: 5
        }
        
        return (
          <div style={{
            padding: "30px",
            borderRadius: styles.borderRadius || "8px",
            backgroundColor: styles.backgroundColor || "#f9fafb",
            width: styles.width || "100%",
          }}>
            {/* Rating */}
            <div style={{ marginBottom: "15px" }}>
              {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                <span key={`${keyPrefix}star-${i}`} style={{ color: "#f59e0b", marginRight: "2px" }}>★</span>
              ))}
            </div>
            
            {/* Content */}
            <div style={{
              fontSize: "18px",
              fontStyle: "italic",
              marginBottom: "20px",
              lineHeight: "1.6"
            }}>
              "{testimonial.content}"
            </div>
            
            {/* Author */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {testimonial.avatar && (
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    marginRight: "15px",
                    objectFit: "cover"
                  }}
                />
              )}
              <div>
                <div style={{ fontWeight: "bold" }}>{testimonial.author}</div>
                <div style={{ color: "#6b7280", fontSize: "14px" }}>{testimonial.position}</div>
              </div>
            </div>
          </div>
        )

      default:
        console.warn(`Unsupported element type: ${type}`, element);
        return (
          <div style={{ padding: "5px", border: "1px dashed #ff0000", margin: "2px 0" }}>
            <div style={{ color: "#ff0000", fontWeight: "bold" }}>Unsupported element type: {type}</div>
            {content && <div>{content}</div>}
          </div>
        )
    }
  }

  return (
    <div className="elementor-preview-content" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {elements.map((element, index) => (
        <React.Fragment key={`root-element-${index}`}>
          {renderElement(element, `root-${index}-`)}
        </React.Fragment>
      ))}
    </div>
  )
}
