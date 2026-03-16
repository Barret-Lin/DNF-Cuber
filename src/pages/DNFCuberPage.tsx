import { motion } from 'motion/react';
import { Youtube, ExternalLink } from 'lucide-react';

const videos = [
  { id: 'mF6F3Gzw_Q8', type: 'video', title: '賽程轉播', start: 65 },
  { id: '2eGlXar9B_o', type: 'short', title: 'Shorts 1' },
  { id: 'eGsepfDXkQo', type: 'short', title: 'Shorts 2' },
  { id: 'yEAgn3xYYeM', type: 'short', title: 'Shorts 3' },
  { id: '1tsjydjjolo', type: 'short', title: 'Shorts 4' },
  { id: 'HGj4ntqNJdQ', type: 'short', title: 'Shorts 5' },
  { id: 'orC81ipd0ts', type: 'short', title: 'Shorts 6' },
  { id: '125LuEnnIok', type: 'short', title: 'Shorts 7' },
];

export default function DNFCuberPage() {
  return (
    <div className="space-y-8 relative">
      <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-red-500/10 rounded-full blur-[100px] md:blur-[120px] -z-10"></div>
      
      <div className="text-center space-y-4 mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight flex items-center justify-center gap-3">
          <Youtube className="w-8 h-8 md:w-10 md:h-10 text-red-500" />
          DNF Cuber
        </h1>
        <p className="text-base md:text-lg text-slate-400">
          賽程轉播與精彩短影音
        </p>
        <a 
          href="https://www.youtube.com/@%E6%9E%97%E5%B1%95%E9%82%91-f6x" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full transition-colors font-medium"
        >
          前往 YouTube 頻道 <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Main Video */}
        {videos.filter(v => v.type === 'video').map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800 overflow-hidden p-2 md:p-4"
          >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}${video.start ? `?start=${video.start}` : ''}`}
                title={video.title}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        ))}

        {/* Shorts */}
        {videos.filter(v => v.type === 'short').map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-800 overflow-hidden flex justify-center p-2"
          >
            <div className="relative w-full max-w-[300px] aspect-[9/16] rounded-xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
