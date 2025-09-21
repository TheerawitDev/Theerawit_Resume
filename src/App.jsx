import { useMemo, useState, useEffect } from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Globe, Moon, Sun, Printer, Link as LinkIcon, Search, X } from "lucide-react";

const ThemeBootstrap = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
(function(){
  try{
    var t = localStorage.getItem('theme');
    if(!t){ t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    if(t === 'dark') document.documentElement.classList.add('dark');
  }catch(_){}
})();
      `.trim(),
    }}
  />
);

// -----------------------------------------------------
// 1) DATA
// -----------------------------------------------------
const DATA = {
  profile: {
    name: "Theerawit Waithayawan",
    role: "Software Developer / Programmer",
    summary:
      "Beginner software developer learning to build web applications, with a strong focus on Python and growing skills in full-stack development.",
    location: "Bangkok, Thailand",
    avatar: {
      src: import.meta.env.BASE_URL + "me.jpg", 
      alt: "Portrait of Theerawit <3",
    },
    contacts: [
      { type: "email", label: "pm.theerawit@gmail.com", href: "mailto:pm.theerawit@gmail.com", icon: Mail },
      { type: "phone", label: "+66 95 192 4253", href: "tel:+66951924253", icon: Phone },
      { type: "github", label: "github.com/TheerawitDev", href: "https://github.com/TheerawitDev", icon: Github },
      { type: "linkedin", label: "linkedin.com/in/theerawit-waithayawan", href: "https://www.linkedin.com/in/theerawit-waithayawan-0b9348338", icon: Linkedin },
    ],
  },
  experience: [
    {
      role: "Intern",
      company: "i-bitz Company Limited",
      period: "Mar 2024 – Apr 2024",
      bullets: [
        "Completed a professional internship, demonstrating strong technical skills and work ethic",
        "Contributed to software development projects, applying knowledge of programming and system design",
        "Gained experience in professional workflows, collaboration, and project presentation",
      ],
      tech: ["React", "Docker", "Python"],
    },

  ],
  projects: [
    {
      name: "ScholarGuide",
      description: "Website providing guidance on studying abroad https://scholarguide.net", 
      link: "https://scholarguide.net/",
      tags: ["wordpress"],
    },

  ],
  skills: {
    hard: ["Python", "React", "Node.js", "Git", "Docker"],
    soft: ["Clear Communication", "Teamwork", "Systematic Problem Solving", "Quick Learner"],
    languages: [
      { name: "Thai", level: "Native" },
      { name: "English", level: "B1 (KUEXITE 64)" },
    ],
  },
  education: [
    {
      degree: "High School Diploma",
      school: "Bodindecha (Sing Singhaseni) School",
      period: "2017 – 2024",
      extra: "",
    },
    {
      degree: "Bachelor of Computer Engineering",
      school: "Kasetsart University",
      period: "2024 – Present",
      extra: "",
    },
  ],
  awards: [
    { 
      title: "Ambassador – Hiroshima Junior International Forum", 
      org: "Hiroshima Prefecture", 
      year: "2023" 
    },
  ],
};

// -----------------------------------------------------
// 2) UI Primitives
// -----------------------------------------------------
function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs md:text-sm bg-gray-100 dark:bg-zinc-800 dark:text-zinc-200 shadow-sm">
      {children}
    </span>
  );
}

function Section({ title, children, id }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-3 md:mb-4">
        {title}
      </h2>
      <div className="space-y-3 md:space-y-4">{children}</div>
    </section>
  );
}

function ExternalLink({ href, children, className }) {
  const external = /^https?:\/\//i.test(href);
  return (
    <a
      href={href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function Header({ onPrint, dark, toggleDark }) {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-zinc-950/60 bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <div className="flex items-center justify-between py-3 md:py-4">
          <nav className="hidden md:flex gap-4 text-sm">
            {[
              ["About", "about"],
              ["Experience", "experience"],
              ["Projects", "projects"],
              ["Skills", "skills"],
              ["Education", "education"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <a key={id} href={`#${id}`} className="hover:underline">
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 hover:shadow-sm"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={onPrint}
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 hover:shadow-sm"
              aria-label="Print / Save as PDF"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function ContactList({ contacts, location }) {
  return (
    <ul className="flex flex-wrap gap-2 md:gap-3">
      {location && (
        <li>
          <Badge>
            <MapPin className="w-3.5 h-3.5" /> <span className="sr-only">Location:</span> {location}
          </Badge>
        </li>
      )}
      {contacts.map((c) => {
        const key = `${c.type}-${c.label}`;
        return (
          <li key={key}>
            <ExternalLink href={c.href} className="group">
              <Badge>
                {c.icon ? (
                  <c.icon className="w-3.5 h-3.5" />
                ) : (
                  <LinkIcon className="w-3.5 h-3.5" />
                )} {c.label}
              </Badge>
            </ExternalLink>
          </li>
        );
      })}
    </ul>
  );
}

function ExperienceItem({ item }) {
  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 md:p-5 bg-white dark:bg-zinc-950 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-base md:text-lg leading-tight">
            {item.role} <span className="text-zinc-500">·</span> {item.company}
          </h3>
          <p className="text-sm text-zinc-500">{item.period}</p>
        </div>
        <div className="flex flex-wrap gap-1.5 max-w-[50%] justify-end">
          {item.tech?.map((t) => (
            <span key={`${item.company}-${t}`} className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
              {t}
            </span>
          ))}
        </div>
      </div>
      <ul className="list-disc pl-5 mt-3 space-y-1">
        {item.bullets.map((b, i) => (
          <li key={`${item.company}-b-${i}`} className="text-sm md:text-base leading-relaxed">{b}</li>
        ))}
      </ul>
    </div>
  );
}

