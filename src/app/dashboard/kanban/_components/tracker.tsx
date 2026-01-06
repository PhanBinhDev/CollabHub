'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown, MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';

const TrackerPanel = () => {
  const [expandedProjects, setExpandedProjects] = useState<string[]>([
    'highground',
    'jia',
    'khub',
  ]);

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId],
    );
  };

  const projects = [
    { id: 'highground', name: 'HIGHGROUND', icon: '🟣' },
    { id: 'jia', name: 'JIA', icon: '🟤' },
    { id: 'khub', name: 'KHUB', icon: '🔘' },
  ];

  return (
    <div className="w-72 h-screen bg-[#1e1e1e] text-white flex flex-col border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-semibold mb-3">Tracker</h2>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>New issue</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded text-sm">
            <span>🔄</span>
            <span>My issues</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded text-sm">
            <span>☑️</span>
            <span>All issues</span>
          </button>
        </div>

        <div className="border-t border-gray-800 mt-2 pt-2">
          <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded text-sm mx-2">
            <span>📋</span>
            <span>All projects</span>
          </button>
          <button className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-800 rounded text-sm mx-2">
            <span>🏷️</span>
            <span>Labels</span>
          </button>
        </div>

        <div className="border-t border-gray-800 mt-2 pt-2">
          <div className="flex items-center justify-between px-3 py-2">
            <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-white">
              <ChevronDown className="w-3 h-3" />
              <span className="uppercase font-semibold">Your Projects</span>
            </button>
            <button className="text-gray-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {projects.map(project => (
            <div key={project.id} className="mb-1">
              <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-800 rounded mx-2">
                <button
                  onClick={() => toggleProject(project.id)}
                  className="flex items-center gap-2 flex-1 text-sm"
                >
                  <span className="text-lg">{project.icon}</span>
                  <span>{project.name}</span>
                </button>
                <button className="text-gray-400 hover:text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {expandedProjects.includes(project.id) && (
                <div className="ml-6 mr-2">
                  <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 rounded text-sm text-blue-400">
                    <span>☑️</span>
                    <span>Issues</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 rounded text-sm text-gray-300">
                    <span>◇</span>
                    <span>Components</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 rounded text-sm text-gray-300">
                    <span>🏁</span>
                    <span>Milestones</span>
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 rounded text-sm text-gray-300">
                    <span>📋</span>
                    <span>Templates</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackerPanel;
