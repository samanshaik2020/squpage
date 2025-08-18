"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditableElement } from "../editable-element"
import { Github, Linkedin, Mail, ExternalLink, Download, Star } from "lucide-react"

interface AIPortfolioTemplateProps {
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
  isEditable: boolean
}

export function AIPortfolioTemplate({
  selectedElement,
  onElementSelect,
  isEditable,
}: AIPortfolioTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <EditableElement
              id="portfolio-name"
              type="text"
              className="text-2xl font-bold text-gray-900"
              isSelected={selectedElement === "portfolio-name"}
              onSelect={onElementSelect}
              defaultContent="John Doe"
              isEditable={isEditable}
            />
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#skills" className="text-gray-600 hover:text-gray-900">Skills</a>
              <a href="#projects" className="text-gray-600 hover:text-gray-900">Projects</a>
              <a href="#experience" className="text-gray-600 hover:text-gray-900">Experience</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <EditableElement
              id="hero-greeting"
              type="text"
              className="text-lg text-blue-600 font-medium mb-4"
              isSelected={selectedElement === "hero-greeting"}
              onSelect={onElementSelect}
              defaultContent="Hello, I'm"
              isEditable={isEditable}
            />
            <EditableElement
              id="hero-name"
              type="heading"
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
              isSelected={selectedElement === "hero-name"}
              onSelect={onElementSelect}
              defaultContent="John Doe"
              isEditable={isEditable}
            />
            <EditableElement
              id="hero-title"
              type="text"
              className="text-2xl md:text-3xl text-gray-600 mb-6"
              isSelected={selectedElement === "hero-title"}
              onSelect={onElementSelect}
              defaultContent="Full Stack Developer"
              isEditable={isEditable}
            />
            <EditableElement
              id="hero-description"
              type="text"
              className="text-lg text-gray-600 mb-8 leading-relaxed"
              isSelected={selectedElement === "hero-description"}
              onSelect={onElementSelect}
              defaultContent="I create exceptional digital experiences through innovative web development and design. Passionate about building scalable applications that make a difference."
              isEditable={isEditable}
            />
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <EditableElement
                id="hero-cta-primary"
                type="button"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                isSelected={selectedElement === "hero-cta-primary"}
                onSelect={onElementSelect}
                defaultContent="View My Work"
                isEditable={isEditable}
              />
              <EditableElement
                id="hero-cta-secondary"
                type="button"
                className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                isSelected={selectedElement === "hero-cta-secondary"}
                onSelect={onElementSelect}
                defaultContent="Download CV"
                isEditable={isEditable}
              />
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                <Mail className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <EditableElement
              id="hero-image"
              type="image"
              className="w-80 h-80 rounded-full object-cover shadow-2xl"
              isSelected={selectedElement === "hero-image"}
              onSelect={onElementSelect}
              defaultContent="/placeholder.svg?height=320&width=320&text=Profile+Photo"
              isEditable={isEditable}
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-gray-50">
        <div className="text-center mb-16">
          <EditableElement
            id="about-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            isSelected={selectedElement === "about-title"}
            onSelect={onElementSelect}
            defaultContent="About Me"
            isEditable={isEditable}
          />
          <EditableElement
            id="about-subtitle"
            type="text"
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            isSelected={selectedElement === "about-subtitle"}
            onSelect={onElementSelect}
            defaultContent="Passionate developer with a love for creating innovative solutions"
            isEditable={isEditable}
          />
        </div>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <EditableElement
              id="about-description"
              type="text"
              className="text-lg text-gray-600 leading-relaxed mb-8"
              isSelected={selectedElement === "about-description"}
              onSelect={onElementSelect}
              defaultContent="I'm a passionate full-stack developer with over 5 years of experience creating digital solutions that matter. I specialize in modern web technologies and have a keen eye for user experience design. My journey in tech started with a curiosity about how things work, and it has evolved into a career dedicated to building applications that solve real-world problems."
              isEditable={isEditable}
            />
            <div className="grid grid-cols-2 gap-6">
              <div>
                <EditableElement
                  id="stat-1-number"
                  type="text"
                  className="text-3xl font-bold text-blue-600"
                  isSelected={selectedElement === "stat-1-number"}
                  onSelect={onElementSelect}
                  defaultContent="50+"
                  isEditable={isEditable}
                />
                <EditableElement
                  id="stat-1-label"
                  type="text"
                  className="text-gray-600"
                  isSelected={selectedElement === "stat-1-label"}
                  onSelect={onElementSelect}
                  defaultContent="Projects Completed"
                  isEditable={isEditable}
                />
              </div>
              <div>
                <EditableElement
                  id="stat-2-number"
                  type="text"
                  className="text-3xl font-bold text-blue-600"
                  isSelected={selectedElement === "stat-2-number"}
                  onSelect={onElementSelect}
                  defaultContent="5+"
                  isEditable={isEditable}
                />
                <EditableElement
                  id="stat-2-label"
                  type="text"
                  className="text-gray-600"
                  isSelected={selectedElement === "stat-2-label"}
                  onSelect={onElementSelect}
                  defaultContent="Years Experience"
                  isEditable={isEditable}
                />
              </div>
            </div>
          </div>
          <div>
            <EditableElement
              id="about-image"
              type="image"
              className="w-full h-96 rounded-lg object-cover shadow-xl"
              isSelected={selectedElement === "about-image"}
              onSelect={onElementSelect}
              defaultContent="/placeholder.svg?height=400&width=600&text=About+Image"
              isEditable={isEditable}
            />
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <EditableElement
            id="skills-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            isSelected={selectedElement === "skills-title"}
            onSelect={onElementSelect}
            defaultContent="Skills & Technologies"
            isEditable={isEditable}
          />
          <EditableElement
            id="skills-subtitle"
            type="text"
            className="text-xl text-gray-600"
            isSelected={selectedElement === "skills-subtitle"}
            onSelect={onElementSelect}
            defaultContent="Technologies I work with"
            isEditable={isEditable}
          />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Card key={i} className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <EditableElement
                    id={`skill-${i}-icon`}
                    type="text"
                    className="text-2xl"
                    isSelected={selectedElement === `skill-${i}-icon`}
                    onSelect={onElementSelect}
                    defaultContent="⚡"
                    isEditable={isEditable}
                  />
                </div>
                <EditableElement
                  id={`skill-${i}-name`}
                  type="text"
                  className="font-semibold text-gray-900 mb-2"
                  isSelected={selectedElement === `skill-${i}-name`}
                  onSelect={onElementSelect}
                  defaultContent={`Skill ${i}`}
                  isEditable={isEditable}
                />
                <EditableElement
                  id={`skill-${i}-level`}
                  type="text"
                  className="text-sm text-gray-600"
                  isSelected={selectedElement === `skill-${i}-level`}
                  onSelect={onElementSelect}
                  defaultContent="Advanced"
                  isEditable={isEditable}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-gray-50">
        <div className="text-center mb-16">
          <EditableElement
            id="projects-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            isSelected={selectedElement === "projects-title"}
            onSelect={onElementSelect}
            defaultContent="Featured Projects"
            isEditable={isEditable}
          />
          <EditableElement
            id="projects-subtitle"
            type="text"
            className="text-xl text-gray-600"
            isSelected={selectedElement === "projects-subtitle"}
            onSelect={onElementSelect}
            defaultContent="Some of my recent work"
            isEditable={isEditable}
          />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden hover:shadow-xl transition-shadow">
              <EditableElement
                id={`project-${i}-image`}
                type="image"
                className="w-full h-48 object-cover"
                isSelected={selectedElement === `project-${i}-image`}
                onSelect={onElementSelect}
                defaultContent={`/placeholder.svg?height=200&width=400&text=Project+${i}`}
                isEditable={isEditable}
              />
              <CardContent className="p-6">
                <EditableElement
                  id={`project-${i}-title`}
                  type="heading"
                  className="text-xl font-semibold text-gray-900 mb-2"
                  isSelected={selectedElement === `project-${i}-title`}
                  onSelect={onElementSelect}
                  defaultContent={`Project ${i}`}
                  isEditable={isEditable}
                />
                <EditableElement
                  id={`project-${i}-description`}
                  type="text"
                  className="text-gray-600 mb-4"
                  isSelected={selectedElement === `project-${i}-description`}
                  onSelect={onElementSelect}
                  defaultContent={`Description of project ${i} and the technologies used to build it.`}
                  isEditable={isEditable}
                />
                <div className="flex flex-wrap gap-2 mb-4">
                  {[1, 2, 3].map((tag) => (
                    <EditableElement
                      key={tag}
                      id={`project-${i}-tag-${tag}`}
                      type="text"
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      isSelected={selectedElement === `project-${i}-tag-${tag}`}
                      onSelect={onElementSelect}
                      defaultContent={`Tech${tag}`}
                      isEditable={isEditable}
                    />
                  ))}
                </div>
                <div className="flex space-x-4">
                  <Button size="sm" variant="outline">
                    <Github className="w-4 h-4 mr-2" />
                    Code
                  </Button>
                  <Button size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <EditableElement
            id="experience-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            isSelected={selectedElement === "experience-title"}
            onSelect={onElementSelect}
            defaultContent="Work Experience"
            isEditable={isEditable}
          />
        </div>
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-8">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <EditableElement
                      id={`experience-${i}-title`}
                      type="heading"
                      className="text-xl font-semibold text-gray-900"
                      isSelected={selectedElement === `experience-${i}-title`}
                      onSelect={onElementSelect}
                      defaultContent={`Job Title ${i}`}
                      isEditable={isEditable}
                    />
                    <EditableElement
                      id={`experience-${i}-company`}
                      type="text"
                      className="text-blue-600 font-medium"
                      isSelected={selectedElement === `experience-${i}-company`}
                      onSelect={onElementSelect}
                      defaultContent={`Company Name ${i}`}
                      isEditable={isEditable}
                    />
                  </div>
                  <EditableElement
                    id={`experience-${i}-duration`}
                    type="text"
                    className="text-gray-600"
                    isSelected={selectedElement === `experience-${i}-duration`}
                    onSelect={onElementSelect}
                    defaultContent="2020 - Present"
                    isEditable={isEditable}
                  />
                </div>
                <EditableElement
                  id={`experience-${i}-description`}
                  type="text"
                  className="text-gray-600"
                  isSelected={selectedElement === `experience-${i}-description`}
                  onSelect={onElementSelect}
                  defaultContent={`Description of responsibilities and achievements at job ${i}.`}
                  isEditable={isEditable}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-gray-50">
        <div className="text-center mb-16">
          <EditableElement
            id="contact-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            isSelected={selectedElement === "contact-title"}
            onSelect={onElementSelect}
            defaultContent="Let's Work Together"
            isEditable={isEditable}
          />
          <EditableElement
            id="contact-subtitle"
            type="text"
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            isSelected={selectedElement === "contact-subtitle"}
            onSelect={onElementSelect}
            defaultContent="Have a project in mind? Let's discuss how we can bring your ideas to life."
            isEditable={isEditable}
          />
        </div>
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <EditableElement
                    id="contact-email-label"
                    type="text"
                    className="block text-sm font-medium text-gray-700 mb-2"
                    isSelected={selectedElement === "contact-email-label"}
                    onSelect={onElementSelect}
                    defaultContent="Email"
                    isEditable={isEditable}
                  />
                  <EditableElement
                    id="contact-email"
                    type="text"
                    className="text-blue-600"
                    isSelected={selectedElement === "contact-email"}
                    onSelect={onElementSelect}
                    defaultContent="john@example.com"
                    isEditable={isEditable}
                  />
                </div>
                <div>
                  <EditableElement
                    id="contact-phone-label"
                    type="text"
                    className="block text-sm font-medium text-gray-700 mb-2"
                    isSelected={selectedElement === "contact-phone-label"}
                    onSelect={onElementSelect}
                    defaultContent="Phone"
                    isEditable={isEditable}
                  />
                  <EditableElement
                    id="contact-phone"
                    type="text"
                    className="text-gray-900"
                    isSelected={selectedElement === "contact-phone"}
                    onSelect={onElementSelect}
                    defaultContent="+1 (555) 123-4567"
                    isEditable={isEditable}
                  />
                </div>
              </div>
              <div className="text-center">
                <EditableElement
                  id="contact-cta"
                  type="button"
                  className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  isSelected={selectedElement === "contact-cta"}
                  onSelect={onElementSelect}
                  defaultContent="Get In Touch"
                  isEditable={isEditable}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto border-t border-gray-200">
        <div className="text-center">
          <EditableElement
            id="footer-text"
            type="text"
            className="text-gray-600"
            isSelected={selectedElement === "footer-text"}
            onSelect={onElementSelect}
            defaultContent="© 2024 John Doe. All rights reserved."
            isEditable={isEditable}
          />
        </div>
      </footer>
    </div>
  )
}