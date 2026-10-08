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
  Play,
  ExternalLink
} from 'lucide-react';

const mockJobs = [
  { 
    id: 1, 
    title: 'Software Development Engineer I', 
    company: 'CRED', 
    salary: '₹ 16L - 20L PA', 
    match: 95, 
    location: 'Bangalore, Karnataka', 
    reason: 'Strong overlap in React and Python stack. Previous fintech experience is a huge plus.', 
    deadline: '20 NOV 2026',
    link: 'https://careers.cred.club/',
    description: 'CRED is looking for a passionate SDE I to build high-scale, low-latency fintech systems. You will work on architecting solutions for millions of members, integrating payment gateways, and ensuring bank-grade security.' 
  },
  { 
    id: 2, 
    title: 'Frontend Engineer (React)', 
    company: 'Meesho', 
    salary: '₹ 14L - 18L PA', 
    match: 88, 
    location: 'Bangalore, Karnataka', 
    reason: 'UI/UX experience aligns perfectly with role. Excellent TypeScript background.', 
    deadline: '05 DEC 2026',
    link: 'https://meesho.io/jobs',
    description: 'Join Meesho to democratize internet commerce in India. You will build highly responsive, mobile-first web applications using React and Next.js, optimizing performance for next-billion users on low-end devices.' 
  },
  { 
    id: 3, 
    title: 'Backend Software Engineer', 
    company: 'Postman', 
    salary: '₹ 18L PA', 
    match: 82, 
    location: 'Remote, India', 
    reason: 'Lacks Hadoop, but Python/SQL and API design skills strongly match.', 
    deadline: '15 DEC 2026',
    link: 'https://www.postman.com/company/careers/',
    description: 'Postman is building the future of APIs. You will design, develop, and maintain highly scalable backend microservices, working heavily with Node.js, Python, and distributed data stores.' 
  },
  { 
    id: 4, 
    title: 'SDE Intern', 
    company: 'Razorpay', 
    salary: '₹ 45K PM', 
    match: 79, 
    location: 'Bangalore / Remote', 
    reason: 'Missing Go experience required for core services, but Node.js fits perfectly.', 
    deadline: '10 NOV 2026',
    link: 'https://razorpay.com/jobs/',
    description: 'Kickstart your career at Razorpay. As an SDE Intern, you will be embedded in a core product team, writing production code, participating in architecture discussions, and learning how to build resilient payment systems.' 
  },
  { 
    id: 5, 
    title: 'Data Engineer I', 
    company: 'Zeta', 
    salary: '₹ 12L - 16L PA', 
    match: 91, 
    location: 'Hyderabad, Telangana', 
    reason: 'AWS and data pipeline experience is highly relevant for this banking role.', 
    deadline: '31 JAN 2027',
    link: 'https://www.zeta.tech/careers/',
    description: 'Zeta is transforming modern banking tech. You will build scalable data pipelines, design data warehouses, and work closely with data scientists to unlock insights from petabytes of transactional data.' 
  },
];

const CircularProgress = ({ value }: { value: number }) => {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  const color = value >= 90 ? 'text-emerald-500' : value >= 80 ? 'text-indigo-500' : 'text-amber-500';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-12 h-12 transform -rotate-90">
        <circle className="text-gray-100" strokeWidth="3" stroke="currentColor" fill="transparent" r={radius} cx="24" cy="24" />
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
      <span className="absolute text-xs font-bold text-gray-700">{value}%</span>
    </div>
  );
};