function ProjectCard({ p }) {
  return (
    <ExternalLink
      href={p.link}
      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 md:p-5 bg-white dark:bg-zinc-950 shadow-sm block hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-base md:text-lg leading-tight">{p.name}</h3>
        <div className="flex flex-wrap gap-1.5">
          {p.tags?.map((t) => (
            <span key={`${p.name}-${t}`} className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800">
              {t}
            </span>
          ))}
        </div>
      </div>
      <p className="mt-2 text-sm md:text-base text-zinc-600 dark:text-zinc-300">{p.description}</p>
    </ExternalLink>
  );
}

function Skills({ skills }) {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950">
        <h4 className="font-semibold mb-2">Hard Skills</h4>
        <ul className="flex flex-wrap gap-2">
          {skills.hard.map((s) => (
            <span key={`hard-${s}`} className="text-xs md:text-sm px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
              {s}
            </span>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950">
        <h4 className="font-semibold mb-2">Soft Skills</h4>
        <ul className="flex flex-wrap gap-2">
          {skills.soft.map((s) => (
            <span key={`soft-${s}`} className="text-xs md:text-sm px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
              {s}
            </span>
          ))}
        </ul>
      </div>
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950">
        <h4 className="font-semibold mb-2">Languages</h4>
        <ul className="space-y-1">
          {skills.languages.map((l) => (
            <li key={`lang-${l.name}`} className="text-sm md:text-base">
              <span className="font-medium">{l.name}</span> · {l.level}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Avatar({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="
        avatar
        w-[140px] h-[140px] md:w-[160px] md:h-[160px]
        rounded-2xl object-cover ring-2 ring-zinc-200 dark:ring-zinc-800 shadow-md
        print:hidden
      "
      loading="eager"
      decoding="async"
    />
  );
}


// -----------------------------------------------------
// 3) APP
// -----------------------------------------------------
export default function App() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return true;
    const ls = localStorage.getItem("theme");
    if (ls) return ls === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [query, setQuery] = useState("");
  const toggleDark = () => setDark((v) => !v);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch {}
  }, [dark]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e) => {
      const stored = localStorage.getItem("theme");
      if (!stored) setDark(e.matches);
    };
    mq.addEventListener?.("change", onChange);
    mq.addListener?.(onChange); 
    return () => {
      mq.removeEventListener?.("change", onChange);
      mq.removeListener?.(onChange);
    };
  }, []);

  const filteredProjects = useMemo(() => {
    if (!query.trim()) return DATA.projects;
    const q = query.toLowerCase();
    return DATA.projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [query]);

  const handlePrint = () => window.print();

  const portfolioHref = DATA.profile.contacts.find((c) => c.type === "portfolio")?.href || undefined;
  const sameAs = DATA.profile.contacts.filter((c) => /^https?:\/\//i.test(c.href)).map((c) => c.href);


  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100">
      {/* Prevent theme flash */}
      <ThemeBootstrap />

      {/* Skip to content for a11y */}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:bg-white dark:focus:bg-zinc-900 focus:px-3 focus:py-2 focus:rounded">
        Skip to content
      </a>

      <Header onPrint={handlePrint} dark={dark} toggleDark={() => setDark((v) => !v)} />

      <main id="main" className="mx-auto max-w-4xl px-4 md:px-6 pb-16" role="main">
        {/* Hero */}
        <section className="pt-8 md:pt-12 pb-6">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 bg-white dark:bg-zinc-950 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {DATA.profile.name}
                </h1>
                <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 mt-1">
                  {DATA.profile.role}
                </p>
                <p className="mt-3 md:mt-4 text-sm md:text-base leading-relaxed max-w-2xl">
                  {DATA.profile.summary}
                </p>
                <div className="mt-4 md:mt-5">
                  <ContactList contacts={DATA.profile.contacts} location={DATA.profile.location} />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 min-w-[240px]">
                {DATA.profile.avatar?.src && (
                  <Avatar src={DATA.profile.avatar.src} alt={DATA.profile.avatar.alt} />
                )}
                <a
                  href="#projects"
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-center hover:shadow-sm w-full"
                  aria-label="Jump to projects"
                >
                  View Projects
                </a>
                <a
                  href="#contact"
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-center hover:shadow-sm w-full"
                  aria-label="Jump to contact"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <Section title="About" id="about">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 md:p-6 bg-white dark:bg-zinc-950">
            <p className="text-sm md:text-base leading-relaxed">
              I am a beginner software developer who is learning to build full-stack web applications. I enjoy working with JavaScript, React, Next.js, 
              Node.js, and Python, and I am focused on improving step by step through projects and practice.Node.js, and Python, 
              and I am focused on improving step by step through projects and practice.Node.js,
              and Python, and I am focused on improving step by step through projects and practice.
              Even though I am just starting out, I am eager to learn, explore new technologies, 
               and take on challenges that help me grow. My goal is to gain more experience, build useful applications, 
               and become a skilled developer who can contribute to real projects in the future.
            </p>
          </div>
        </Section>

        {/* Experience */}
        <div className="mt-8 md:mt-12">
          <Section title="Experience" id="experience">
            {DATA.experience.map((e) => (
              <ExperienceItem item={e} key={`${e.role}-${e.company}`} />
            ))}
          </Section>
        </div>

        {/* Projects with search */}
        <div className="mt-8 md:mt-12">
          <Section title="Projects" id="projects">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative w-full">
                <Search aria-hidden="true" focusable="false" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects by name, description, or tags"
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pl-9 pr-9 py-2 outline-none focus:ring-2 focus:ring-zinc-400/40"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredProjects.map((p) => (
                <ProjectCard p={p} key={`proj-${p.name}`} />
              ))}
              {filteredProjects.length === 0 && (
                <div className="text-sm text-zinc-500">No projects found matching your search.</div>
              )}
            </div>
          </Section>
        </div>

        {/* Skills */}
        <div className="mt-8 md:mt-12">
          <Section title="Skills" id="skills">
            <Skills skills={DATA.skills} />
          </Section>
        </div>

        {/* Education + Awards */}
        <div className="mt-8 md:mt-12 grid md:grid-cols-2 gap-4">
          <Section title="Education" id="education">
            {DATA.education.map((ed) => (
              <div key={`${ed.degree}-${ed.school}`} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950">
                <h3 className="font-semibold leading-tight">{ed.degree}</h3>
                <p className="text-sm text-zinc-500">{ed.school}</p>
                <p className="text-sm text-zinc-500">{ed.period}</p>
                {ed.extra && <p className="text-sm mt-1">{ed.extra}</p>}
              </div>
            ))}
          </Section>
          <Section title="Awards / Certificates" id="awards">
            {DATA.awards.length ? (
              <ul className="space-y-2">
                {DATA.awards.map((a) => (
                  <li key={`${a.title}-${a.org}-${a.year}`} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white dark:bg-zinc-950">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{a.title}</p>
                        <p className="text-sm text-zinc-500">{a.org}</p>
                      </div>
                      <span className="text-sm text-zinc-500">{a.year}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-zinc-500">—</div>
            )}
          </Section>
        </div>

        {/* Contact */}
        <div className="mt-8 md:mt-12">
          <Section title="Contact" id="contact">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 md:p-6 bg-white dark:bg-zinc-950">
              <p className="text-sm md:text-base">Nice to meet you! :</p>
              <div className="mt-2">
                <ContactList contacts={DATA.profile.contacts.filter(c => c.type === "email")} location={null} />
              </div>
            </div>
          </Section>
        </div>

        {/* Footer (ensure dark/light applies to the bottom too) */}
        <footer className="mt-12 text-center text-xs text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Theerawit Waithayawan
        </footer>
      </main>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        // In Next.js, move to <Head>
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: DATA.profile.name,
            jobTitle: DATA.profile.role,
            url: portfolioHref,
            sameAs,
            image: DATA.profile.avatar?.src,
            address: {
              "@type": "PostalAddress",
              addressLocality: DATA.profile.location,
              addressCountry: "TH",
            },
          }),
        }}
      />

      {/* Print styles */}
      <style>{`
        @media print {
          html { color-scheme: light; }
          body { background: #fff !important; color: #000 !important; line-height: 1.35; }

          header { display: none !important; }

          .print-hide, input, button { display: none !important; }
          a { text-decoration: none !important; color: #000 !important; }
          body, body * { color: #000 !important; }
          .text-zinc-500, .text-zinc-600, .text-zinc-700,
          .dark\\:text-zinc-100, .dark\\:text-zinc-300,
          .opacity-50, .opacity-60, .opacity-70, .opacity-80 {
            color: #000 !important;
            opacity: 1 !important;
          }
          .shadow-sm, .shadow-md, .shadow-lg { box-shadow: none !important; }
          .border { border-color: #d4d4d8 !important; } /* light neutral */
          .bg-white, .dark\\:bg-black, .dark\\:bg-zinc-950, .dark\\:bg-zinc-900 { background: #fff !important; }
          .rounded-2xl, .rounded-3xl { border-radius: 12px !important; }
          .bg-gray-100, .bg-zinc-100, .dark\\:bg-zinc-800 {
            background: #f5f5f5 !important;
            border: 0.2mm solid #e5e7eb !important;
          }
          .avatar { break-inside: avoid; page-break-inside: avoid; }

          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

          @page { margin: 12mm; }
        }
      `}</style>

    </div>
  );
}
