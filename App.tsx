import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowRight, Menu, X } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence, useScroll, MotionValue } from 'framer-motion';

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// --- Types & Interfaces ---
interface NavItem {
  id: string;
  label: string;
  num: string;
}

// --- Constants ---
const NAV_ITEMS: NavItem[] = [
  { id: 'about', label: 'About', num: '01.' },
  { id: 'experience', label: 'Experience', num: '02.' },
  { id: 'projects', label: 'Projects', num: '03.' },
  { id: 'skills', label: 'Skills', num: '04.' },
  { id: 'contact', label: 'Contact', num: '05.' },
];

const SCROLL_TEXT = "I’m learning to bridge video and code. I care about getting the details right, making things run well, and building something that makes someone say “wow”.";
const REPEATED_TEXT = SCROLL_TEXT.repeat(30);

const GALLERY_IMAGES = [
  "/images/1.png", // Cinema
  "/images/5.png", // Tech
  "/images/3.png", // Abstract AI
  "/images/4.png", // Movie production
  "/images/5.png", // Hardware
  "/images/2.png", // Neon
  "/images/7.png", // Film reel
  "/images/project4.png", // Code
  "/images/project3.png", // 3D Render
  "/images/project2.png", // Editing
  "/images/project1_1.png", // Connectivity
  "/images/project4_1.png", // Code
  "/images/project1.png", // 3D Render
  "/images/project2.png", // Editing
  "/images/project1_1.png", 
];

// 3x5 Grid Layout with deeper Z for "tunnel" start
const CARD_LAYOUT = (function() {
  const layout = [];
  // Tightened arrangement to reduce gaps
  const columns = [-66, -33, 0, 33, 66]; 
  const rows = [-22, 0, 22];             
  
  for (let r of rows) {
    for (let c of columns) {
      const horizontalFactor = Math.abs(c) / 66; 
      const verticalFactor = Math.abs(r) / 22;
      
      layout.push({
        x: c,
        y: r,
        // Deeper Z mapping for a powerful tunnel effect
        z: (horizontalFactor * 400) + (verticalFactor * 150) - 500,
        rY: c * -0.5,
        rX: r * 0.3,
        s: 0.9
      });
    }
  }
  return layout;
})();

const HolographicCard: React.FC<{ 
  url: string; 
  config: typeof CARD_LAYOUT[0]; 
  isActive: boolean;
  scrollProgress: MotionValue<number>;
  onToggle: () => void;
}> = ({ url, config, isActive, scrollProgress, onToggle }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth mouse tilt spring
  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });

  // Calculate base values from grid config
  const zBase = config.z;
  const scrollZ = useTransform(scrollProgress, [0, 1], [zBase - 1500, zBase + 2500]);
  const scrollOpacity = useTransform(scrollProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  // Derived transforms for mouse interaction
  const tiltX = useTransform(springY, [-0.5, 0.5], [config.rX + 10, config.rX - 10]);
  const tiltY = useTransform(springX, [-0.5, 0.5], [config.rY - 10, config.rY + 10]);

  // Combined rotation that respects isActive state
  const rotateX = useSpring(useTransform(() => isActive ? 0 : tiltX.get()), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(() => isActive ? 0 : tiltY.get()), { stiffness: 100, damping: 20 });

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    if (isActive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0); y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      animate={{
        // Discrete state changes handled by animate
        top: isActive ? "50%" : `calc(50% + ${config.y}%)`,
        left: isActive ? "50%" : `calc(50% + ${config.x}%)`,
        scale: isActive ? 1.8 : config.s,
        zIndex: isActive ? 10000 : Math.floor(config.z + 5000),
      }}
      style={{
        position: "absolute",
        x: "-50%",
        y: "-50%",
        transformStyle: "preserve-3d",
        // Continuous values and reactive transforms handled by style
        rotateX,
        rotateY,
        translateZ: isActive ? 1200 : scrollZ,
        opacity: isActive ? 1 : scrollOpacity,
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      className="holographic-card w-[360px] md:w-[480px] aspect-[21/9] cursor-pointer group bg-stone-100/5 overflow-hidden shadow-2xl"
    >
      <motion.img 
        src={url} 
        alt="" 
        animate={{ 
          filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
        }}
        initial={{ filter: "grayscale(100%)" }}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        style={{ opacity: 1 }}
      />
      
      {/* Light Reflection overlay */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 70%)",
        }}
      />
      
      {/* Subtle border */}
      <div className="absolute inset-0 z-10 border border-white/10 group-hover:border-white/20 transition-colors pointer-events-none" />
      
      {/* Optional: Close Icon */}
      {isActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 right-4 z-30"
        >
          <X size={16} className="text-white/60" />
        </motion.div>
      )}
    </motion.div>
  );
};

