import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { TreeVisualizer } from './components/TreeVisualizer';
import { InfoPanel } from './components/InfoPanel';
import { STORY_SECTIONS } from './constants';
import { StorySection } from './types';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeSection, setActiveSection] = useState<StorySection>(STORY_SECTIONS[0]);
  
  // Update active section based on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const section = STORY_SECTIONS.find(
      (s) => latest >= s.thresholdStart && latest < s.thresholdEnd
    ) || STORY_SECTIONS[STORY_SECTIONS.length - 1]; // Default to last if at end
    
    if (section.id !== activeSection.id) {
      setActiveSection(section);
    }
  });

  return (
    <div ref={containerRef} className="relative bg-slate-950 text-slate-100 selection:bg-emerald-500/30">
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20" 
           style={{ 
               backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', 
               backgroundSize: '32px 32px' 
           }} 
      />

      {/* Sticky Visualization Layer */}
      <div className="fixed inset-0 z-10 flex items-center justify-center lg:pl-64">
        <div className="w-full max-w-4xl h-screen relative">
             <TreeVisualizer growth={scrollYProgress} />
        </div>
      </div>

      {/* Info Panel (Fixed Left) */}
      <InfoPanel activeSection={activeSection} />

      {/* Scrollable Content Overlay (Invisible Triggers + Mobile Text) */}
      <div className="relative z-20">
        {STORY_SECTIONS.map((section) => (
          <section
            key={section.id}
            className="h-[150vh] w-full flex items-start justify-center pt-32 lg:hidden pointer-events-none"
          >
            {/* Mobile Text Card */}
            <div className="mx-4 p-6 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl shadow-xl max-w-md pointer-events-auto">
                <h2 className="text-2xl font-bold text-emerald-400 mb-2">{section.title}</h2>
                <h3 className="text-lg text-slate-400 mb-4">{section.subtitle}</h3>
                <p className="text-sm text-slate-300">{section.description}</p>
            </div>
          </section>
        ))}
        {/* Spacer for Desktop to allow scrolling */}
        <div className="hidden lg:block h-[500vh]"></div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="fixed bottom-8 right-8 z-50 flex flex-col items-center gap-2"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
      >
        <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">Init Growth</span>
        <div className="w-px h-12 bg-emerald-500/50 relative overflow-hidden">
            <motion.div 
                className="absolute top-0 left-0 w-full bg-emerald-400"
                animate={{ height: ['0%', '100%'], top: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
        </div>
      </motion.div>

    </div>
  );
};

export default App;
