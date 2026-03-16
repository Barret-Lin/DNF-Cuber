import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Home, History, Cuboid, BookOpen, Zap, Trophy, BrainCircuit, CalendarDays } from 'lucide-react';
import { RubiksCubeIcon } from './components/RubiksCubeIcon';

import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import WCAPuzzlesPage from './pages/WCAPuzzlesPage';
import BasicTutorialsPage from './pages/BasicTutorialsPage';
import SpeedSolvingPage from './pages/SpeedSolvingPage';
import WorldRecordsPage from './pages/WorldRecordsPage';
import AISolverPage from './pages/AISolverPage';
import CalendarPage from './pages/CalendarPage';

const pages = [
  { id: 'home', name: '首頁', icon: Home, component: HomePage },
  { id: 'history', name: '歷史沿革', icon: History, component: HistoryPage },
  { id: 'wca', name: 'WCA 項目', icon: Cuboid, component: WCAPuzzlesPage },
  { id: 'basic', name: '基礎教學', icon: BookOpen, component: BasicTutorialsPage },
  { id: 'speed', name: '速解進階', icon: Zap, component: SpeedSolvingPage },
  { id: 'records', name: '世界紀錄', icon: Trophy, component: WorldRecordsPage },
  { id: 'calendar', name: '魔方行事曆', icon: CalendarDays, component: CalendarPage },
  { id: 'ai', name: 'AI 最佳解法', icon: BrainCircuit, component: AISolverPage },
];

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200 p-4">
          <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl max-w-2xl w-full">
            <h1 className="text-2xl font-bold text-red-400 mb-4">應用程式發生錯誤</h1>
            <pre className="text-sm text-red-300 overflow-auto whitespace-pre-wrap bg-black/50 p-4 rounded-lg">
              {this.state.error?.toString()}
            </pre>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
            >
              重新載入頁面
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const CurrentComponent = pages.find((p) => p.id === currentPage)?.component || HomePage;

  return (
    <ErrorBoundary>
      <div className="min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30 relative overflow-x-hidden">
        {/* Background Decorations */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
          
          <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[15%] left-[5%] text-cyan-500/20 w-24 h-24 md:w-32 md:h-32">
            <RubiksCubeIcon className="w-full h-full" />
          </motion.div>
          <motion.div animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-[60%] left-[10%] text-blue-500/10 w-32 h-32 md:w-48 md:h-48">
            <RubiksCubeIcon className="w-full h-full" />
          </motion.div>
          <motion.div animate={{ y: [0, -25, 0], rotate: [0, 8, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[25%] right-[8%] text-indigo-500/20 w-28 h-28 md:w-40 md:h-40">
            <RubiksCubeIcon className="w-full h-full" />
          </motion.div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Navigation */}
          <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
                  <RubiksCubeIcon className="h-6 w-6 md:h-8 md:w-8 text-cyan-400 mr-2" />
                  <span className="font-bold text-lg md:text-xl tracking-tight text-slate-100 truncate">DNF Cuber</span>
                </div>
                
                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center space-x-1">
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
                <div className="flex items-center lg:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-slate-400 hover:text-slate-200 focus:outline-none p-2"
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
                  className="lg:hidden overflow-hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-md"
                >
                  <div className="px-2 pt-2 pb-3 space-y-1 max-h-[70vh] overflow-y-auto">
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
                          className={`flex items-center w-full px-3 py-3 rounded-md text-base font-medium ${
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
          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <CurrentComponent />
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="bg-slate-950/80 border-t border-slate-800 mt-8 py-6 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} DNF Cuber. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </ErrorBoundary>
  );
}
