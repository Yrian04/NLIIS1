// src/components/Tree.tsx
import React, { useState } from 'react';
import { TreeNode } from '../types';

interface TreeProps {
  node: TreeNode;
  onUpdateDescription?: (wordFormId: number, newDesc: string) => void;
}

// Tree.tsx
export const TreeNodeComponent: React.FC<TreeProps> = ({ node, onUpdateDescription }) => {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => setExpanded(!expanded);

  if (node.type === 'lemma') {
    return (
      <div className="tree-node">
        <div 
          className="lemma-node p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200 transition"
          onClick={toggle}
          title="Кликните, чтобы развернуть/свернуть"
        >
          {expanded ? '🔻' : '🔸'} {node.name} ({node.children?.length || 0})
        </div>
        
        {expanded && ( // ✅ Проверка на длину
          <div className="children pl-4 border-l-2 border-gray-200 ml-2 mt-1">
            {node.children?.map(child => (
              <TreeNodeComponent 
                key={child.id} 
                node={child} 
                onUpdateDescription={onUpdateDescription} 
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="word-form-node flex items-center gap-2 py-1">
      <span className="text-gray-600">{node.name}</span>
      <span className="text-xs text-gray-400">({node.count})</span>
      <input
        type="text"
        defaultValue={node.description || ''}
        onBlur={(e) => onUpdateDescription?.(node.id, e.target.value)}
        className="input w-full max-w-xs"
      />
    </div>
  );
};