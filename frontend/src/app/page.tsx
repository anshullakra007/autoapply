"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Briefcase, 
  Bookmark, 
  BarChart2, 
  UploadCloud, 
  CheckCircle,
  FileText,
  Wand2,
  ChevronRight,
  X,
  Play
} from 'lucide-react';

const mockJobs = [
  { id: 1, title: 'Software Engineer', company: 'HSBC', salary: 'To Be Announced', match: 95, location: 'Bangalore/Hyderabad', reason: 'Strong overlap in React and Python stack.', deadline: '16 MAR 2026' },
  { id: 2, title: 'SDE Intern', company: 'project44', salary: '₹ 1.35L PM', match: 88, location: 'Chennai', reason: 'UI/UX experience aligns perfectly with role.', deadline: '30 JUN 2026' },
  { id: 3, title: 'Frontend Developer', company: 'Groww', salary: '₹ 26L PA', match: 82, location: 'Bangalore', reason: 'Lacks Hadoop, but Python/SQL skills match.', deadline: '4 JUL 2026' },
  { id: 4, title: 'Backend Engineer', company: 'Value Labs', salary: '₹ 22L PA', match: 79, location: 'Hyderabad', reason: 'Missing Go experience required for core services.', deadline: '4 JUL 2026' },
  { id: 5, title: 'Full Stack Engineer', company: 'Razorpay', salary: '₹ 32L PA', match: 91, location: 'Remote', reason: 'Next.js and FastAPI experience is highly relevant.', deadline: '15 AUG 2026' },
];

const CircularProgress = ({ value }: { value: number }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  const color = value >= 90 ? 'text-emerald-400' : value >= 80 ? 'text-blue-400' : 'text-amber-400';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-12 h-12 transform -rotate-90">
        <circle className="text-gray-800" strokeWidth="3" stroke="currentColor" fill="transparent" r={radius} cx="24" cy="24" />
        <motion.circle 
          className={color}
          strokeWidth="3" 
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor" 
          fill="transparent" 
          r={radius} 
          cx="24" 
          cy="24"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <span className="absolute text-xs font-bold text-gray-200">{value}%</span>
    </div>
  );
};

export default function Dashboard() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeJob, setActiveJob] = useState<any>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Simulate upload and parse
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-blue-500/30 flex">
      {/* Sidebar Navigation */}
      <aside className="w-20 hover:w-64 transition-all duration-300 border-r border-white/10 bg-black/50 backdrop-blur-xl flex flex-col items-center hover:items-start py-8 fixed h-full z-50 group">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center mb-12 group-hover:ml-6 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        
        <nav className="flex flex-col gap-6 w-full px-6 text-gray-400">
          {[
            { icon: Home, label: 'Home', active: true }
          ].map((item, i) => (
            <button key={i} className={`flex items-center gap-4 p-2 rounded-lg transition-all ${item.active ? 'text-blue-400 bg-blue-500/10' : 'hover:text-gray-200 hover:bg-white/5'}`}>
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 font-medium whitespace-nowrap transition-opacity">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-20 flex-1 p-8 lg:p-12 max-w-7xl mx-auto space-y-12 relative">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Hero / Upload Section */}
        <section className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-2">Job Matcher</h1>
            <p className="text-gray-400">Upload your resume to find jobs that perfectly match your skills.</p>
          </motion.div>

          <div 
            className={`relative w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 ${
              isDragging ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(37,99,235,0.2)]' : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <div className="p-12 flex flex-col items-center justify-center text-center">
              {uploadProgress > 0 ? (
                <div className="w-full max-w-md space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-blue-400">Analyzing your resume...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-blue-600 to-purple-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                    <UploadCloud className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
                  <p className="text-gray-500 text-sm">Drag & drop your PDF resume here to get started</p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Job Feed Grid */}
        <section className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" /> Latest Job Matches
            </h3>
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Updates
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockJobs.map((job, i) => (
              <motion.div 
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setActiveJob(job)}
                className="group cursor-pointer bg-black/40 border border-white/10 p-6 rounded-2xl hover:bg-white/[0.03] hover:border-white/20 transition-all font-mono backdrop-blur-md relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-lg font-bold font-sans text-gray-100 mb-1 line-clamp-1">{job.title}</h4>
                    <p className="text-sm text-gray-400">{job.company}</p>
                  </div>
                  <CircularProgress value={job.match} />
                </div>

                <div className="space-y-2 text-xs text-gray-500 mb-6">
                  <div className="flex justify-between">
                    <span>Salary</span>
                    <span className="text-gray-300 font-medium">{job.salary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location</span>
                    <span className="text-gray-300 font-medium">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Apply Before</span>
                    <span className="text-gray-300 font-medium">{job.deadline}</span>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                  <div className="text-[10px] uppercase text-gray-500 mb-1 tracking-wider">Why it's a match</div>
                  <p className="text-xs text-gray-300 font-sans leading-relaxed line-clamp-2">{job.reason}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Slide-out Panel (Shadcn Sheet mock) */}
      <AnimatePresence>
        {activeJob && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setActiveJob(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0a0a0a] border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-8">
                <button onClick={() => setActiveJob(null)} className="mb-8 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center font-bold text-2xl">
                    {activeJob.company[0]}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{activeJob.title}</h2>
                    <p className="text-gray-400 text-lg">{activeJob.company} • {activeJob.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 border-b border-white/10 pb-2">Resume Feedback</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-gray-300">Strong match for <span className="text-white font-medium">React</span> and <span className="text-white font-medium">TypeScript</span>.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                        <span className="text-gray-300">Missing keywords: <span className="text-white font-medium">GraphQL</span>, <span className="text-white font-medium">CI/CD</span>. Add these if you have experience.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 border-b border-white/10 pb-2">Cover Letter Generator</h3>
                    <p className="text-sm text-gray-400 italic">Generate a personalized cover letter based on your experience and this job.</p>
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                      <FileText className="w-4 h-4" />
                      Generate Cover Letter
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 border-b border-white/10 pb-2">Job Description</h3>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-400 font-mono leading-relaxed h-64 overflow-y-auto">
                    We are looking for a highly skilled {activeJob.title} to join our core team at {activeJob.company}. You will be responsible for architecting scalable solutions, optimizing performance, and building seamless user experiences...
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
