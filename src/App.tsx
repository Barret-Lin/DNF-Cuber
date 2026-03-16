import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Home, History, Cuboid, BookOpen, Zap, Trophy, BrainCircuit } from 'lucide-react';

import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import WCAPuzzlesPage from './pages/WCAPuzzlesPage';
import BasicTutorialsPage from './pages/BasicTutorialsPage';
import SpeedSolvingPage from './pages/SpeedSolvingPage';
import WorldRecordsPage from './pages/WorldRecordsPage';
import AISolverPage from './pages/AISolverPage';

const pages = [
  { id: 'home', name: '首頁', icon: Home, component: HomePage },
  { id: 'history', name: '歷史沿革', icon: History, component: HistoryPage },
  { id: 'wca', name: 'WCA 項目', icon: Cuboid, component: WCAPuzzlesPage },
  { id: 'basic', name: '基礎教學', icon: BookOpen, component: BasicTutorialsPage },
  { id: 'speed', name: '速解進階', icon: Zap, component: SpeedSolvingPage },
  { id: 'records', name: '世界紀錄', icon: Trophy, component: WorldRecordsPage },
  { id: 'ai', name: 'AI 最佳解法', icon: BrainCircuit, component: AISolverPage },
];

const RubiksCubeSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Top face */}
    <path d="M50 10 L90 30 L50 50 L10 30 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"/>
    <path d="M36.67 16.67 L76.67 36.67 M23.33 23.33 L63.33 43.33" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M63.33 16.67 L23.33 36.67 M76.67 23.33 L36.67 43.33" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Left face */}
    <path d="M10 30 L50 50 L50 90 L10 70 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.05"/>
    <path d="M10 43.33 L50 63.33 M10 56.67 L50 76.67" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M23.33 36.67 L23.33 76.67 M36.67 43.33 L36.67 83.33" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Right face */}
    <path d="M50 50 L90 30 L90 70 L50 90 Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
    <path d="M90 43.33 L50 63.33 M90 56.67 L50 76.67" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M76.67 36.67 L76.67 76.67 M63.33 43.33 L63.33 83.33" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const CurrentComponent = pages.find((p) => p.id === currentPage)?.component || HomePage;

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Glowing orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        
        {/* Floating Cubes */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[5%] text-cyan-500/20 w-32 h-32"
        >
          <RubiksCubeSVG className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-[60%] left-[10%] text-blue-500/10 w-48 h-48"
        >
          <RubiksCubeSVG className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -25, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[25%] right-[8%] text-indigo-500/20 w-40 h-40"
        >
          <RubiksCubeSVG className="w-full h-full" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[15%] right-[15%] text-cyan-400/15 w-24 h-24"
        >
          <RubiksCubeSVG className="w-full h-full" />
        </motion.div>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
                <Cuboid className="h-8 w-8 text-cyan-400 mr-2" />
                <span className="font-bold text-xl tracking-tight text-slate-100">DNF Cuber by Bryan Lin</span>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-1">
                {pages.map((page) => {
                  const Icon = page.icon;
                  const isActive = currentPage === page.id;
                  return (
                    <button
                      key={page.id}
                      onClick={() => setCurrentPage(page.id)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-1.5" />
                      {page.name}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Menu Button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-slate-400 hover:text-slate-200 focus:outline-none"
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {pages.map((page) => {
                    const Icon = page.icon;
                    const isActive = currentPage === page.id;
                    return (
                      <button
                        key={page.id}
                        onClick={() => {
                          setCurrentPage(page.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                          isActive
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {page.name}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Main Content */}
        <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <CurrentComponent />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="bg-slate-950/80 border-t border-slate-800 mt-12 py-8 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} DNF Cuber by Bryan Lin. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}