// --- Components ---

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setIsScrolled(window.scrollY > 50));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      gsap.to(window, { duration: 1.5, scrollTo: { y: el, offsetY: 70 }, ease: "power3.inOut" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-cream/80 backdrop-blur-md border-b border-gray-200/50 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-xl font-serif font-bold tracking-tighter text-dust-gray cursor-pointer" onClick={() => scrollTo('home')}>
          ZI YUN.
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              aria-label={`Navigate to ${item.label}`}
              className="group flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-dust-gray transition-colors"
            >
              <span className="text-xs text-gray-300 group-hover:text-gray-500 transition-colors">{item.num}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <button className="px-5 py-2 border border-dust-gray rounded-full text-sm font-medium hover:bg-dust-gray hover:text-white transition-all duration-300">
            Resume
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-dust-gray"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="absolute top-full left-0 w-full bg-cream border-b border-gray-200 p-6 md:hidden flex flex-col space-y-4 shadow-xl">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => scrollTo(item.id)} className="text-left text-lg font-serif text-dust-gray">
              {item.num} {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pathTextRef = useRef<SVGTextPathElement>(null);
  const backgroundMistRef = useRef<SVGTextPathElement>(null);
  const ribbonMistRef = useRef<SVGTextPathElement>(null);
  const typewriterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ... existing animations
      gsap.from(".hero-content", {
        opacity: 0,
        y: 30,
        duration: 1.5,
        ease: "power3.out"
      });

      if (typewriterRef.current) {
        const text = "change is the end result of all true learning.";
        const tl = gsap.timeline({ delay: 3 });
        const element = typewriterRef.current;

        text.split('').forEach((_, i) => {
          tl.set(element, { textContent: text.substring(0, i + 1) }, i * 0.08);
        });

        tl.to(element, {
          filter: "blur(8px)",
          opacity: 0,
          duration: 0.8,
          delay: 2,
          ease: "power2.in"
        });
      }

      if (pathTextRef.current) {
        gsap.fromTo(pathTextRef.current,
          { attr: { startOffset: "-500%" } },
          { attr: { startOffset: "0%" }, duration: 300, repeat: -1, ease: "none" }
        );
      }

      if (backgroundMistRef.current) {
        gsap.fromTo(backgroundMistRef.current,
          { attr: { startOffset: "-500%" }, opacity: 0 },
          { attr: { startOffset: "0%" }, duration: 450, repeat: -1, ease: "none", opacity: 0.1, delay: 1 }
        );
      }

      if (ribbonMistRef.current) {
        gsap.fromTo(ribbonMistRef.current,
          { attr: { startOffset: "-500%" } },
          { attr: { startOffset: "0%" }, duration: 300, repeat: -1, ease: "none" }
        );
      }

      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: 100,
        opacity: 0,
        scale: 0.98
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
      {/* Background Mist Layer */}
      <div className="absolute top-[30%] left-0 w-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 1440 300" className="w-full h-auto">
          <path id="mistPath" d="M0,100 C400,200 1000,0 1440,100" fill="transparent" />
          <text className="text-4xl font-serif fill-dust-gray tracking-tighter italic opacity-40">
            <textPath ref={backgroundMistRef} href="#mistPath">
              {REPEATED_TEXT}
            </textPath>
          </text>
        </svg>
      </div>

      <div ref={textRef} className="hero-content relative z-10 text-center px-4 max-w-5xl mx-auto perspective-1000 -mt-12">
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif text-dust-gray tracking-tighter mb-10">
          <div className="overflow-hidden leading-tight">
            <span className="inline-block">Don't just plan,</span>
          </div>
          <div className="overflow-visible italic font-light text-dust-gray opacity-95 leading-none pt-1 pb-4">
            <span className="inline-block">create!</span>
          </div>
        </h1>
        
        <p className="mt-4 text-lg md:text-xl text-gray-500 font-light tracking-wide max-w-2xl mx-auto opacity-70">
          Crafting digital experiences that speak to your users.
        </p>

        {/* Typewriter message element */}
        <div
          ref={typewriterRef}
          className="mt-4 h-8 text-dust-gray/40 font-serif italic text-lg tracking-tight"
        ></div>

        <div className="mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '2s', animationFillMode: 'forwards' }}>
          <button
            onClick={() => gsap.to(window, { duration: 1.5, scrollTo: { y: '#projects', offsetY: 70 }, ease: 'power3.inOut' })}
            className="group relative px-10 py-5 bg-dust-gray text-white rounded-full overflow-hidden transition-all hover:shadow-2xl"
          >
            <span className="relative z-10 flex items-center gap-3 text-xs uppercase tracking-widest font-medium">
              View Portfolio <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
          </button>
        </div>
      </div>

      {/* SVG Curved Text Black Ribbon Section */}
      <div className="absolute inset-x-0 bottom-8 h-100 pointer-events-none">
        <svg viewBox="0 0 1440 300" className="w-full h-full overflow-visible">
          <defs>
            <path id="masterCurve" d="M-100,200 C300,200 600,450 1540,150" />
            <mask id="ribbonMask">
              <rect x="0" y="0" width="1440" height="400" fill="black" />
              <rect x="720" y="0" width="1000" height="400" fill="white" />
            </mask>
          </defs>

          <text className="text-xl md:text-2xl font-serif fill-dust-gray opacity-10 tracking-widest uppercase">
            <textPath ref={ribbonMistRef} href="#masterCurve" startOffset="0%">
              {REPEATED_TEXT}
            </textPath>
          </text>

          <g mask="url(#ribbonMask)">
            <use href="#masterCurve" fill="none" stroke="#1A1A1A" strokeWidth="60" />
            <text className="text-xl md:text-2xl font-serif fill-white tracking-widest uppercase italic">
              <textPath ref={pathTextRef} href="#masterCurve" startOffset="0%">
                {REPEATED_TEXT}
              </textPath>
            </text>
          </g>

          <foreignObject x="670" y="275" width="100" height="40" className="overflow-visible">
            <div className="bg-white border border-dust-gray/20 rounded-full h-full w-full flex items-center justify-center space-x-1.5 shadow-xl p-2">
              {[0.1, 0.3, 0.2, 0.5, 0.2, 0.4].map((delay, i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="visualizer-bar w-0.5 bg-dust-gray rounded-full"
                  style={{ animationDelay: `${delay}s`, height: '10px' }}
                />
              ))}
            </div>
          </foreignObject>
        </svg>
      </div>
    </section>
  );
};

const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 3D Tilt Effect on Scroll
      gsap.fromTo(contentRef.current,
        { rotateX: 20, y: 100, opacity: 0, transformOrigin: "center bottom" },
        {
          rotateX: 0, y: 0, opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "top 30%",
            scrub: 1
          }
        }
      );

      // Staggered reveal for text elements
      const textElements = contentRef.current?.children;
      if (textElements) {
        gsap.from(textElements, {
          y: 40,
          opacity: 0,
          stagger: 0.2,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          }
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="min-h-screen flex items-center justify-center py-24 px-6 bg-cream">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div ref={contentRef} className="space-y-8 perspective-1000">
          <div className="space-y-2">
            <div className="flex items-center space-x-4 mb-2">
              <span className="text-sm font-mono text-gray-400">(01)</span>
              <div className="h-px w-8 bg-gray-200" />
              <span className="text-sm font-mono text-gray-400">Hi, my name is</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold text-dust-gray tracking-tight">
              ZiYun - AI Builder.
            </h2>
          </div>
          <p className="text-2xl md:text-4xl text-gray-400 font-light leading-tight">
            Crafting digital experiences with precision and passion.
          </p>
          <p className="text-gray-600 leading-relaxed max-w-md">
            I started as a video editor with two years of hands-on experience. Then I embraced the AI wave, joined the AIDM program, and shifted my focus toward coding and development. Today, I’m a multidisciplinary creator who bridges storytelling and technology — and my ultimate goal is to craft work that makes people say “wow”. I want to build digital experiences that strike straight at the heart.
          </p>
          <div className="flex gap-4 pt-4">
            <button className="px-6 py-3 bg-dust-gray text-white rounded-lg hover:bg-gray-800 transition-colors">
              View My Work
            </button>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:border-dust-gray transition-colors">
              Personal CV
            </button>
          </div>
        </div>

        {/* Intro Image Representation */}
        <div className="relative h-125 w-full bg-gray-100 rounded-2xl overflow-hidden group shadow-2xl">
           <img 
            src="/images/intro.png" 
            alt="ZiYun Intro" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
           />
           <div className="absolute inset-0 bg-dust-gray/10 group-hover:bg-transparent transition-colors duration-700" />
        </div>
      </div>
    </section>
  );
};

