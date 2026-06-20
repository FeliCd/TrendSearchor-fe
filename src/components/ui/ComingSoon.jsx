import React from 'react';
import { Hammer } from 'lucide-react';

export default function ComingSoon({ title = 'Coming Soon', description = 'This feature is currently under development.' }) {
  return (
    <div className="flex-1 h-full w-full flex flex-col items-center justify-center bg-[#151515] p-8 min-h-[400px]">
      <div className="border-4 border-gray-800 p-12 flex flex-col items-center bg-[#1e1e1e] shadow-[8px_8px_0px_0px_#000000] max-w-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#0058be]"></div>
        <div className="w-16 h-16 border-4 border-[#0058be] bg-[#0058be]/10 flex items-center justify-center mb-6">
          <Hammer className="w-8 h-8 text-[#0058be]" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">{title}</h1>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{description}</p>
      </div>
    </div>
  );
}
