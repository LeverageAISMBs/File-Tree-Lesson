import { FileNode, NodeType, StorySection } from './types';
import { 
  Box, 
  FileCode, 
  Folder, 
  Settings, 
  Database, 
  Layout, 
  Terminal, 
  Cpu 
} from 'lucide-react';

export const FILE_TREE_DATA: FileNode = {
  id: 'root',
  name: 'project-root',
  type: NodeType.ROOT,
  description: 'The foundation. The seed.',
  children: [
    {
      id: 'config',
      name: 'package.json',
      type: NodeType.CONFIG,
      description: 'Dependencies and Scripts. The DNA.',
      icon: Settings,
      children: []
    },
    {
      id: 'env',
      name: '.env',
      type: NodeType.CONFIG,
      description: 'Environment Variables. The Nutrients.',
      icon: Database,
      children: []
    },
    {
      id: 'src',
      name: 'src',
      type: NodeType.FOLDER,
      description: 'Source Code. The Trunk.',
      icon: Folder,
      children: [
        {
          id: 'index',
          name: 'index.tsx',
          type: NodeType.FILE,
          description: 'Entry Point. The Sprout.',
          icon: Terminal,
          children: []
        },
        {
          id: 'app',
          name: 'App.tsx',
          type: NodeType.FILE,
          description: 'Main Application Logic.',
          icon: Layout,
          children: []
        },
        {
          id: 'components',
          name: 'components',
          type: NodeType.FOLDER,
          description: 'Reusable UI. Major Branches.',
          icon: Box,
          children: [
            {
              id: 'button',
              name: 'Button.tsx',
              type: NodeType.FILE,
              description: 'Atomic Component. A Leaf.',
              icon: FileCode,
            },
            {
              id: 'card',
              name: 'Card.tsx',
              type: NodeType.FILE,
              description: 'Container Component.',
              icon: FileCode,
            }
          ]
        },
        {
          id: 'hooks',
          name: 'hooks',
          type: NodeType.FOLDER,
          description: 'Logic Extraction. Inner Fibers.',
          icon: Cpu,
          children: [
            {
              id: 'useAuth',
              name: 'useAuth.ts',
              type: NodeType.FILE,
              description: 'Authentication Logic.',
              icon: FileCode,
            }
          ]
        }
      ]
    }
  ]
};

export const STORY_SECTIONS: StorySection[] = [
  {
    id: 'intro',
    title: 'The Seed',
    subtitle: 'Initialization',
    description: 'Every complex system begins as a single point of potential. In software, this is your configuration. The `package.json` and environment files act as the DNA and soil nutrients, defining what the organism can become.',
    thresholdStart: 0,
    thresholdEnd: 0.15,
    highlightNodeIds: ['config', 'env']
  },
  {
    id: 'germination',
    title: 'Germination',
    subtitle: 'The Root System',
    description: 'Before visible growth occurs, the roots must anchor. Dependencies are installed, establishing the structural integrity required for the application to run. This hidden network supports everything above.',
    thresholdStart: 0.15,
    thresholdEnd: 0.35,
    highlightNodeIds: ['root']
  },
  {
    id: 'sprout',
    title: 'The Sprout',
    subtitle: 'Entry Point',
    description: 'The `index.tsx` file breaks the surface. This is the first executable moment, where the DOM is mounted and the React lifecycle begins. The trunk forms.',
    thresholdStart: 0.35,
    thresholdEnd: 0.55,
    highlightNodeIds: ['src', 'index', 'app']
  },
  {
    id: 'branching',
    title: 'Branching',
    subtitle: 'Structural Definition',
    description: 'As the application scales, logic must separate. The `src` directory diverges into `components`, `hooks`, and `services`. These major branches allow for parallel development and organized complexity.',
    thresholdStart: 0.55,
    thresholdEnd: 0.75,
    highlightNodeIds: ['components', 'hooks']
  },
  {
    id: 'canopy',
    title: 'The Canopy',
    subtitle: 'Leaf Components',
    description: 'Finally, the detailed work appears. Buttons, Inputs, Cards. These are the leaves—the interface points that interact with the user (light). The tree is now a complete, living system.',
    thresholdStart: 0.75,
    thresholdEnd: 1.0,
    highlightNodeIds: ['button', 'card', 'useAuth']
  }
];
