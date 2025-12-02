import React, { useState, useEffect } from 'react';
import { SolarProject } from '../types';
import { X, MapPin, Zap, ImageOff } from 'lucide-react';

interface ProjectCardProps {
  project: SolarProject | null;
  onClose: () => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClose }) => {
  // Reset error state when project changes
  const [imgError, setImgError] = useState(false);
  
  useEffect(() => {
    setImgError(false);
  }, [project]);

  if (!project) return null;

  // Fallback image from Unsplash if local asset is missing
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="absolute top-4 right-4 z-50 w-full max-w-sm transform transition-all duration-300 ease-in-out md:top-8 md:right-8 animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl border-2 border-orange-500 overflow-hidden">
        {/* Header Image */}
        <div className="relative h-48 w-full bg-slate-100">
          {!imgError ? (
            <img 
              src={project.imageUrl} 
              alt={project.name} 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full relative group">
                <img 
                    src={FALLBACK_IMAGE} 
                    alt="Fallback" 
                    className="w-full h-full object-cover opacity-50 grayscale"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <div className="bg-white/90 p-2 rounded-lg shadow-sm flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <ImageOff size={14} />
                        <span>Image not found: {project.imageUrl}</span>
                    </div>
                </div>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
             <h2 className="text-2xl font-bold text-white shadow-sm leading-tight">{project.name}</h2>
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center text-gray-500 text-sm font-medium">
                <MapPin size={16} className="mr-1.5 text-orange-500" />
                {project.location}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-slate-800">{project.capacityMW}</span>
                <span className="text-lg text-slate-500 font-medium">MW</span>
                <span className="ml-2 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Capacity</span>
              </div>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
                <Zap className="text-blue-600 fill-blue-600" size={20} />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Status</h4>
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-green-700">OPERATIONAL</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="block text-xs text-slate-400">Technology</span>
                    <span className="font-semibold text-slate-700">Hikam Solar PV</span>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="block text-xs text-slate-400">Grid</span>
                    <span className="font-semibold text-slate-700">Connected</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};