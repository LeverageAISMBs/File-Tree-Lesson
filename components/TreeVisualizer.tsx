import React from 'react';
import { motion, useSpring, useTransform, MotionValue } from 'framer-motion';
import { FileNode } from '../types';
import { FILE_TREE_DATA } from '../constants';

// --- Recursive Branch Component ---

interface BranchProps {
  node: FileNode;
  depth: number;
  index: number;
  totalSiblings: number;
  growthProgress: MotionValue<number>;
  x: number;
  y: number;
  angle: number;
  length: number;
}

const Branch: React.FC<BranchProps> = ({ 
  node, 
  depth, 
  index, 
  totalSiblings, 
  growthProgress, 
  x, 
  y, 
  angle,
  length 
}) => {
  // Calculate end coordinates based on angle and length
  const rad = (angle * Math.PI) / 180;
  const endX = x + length * Math.sin(rad);
  const endY = y - length * Math.cos(rad);

  // Growth thresholds based on depth to stagger animation
  // Depth 0 (Trunk) starts at 10% scroll
  // Deeper levels start later
  const startThreshold = 0.1 + (depth * 0.15); 
  const endThreshold = startThreshold + 0.2;

  // --- Animation Transforms ---
  // Critical Fix: Use useTransform to create reactive MotionValues from the master scroll progress
  
  // 1. Path Drawing: Maps scroll range to 0-1 path length
  const rawPathLength = useTransform(
      growthProgress,
      [startThreshold, endThreshold],
      [0, 1]
  );
  // Smooth the path drawing
  const pathLength = useSpring(rawPathLength, { stiffness: 40, damping: 20 });

  // 2. Opacity: Fades in slightly before drawing finishes
  const rawOpacity = useTransform(
      growthProgress,
      [startThreshold, startThreshold + 0.05],
      [0, 1]
  );
  const opacity = useSpring(rawOpacity, { stiffness: 60, damping: 20 });

  // 3. Node/Label Pop-in: Pops in at the end of the branch growth
  const rawScale = useTransform(
      growthProgress,
      [endThreshold - 0.1, endThreshold],
      [0, 1]
  );
  const scale = useSpring(rawScale, { stiffness: 150, damping: 12 });

  
  const isLeft = index < totalSiblings / 2;
  // Dynamic spread based on depth (tighter at top)
  const spread = depth === 0 ? 60 : 80; 
  
  // Get children for recursion
  const children = node.children || [];
  
  // Visual Styles
  const strokeWidth = Math.max(1, 10 - depth * 2.5); // Thicker trunk, thinner branches
  const strokeColor = depth === 0 ? '#475569' : depth === 1 ? '#059669' : '#0ea5e9'; // Slate -> Emerald -> Sky
  
  // Icon Component
  const Icon = node.icon;

  return (
    <g>
       {/* The Branch Line */}
      <motion.path
        d={`M ${x} ${y} L ${endX} ${endY}`}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
        style={{
             pathLength,
             opacity
        }}
      />

      {/* The Node Joint (Leaf/Label) */}
      <motion.g
        style={{
            x: endX,
            y: endY,
            scale,
            opacity: scale // Link opacity to scale for clean entry
        }}
      >
        {/* Joint Circle */}
        <circle r={depth === 0 ? 0 : 5} fill="#f8fafc" stroke={strokeColor} strokeWidth={2} />
        
        {/* Label and Icon - Only for significant nodes (not root/trunk if undesired) */}
        {depth > 0 && (
            <g className="pointer-events-none">
                 {/* Background Pill */}
                 <rect 
                    x={isLeft ? -140 : 15} 
                    y={-14} 
                    width={130} 
                    height={28} 
                    rx={6} 
                    fill="rgba(15, 23, 42, 0.9)" 
                    stroke="rgba(148, 163, 184, 0.2)"
                    strokeWidth={1}
                 />
                 
                 {/* Icon */}
                 {Icon && (
                     <foreignObject 
                        x={isLeft ? -135 : 20} 
                        y={-10} 
                        width={20} 
                        height={20}
                     >
                         <div className="flex items-center justify-center text-emerald-400">
                             <Icon size={16} />
                         </div>
                     </foreignObject>
                 )}

                 {/* Text Name */}
                 <text 
                    x={isLeft ? -110 : 45} 
                    y={5} 
                    fill="#e2e8f0" 
                    fontSize="11" 
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="0.5px"
                >
                    {node.name}
                 </text>
            </g>
        )}
      </motion.g>

      {/* Recursively Render Children */}
      {children.map((child, i) => {
        const childTotal = children.length;
        
        // Calculate Angles
        // Distribute children evenly around the parent vector
        const segmentStep = spread / (Math.max(childTotal - 1, 1));
        const startAngle = -spread / 2;
        
        let currentOffset = 0;
        if (childTotal > 1) {
             currentOffset = startAngle + (i * segmentStep);
        } else {
            // If single child, add slight organic wobble, don't just go straight
            currentOffset = (Math.random() * 20) - 10; 
        }

        // Add some "organic" randomness to every branch
        const randomWobble = (Math.random() * 10) - 5;
        
        // Decrease length as we go up
        const childLength = length * 0.75; 

        return (
          <Branch
            key={child.id}
            node={child}
            depth={depth + 1}
            index={i}
            totalSiblings={childTotal}
            growthProgress={growthProgress}
            x={endX}
            y={endY}
            angle={angle + currentOffset + randomWobble}
            length={childLength}
          />
        );
      })}
    </g>
  );
};

