"use client"
import { Card, CardContent } from "@/components/ui/card"
import { TemplateEditableElement } from "./template-editable-element"

interface PortfolioTemplateProps {
  selectedElement: string | null
  onElementSelect: (elementId: string) => void
  isEditable: boolean // Added prop
}

export function PortfolioTemplate({ selectedElement, onElementSelect, isEditable }: PortfolioTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <TemplateEditableElement
              id="nav-name"
              type="text"
              className="text-xl font-bold text-gray-900"
              isSelected={selectedElement === "nav-name"}
              onSelect={onElementSelect}
              defaultContent="John Doe"
              isEditable={isEditable} // Pass prop
            />
            <div className="hidden md:flex items-center space-x-8">
              <TemplateEditableElement
                id="nav-about"
                type="text"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                isSelected={selectedElement === "nav-about"}
                onSelect={onElementSelect}
                defaultContent="About"
                isEditable={isEditable} // Pass prop
              />
              <TemplateEditableElement
                id="nav-projects"
                type="text"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                isSelected={selectedElement === "nav-projects"}
                onSelect={onElementSelect}
                defaultContent="Projects"
                isEditable={isEditable} // Pass prop
              />
              <TemplateEditableElement
                id="nav-skills"
                type="text"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                isSelected={selectedElement === "nav-skills"}
                onSelect={onElementSelect}
                defaultContent="Skills"
                isEditable={isEditable} // Pass prop
              />
              <TemplateEditableElement
                id="nav-contact"
                type="text"
                className="text-gray-600 hover:text-gray-900 cursor-pointer"
                isSelected={selectedElement === "nav-contact"}
                onSelect={onElementSelect}
                defaultContent="Contact"
                isEditable={isEditable} // Pass prop
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <TemplateEditableElement
                id="hero-greeting"
                type="text"
                className="text-lg text-blue-600 font-medium mb-4"
                isSelected={selectedElement === "hero-greeting"}
                onSelect={onElementSelect}
                defaultContent="Hello, I'm"
                isEditable={isEditable} // Pass prop
              />
              <TemplateEditableElement
                id="hero-name"
                type="heading"
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
                isSelected={selectedElement === "hero-name"}
                onSelect={onElementSelect}
                defaultContent="John Doe"
                isEditable={isEditable} // Pass prop
              />
              <TemplateEditableElement
                id="hero-title"
                type="text"
                className="text-2xl text-gray-600 mb-6"
                isSelected={selectedElement === "hero-title"}
                onSelect={onElementSelect}
                defaultContent="Full-Stack Developer & UI/UX Designer"
                isEditable={isEditable} // Pass prop
              />
              <TemplateEditableElement
                id="hero-description"
                type="text"
                className="text-lg text-gray-600 mb-8 leading-relaxed"
                isSelected={selectedElement === "hero-description"}
                onSelect={onElementSelect}
                defaultContent="I create beautiful, functional, and user-centered digital experiences. With 5+ years of experience in web development and design."
                isEditable={isEditable} // Pass prop
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <TemplateEditableElement
                  id="hero-cta-primary"
                  type="button"
                  size="lg"
                  isSelected={selectedElement === "hero-cta-primary"}
                  onSelect={onElementSelect}
                  defaultContent="View My Work"
                  isEditable={isEditable} // Pass prop
                />
                <TemplateEditableElement
                  id="hero-cta-secondary"
                  type="button"
                  variant="outline"
                  size="lg"
                  isSelected={selectedElement === "hero-cta-secondary"}
                  onSelect={onElementSelect}
                  defaultContent="Download CV"
                  isEditable={isEditable} // Pass prop
                />
              </div>
            </div>
            <div className="relative">
              <TemplateEditableElement
                id="hero-profile-image"
                type="image"
                className="w-80 h-80 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center"
                isSelected={selectedElement === "hero-profile-image"}
                onSelect={onElementSelect}
                defaultContent="/placeholder.svg?height=320&width=320&text=Profile+Photo"
                isEditable={isEditable} // Pass prop
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <TemplateEditableElement
              id="about-title"
              type="heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              isSelected={selectedElement === "about-title"}
              onSelect={onElementSelect}
              defaultContent="About Me"
              isEditable={isEditable} // Pass prop
            />
            <TemplateEditableElement
              id="about-subtitle"
              type="text"
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              isSelected={selectedElement === "about-subtitle"}
              onSelect={onElementSelect}
              defaultContent="Passionate about creating digital solutions that make a difference"
              isEditable={isEditable} // Pass prop
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <TemplateEditableElement
                id="about-description"
                type="text"
                className="text-lg text-gray-600 leading-relaxed mb-6"
                isSelected={selectedElement === "about-description"}
                onSelect={onElementSelect}
                defaultContent="I'm a passionate full-stack developer with a keen eye for design. I love turning complex problems into simple, beautiful, and intuitive solutions. When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through blog posts and mentoring."
                isEditable={isEditable} // Pass prop
              />
              <TemplateEditableElement
                id="about-experience"
                type="text"
                className="text-lg text-gray-600 leading-relaxed"
                isSelected={selectedElement === "about-experience"}
                onSelect={onElementSelect}
                defaultContent="With over 5 years of experience in the industry, I've had the privilege of working with startups and established companies, helping them bring their digital visions to life."
                isEditable={isEditable} // Pass prop
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: "50+", label: "Projects Completed" },
                { number: "5+", label: "Years Experience" },
                { number: "30+", label: "Happy Clients" },
                { number: "15+", label: "Technologies" },
              ].map((stat, index) => (
                <Card key={index} className="text-center p-6">
                  <TemplateEditableElement
                    id={`stat-${index}-number`}
                    type="text"
                    className="text-3xl font-bold text-blue-600 mb-2"
                    isSelected={selectedElement === `stat-${index}-number`}
                    onSelect={onElementSelect}
                    defaultContent={stat.number}
                    isEditable={isEditable} // Pass prop
                  />
                  <TemplateEditableElement
                    id={`stat-${index}-label`}
                    type="text"
                    className="text-gray-600"
                    isSelected={selectedElement === `stat-${index}-label`}
                    onSelect={onElementSelect}
                    defaultContent={stat.label}
                    isEditable={isEditable} // Pass prop
                  />
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <TemplateEditableElement
              id="skills-title"
              type="heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              isSelected={selectedElement === "skills-title"}
              onSelect={onElementSelect}
              defaultContent="Skills & Technologies"
              isEditable={isEditable} // Pass prop
            />
            <TemplateEditableElement
              id="skills-subtitle"
              type="text"
              className="text-xl text-gray-600"
              isSelected={selectedElement === "skills-subtitle"}
              onSelect={onElementSelect}
              defaultContent="Technologies I love working with"
              isEditable={isEditable} // Pass prop
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                category: "Frontend",
                skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"],
              },
              {
                category: "Backend",
                skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "GraphQL"],
              },
              {
                category: "Tools & Others",
                skills: ["Git", "Docker", "AWS", "Figma", "Vercel"],
              },
            ].map((skillGroup, groupIndex) => (
              <Card key={groupIndex} className="p-6">
                <TemplateEditableElement
                  id={`skill-group-${groupIndex}-title`}
                  type="text"
                  className="text-xl font-semibold text-gray-900 mb-4"
                  isSelected={selectedElement === `skill-group-${groupIndex}-title`}
                  onSelect={onElementSelect}
                  defaultContent={skillGroup.category}
                  isEditable={isEditable} // Pass prop
                />
                <div className="flex flex-wrap gap-2">
                  {skillGroup.skills.map((skill, skillIndex) => (
                    <TemplateEditableElement
                      key={skillIndex}
                      id={`skill-${groupIndex}-${skillIndex}`}
                      type="badge"
                      variant="secondary"
                      isSelected={selectedElement === `skill-${groupIndex}-${skillIndex}`}
                      onSelect={onElementSelect}
                      defaultContent={skill}
                      isEditable={isEditable} // Pass prop
                    />
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <TemplateEditableElement
              id="projects-title"
              type="heading"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              isSelected={selectedElement === "projects-title"}
              onSelect={onElementSelect}
              defaultContent="Featured Projects"
              isEditable={isEditable} // Pass prop
            />
            <TemplateEditableElement
              id="projects-subtitle"
              type="text"
              className="text-xl text-gray-600"
              isSelected={selectedElement === "projects-subtitle"}
              onSelect={onElementSelect}
              defaultContent="Some of my recent work"
              isEditable={isEditable} // Pass prop
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "E-commerce Platform",
                description: "Full-stack e-commerce solution with React, Node.js, and Stripe integration",
                tech: ["React", "Node.js", "MongoDB"],
                image: "/placeholder.svg?height=200&width=350&text=E-commerce+Project",
              },
              {
                title: "Task Management App",
                description: "Collaborative task management tool with real-time updates",
                tech: ["Next.js", "TypeScript", "Prisma"],
                image: "/placeholder.svg?height=200&width=350&text=Task+Management+App",
              },
              {
                title: "Portfolio Website",
                description: "Responsive portfolio website with modern design and animations",
                tech: ["React", "Tailwind", "Framer Motion"],
                image: "/placeholder.svg?height=200&width=350&text=Portfolio+Website",
              },
            ].map((project, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <TemplateEditableElement
                  id={`project-${index}-image`}
                  type="image"
                  className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center"
                  isSelected={selectedElement === `project-${index}-image`}
                  onSelect={onElementSelect}
                  defaultContent={project.image}
                  isEditable={isEditable} // Pass prop
                />
                <CardContent className="p-6">
                  <TemplateEditableElement
                    id={`project-${index}-title`}
                    type="text"
                    className="text-xl font-semibold text-gray-900 mb-2"
                    isSelected={selectedElement === `project-${index}-title`}
                    onSelect={onElementSelect}
                    defaultContent={project.title}
                    isEditable={isEditable} // Pass prop
                  />
                  <TemplateEditableElement
                    id={`project-${index}-description`}
                    type="text"
                    className="text-gray-600 mb-4"
                    isSelected={selectedElement === `project-${index}-description`}
                    onSelect={onElementSelect}
                    defaultContent={project.description}
                    isEditable={isEditable} // Pass prop
                  />
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <TemplateEditableElement
                        key={techIndex}
                        id={`project-${index}-tech-${techIndex}`}
                        type="badge"
                        variant="outline"
                        className="text-xs"
                        isSelected={selectedElement === `project-${index}-tech-${techIndex}`}
                        onSelect={onElementSelect}
                        defaultContent={tech}
                        isEditable={isEditable} // Pass prop
                      />
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <TemplateEditableElement
                      id={`project-${index}-demo`}
                      type="button"
                      size="sm"
                      isSelected={selectedElement === `project-${index}-demo`}
                      onSelect={onElementSelect}
                      defaultContent="Live Demo"
                      isEditable={isEditable} // Pass prop
                    />
                    <TemplateEditableElement
                      id={`project-${index}-code`}
                      type="button"
                      variant="outline"
                      size="sm"
                      isSelected={selectedElement === `project-${index}-code`}
                      onSelect={onElementSelect}
                      defaultContent="View Code"
                      isEditable={isEditable} // Pass prop
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <TemplateEditableElement
            id="contact-title"
            type="heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            isSelected={selectedElement === "contact-title"}
            onSelect={onElementSelect}
            defaultContent="Let's Work Together"
            isEditable={isEditable} // Pass prop
          />
          <TemplateEditableElement
            id="contact-description"
            type="text"
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            isSelected={selectedElement === "contact-description"}
            onSelect={onElementSelect}
            defaultContent="I'm always interested in new opportunities and exciting projects. Let's discuss how we can bring your ideas to life."
            isEditable={isEditable} // Pass prop
          />

          <div className="flex justify-center space-x-6 mb-8">
            <TemplateEditableElement
              id="contact-email"
              type="button"
              variant="outline"
              size="lg"
              isSelected={selectedElement === "contact-email"}
              onSelect={onElementSelect}
              defaultContent="john@example.com"
              isEditable={isEditable} // Pass prop
            />
            <TemplateEditableElement
              id="contact-linkedin"
              type="button"
              variant="outline"
              size="lg"
              isSelected={selectedElement === "contact-linkedin"}
              onSelect={onElementSelect}
              defaultContent="LinkedIn"
              isEditable={isEditable} // Pass prop
            />
            <TemplateEditableElement
              id="contact-github"
              type="button"
              variant="outline"
              size="lg"
              isSelected={selectedElement === "contact-github"}
              onSelect={onElementSelect}
              defaultContent="GitHub"
              isEditable={isEditable} // Pass prop
            />
          </div>

          <TemplateEditableElement
            id="contact-cta"
            type="button"
            size="lg"
            className="px-8 py-3"
            isSelected={selectedElement === "contact-cta"}
            onSelect={onElementSelect}
            defaultContent="Get In Touch"
            isEditable={isEditable} // Pass prop
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <TemplateEditableElement
            id="footer-copyright"
            type="text"
            className="text-gray-400"
            isSelected={selectedElement === "footer-copyright"}
            onSelect={onElementSelect}
            defaultContent="© 2024 John Doe. All rights reserved."
            isEditable={isEditable} // Pass prop
          />
        </div>
      </footer>
    </div>
  )
}
