"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TemplateEditableElement } from "./template-editable-element"
import { Star, Check, Shield, Award, Users, Play } from "lucide-react"

interface AIDentalHealthLandingTemplateProps {
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
  isEditable: boolean
}

export function AIDentalHealthLandingTemplate({
  selectedElement,
  onElementSelect,
  isEditable,
}: AIDentalHealthLandingTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <TemplateEditableElement
              id="hero-title"
              type="heading"
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
              isSelected={selectedElement === "hero-title"}
              onSelect={onElementSelect}
              defaultContent="The Simple 5-Second Habit for Better Health"
              isEditable={isEditable}
            />
            <TemplateEditableElement
              id="hero-subtitle"
              type="text"
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              isSelected={selectedElement === "hero-subtitle"}
              onSelect={onElementSelect}
              defaultContent="Discover the science-backed way to support your health — naturally."
              isEditable={isEditable}
            />
            <TemplateEditableElement
              id="hero-cta"
              type="button"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
              isSelected={selectedElement === "hero-cta"}
              onSelect={onElementSelect}
              defaultContent="Learn How It Works"
              isEditable={isEditable}
            />
            
            {/* Trust Badges */}
            <div className="flex items-center space-x-4 mt-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <TemplateEditableElement
                  key={i}
                  id={`trust-badge-${i}`}
                  type="image"
                  className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"
                  isSelected={selectedElement === `trust-badge-${i}`}
                  onSelect={onElementSelect}
                  defaultContent={`/placeholder.svg?height=48&width=48&text=Badge+${i}`}
                  isEditable={isEditable}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <TemplateEditableElement
              id="hero-image"
              type="image"
              className="w-full max-w-lg h-80 object-cover rounded-lg shadow-xl"
              isSelected={selectedElement === "hero-image"}
              onSelect={onElementSelect}
              defaultContent="/placeholder.svg?height=400&width=600&text=Dental+Professional"
              isEditable={isEditable}
            />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-orange-50">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <TemplateEditableElement
              id="problem-title"
              type="heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
              isSelected={selectedElement === "problem-title"}
              onSelect={onElementSelect}
              defaultContent="The Hidden Reason Your Health Isn't as Good as It Could Be"
              isEditable={isEditable}
            />
            <TemplateEditableElement
              id="problem-subtitle"
              type="text"
              className="text-xl text-gray-700 mb-8 font-semibold"
              isSelected={selectedElement === "problem-subtitle"}
              onSelect={onElementSelect}
              defaultContent="A New Way to Support Your Health From the Inside Out"
              isEditable={isEditable}
            />
            
            {/* Benefits List */}
            <div className="space-y-4 mb-8">
              {[
                "Supports your body's natural processes",
                "Made with natural, plant-based ingredients",
                "Easy to use daily routine",
                "Backed by scientific research"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                  <TemplateEditableElement
                    id={`benefit-${i + 1}`}
                    type="text"
                    className="text-gray-700"
                    isSelected={selectedElement === `benefit-${i + 1}`}
                    onSelect={onElementSelect}
                    defaultContent={benefit}
                    isEditable={isEditable}
                  />
                </div>
              ))}
            </div>
            
            <TemplateEditableElement
              id="problem-cta"
              type="button"
              className="inline-flex items-center justify-center px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              isSelected={selectedElement === "problem-cta"}
              onSelect={onElementSelect}
              defaultContent="See the Full Ingredient List & Research"
              isEditable={isEditable}
            />
          </div>
          <div className="flex justify-center">
            <Card className="bg-orange-100 p-8 max-w-sm">
              <CardContent className="p-0 text-center">
                <TemplateEditableElement
                  id="bacteria-image"
                  type="image"
                  className="w-full h-48 object-contain mb-4"
                  isSelected={selectedElement === "bacteria-image"}
                  onSelect={onElementSelect}
                  defaultContent="/placeholder.svg?height=200&width=300&text=Bacteria+Illustration"
                  isEditable={isEditable}
                />
                <TemplateEditableElement
                  id="did-you-know-title"
                  type="heading"
                  className="text-2xl font-bold text-gray-900 mb-4"
                  isSelected={selectedElement === "did-you-know-title"}
                  onSelect={onElementSelect}
                  defaultContent="Did you know..."
                  isEditable={isEditable}
                />
                <TemplateEditableElement
                  id="bacteria-fact"
                  type="text"
                  className="text-gray-700"
                  isSelected={selectedElement === "bacteria-fact"}
                  onSelect={onElementSelect}
                  defaultContent="your body has amazing natural healing abilities that just need the right support?"
                  isEditable={isEditable}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <TemplateEditableElement
            id="testimonials-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            isSelected={selectedElement === "testimonials-title"}
            onSelect={onElementSelect}
            defaultContent="People Everywhere Are Talking About This..."
            isEditable={isEditable}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sam Perkin",
              location: "Dallas, USA",
              text: "I've always taken such good care of my teeth but it always felt like I wasn't doing enough. Now, for the first time in decades, my teeth feel amazing."
            },
            {
              name: "Portia Thompson",
              location: "Florida, USA", 
              text: "It's just unbelievable how much I like ProDentim. I'm so glad my dentist recommended it to me!"
            },
            {
              name: "Theo Franklin",
              location: "Chicago, USA",
              text: "My gums have never looked better. It feels so good to not have to worry about my teeth. I simply love it!"
            }
          ].map((testimonial, i) => (
            <Card key={i} className="text-center p-6">
              <CardContent className="p-0">
                <TemplateEditableElement
                  id={`testimonial-${i + 1}-avatar`}
                  type="image"
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  isSelected={selectedElement === `testimonial-${i + 1}-avatar`}
                  onSelect={onElementSelect}
                  defaultContent={`/placeholder.svg?height=80&width=80&text=${testimonial.name.split(' ')[0]}`}
                  isEditable={isEditable}
                />
                <TemplateEditableElement
                  id={`testimonial-${i + 1}-title`}
                  type="text"
                  className="font-semibold text-gray-900 mb-2"
                  isSelected={selectedElement === `testimonial-${i + 1}-title`}
                  onSelect={onElementSelect}
                  defaultContent={`${testimonial.name} is enjoying better oral health...`}
                  isEditable={isEditable}
                />
                <TemplateEditableElement
                  id={`testimonial-${i + 1}-text`}
                  type="text"
                  className="text-gray-600 text-sm mb-4 italic"
                  isSelected={selectedElement === `testimonial-${i + 1}-text`}
                  onSelect={onElementSelect}
                  defaultContent={`"${testimonial.text}" ${testimonial.name} - ${testimonial.location}`}
                  isEditable={isEditable}
                />
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Verified Purchase
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <TemplateEditableElement
          id="final-cta-title"
          type="heading"
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          isSelected={selectedElement === "final-cta-title"}
          onSelect={onElementSelect}
          defaultContent="Ready to See the Science and Results for Yourself?"
          isEditable={isEditable}
        />
        <TemplateEditableElement
          id="final-cta-subtitle"
          type="text"
          className="text-xl text-orange-500 mb-8 font-semibold"
          isSelected={selectedElement === "final-cta-subtitle"}
          onSelect={onElementSelect}
          defaultContent="Now available while supplies last — see how it works today."
          isEditable={isEditable}
        />
        <TemplateEditableElement
          id="final-cta-button"
          type="button"
          className="inline-flex items-center justify-center px-12 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-xl"
          isSelected={selectedElement === "final-cta-button"}
          onSelect={onElementSelect}
          defaultContent="Watch the Official Presentation"
          isEditable={isEditable}
        />
      </section>

      {/* Footer Links */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-200">
        <div className="flex justify-center space-x-8 text-sm text-gray-600">
          <TemplateEditableElement
            id="footer-link-1"
            type="text"
            className="hover:text-gray-900"
            isSelected={selectedElement === "footer-link-1"}
            onSelect={onElementSelect}
            defaultContent="Affiliate Disclaimer"
            isEditable={isEditable}
          />
          <TemplateEditableElement
            id="footer-link-2"
            type="text"
            className="hover:text-gray-900"
            isSelected={selectedElement === "footer-link-2"}
            onSelect={onElementSelect}
            defaultContent="Medical Disclaimer"
            isEditable={isEditable}
          />
          <TemplateEditableElement
            id="footer-link-3"
            type="text"
            className="hover:text-gray-900"
            isSelected={selectedElement === "footer-link-3"}
            onSelect={onElementSelect}
            defaultContent="Privacy Policy"
            isEditable={isEditable}
          />
          <TemplateEditableElement
            id="footer-link-4"
            type="text"
            className="hover:text-gray-900"
            isSelected={selectedElement === "footer-link-4"}
            onSelect={onElementSelect}
            defaultContent="Terms of Service"
            isEditable={isEditable}
          />
        </div>
      </footer>
    </div>
  )
}