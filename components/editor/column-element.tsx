import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface ColumnElementProps {
  element: any;
  isSelected: boolean;
  isPreview: boolean;
  children: any[];
  handleElementClick: (e: React.MouseEvent) => void;
  renderElement: (element: any) => React.ReactNode;
  addElement: (element: any) => void;
  updateElement: (id: string, data: any) => void;
  elements: any[];
  generateId: () => string;
}

const ColumnElement: React.FC<ColumnElementProps> = ({
  element,
  isSelected,
  isPreview,
  children,
  handleElementClick,
  renderElement,
  addElement,
  updateElement,
  elements,
  generateId
}) => {
  // State for tracking drop indicator position
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null);
  
  // Calculate drop position based on mouse Y position
  const calculateDropPosition = (e: React.DragEvent<HTMLDivElement>, children: any[]) => {
    if (children.length === 0) return 0;
    
    const container = e.currentTarget;
    const containerRect = container.getBoundingClientRect();
    const mouseY = e.clientY - containerRect.top;
    
    // Get all child elements
    const childElements = Array.from(container.querySelectorAll('.elementor-column-item'));
    
    // Find the closest child based on mouse position
    for (let i = 0; i < childElements.length; i++) {
      const child = childElements[i];
      const childRect = child.getBoundingClientRect();
      const childMiddle = childRect.top + childRect.height / 2 - containerRect.top;
      
      if (mouseY < childMiddle) {
        return i;
      }
    }
    
    // If we're below all children, insert at the end
    return children.length;
  };

  // Function to create a new element based on type
  const createNewElement = (elementType: string, parentId: string) => {
    const newElementId = generateId();
    let newElement: any = {
      id: newElementId,
      type: elementType,
      parentId: parentId
    };
    
    switch (elementType) {
      case 'headline':
        newElement = {
          ...newElement,
          content: 'Your Heading Here',
          styles: {
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#000000',
            textAlign: 'left',
            margin: '0 0 16px 0'
          }
        };
        break;
        
      case 'text':
        newElement = {
          ...newElement,
          content: 'Your text content here. Click to edit this text and add your own content.',
          styles: {
            fontSize: '16px',
            fontWeight: 'normal',
            color: '#000000',
            textAlign: 'left',
            lineHeight: '1.6',
            margin: '0 0 16px 0'
          }
        };
        break;
        
      case 'image':
        newElement = {
          ...newElement,
          styles: {
            width: '100%',
            textAlign: 'left',
            borderRadius: '0px'
          },
          settings: {
            imageUrl: 'https://via.placeholder.com/400x200/e2e8f0/64748b?text=Image+Placeholder',
            alt: 'Placeholder image'
          }
        };
        break;
        
      case 'button':
        newElement = {
          ...newElement,
          content: 'Click Me',
          styles: {
            fontSize: '16px',
            fontWeight: 'normal',
            color: '#ffffff',
            backgroundColor: '#007bff',
            borderRadius: '4px',
            padding: '12px 24px',
            textAlign: 'center',
            display: 'inline-block',
            cursor: 'pointer'
          },
          settings: {
            linkUrl: '',
            linkTarget: '_self'
          }
        };
        break;
        
      case 'video':
        newElement = {
          ...newElement,
          styles: {
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '0px'
          },
          settings: {
            videoUrl: ''
          }
        };
        break;
        
      case 'spacer':
        newElement = {
          ...newElement,
          styles: {
            height: '50px',
            width: '100%'
          }
        };
        break;
        
      case 'form':
        newElement = {
          ...newElement,
          formFields: [
            {
              id: generateId(),
              type: 'text',
              label: 'Name',
              placeholder: 'Enter your name',
              required: true,
              width: '100%'
            },
            {
              id: generateId(),
              type: 'email',
              label: 'Email',
              placeholder: 'Enter your email',
              required: true,
              width: '100%'
            },
            {
              id: generateId(),
              type: 'textarea',
              label: 'Message',
              placeholder: 'Enter your message',
              required: false,
              width: '100%'
            }
          ],
          styles: {
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          },
          settings: {
            submitAction: 'email',
            submitEmail: '',
            successMessage: 'Thank you for your message!'
          }
        };
        break;
        
      case 'pricing-table':
        newElement = {
          ...newElement,
          content: 'Basic Plan',
          pricingFeatures: [
            { id: generateId(), text: 'Feature 1', included: true },
            { id: generateId(), text: 'Feature 2', included: true },
            { id: generateId(), text: 'Feature 3', included: true },
            { id: generateId(), text: 'Feature 4', included: false }
          ],
          styles: {
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          },
          settings: {
            featured: false,
            ribbonText: 'Popular',
            price: '$99',
            period: '/month',
            currency: '$',
            buttonText: 'Get Started',
            buttonColor: '#007bff'
          }
        };
        break;
        
      case 'testimonial-carousel':
        newElement = {
          ...newElement,
          testimonials: [
            {
              id: generateId(),
              content: 'This is an amazing product! I highly recommend it to everyone.',
              author: 'John Doe',
              position: 'CEO, Company Inc.',
              rating: 5,
              avatar: ''
            },
            {
              id: generateId(),
              content: 'The customer service is outstanding and the product exceeded my expectations.',
              author: 'Jane Smith',
              position: 'Marketing Director',
              rating: 5,
              avatar: ''
            }
          ],
          styles: {
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            width: '100%'
          },
          settings: {
            autoplay: true,
            autoplaySpeed: 3000,
            showDots: true,
            showArrows: true,
            slidesToShow: 1
          }
        };
        break;
    }
    
    return newElement;
  };

  // Handle drop on empty column
  const handleEmptyColumnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const elementType = e.dataTransfer.getData('text/plain');
    
    if (['headline', 'text', 'image', 'button', 'video', 'spacer', 'form', 'pricing-table', 'testimonial-carousel'].includes(elementType)) {
      const newElement = createNewElement(elementType, element.id);
      
      // Add the element to the state
      addElement(newElement);
      
      // Update the column's children array
      const updatedChildren = [newElement.id];
      updateElement(element.id, { children: updatedChildren });
    }
    
    // Reset the drop indicator
    setDropIndicatorIndex(null);
  };

  // Handle drop on column with existing content
  const handleColumnDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const elementType = e.dataTransfer.getData('text/plain');
    const insertionIndex = dropIndicatorIndex !== null ? dropIndicatorIndex : children.length;
    
    if (['headline', 'text', 'image', 'button', 'video', 'spacer', 'form', 'pricing-table', 'testimonial-carousel'].includes(elementType)) {
      const newElement = createNewElement(elementType, element.id);
      
      // Add the element to the state
      addElement(newElement);
      
      // Get the current children array
      const targetColumn = elements.find(el => el.id === element.id);
      if (targetColumn) {
        // Create a copy of the children array
        const updatedChildren = [...(targetColumn.children || [])];
        
        // Insert the new element at the correct position
        updatedChildren.splice(insertionIndex, 0, newElement.id);
        
        // Update the column with the new children array
        updateElement(element.id, { children: updatedChildren });
      }
    }
    
    // Reset the drop indicator
    setDropIndicatorIndex(null);
  };

  return (
    <div
      key={element.id}
      className={`relative ${!isPreview ? (isSelected ? 'border-2' : 'hover:border hover:border-dashed') : ''} transition-all duration-200 min-h-[100px] ${
        isSelected ? 'border-purple-500 bg-purple-50/20' : isPreview ? '' : 'border-transparent hover:border-purple-300'
      }`}
      style={{
        width: element.styles?.width || '100%',
        padding: element.styles?.padding || '10px',
        float: element.styles?.float || 'left',
        boxSizing: 'border-box',
        minHeight: '100px',
        marginBottom: '20px',
        backgroundColor: isSelected ? 'rgba(168, 85, 247, 0.05)' : 'transparent'
      }}
      onClick={handleElementClick}
    >
      {isSelected && !isPreview && (
        <>
          <div className="absolute -top-6 left-0 bg-purple-500 text-white px-2 py-1 text-xs rounded z-10">
            Column
          </div>
          <div className="absolute -top-6 right-0 bg-red-500 text-white px-2 py-1 text-xs rounded z-10 cursor-pointer">
            Delete
          </div>
        </>
      )}
      
      {children.length === 0 ? (
        <div 
          className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg min-h-[100px]"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDropIndicatorIndex(0);
          }}
          onDragLeave={() => setDropIndicatorIndex(null)}
          onDrop={handleEmptyColumnDrop}
        >
          <div className="text-center text-gray-500">
            <Plus className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Drop content here</p>
          </div>
        </div>
      ) : (
        <div 
          className="space-y-2 relative"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const index = calculateDropPosition(e, children);
            setDropIndicatorIndex(index);
          }}
          onDragLeave={() => setDropIndicatorIndex(null)}
          onDrop={handleColumnDrop}
        >
          {/* Drop indicators */}
          {dropIndicatorIndex !== null && (
            <div 
              className="absolute left-0 right-0 h-1 bg-blue-500 z-10 pointer-events-none" 
              style={{
                top: dropIndicatorIndex === 0 ? 0 : 'auto',
                bottom: dropIndicatorIndex === children.length ? 0 : 'auto',
                transform: 'translateY(-50%)',
                // If not at start or end, position it between elements
                ...(dropIndicatorIndex > 0 && dropIndicatorIndex < children.length ? {
                  top: `calc(${(dropIndicatorIndex / children.length) * 100}% - 1px)`
                } : {})
              }}
            />
          )}
          
          {/* Render children with class for drop indicator positioning */}
          {children.map((child, index) => (
            <div key={child.id} className="elementor-column-item">
              {renderElement(child)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnElement;
