import React from "react";

// Project technical details
const techStack = {
  languages: [
      { name: "TypeScript/JavaScript", usage: "Primary programming languages" },
      { name: "CSS/SCSS", usage: "Styling and animations" },
      { name: "HTML", usage: "Markup language" },
  ],
  frameworks: [
      { name: "Next.js 14", usage: "React framework with server components" },
      { name: "TailwindCSS", usage: "Utility-first CSS framework" },
  ],
  libraries: [
      { name: "React", usage: "UI library" },
      { name: "Prisma", usage: "Database ORM" },
      { name: "NextAuth.js", usage: "Authentication" },
      { name: "Lucide Icons", usage: "Icon library" },
      { name: "Cheerio", usage: "Web scraping" },
      { name: "Framer Motion", usage: "Animations" },
      { name: "TipTap", usage: "Rich text editor" },
      { name: "Recharts", usage: "Dashboard charts" },
  ],
  tools: [
      { name: "VS Code", usage: "IDE" },
      { name: "Git", usage: "Version control" },
      { name: "Postman", usage: "API testing" },
  ]
};

// Learning resources
const resources = [
  { name: "Next.js Documentation", url: "https://nextjs.org/docs" },
  { name: "React Documentation", url: "https://react.dev" },
  { name: "TailwindCSS Documentation", url: "https://tailwindcss.com/docs" },
  { name: "Prisma Documentation", url: "https://www.prisma.io/docs" },
  { name: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/" },
];

// Short descriptions for each main folder/file
const structure = [
{
  name: "src/app",
  desc: "Main application directory containing all route handlers, pages, and API endpoints.",
  children: [
    { name: "about-us/", desc: "About Us page." },
    { name: "afya/", desc: "Health news section." },
    { name: "ajira/", desc: "Jobs and career news section." },
    { name: "api/", desc: "API route handlers for articles, users, comments, etc." },
    { name: "auth/", desc: "Authentication pages (sign in, sign up, password reset)." },
    { name: "burudani/", desc: "Entertainment news section." },
    { name: "dashboard/", desc: "Admin dashboard for managing articles, users, and settings." },
    { name: "eastafrica/", desc: "East Africa news section." },
    { name: "habari/", desc: "General news section and dynamic article pages." },
    { name: "kimataifa/", desc: "International news section." },
    { name: "michezo/", desc: "Sports news section." },
    { name: "tehama/", desc: "Technology news section." },
    { name: "test/", desc: "Testing and experimental pages." },
    { name: "globals.css", desc: "Global styles for the app." },
    { name: "layout.tsx", desc: "Root layout component for the app." },
    { name: "not-found.tsx", desc: "Custom 404 page." },
    { name: "page.tsx", desc: "Landing page of the application." },
  ],
},
{
  name: "src/components",
  desc: "Reusable UI components and widgets.",
  children: [
    { name: "dashboard/", desc: "Dashboard-specific components (articles, sidebar, editor, etc)." },
    { name: "providers/", desc: "Context and provider components (e.g., session provider)." },
    { name: "ui/", desc: "Document UI components (buttons, cards, dialogs, etc)." },
    { name: "ArticleComp.tsx", desc: "Displays a single article with details." },
    { name: "CommentForm.tsx", desc: "Form for submitting comments on articles." },
    { name: "FollowUs.tsx", desc: "Social media follow buttons." },
    { name: "Footer.tsx", desc: "Site footer." },
    { name: "HotNewsBanner.tsx", desc: "Banner for hot/trending news." },
    { name: "ImageUpload.tsx", desc: "Image upload component." },
    { name: "LikeBtn.tsx", desc: "Like button for articles." },
    { name: "NavBar.tsx", desc: "Main navigation bar." },
    { name: "NewCard.tsx", desc: "Card component for news items." },
    { name: "PopularSideBar.tsx", desc: "Sidebar showing popular articles." },
    { name: "RecentNews.tsx", desc: "Widget for recent news." },
    { name: "SearchFilters.tsx", desc: "Search and filter controls." },
    { name: "SignOutButton.tsx", desc: "Sign out button." },
    { name: "subscribe.tsx", desc: "Newsletter subscription form." },
    { name: "SummaryCard.tsx", desc: "Summary/statistics card for dashboard." },
  ],
},
{
  name: "src/lib",
  desc: "Utility libraries and helper functions.",
  children: [
    { name: "auth.ts", desc: "Authentication helpers." },
    { name: "email.js", desc: "Email sending utilities." },
    { name: "passwordGen.ts", desc: "Password generation utilities." },
    { name: "prisma.ts", desc: "Prisma ORM client setup." },
    { name: "tehama.js", desc: "Technology news scraping/utilities." },
    { name: "user.ts", desc: "User-related helpers." },
    { name: "utils.ts", desc: "General utility functions." },
  ],
},
{
  name: "src/types",
  desc: "TypeScript type definitions.",
  children: [
    { name: "next-auth.d.ts", desc: "Types for NextAuth authentication." },
  ],
},
];

function renderTechStack(stack: Record<string, Array<{ name: string; usage: string }>>) {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stack).map(([category, items]) => (
              <div key={category} className="bg-white p-6 rounded-md shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-gray-900 capitalize mb-4 border-b pb-2">{category}</h3>
                  <ul className="space-y-3">
                      {items.map((item) => (
                          <li key={item.name} className="flex flex-col">
                              <span className="font-semibold text-gray-800">{item.name}</span>
                              <span className="text-gray-600 text-sm">{item.usage}</span>
                          </li>
                      ))}
                  </ul>
              </div>
          ))}
      </div>
  );
}

function renderResources(resources: Array<{ name: string; url: string }>) {
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => (
              <a 
                  key={resource.name}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-md shadow-sm hover:shadow-md transition-all hover:bg-gray-50 flex items-center justify-between"
              >
                  <span className="font-medium text-gray-900">{resource.name}</span>
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
              </a>
          ))}
      </div>
  );
}

function renderStructure(items: Array<{
  name: string;
  desc: string;
  children?: Array<{ name: string; desc: string }>;
}>) {
  return (
      <div className="space-y-6">
          {items.map((item) => (
              <div key={item.name} className="bg-white p-6 rounded-md shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                      <span className="text-sm text-gray-600">{item.desc}</span>
                  </div>
                  {item.children && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.children.map((child) => (
                              <div key={child.name} className="p-3 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors">
                                  <div className="font-mono text-sm text-gray-800">{child.name}</div>
                                  <div className="text-sm text-gray-600">{child.desc}</div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          ))}
      </div>
  );
}

export default function StructurePage() {
  return (
      <div className="min-h-screen bg-[#fafbfc] py-10 px-4 pt-20">
          <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Project Structure & Technical Details</h1>
                
              <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h2>
                  {renderTechStack(techStack)}
              </section>

              <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Resources</h2>
                  {renderResources(resources)}
              </section>

              <section className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Structure</h2>
                  <p className="text-gray-700 mb-6">
                      Below is the folder and file structure of the Newsfy project, with short descriptions for each major part:
                  </p>
                  {renderStructure(structure)}
              </section>
          </div>
      </div>
  );
}