export default function Dashboard() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  
  // Real file input reference
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        // Simulate dynamic backend match generation
        setTimeout(() => {
          setJobs(mockJobs.map(job => ({
            ...job,
            // Randomize match slightly to simulate live processing
            match: Math.floor(Math.random() * (98 - 75 + 1) + 75)
          })).sort((a, b) => b.match - a.match));
        }, 500);
      }
    }, 100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUpload();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload();
    }
  };

  const handleGenerateCoverLetter = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCoverLetter(`Dear Hiring Manager at ${activeJob.company},\n\nI am writing to express my strong interest in the ${activeJob.title} position at ${activeJob.company}. With my background in software engineering and a proven track record of delivering scalable solutions, I am confident in my ability to contribute effectively to your team.\n\nMy experience aligns well with the requirements for this role, and I am particularly drawn to ${activeJob.company}'s innovative approach in the industry. I have successfully built and optimized applications using modern frameworks, ensuring high performance and user satisfaction.\n\nI would welcome the opportunity to discuss how my skills and experiences can bring value to your engineering team. Thank you for considering my application.\n\nSincerely,\n[Your Name]`);
      setIsGenerating(false);
    }, 2000);
  };

  const handleClosePanel = () => {
    setActiveJob(null);
    setCoverLetter(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex">
      {/* Sidebar Navigation */}
      <aside className="w-20 hover:w-64 transition-all duration-300 border-r border-gray-200 bg-white flex flex-col items-center hover:items-start py-8 fixed h-full z-50 group shadow-sm">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mb-12 group-hover:ml-6 transition-all shadow-md">
          <Wand2 className="w-5 h-5 text-white" />
        </div>
        
        <nav className="flex flex-col gap-6 w-full px-6 text-gray-500">
          {[
            { icon: Home, label: 'Home', active: true }
          ].map((item, i) => (
            <button key={i} className={`flex items-center gap-4 p-2 rounded-lg transition-all ${item.active ? 'text-indigo-600 bg-indigo-50' : 'hover:text-gray-900 hover:bg-gray-100'}`}>
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="opacity-0 group-hover:opacity-100 font-medium whitespace-nowrap transition-opacity">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-20 flex-1 p-8 lg:p-12 max-w-7xl mx-auto space-y-12 relative">
        {/* Hero / Upload Section */}
        <section className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Job Matcher</h1>
            <p className="text-gray-600">Upload your resume to find jobs that perfectly match your skills.</p>
          </motion.div>

          <div 
            className={`relative w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 bg-white cursor-pointer ${
              isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden" 
              accept=".pdf,.doc,.docx"
            />
            
            <div className="p-12 flex flex-col items-center justify-center text-center">
              {uploadProgress > 0 && uploadProgress < 100 ? (
                <div className="w-full max-w-md space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-indigo-600">Analyzing your resume...</span>
                    <span className="text-gray-700">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-indigo-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : uploadProgress === 100 ? (
                <>
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Resume Analyzed!</h3>
                  <p className="text-gray-500 text-sm">We've found {jobs.length} great matches for you below.</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 border border-indigo-100">
                    <UploadCloud className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">Upload Your Resume</h3>
                  <p className="text-gray-500 text-sm">Drag & drop your PDF here, or click to browse files</p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Job Feed Grid */}
        {jobs.length > 0 && (
          <section className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
                <Play className="w-4 h-4 text-emerald-500" /> Latest Job Matches
              </h3>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-white shadow-sm px-3 py-1.5 rounded-full border border-gray-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Updates
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job, i) => (
                <motion.div 
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setActiveJob(job)}
                  className="group cursor-pointer bg-white border border-gray-200 shadow-sm hover:shadow-md p-6 rounded-2xl transition-all relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{job.title}</h4>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-bold text-sm border border-indigo-100">
                      {job.match}%
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600 mb-6 border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs uppercase font-semibold">Salary</span>
                      <span className="font-medium text-gray-800">{job.salary}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs uppercase font-semibold">Location</span>
                      <span className="font-medium text-gray-800">{job.location}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-xs uppercase font-semibold">Apply Before</span>
                      <span className="font-medium text-gray-800">{job.deadline}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-50">
                    <div className="text-[10px] uppercase text-indigo-500 font-semibold mb-1 tracking-wider">Why it's a match</div>
                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{job.reason}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {activeJob && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={handleClosePanel}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white border-l border-gray-200 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-8">
                <button onClick={handleClosePanel} className="mb-8 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                  <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-sm">
                    {activeJob.company[0]}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{activeJob.title}</h2>
                    <p className="text-gray-600 text-lg">{activeJob.company} • {activeJob.location}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">Resume Feedback</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span className="text-gray-600">Strong match for <span className="text-gray-900 font-medium">React</span> and <span className="text-gray-900 font-medium">TypeScript</span>.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <X className="w-5 h-5 text-red-500 shrink-0" />
                        <span className="text-gray-600">Missing keywords: <span className="text-gray-900 font-medium">GraphQL</span>, <span className="text-gray-900 font-medium">CI/CD</span>. Add these if you have experience.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">Cover Letter Generator</h3>
                    <p className="text-sm text-gray-600">Generate a personalized cover letter based on your experience and this job.</p>
                    
                    {!coverLetter ? (
                      <button 
                        onClick={handleGenerateCoverLetter}
                        disabled={isGenerating}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                        {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
                      </button>
                    ) : (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {coverLetter}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">Job Description</h3>
                  <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 leading-relaxed">
                    {activeJob.description}
                  </div>
                  
                  <div className="pt-4">
                    <a 
                      href={activeJob.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-900/20"
                    >
                      Apply on Company Website <ExternalLink className="w-5 h-5" />
                    </a>
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