const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  const experiences = [
    { role: 'AI Builder ', school: 'HKBU', period: '2025 — Present', desc: 'Building AI-powered products and creating AI generated films.' },
    { role: 'Video Editor & Colorist', company: 'Beijing Yingmei', period: '2024 — 2025', desc: 'Creating and editing video content for various clients.' },
    { role: 'Data Analysis Intern', company: '', period: '2023 — 2024', desc: 'Conduct educational situation analysis for junior and senior high schools in Beijing.' }
  ];

  // Use Framer Motion for gallery scroll progress
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start 85%", "end 15%"]
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Experience items animation
      gsap.from('.exp-item', {
        y: 40, opacity: 0, stagger: 0.15, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });

      // Background color change for "next room" effect
      gsap.to(sectionRef.current, {
        backgroundColor: "#F9F9F7", 
        duration: 1,
        scrollTrigger: {
          trigger: galleryRef.current,
          start: "center center",
          toggleActions: "play none none reverse"
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="py-32 px-6 bg-white overflow-hidden transition-colors duration-700">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-20">
          <h2 className="text-6xl md:text-8xl font-serif text-dust-gray">Experience</h2>
          <span className="hidden md:block text-xl text-gray-400 font-mono">(02)</span>
        </div>
        <div className="space-y-0 relative z-10">
          {experiences.map((exp, i) => (
            <div key={i} className="exp-item border-t border-gray-200 py-10 group">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <span className="text-sm font-mono text-gray-400 pt-1">{exp.period}</span>
                <div className="md:col-span-2">
                  <h3 className="text-2xl font-serif text-dust-gray group-hover:italic transition-all">{exp.role}</h3>
                  <p className="text-gray-400 font-medium mt-1 mb-3">{exp.company}</p>
                  <p className="text-gray-500 leading-relaxed">{exp.desc}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-200" />
        </div>
      </div>

      {/* 3D Gallery: "Tunnel Traversal" */}
      <div 
        ref={galleryRef} 
        className="relative h-[150vh] w-full mt-20 flex flex-col items-center justify-center"
      >
        <div className="absolute top-20 w-full px-6 z-50">
          <div className="max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex justify-between items-end"
            >
              <h2 className="text-6xl md:text-8xl font-serif text-dust-gray">Portfolio Gallery</h2>
              <span className="hidden md:block text-xl text-gray-400 font-mono">(03)</span>
            </motion.div>
          </div>
        </div>

        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-2000">
          <div 
            className="w-full h-full relative" 
            style={{ transformStyle: "preserve-3d" }}
            onClick={() => setActiveCardIndex(null)}
          >
            {CARD_LAYOUT.map((config, i) => (
              <HolographicCard 
                key={i} 
                url={GALLERY_IMAGES[i % GALLERY_IMAGES.length]} 
                config={config}
                isActive={activeCardIndex === i}
                scrollProgress={scrollYProgress}
                onToggle={() => setActiveCardIndex(activeCardIndex === i ? null : i)}
              />
            ))}
          </div>
          
          {/* Depth fog/overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.project-card');
      cards.forEach((card, i) => {
        gsap.fromTo(card, 
          { y: 100, opacity: 0, rotateY: i % 2 === 0 ? -5 : 5 },
          {
            y: 0, opacity: 1, rotateY: 0,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 50%",
              scrub: 1
            }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const projects = [
    { 
      title: "TourBox Elite Technology Product Ad", 
      category: "Video Editing", 
      year: "2025",
      image: "/images/project1.png",
      images: ["/images/project1.png", "/images/project.png"],
      desc: "A high-performance advertisement for the TourBox Elite。This video pre-shoots five people using the TourBox product. Therefore, the editing structure follows the director’s concept, differentiating the rhythm and content of each segment based on the performers’ actions and camera characteristics, creating a rhythm curve with ups and downs."
    },
    { 
      title: "AI storyboard", 
      category: "Web design & Multi-agent", 
      year: "2026",
      images: ["/images/story board2.jpg", "/images/storyboard.jpg", "/images/story board3.jpg"],
      image: "/images/story board2.jpg",
      desc: "A system that uses multiple agents and LLM API calls to build an AI storyboard, enabling the reproduction of creative ideas. You can input your idea, and the system will generate a script and storyboard preview images for you."
    },
    { 
      title: "AI Generated Video", 
      category: "AIGC", 
      year: "2026",
      image: "/images/小黄人版老友记-封面.jpg",
      videoUrl: "//player.bilibili.com/player.html?bvid=BV1nf6DBjE6f&page=1&high_quality=1&danmaku=0", 
      desc: " Produced a Minions x Friends parody video using generative AI; achieved 10K+ views and 1.5K likes, showcasing AI's ability to accelerate creative storytelling and character-based parody."
    },
  ];

  return (
    <section id="projects" ref={sectionRef} className="py-32 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-20">
          <h2 className="text-6xl md:text-8xl font-serif text-dust-gray">Selected<br />Works</h2>
          <span className="hidden md:block text-xl text-gray-400 font-mono">(03)</span>
        </div>

        <div className="space-y-24">
          {projects.map((p, i) => (
            <div 
              key={i} 
              className="project-card group cursor-pointer"
              onClick={() => setSelectedProject(p)}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className={`md:col-span-7 ${i % 2 !== 0 ? 'md:order-2' : ''}`}>
                  <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden relative">
                    <img 
                      src={p.image} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
                      alt={p.title}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className={`md:col-span-5 ${i % 2 !== 0 ? 'md:order-1 md:text-right' : ''}`}>
                  <span className="text-sm font-mono text-gray-400 block mb-4 uppercase tracking-widest">{p.category} — {p.year}</span>
                  <h3 className="text-4xl md:text-6xl font-serif text-stone-900 leading-tight">
                    {p.title}
                  </h3>
                  <div className="mt-8 w-14 h-14 rounded-full border border-stone-200 flex items-center justify-center group-hover:bg-stone-900 group-hover:text-white transition-all duration-500">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] bg-white flex flex-col md:flex-row overflow-y-auto md:overflow-hidden"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }}
              className="absolute top-8 right-8 z-50 p-4 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="w-full md:w-3/5 h-[60vh] md:h-screen bg-stone-50 overflow-y-auto custom-scrollbar">
              {selectedProject.videoUrl ? (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  {selectedProject.videoUrl.includes('bilibili.com') || selectedProject.videoUrl.startsWith('//') ? (
                    <iframe 
                      src={selectedProject.videoUrl}
                      className="w-full h-full border-0"
                      allowFullScreen
                      sandbox="allow-top-navigation allow-same-origin allow-forms allow-scripts"
                    />
                  ) : (
                    <video 
                      autoPlay 
                      loop 
                      muted 
                      controls
                      className="w-full h-full object-contain"
                      src={selectedProject.videoUrl}
                    />
                  )}
                </div>
              ) : selectedProject.images ? (
                <div className="flex flex-col space-y-4 p-4 md:p-8">
                  {selectedProject.images.map((img: string, idx: number) => (
                    <motion.img 
                      key={idx}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.15 + 0.3 }}
                      src={img}
                      className="w-full h-auto rounded-lg shadow-lg"
                      alt={`${selectedProject.title} ${idx + 1}`}
                      referrerPolicy="no-referrer"
                    />
                  ))}
                </div>
              ) : (
                <motion.img 
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  src={selectedProject.image}
                  className="w-full h-full object-cover"
                  alt={selectedProject.title}
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            <div className="w-full md:w-2/5 p-8 md:p-20 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex space-x-4 text-xs font-mono text-gray-400 mb-8 tracking-tighter uppercase">
                  <span>{selectedProject.category}</span>
                  <span>•</span>
                  <span>{selectedProject.year}</span>
                </div>
                <h3 className="text-5xl md:text-7xl font-serif text-stone-900 mb-10 leading-[0.9]">
                  {selectedProject.title}
                </h3>
                <p className="text-xl text-stone-600 leading-relaxed mb-12">
                  {selectedProject.desc}
                </p>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="flex items-center space-x-4 text-stone-900 font-medium hover:opacity-60 transition-opacity"
                >
                  <ArrowRight className="rotate-180" />
                  <span className="font-mono text-sm tracking-widest uppercase">Close Project</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".skill-item", 
        { x: -50, opacity: 0 },
        {
          x: 0, opacity: 1, stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%"
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const skills = [
    "Davinci/Final CUT", "AIGC", "Web Design", "AI Agent", 
    "Color Toning", "Video Editing", "Python"
  ];

  return (
    <section id="skills" ref={sectionRef} className="py-32 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-sm font-mono text-gray-400 mb-12">(04) CAPABILITIES</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-12">
          {skills.map((skill, i) => (
            <div key={i} className="skill-item border-b border-gray-300 pb-6 group">
              <div className="flex justify-between items-center">
                <span className="text-3xl md:text-5xl font-serif text-dust-gray group-hover:translate-x-4 transition-transform duration-300">
                  {skill}
                </span>
                <span className="text-gray-300 group-hover:text-dust-gray transition-colors">
                  <ArrowRight size={32} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact: React.FC = () => {
  return (
    <section id="contact" className="min-h-screen flex flex-col justify-center items-center bg-dust-gray text-cream px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 border border-white rounded-full" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 border border-white rounded-full" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-100 border border-white rounded-full" />
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        <h2 className="text-sm font-mono text-gray-500 mb-8">(05) LET'S TALK</h2>
        <p className="text-5xl md:text-7xl font-serif mb-12 leading-tight">
        Contact me
        </p>
        <a href="mailto:25417681@life.hkbu.edu.hk" className="inline-block text-2xl md:text-4xl border-b border-cream pb-2 hover:text-gray-300 hover:border-gray-300 transition-all">
          25417681@life.hkbu.edu.hk
        </a>
      </div>

      <footer className="absolute bottom-8 w-full px-6 flex justify-between text-xs text-gray-500 font-mono">
        <span>© 2026 ZIYUN DEV</span>
        <button
          onClick={() => gsap.to(window, { duration: 1.5, scrollTo: { y: 0 }, ease: 'power3.inOut' })}
          className="hover:text-cream transition-colors"
        >
          BACK TO TOP
        </button>
      </footer>
    </section>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  return (
    <div className="bg-cream text-dust-gray selection:bg-dust-gray selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&family=Space+Mono&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        
        .perspective-1000 { perspective: 1000px; }
        
        @keyframes visualizer {
          0%, 100% { height: 4px; }
          50% { height: 20px; }
        }
        .visualizer-bar { animation: visualizer 1.2s ease-in-out infinite; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>

      <Navigation />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </div>
  );
};

export default App;