// --- Roots Component ---

const RootSystem: React.FC<{ growthProgress: MotionValue<number>; startX: number; startY: number }> = ({ growthProgress, startX, startY }) => {
    
    // Animate roots growing down (active early in scroll: 0 - 0.35)
    
    // Global opacity for roots
    const opacity = useTransform(growthProgress, [0, 0.1], [0, 0.8]);
    
    return (
        <g>
            {[1, 2, 3, 4, 5, 6].map((i) => {
                const angle = 135 + (i * 12) + (Math.random() * 10);
                const length = 60 + (Math.random() * 50);
                // Control point for quadratic bezier to make roots curvy
                const cpx = startX + (Math.random() * 40 - 20);
                const cpy = startY + (Math.random() * 40);
                
                const rad = angle * Math.PI / 180;
                const endX = startX + length * Math.sin(rad);
                const endY = startY - length * Math.cos(rad); 

                // Stagger root growth
                const myStart = 0.05 + (i * 0.02);
                const myEnd = 0.35;
                const pathVal = useTransform(growthProgress, [myStart, myEnd], [0, 1]);
                
                return (
                    <motion.path
                        key={`root-${i}`}
                        d={`M ${startX} ${startY} Q ${cpx} ${cpy}, ${endX} ${endY}`}
                        stroke="#92400e" 
                        strokeWidth={i % 2 === 0 ? 2 : 1}
                        strokeDasharray={i % 2 === 0 ? "none" : "4 4"}
                        strokeOpacity={0.7}
                        fill="none"
                        style={{
                            pathLength: pathVal,
                            opacity
                        }}
                    />
                );
            })}
             {/* The Seed */}
             <motion.circle 
                cx={startX} 
                cy={startY} 
                r={8} 
                fill="#fcd34d" 
                stroke="#b45309"
                strokeWidth={2}
                style={{
                    scale: useTransform(growthProgress, [0, 0.1], [0, 1])
                }}
            />
        </g>
    )
}

// --- Main Visualizer ---

interface TreeVisualizerProps {
  growth: MotionValue<number>; 
}

export const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ growth }) => {
  const VIEWBOX_WIDTH = 800;
  const VIEWBOX_HEIGHT = 600;
  const START_X = VIEWBOX_WIDTH / 2;
  const START_Y = VIEWBOX_HEIGHT - 80;
  
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <motion.svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
        style={{
             filter: "drop-shadow(0px 0px 8px rgba(16, 185, 129, 0.2))"
        }}
      >
        {/* Soil Level */}
        <line 
            x1={0} y1={START_Y} x2={VIEWBOX_WIDTH} y2={START_Y} 
            stroke="#475569" 
            strokeWidth={2}
            strokeDasharray="8 8"
            opacity={0.3}
        />
        
        <text x={20} y={START_Y + 20} fill="#64748b" fontSize="10" fontFamily="monospace" letterSpacing="2px">
            // ENVIRONMENT: PRODUCTION
        </text>

        {/* Roots System */}
        <RootSystem growthProgress={growth} startX={START_X} startY={START_Y} />

        {/* Main Tree Trunk (Source Code) */}
        {/* We map the 'src' folder (index 2) as the main trunk */}
        {FILE_TREE_DATA.children && FILE_TREE_DATA.children[2] && (
            <Branch 
                node={FILE_TREE_DATA.children[2]} 
                depth={0} 
                index={0} 
                totalSiblings={1}
                growthProgress={growth}
                x={START_X}
                y={START_Y}
                angle={0} // Straight up
                length={140}
            />
        )}
        
        {/* Config Files (Nutrients) */}
        {/* Rendered as small offshoots near the base */}
        <g transform={`translate(${START_X}, ${START_Y})`}>
             {FILE_TREE_DATA.children?.slice(0, 2).map((node, i) => {
                 const configAngle = i === 0 ? -120 : 120; // Downwards/Sides
                 return (
                     <Branch
                        key={node.id}
                        node={node}
                        depth={1}
                        index={i}
                        totalSiblings={2}
                        growthProgress={growth}
                        x={0}
                        y={0}
                        angle={configAngle}
                        length={50}
                     />
                 )
             })}
        </g>

      </motion.svg>
    </div>
  );
};
