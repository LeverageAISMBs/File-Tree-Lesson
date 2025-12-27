import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StorySection } from '../types';

interface InfoPanelProps {
  activeSection: StorySection;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ activeSection }) => {
  return (
    <div className="fixed top-32 left-8 w-80 z-20 hidden lg:block">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl"
        >
          <div className="flex items-center space-x-2 mb-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-mono text-emerald-500 uppercase tracking-widest">
                System Status: Active
             </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 font-mono">
            {activeSection.title}
          </h1>
          <h2 className="text-xl text-slate-400 mb-6 font-light italic">
            {activeSection.subtitle}
          </h2>
          
          <div className="h-px w-full bg-gradient-to-r from-emerald-500/50 to-transparent mb-6" />

          <p className="text-slate-300 leading-relaxed text-sm">
            {activeSection.description}
          </p>
          
          <div className="mt-8">
            <h3 className="text-xs uppercase text-slate-500 font-bold mb-2">Active Nodes</h3>
            <div className="flex flex-wrap gap-2">
                {activeSection.highlightNodeIds.map(id => (
                    <span key={id} className="px-2 py-1 bg-slate-800 border border-slate-600 rounded text-xs font-mono text-cyan-400">
                        {id}
                    </span>
                ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
