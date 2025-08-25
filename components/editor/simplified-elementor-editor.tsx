"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Type, 
  Image, 
  MousePointer, 
  Square, 
  FileText, 
  DollarSign, 
  MessageSquare, 
  Video,
  ArrowUp,
  ArrowDown,
  Trash2,
  Star,
  Plus,
  Columns,
  Grip,
  X 
} from 'lucide-react'
import { useElementor } from '@/lib/elementor-context'
import { ElementPropertiesPanel } from './element-properties-panel'
import { EditableText } from './editable-text'
import { AddStructureButton } from './add-structure-button'


interface SimplifiedElementorEditorProps {
  isPremium?: boolean;
}

export function SimplifiedElementorEditor({ isPremium = false }: SimplifiedElementorEditorProps) {
  const { elements, addElement, updateElement, moveElement, deleteElement, selectedElement, selectElement, getElementById } = useElementor()
  
  // Get the selected element object from the ID
  const selectedElementObj = selectedElement ? getElementById(selectedElement) : null
  
  // Helper function to render elements based on type
  const renderElement = (element: any) => {
    switch (element.type) {
      case 'heading':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden', // Prevent content from overflowing
              wordWrap: 'break-word' // Break long words to prevent overflow
            }}
          >
            <EditableText 
              element={element}
              isSelected={selectedElement === element.id}
              elementType="headline"
              defaultTag="h2"
              placeholder="Enter heading text"
            />
          </div>
        )
      case 'text':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden', // Prevent content from overflowing
              wordWrap: 'break-word' // Break long words to prevent overflow
            }}
          >
            <EditableText 
              element={element}
              isSelected={selectedElement === element.id}
              elementType="text"
              defaultTag="p"
              placeholder="Enter paragraph text"
            />
          </div>
        )
      case 'button':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden', // Prevent content from overflowing
              textAlign: 'center' // Center the button in the column
            }}
          >
            <EditableText 
              element={element}
              isSelected={selectedElement === element.id}
              elementType="button"
              defaultTag="button"
              placeholder="Button Text"
            />
          </div>
        )
      case 'image':
        return (
          <div 
            key={element.id} 
            className={`${selectedElement === element.id ? 'outline outline-2 outline-blue-500' : ''} w-full`}
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              ...element.styles,
              maxWidth: '100%', // Ensure it doesn't exceed column width
              width: '100%' // Always fill the column width
            }}
          >
            {element.settings?.linkUrl ? (
              <a 
                href={element.settings.linkUrl} 
                target={element.settings.linkTarget || '_self'}
                style={{ display: 'block', width: '100%' }}
              >
                <img 
                  src={element.settings?.imageUrl || '/placeholder-image.jpg'} 
                  alt={element.settings?.alt || 'Image'} 
                  className="max-w-full"
                  style={{ 
                    display: 'block',
                    margin: '0 auto',
                    objectFit: 'contain',
                    height: element.styles?.height || 'auto',
                    width: element.styles?.width || '100%'
                  }}
                />
              </a>
            ) : (
              <img 
                src={element.settings?.imageUrl || '/placeholder-image.jpg'} 
                alt={element.settings?.alt || 'Image'} 
                className="max-w-full"
                style={{ 
                  display: 'block',
                  margin: '0 auto',
                  objectFit: 'contain',
                  height: element.styles?.height || 'auto',
                  width: element.styles?.width || '100%'
                }}
              />
            )}
          </div>
        )
      case 'form':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden' // Prevent content from overflowing
            }}
          >
            <div className="p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-4">{element.content || 'Contact Form'}</h3>
              <div className="space-y-4">
                {element.formFields?.map((field: any) => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea 
                        className="w-full p-2 border rounded-md" 
                        placeholder={field.placeholder || ''}
                        disabled
                      />
                    ) : field.type === 'select' ? (
                      <select className="w-full p-2 border rounded-md" disabled>
                        <option>Select an option</option>
                      </select>
                    ) : (
                      <input 
                        type={field.type} 
                        className="w-full p-2 border rounded-md" 
                        placeholder={field.placeholder || ''}
                        disabled
                      />
                    )}
                  </div>
                ))}
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                  disabled
                >
                  {element.settings?.submitButtonText || 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )
      case 'pricing-table':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden' // Prevent content from overflowing
            }}
          >
            <div className="p-4 border rounded-md relative">
              {element.settings?.hasRibbon && (
                <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 text-sm">
                  {element.settings?.ribbonText || 'Popular'}
                </div>
              )}
              <h3 className="text-xl font-bold text-center">{element.content || 'Basic Plan'}</h3>
              <div className="text-center my-4">
                <span className="text-3xl font-bold">{element.settings?.price || '$9.99'}</span>
                <span className="text-gray-500">{element.settings?.period || '/month'}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {element.pricingFeatures?.map((feature: any) => (
                  <li 
                    key={feature.id} 
                    className={`flex items-center ${!feature.included ? 'text-gray-400 line-through' : ''}`}
                  >
                    <span className={`mr-2 ${feature.included ? 'text-green-500' : 'text-red-500'}`}>
                      {feature.included ? '✓' : '✕'}
                    </span>
                    {feature.text}
                  </li>
                ))}
              </ul>
              <button className="w-full py-2 bg-blue-600 text-white rounded-md">
                Get Started
              </button>
            </div>
          </div>
        )
      case 'testimonial-carousel':
        return (
          <div 
            key={element.id} 
            className={`p-4 w-full ${selectedElement === element.id ? 'outline outline-2 outline-blue-500' : ''}`}
            onClick={() => selectElement(element.id)}
            style={{
              ...element.styles,
              maxWidth: '100%', // Ensure it doesn't exceed column width
              overflow: 'hidden' // Prevent content from overflowing
            }}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">{element.content || 'Testimonial Carousel'}</h3>
              {element.testimonials && element.testimonials.length > 0 ? (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="mb-4">
                    <div className="flex justify-center mb-2">
                      {Array.from({ length: element.testimonials[0].rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="italic mb-4">"{element.testimonials[0].content}"</p>
                    <div className="flex items-center">
                      {element.testimonials[0].avatar ? (
                        <img 
                          src={element.testimonials[0].avatar} 
                          alt={element.testimonials[0].name}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-medium">
                            {element.testimonials[0].name?.charAt(0) || 'U'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{element.testimonials[0].name}</p>
                        <p className="text-sm text-gray-600">
                          {element.testimonials[0].position}{element.testimonials[0].company ? `, ${element.testimonials[0].company}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-4">
                    {element.testimonials.map((_: any, i: number) => (
                      <span 
                        key={i} 
                        className={`w-2 h-2 rounded-full mx-1 ${i === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No testimonials added yet</p>
              )}
            </div>
          </div>
        )
      case 'video':
        return (
          <div 
            key={element.id} 
            className={`${selectedElement === element.id ? 'outline outline-2 outline-blue-500' : ''} w-full`}
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              ...element.styles,
              maxWidth: '100%', // Ensure it doesn't exceed column width
              width: '100%' // Always fill the column width
            }}
          >
            {element.settings?.videoId ? (
              <div className="w-full" style={{ 
                aspectRatio: element.styles?.aspectRatio || '16/9',
                height: element.styles?.height || 'auto',
                width: element.styles?.width || '100%'
              }}>
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${element.settings.videoId}${element.settings?.autoplay ? '?autoplay=1&mute=1' : ''}`}
                  title={element.settings?.videoTitle || 'YouTube video'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ maxWidth: '100%' }}
                ></iframe>
              </div>
            ) : (
              <div className="bg-gray-100 w-full flex items-center justify-center text-gray-500" style={{ aspectRatio: '16/9' }}>
                <div className="text-center">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Add a YouTube video URL in the properties panel</p>
                </div>
              </div>
            )}
          </div>
        )
      case 'lead-magnet-form':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-purple-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-6 border-2 border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-blue-50">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {element.settings?.leadMagnet?.title || 'Get Your Free Guide'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {element.settings?.leadMagnet?.description || 'Download our comprehensive guide and boost your results today!'}
                </p>
              </div>
              <div className="space-y-3">
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-md" 
                  placeholder="Your Name"
                  disabled
                />
                <input 
                  type="email" 
                  className="w-full p-3 border rounded-md" 
                  placeholder="Your Email Address"
                  disabled
                />
                <button 
                  className="w-full py-3 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition-colors"
                  disabled
                >
                  Download Now - It's Free!
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        )
      case 'newsletter-signup':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {element.content || 'Stay Updated'}
                </h3>
                <p className="text-gray-600 text-sm">
                  Get the latest news and updates delivered to your inbox.
                </p>
              </div>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  className="flex-1 p-2 border rounded-md" 
                  placeholder="Enter your email"
                  disabled
                />
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium"
                  disabled
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        )
      case 'multi-step-form':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-green-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 border rounded-lg">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Multi-Step Form</h3>
                  <span className="text-sm text-gray-500">Step 1 of 3</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">What's your main goal?</label>
                  <select className="w-full p-2 border rounded-md" disabled>
                    <option>Select your goal</option>
                    <option>Increase sales</option>
                    <option>Generate leads</option>
                    <option>Build brand awareness</option>
                  </select>
                </div>
                <button 
                  className="w-full py-2 bg-green-600 text-white rounded-md"
                  disabled
                >
                  Next Step →
                </button>
              </div>
            </div>
          </div>
        )
      case 'slides':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-indigo-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg overflow-hidden">
              {/* Current Slide */}
              <div 
                className="relative h-64 flex items-center justify-center text-white"
                style={{
                  backgroundImage: element.slides?.[0]?.backgroundImage ? `url(${element.slides[0].backgroundImage})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative z-10 text-center px-6">
                  <h3 className="text-2xl font-bold mb-2">
                    {element.slides?.[0]?.title || 'Slide Title'}
                  </h3>
                  <p className="text-lg mb-4 opacity-90">
                    {element.slides?.[0]?.subtitle || 'Compelling subtitle that captures attention'}
                  </p>
                  <p className="mb-6 opacity-80">
                    {element.slides?.[0]?.content || 'Your slide content goes here. Make it engaging and actionable.'}
                  </p>
                  <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                    {element.slides?.[0]?.buttonText || 'Get Started'}
                  </button>
                </div>
              </div>
              
              {/* Navigation Arrows */}
              <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all">
                <ArrowUp className="w-4 h-4 rotate-[-90deg]" />
              </button>
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all">
                <ArrowUp className="w-4 h-4 rotate-90" />
              </button>
              
              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {(element.slides || [{ id: '1' }, { id: '2' }, { id: '3' }]).map((_: any, index: number) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white bg-opacity-50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )
      case 'countdown':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-red-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-6 border-2 border-red-200 rounded-lg bg-gradient-to-br from-red-50 to-orange-50">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {element.content || 'Limited Time Offer!'}
                </h3>
                <p className="text-gray-600 text-sm">
                  Don't miss out - offer expires soon!
                </p>
              </div>
              
              {/* Countdown Display */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center">
                  <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                    05
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Days</div>
                </div>
                <div className="text-center">
                  <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                    14
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Hours</div>
                </div>
                <div className="text-center">
                  <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                    32
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="bg-red-600 text-white text-xl font-bold py-3 px-2 rounded-lg">
                    18
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Seconds</div>
                </div>
              </div>
              
              <button className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                Claim Offer Now!
              </button>
            </div>
          </div>
        )
      case 'call-to-action':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className={`flex ${element.settings?.callToAction?.layout === 'vertical' ? 'flex-col' : 'items-center'} gap-4`}>
                {element.settings?.callToAction?.showImage !== false && (
                  <div className="flex-shrink-0">
                    <img 
                      src={element.settings?.callToAction?.imageUrl || '/placeholder-image.jpg'} 
                      alt="CTA Image" 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {element.settings?.callToAction?.title || 'Ready to Get Started?'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {element.settings?.callToAction?.description || 'Join thousands of satisfied customers and transform your business today.'}
                  </p>
                  <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    {element.settings?.callToAction?.buttonText || 'Get Started Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'share-buttons':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-green-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="text-center mb-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Share this page</h4>
              </div>
              <div className={`flex ${element.settings?.shareButtons?.layout === 'vertical' ? 'flex-col' : 'flex-row'} gap-2 justify-center`}>
                {['Facebook', 'Twitter', 'LinkedIn', 'WhatsApp'].map((platform) => (
                  <button
                    key={platform}
                    className={`flex items-center justify-center px-3 py-2 rounded text-white text-sm font-medium transition-colors ${
                      platform === 'Facebook' ? 'bg-blue-600 hover:bg-blue-700' :
                      platform === 'Twitter' ? 'bg-sky-500 hover:bg-sky-600' :
                      platform === 'LinkedIn' ? 'bg-blue-700 hover:bg-blue-800' :
                      'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {element.settings?.shareButtons?.showLabels !== false && platform}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case 'blockquote':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-gray-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-6 border-l-4 border-gray-400 bg-gray-50 rounded-r-lg">
              <div className="relative">
                {element.settings?.blockquote?.quoteIcon !== false && (
                  <div className="absolute -top-2 -left-2 text-4xl text-gray-300 font-serif">"</div>
                )}
                <blockquote className="text-lg italic text-gray-700 mb-4 pl-6">
                  {element.content || 'This is a sample quote that demonstrates the blockquote widget. You can customize the styling and add author information.'}
                </blockquote>
                {element.settings?.blockquote?.showAuthor !== false && (
                  <div className="flex items-center">
                    {element.settings?.blockquote?.authorImage && (
                      <img 
                        src={element.settings.blockquote.authorImage} 
                        alt="Author" 
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                      />
                    )}
                    <div>
                      <cite className="text-sm font-semibold text-gray-800 not-italic">
                        {element.settings?.blockquote?.authorName || 'John Doe'}
                      </cite>
                      {element.settings?.blockquote?.authorTitle && (
                        <p className="text-xs text-gray-600">
                          {element.settings.blockquote.authorTitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      case 'posts':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 border rounded-lg bg-white">
              <h3 className="text-lg font-semibold mb-4">Latest Posts</h3>
              <div className={`grid ${element.settings?.posts?.layout === 'list' ? 'grid-cols-1' : `grid-cols-${element.settings?.posts?.columns || 2}`} gap-4`}>
                {[1, 2, 3, 4].slice(0, element.settings?.posts?.postsPerPage || 4).map((post) => (
                  <div key={post} className="border rounded-lg overflow-hidden">
                    {element.settings?.posts?.showFeaturedImage !== false && (
                      <div className="h-32 bg-gray-200 flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="p-3">
                      <h4 className="font-semibold text-sm mb-2">Sample Blog Post {post}</h4>
                      {element.settings?.posts?.showExcerpt !== false && (
                        <p className="text-xs text-gray-600 mb-2">This is a sample excerpt for the blog post...</p>
                      )}
                      <div className="flex justify-between text-xs text-gray-500">
                        {element.settings?.posts?.showAuthor !== false && <span>By Author</span>}
                        {element.settings?.posts?.showDate !== false && <span>Jan 1, 2024</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'animated-headline':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-purple-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 text-center">
              <h2 className="text-2xl font-bold">
                <span>{element.settings?.animatedHeadline?.beforeText || 'We are '}</span>
                <span className="text-purple-600 border-r-2 border-purple-600 animate-pulse">
                  {element.settings?.animatedHeadline?.animatedText?.[0] || 'Creative'}
                </span>
                <span>{element.settings?.animatedHeadline?.afterText || ' Designers'}</span>
              </h2>
              <p className="text-sm text-gray-500 mt-2">Animated text will cycle through: {element.settings?.animatedHeadline?.animatedText?.join(', ') || 'Creative, Innovative, Professional'}</p>
            </div>
          </div>
        )
      case 'product-price':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-green-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                {element.settings?.product?.showSalePrice && (
                  <span className="text-lg line-through text-gray-500">$99.99</span>
                )}
                <span className="text-2xl font-bold text-green-600">$79.99</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Product Price Display</p>
            </div>
          </div>
        )
      case 'product-images':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-blue-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <Image className="w-12 h-12 text-gray-400" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((thumb) => (
                  <div key={thumb} className="aspect-square bg-gray-100 rounded border-2 border-transparent hover:border-blue-500 cursor-pointer flex items-center justify-center">
                    <Image className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case 'product-title':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-gray-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {element.content || 'Premium Product Name'}
              </h1>
              <p className="text-sm text-gray-600">SKU: PRD-001</p>
            </div>
          </div>
        )
      case 'product-rating':
        return (
          <div 
            key={element.id} 
            className="p-2 border border-transparent hover:border-yellow-300 rounded cursor-pointer w-full"
            onClick={(e) => {
              e.stopPropagation();
              selectElement(element.id);
            }}
            style={{
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <div className="p-4">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm font-medium">4.0</span>
                <span className="text-sm text-gray-500">(128 reviews)</span>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div key={element.id} className="p-2 border border-gray-300 rounded">
            Unknown element type: {element.type}
          </div>
        )
    }
  }

  // Get root elements (columns) and sort by order
  const rootElements = elements
    .filter(el => el.type === 'column')
    .sort((a, b) => {
      const orderA = a.styles?.order !== undefined ? Number(a.styles.order) : 999;
      const orderB = b.styles?.order !== undefined ? Number(b.styles.order) : 999;
      return orderA - orderB;
    });
  
  // Define the available elements for the side panel
  const AVAILABLE_ELEMENTS = [
    {
      id: 'headline',
      name: 'Headline',
      icon: Type,
      description: 'Add a heading text'
    },
    {
      id: 'text',
      name: 'Text',
      icon: Type,
      description: 'Add paragraph text'
    },
    {
      id: 'image',
      name: 'Image',
      icon: Image,
      description: 'Add an image'
    },
    {
      id: 'button',
      name: 'Button',
      icon: MousePointer,
      description: 'Add a clickable button'
    },
    {
      id: 'video',
      name: 'Video',
      icon: Video,
      description: 'Add a video player'
    },
    {
      id: 'spacer',
      name: 'Spacer',
      icon: Square,
      description: 'Add spacing between elements'
    },
    {
      id: 'form',
      name: 'Form',
      icon: FileText,
      description: 'Add a contact or lead form'
    },
    {
      id: 'pricing-table',
      name: 'Pricing Table',
      icon: DollarSign,
      description: 'Add a pricing table with features'
    },
    {
      id: 'testimonial-carousel',
      name: 'Testimonials',
      icon: MessageSquare,
      description: 'Add a testimonial carousel'
    }
  ]

  // Pro Marketing & Lead Generation Elements (only show if isPremium)
  const PRO_MARKETING_ELEMENTS = [
    {
      id: 'lead-magnet-form',
      name: 'Lead Magnet',
      icon: FileText,
      description: 'Capture leads with downloadable content'
    },
    {
      id: 'call-to-action',
      name: 'Call to Action',
      icon: MousePointer,
      description: 'Pre-styled box with image, text, and button'
    },
    {
      id: 'newsletter-signup',
      name: 'Newsletter',
      icon: MessageSquare,
      description: 'Newsletter subscription form'
    },
    {
      id: 'slides',
      name: 'Slides',
      icon: Image,
      description: 'Beautiful full-width sliders with content'
    },
    {
      id: 'countdown',
      name: 'Countdown',
      icon: ArrowDown,
      description: 'Add urgency with countdown timers'
    },
    {
      id: 'share-buttons',
      name: 'Share Buttons',
      icon: MessageSquare,
      description: 'Social media sharing buttons'
    },
    {
      id: 'blockquote',
      name: 'Blockquote',
      icon: MessageSquare,
      description: 'Stylized quotes and testimonials'
    },
    {
      id: 'multi-step-form',
      name: 'Multi-Step Form',
      icon: ArrowUp,
      description: 'Multi-step lead capture form'
    }
  ]

  // Pro Content & E-commerce Elements
  const PRO_CONTENT_ELEMENTS = [
    {
      id: 'posts',
      name: 'Posts',
      icon: FileText,
      description: 'Display blog posts with advanced options'
    },
    {
      id: 'animated-headline',
      name: 'Animated Headline',
      icon: Type,
      description: 'Eye-catching headlines with animations'
    },
    {
      id: 'product-price',
      name: 'Product Price',
      icon: DollarSign,
      description: 'Display product pricing information'
    },
    {
      id: 'product-images',
      name: 'Product Images',
      icon: Image,
      description: 'Product image gallery and thumbnails'
    },
    {
      id: 'product-title',
      name: 'Product Title',
      icon: Type,
      description: 'Product name and title display'
    },
    {
      id: 'product-rating',
      name: 'Product Rating',
      icon: Star,
      description: 'Product ratings and reviews'
    }
  ]

  return (
    <div className="flex h-screen bg-white">
      {/* Side Panel */}
      <div className="w-64 border-r border-gray-200 overflow-y-auto p-4">
        <h2 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">Elements</h2>
        <div className="space-y-4">
          {/* Basic Elements */}
          <div className="grid grid-cols-2 gap-2">
            {AVAILABLE_ELEMENTS.map((element) => (
              <div 
                key={element.id}
                className="flex flex-col items-center p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', element.id)
                }}
              >
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-1">
                  {React.createElement(element.icon, { className: "w-4 h-4 text-blue-600" })}
                </div>
                <span className="text-xs font-medium">{element.name}</span>
              </div>
            ))}
          </div>

          {/* Pro Marketing & Lead Generation Elements */}
          {isPremium && (
            <>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-xs uppercase tracking-wider text-purple-600">Marketing & Lead Generation</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PRO_MARKETING_ELEMENTS.map((element) => (
                    <div 
                      key={element.id}
                      className="flex flex-col items-center p-2 border border-purple-200 rounded-lg cursor-pointer hover:bg-purple-50 transition-colors relative"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', element.id)
                      }}
                    >
                      <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-1 rounded-full">PRO</div>
                      <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center mb-1">
                        {React.createElement(element.icon, { className: "w-4 h-4 text-purple-600" })}
                      </div>
                      <span className="text-xs font-medium text-center">{element.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2 text-xs uppercase tracking-wider text-indigo-600">Content & E-commerce</h3>
                <div className="grid grid-cols-2 gap-2">
                  {PRO_CONTENT_ELEMENTS.map((element) => (
                    <div 
                      key={element.id}
                      className="flex flex-col items-center p-2 border border-indigo-200 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors relative"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('text/plain', element.id)
                      }}
                    >
                      <div className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs px-1 rounded-full">PRO</div>
                      <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center mb-1">
                        {React.createElement(element.icon, { className: "w-4 h-4 text-indigo-600" })}
                      </div>
                      <span className="text-xs font-medium text-center">{element.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Elementor Editor {isPremium && <span className="ml-2 text-sm bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Pro</span>}</h1>
          <Link href="/templates" className="text-sm text-gray-500 hover:text-gray-700">
            Back to Templates
          </Link>
        </div>

        {/* Editor Canvas */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div 
            className="min-h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200 relative"
            style={{ 
              minHeight: rootElements.length > 0 ? `${Math.max(600, rootElements.length * 100)}px` : 'calc(100vh - 8rem)'
            }}
            id="editor-canvas"
            onClick={(e) => {
              // Only deselect if clicking on the canvas background (not on elements)
              if (e.target === e.currentTarget) {
                selectElement(null);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            {rootElements.length === 0 ? (
              /* Empty Canvas with Add Structure Button */
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-md w-full p-8 text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <Plus className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Start Building Your Page
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Drag widget here
                  </p>
                  
                  <div className="flex justify-center">
                    <AddStructureButton />
                  </div>
                </div>
              </div>
            ) : (
              <div className="editor-row clearfix">
                {/* Render Elements */}
                {/* Render all columns directly */}
                {rootElements.map(element => {
                  // Get children of this column
                  const columnChildren = elements.filter(el => el.parentId === element.id);
                  
                  return (
                    <div
                      key={element.id}
                      className={`relative border-2 transition-all duration-200 min-h-[100px] group ${
                        selectedElement === element.id 
                          ? 'border-blue-500' 
                          : 'border-transparent hover:border-purple-300'
                      }`}
                      style={{
                        width: element.styles?.width || '100%',
                        padding: element.styles?.padding || '20px',
                        float: element.styles?.float || 'left',
                        boxSizing: 'border-box',
                        minHeight: columnChildren.length > 0 ? 'auto' : '200px',
                        // No margin between columns
                        backgroundColor: element.styles?.backgroundColor || 'transparent',
                        borderRadius: element.styles?.borderRadius || '0px',
                        borderWidth: columnChildren.length === 0 ? '2px' : (element.styles?.borderWidth || '1px'),
                        borderStyle: columnChildren.length === 0 ? 'dashed' : (element.styles?.borderStyle || 'solid'),
                        borderColor: columnChildren.length === 0 ? '#e2e8f0' : (element.styles?.borderColor || '#e2e8f0'),
                        overflow: 'hidden' // Ensure content doesn't overflow column
                      }}
                      onClick={(e) => {
                        // Only select column if clicking on empty space (not on child elements)
                        if (e.target === e.currentTarget) {
                          e.stopPropagation();
                          selectElement(element.id);
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const elementType = e.dataTransfer.getData('text/plain');
                        
                        // Generate a unique ID for the new element
                        const newElementId = `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                        
                        // Create the element based on type
                        switch (elementType) {
                          case 'headline':
                            const headingElement = {
                              id: newElementId,
                              type: 'heading' as const,
                              parentId: element.id,
                              content: 'New Headline',
                              styles: {
                                fontSize: '24px',
                                fontWeight: 'bold',
                                margin: '10px 0'
                              }
                            };
                            addElement(headingElement);
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            
                            // Auto-select the newly created heading element
                            selectElement(newElementId);
                            break;
                          case 'text':
                            addElement({
                              id: newElementId,
                              type: 'text' as const,
                              parentId: element.id,
                              content: 'New paragraph text. Click to edit.',
                              styles: {
                                margin: '10px 0'
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            
                            // Auto-select the newly created text element
                            selectElement(newElementId);
                            break;
                          case 'image':
                            addElement({
                              id: newElementId,
                              type: 'image' as const,
                              parentId: element.id,
                              content: '',
                              settings: {
                                imageUrl: '/placeholder-logo.png',
                                alt: 'Placeholder image'
                              },
                              styles: {
                                width: '100%', // Always use 100% width to fit column
                                maxWidth: '100%', // Limit to column width
                                margin: '10px 0',
                                objectFit: 'contain' // Maintain aspect ratio
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            
                            // Auto-select the newly created image element
                            selectElement(newElementId);
                            break;
                          case 'button':
                            addElement({
                              id: newElementId,
                              type: 'button' as const,
                              parentId: element.id,
                              content: 'Click Me',
                              styles: {
                                backgroundColor: '#4F46E5',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'inline-block',
                                margin: '10px 0'
                              },
                              settings: {
                                linkUrl: '#',
                                linkTarget: '_self'
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            
                            // Auto-select the newly created button element
                            selectElement(newElementId);
                            break;
                          case 'form':
                            addElement({
                              id: newElementId,
                              type: 'form' as const,
                              parentId: element.id,
                              formFields: [
                                {
                                  id: `field_${Date.now()}_1`,
                                  type: 'text',
                                  label: 'Name',
                                  placeholder: 'Enter your name',
                                  required: true,
                                  width: '100%'
                                },
                                {
                                  id: `field_${Date.now()}_2`,
                                  type: 'email',
                                  label: 'Email',
                                  placeholder: 'Enter your email',
                                  required: true,
                                  width: '100%'
                                }
                              ],
                              styles: {
                                padding: '20px',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            break;
                          case 'lead-magnet-form':
                            addElement({
                              id: newElementId,
                              type: 'lead-magnet-form' as const,
                              parentId: element.id,
                              formFields: [
                                {
                                  id: `field_${Date.now()}_1`,
                                  type: 'text',
                                  label: 'Name',
                                  placeholder: 'Your Name',
                                  required: true,
                                  width: '100%'
                                },
                                {
                                  id: `field_${Date.now()}_2`,
                                  type: 'email',
                                  label: 'Email',
                                  placeholder: 'Your Email Address',
                                  required: true,
                                  width: '100%'
                                }
                              ],
                              settings: {
                                leadMagnet: {
                                  enabled: true,
                                  title: 'Get Your Free Guide',
                                  description: 'Download our comprehensive guide and boost your results today!',
                                  downloadUrl: '',
                                  fileType: 'pdf'
                                },
                                emailIntegration: {
                                  provider: 'mailchimp',
                                  doubleOptIn: true
                                },
                                tracking: {
                                  googleAnalytics: true,
                                  conversionGoal: 'lead_generation'
                                }
                              },
                              styles: {
                                padding: '24px',
                                backgroundColor: '#ffffff',
                                borderRadius: '12px',
                                border: '2px solid #e2e8f0'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'newsletter-signup':
                            addElement({
                              id: newElementId,
                              type: 'newsletter-signup' as const,
                              parentId: element.id,
                              content: 'Stay Updated',
                              formFields: [
                                {
                                  id: `field_${Date.now()}_1`,
                                  type: 'email',
                                  label: 'Email',
                                  placeholder: 'Enter your email',
                                  required: true,
                                  width: '100%'
                                }
                              ],
                              settings: {
                                emailIntegration: {
                                  provider: 'mailchimp',
                                  doubleOptIn: false
                                }
                              },
                              styles: {
                                padding: '16px',
                                backgroundColor: '#f0f9ff',
                                borderRadius: '8px'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'multi-step-form':
                            addElement({
                              id: newElementId,
                              type: 'multi-step-form' as const,
                              parentId: element.id,
                              content: 'Multi-Step Form',
                              formFields: [
                                {
                                  id: `field_${Date.now()}_1`,
                                  type: 'select',
                                  label: "What's your main goal?",
                                  required: true,
                                  width: '100%',
                                  options: ['Increase sales', 'Generate leads', 'Build brand awareness']
                                }
                              ],
                              settings: {
                                multiStep: {
                                  enabled: true,
                                  totalSteps: 3,
                                  currentStep: 1,
                                  showProgress: true
                                }
                              },
                              styles: {
                                padding: '20px',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'slides':
                            addElement({
                              id: newElementId,
                              type: 'slides' as const,
                              parentId: element.id,
                              content: 'Image Slider',
                              slides: [
                                {
                                  id: `slide_${Date.now()}_1`,
                                  title: 'Welcome to Our Service',
                                  subtitle: 'Transform Your Business Today',
                                  content: 'Discover how our innovative solutions can help you achieve your goals faster than ever before.',
                                  buttonText: 'Get Started',
                                  buttonUrl: '#',
                                  textAlign: 'center',
                                  backgroundColor: '#4F46E5'
                                },
                                {
                                  id: `slide_${Date.now()}_2`,
                                  title: 'Trusted by Thousands',
                                  subtitle: 'Join Our Growing Community',
                                  content: 'See why over 10,000 businesses choose our platform for their success.',
                                  buttonText: 'Learn More',
                                  buttonUrl: '#',
                                  textAlign: 'center',
                                  backgroundColor: '#7C3AED'
                                },
                                {
                                  id: `slide_${Date.now()}_3`,
                                  title: 'Ready to Begin?',
                                  subtitle: 'Start Your Journey',
                                  content: 'Take the first step towards achieving your business objectives.',
                                  buttonText: 'Contact Us',
                                  buttonUrl: '#',
                                  textAlign: 'center',
                                  backgroundColor: '#059669'
                                }
                              ],
                              settings: {
                                slider: {
                                  autoplay: true,
                                  autoplaySpeed: 5000,
                                  showDots: true,
                                  showArrows: true,
                                  infinite: true,
                                  slidesToShow: 1,
                                  slidesToScroll: 1,
                                  fade: false,
                                  pauseOnHover: true
                                }
                              },
                              styles: {
                                height: '400px',
                                borderRadius: '8px',
                                overflow: 'hidden'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'countdown':
                            addElement({
                              id: newElementId,
                              type: 'countdown' as const,
                              parentId: element.id,
                              content: 'Limited Time Offer!',
                              settings: {
                                countdown: {
                                  targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                                  format: 'dhms',
                                  showLabels: true,
                                  expiredMessage: 'Offer has expired!',
                                  expiredAction: 'message',
                                  style: 'default'
                                }
                              },
                              styles: {
                                padding: '24px',
                                backgroundColor: '#ffffff',
                                borderRadius: '12px',
                                border: '2px solid #fecaca'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'call-to-action':
                            addElement({
                              id: newElementId,
                              type: 'call-to-action' as const,
                              parentId: element.id,
                              content: 'Call to Action',
                              settings: {
                                callToAction: {
                                  layout: 'horizontal',
                                  imagePosition: 'left',
                                  showImage: true,
                                  imageUrl: '/placeholder-image.jpg',
                                  title: 'Ready to Get Started?',
                                  description: 'Join thousands of satisfied customers and transform your business today.',
                                  buttonText: 'Get Started Now',
                                  buttonUrl: '#',
                                  buttonStyle: 'solid'
                                }
                              },
                              styles: {
                                padding: '24px',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'share-buttons':
                            addElement({
                              id: newElementId,
                              type: 'share-buttons' as const,
                              parentId: element.id,
                              content: 'Share Buttons',
                              settings: {
                                shareButtons: {
                                  platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp'],
                                  style: 'default',
                                  size: 'medium',
                                  showLabels: true,
                                  showCounts: false,
                                  layout: 'horizontal'
                                }
                              },
                              styles: {
                                padding: '16px',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                textAlign: 'center'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'blockquote':
                            addElement({
                              id: newElementId,
                              type: 'blockquote' as const,
                              parentId: element.id,
                              content: 'This is a sample quote that demonstrates the blockquote widget. You can customize the styling and add author information.',
                              settings: {
                                blockquote: {
                                  style: 'default',
                                  showAuthor: true,
                                  authorName: 'John Doe',
                                  authorTitle: 'CEO, Company Inc',
                                  quoteIcon: true,
                                  alignment: 'left'
                                }
                              },
                              styles: {
                                padding: '20px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '8px',
                                borderLeft: '4px solid #6b7280'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'posts':
                            addElement({
                              id: newElementId,
                              type: 'posts' as const,
                              parentId: element.id,
                              content: 'Blog Posts',
                              posts: [
                                {
                                  id: '1',
                                  title: 'Sample Blog Post 1',
                                  excerpt: 'This is a sample excerpt for the first blog post...',
                                  content: 'Full content here...',
                                  author: 'John Doe',
                                  date: '2024-01-01',
                                  category: 'Technology',
                                  tags: ['web', 'design'],
                                  featuredImage: '/placeholder-image.jpg',
                                  slug: 'sample-blog-post-1'
                                }
                              ],
                              settings: {
                                posts: {
                                  layout: 'grid',
                                  columns: 2,
                                  postsPerPage: 4,
                                  showExcerpt: true,
                                  showAuthor: true,
                                  showDate: true,
                                  showCategory: true,
                                  showFeaturedImage: true,
                                  excerptLength: 150,
                                  orderBy: 'date',
                                  order: 'desc'
                                }
                              },
                              styles: {
                                padding: '20px',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'animated-headline':
                            addElement({
                              id: newElementId,
                              type: 'animated-headline' as const,
                              parentId: element.id,
                              content: 'Animated Headline',
                              settings: {
                                animatedHeadline: {
                                  beforeText: 'We are ',
                                  animatedText: ['Creative', 'Innovative', 'Professional'],
                                  afterText: ' Designers',
                                  animationType: 'typing',
                                  speed: 2000,
                                  loop: true,
                                  cursor: true
                                }
                              },
                              styles: {
                                padding: '20px',
                                textAlign: 'center',
                                fontSize: '32px',
                                fontWeight: 'bold'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'product-price':
                            addElement({
                              id: newElementId,
                              type: 'product-price' as const,
                              parentId: element.id,
                              content: 'Product Price',
                              product: {
                                id: 'prod-1',
                                title: 'Sample Product',
                                price: 79.99,
                                salePrice: 59.99,
                                currency: 'USD',
                                rating: 4.5,
                                reviewCount: 128,
                                images: ['/placeholder-image.jpg'],
                                description: 'Product description',
                                shortDescription: 'Short description',
                                sku: 'PRD-001',
                                inStock: true
                              },
                              settings: {
                                product: {
                                  showPrice: true,
                                  showSalePrice: true,
                                  showRating: false,
                                  showReviewCount: false,
                                  showSku: false,
                                  showStock: false,
                                  priceColor: '#16a34a',
                                  salePriceColor: '#dc2626'
                                }
                              },
                              styles: {
                                padding: '16px',
                                textAlign: 'center'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'product-images':
                            addElement({
                              id: newElementId,
                              type: 'product-images' as const,
                              parentId: element.id,
                              content: 'Product Images',
                              product: {
                                id: 'prod-1',
                                title: 'Sample Product',
                                price: 79.99,
                                currency: 'USD',
                                rating: 4.5,
                                reviewCount: 128,
                                images: ['/placeholder-image.jpg', '/placeholder-image.jpg', '/placeholder-image.jpg'],
                                description: 'Product description',
                                shortDescription: 'Short description',
                                sku: 'PRD-001',
                                inStock: true
                              },
                              styles: {
                                padding: '16px'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'product-title':
                            addElement({
                              id: newElementId,
                              type: 'product-title' as const,
                              parentId: element.id,
                              content: 'Premium Product Name',
                              product: {
                                id: 'prod-1',
                                title: 'Premium Product Name',
                                price: 79.99,
                                currency: 'USD',
                                rating: 4.5,
                                reviewCount: 128,
                                images: ['/placeholder-image.jpg'],
                                description: 'Product description',
                                shortDescription: 'Short description',
                                sku: 'PRD-001',
                                inStock: true
                              },
                              styles: {
                                padding: '16px',
                                fontSize: '24px',
                                fontWeight: 'bold'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'product-rating':
                            addElement({
                              id: newElementId,
                              type: 'product-rating' as const,
                              parentId: element.id,
                              content: 'Product Rating',
                              product: {
                                id: 'prod-1',
                                title: 'Sample Product',
                                price: 79.99,
                                currency: 'USD',
                                rating: 4.5,
                                reviewCount: 128,
                                images: ['/placeholder-image.jpg'],
                                description: 'Product description',
                                shortDescription: 'Short description',
                                sku: 'PRD-001',
                                inStock: true
                              },
                              settings: {
                                product: {
                                  showPrice: false,
                                  showSalePrice: false,
                                  showRating: true,
                                  showReviewCount: true,
                                  showSku: false,
                                  showStock: false,
                                  priceColor: '#16a34a',
                                  salePriceColor: '#dc2626'
                                }
                              },
                              styles: {
                                padding: '16px'
                              }
                            });
                            
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            selectElement(newElementId);
                            break;
                          case 'pricing-table':
                            addElement({
                              id: newElementId,
                              type: 'pricing-table' as const,
                              parentId: element.id,
                              content: 'Basic Plan',
                              pricingFeatures: [
                                { id: `feature_${Date.now()}_1`, text: 'Feature 1', included: true },
                                { id: `feature_${Date.now()}_2`, text: 'Feature 2', included: true },
                                { id: `feature_${Date.now()}_3`, text: 'Feature 3', included: false }
                              ],
                              settings: {
                                price: '$99',
                                period: '/month',
                                hasRibbon: true,
                                ribbonText: 'Popular'
                              },
                              styles: {
                                padding: '20px',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            break;
                          case 'testimonial-carousel':
                            addElement({
                              id: newElementId,
                              type: 'testimonial-carousel' as const,
                              parentId: element.id,
                              content: 'Testimonials',
                              testimonials: [
                                {
                                  id: `testimonial_${Date.now()}_1`,
                                  name: 'John Doe',
                                  position: 'CEO',
                                  company: 'Company Inc',
                                  content: 'This product is amazing! It has completely transformed how we work.',
                                  rating: 5
                                },
                                {
                                  id: `testimonial_${Date.now()}_2`,
                                  name: 'Jane Smith',
                                  position: 'Marketing Director',
                                  company: 'Agency Co',
                                  content: 'The customer support is outstanding. Highly recommended!',
                                  rating: 4
                                }
                              ],
                              styles: {
                                padding: '20px',
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0'
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            break;
                          case 'video':
                            addElement({
                              id: newElementId,
                              type: 'video' as const,
                              parentId: element.id,
                              settings: {
                                videoUrl: '',
                                videoId: '',
                                videoTitle: 'YouTube Video',
                                autoplay: false
                              },
                              styles: {
                                width: '100%', // Always use 100% width to fit column
                                height: 'auto', // Auto height based on aspect ratio
                                margin: '10px 0',
                                aspectRatio: '16/9' // Maintain video aspect ratio
                              }
                            });
                            
                            // Update the column's children array
                            if (!element.children) element.children = [];
                            element.children.push(newElementId);
                            break;
                        }
                      }}
                    >
                      {/* Column Controls */}
                      <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md rounded-bl-md border border-gray-200 z-10 flex">
                        <button 
                          className="p-1 hover:bg-gray-100" 
                          title="Move Up"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Find index of current column
                            const currentIndex = rootElements.findIndex(col => col.id === element.id);
                            if (currentIndex > 0) {
                              // Swap with previous column
                              const prevElement = rootElements[currentIndex - 1];
                              const currentElement = rootElements[currentIndex];
                              
                              // Update the DOM order by updating styles
                              const currentOrder = currentElement.styles?.order || currentIndex;
                              const prevOrder = prevElement.styles?.order || (currentIndex - 1);
                              
                              updateElement(currentElement.id, {
                                styles: { ...currentElement.styles, order: prevOrder }
                              });
                              updateElement(prevElement.id, {
                                styles: { ...prevElement.styles, order: currentOrder }
                              });
                            }
                          }}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100" 
                          title="Move Down"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Find index of current column
                            const currentIndex = rootElements.findIndex(col => col.id === element.id);
                            if (currentIndex < rootElements.length - 1) {
                              // Swap with next column
                              const nextElement = rootElements[currentIndex + 1];
                              const currentElement = rootElements[currentIndex];
                              
                              // Update the DOM order by updating styles
                              const currentOrder = currentElement.styles?.order || currentIndex;
                              const nextOrder = nextElement.styles?.order || (currentIndex + 1);
                              
                              updateElement(currentElement.id, {
                                styles: { ...currentElement.styles, order: nextOrder }
                              });
                              updateElement(nextElement.id, {
                                styles: { ...nextElement.styles, order: currentOrder }
                              });
                            }
                          }}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-red-100 text-red-600" 
                          title="Delete Column"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Are you sure you want to delete this column and all its contents?')) {
                              // First delete all children
                              columnChildren.forEach(child => {
                                deleteElement(child.id);
                              });
                              // Then delete the column itself
                              deleteElement(element.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {/* Render column children */}
                      {columnChildren.length === 0 ? (
                        <div className="flex items-center justify-center h-32">
                          <p className="text-gray-500 text-sm">Drop elements here</p>
                        </div>
                      ) : (
                        <div 
                          className="space-y-0 -my-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {columnChildren.map(child => {
                            // Render each child element based on its type
                            return renderElement(child);
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Add Structure Button in Editor Panel */}
                <div className="clear-both mt-8 flex justify-center">
                  <div className="w-64">
                    <AddStructureButton />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Properties Panel */}
      <div className="w-72 border-l border-gray-200 overflow-y-auto p-4">
        {selectedElementObj && (
          <ElementPropertiesPanel 
            element={selectedElementObj} 
          />
        )}
      </div>
    </div>
  )
}
