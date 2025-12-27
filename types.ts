import { LucideIcon } from 'lucide-react';

export enum NodeType {
  ROOT = 'ROOT',
  FOLDER = 'FOLDER',
  FILE = 'FILE',
  CONFIG = 'CONFIG'
}

export interface FileNode {
  id: string;
  name: string;
  type: NodeType;
  description: string;
  children?: FileNode[];
  icon?: LucideIcon;
}

export interface StorySection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thresholdStart: number; // 0 to 1 scroll progress
  thresholdEnd: number;   // 0 to 1 scroll progress
  highlightNodeIds: string[];
}

export interface TreeContextType {
  growth: number; // 0 to 100
  rotation: number;
}