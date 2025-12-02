import React, { useState } from 'react';
import { Map } from './components/Map';
import { ProjectCard } from './components/ProjectCard';
import { SolarProject } from './types';
import { SOLAR_PROJECTS } from './constants';
import { LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<SolarProject | null>(null);

  const handleSelectProject = (project: SolarProject) => {
    setSelectedProject(project);
  };

  const totalCapacity = SOLAR_PROJECTS.reduce((acc, curr) => acc + curr.capacityMW, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation / Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-end sticky top-0 z-40 h-16">
        {/* Removed Logo and Title section as requested */}
        
        <div className="hidden md:flex items-center space-x-8">
            <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold">Total Capacity</p>
                <p className="text-lg font-bold text-blue-900">{totalCapacity.toLocaleString()} MW</p>
            </div>
            <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold">Active Sites</p>
                <p className="text-lg font-bold text-blue-900">{SOLAR_PROJECTS.length}</p>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar / List View for Mobile or Accessibility */}
        <aside className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 overflow-y-auto z-30 hidden lg:block">
            <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <LayoutGrid size={18} />
                    <span>Project Locations</span>
                </h2>
                <div className="space-y-3">
                    {SOLAR_PROJECTS.map(project => (
                        <div 
                            key={project.id}
                            onClick={() => setSelectedProject(project)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer group hover:shadow-md
                                ${selectedProject?.id === project.id 
                                    ? 'border-orange-500 bg-orange-50 ring-1 ring-orange-200' 
                                    : 'border-gray-100 bg-gray-50 hover:border-blue-200'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`font-bold ${selectedProject?.id === project.id ? 'text-blue-900' : 'text-slate-700'}`}>
                                        {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">{project.location}</p>
                                </div>
                                <span className="bg-white px-2 py-1 rounded text-xs font-semibold text-blue-900 shadow-sm border border-gray-100">
                                    {project.capacityMW} MW
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>

        {/* Map Container */}
        <div className="flex-1 relative bg-gradient-to-br from-blue-50 to-white p-4 md:p-12 flex items-center justify-center">
             {/* Interactive Map */}
             <div className="w-full max-w-6xl shadow-xl rounded-3xl bg-white border border-blue-100 p-2 md:p-8 relative">
                 <Map 
                    onSelectProject={handleSelectProject} 
                    selectedProjectId={selectedProject?.id || null} 
                 />
                 
                 {/* Map Legend/Overlay Info */}
                 <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-white/90 backdrop-blur border border-blue-100 p-4 rounded-xl shadow-lg text-sm max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-3 h-3 bg-blue-900 rounded-full"></span>
                        <span className="text-slate-600">Active Presence</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-blue-200 rounded-full"></span>
                        <span className="text-slate-600">No Operations</span>
                    </div>
                 </div>
             </div>

             {/* Floating Project Card */}
             <ProjectCard 
                project={selectedProject} 
                onClose={() => setSelectedProject(null)} 
             />
        </div>
      </main>

      {/* Mobile Project List (Horizontal Scroll) */}
      <div className="lg:hidden bg-white border-t border-gray-200 p-4 overflow-x-auto whitespace-nowrap space-x-4">
        {SOLAR_PROJECTS.map(project => (
            <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`inline-block w-64 p-3 rounded-lg border text-left align-middle
                    ${selectedProject?.id === project.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 bg-white'}`}
            >
                <p className="font-bold text-slate-800 truncate">{project.name}</p>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">{project.stateCode}</span>
                    <span className="text-xs font-semibold text-blue-900">{project.capacityMW} MW</span>
                </div>
            </button>
        ))}
      </div>

    </div>
  );
};

export default App;