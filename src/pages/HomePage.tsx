import { motion } from 'motion/react';
import { Cuboid, Trophy, BrainCircuit } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] -z-10"></div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <Cuboid className="h-20 w-20 text-cyan-400" />
          </div>
        </motion.div>
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-100 sm:text-6xl">
          探索魔術方塊的<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">極限世界</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-400">
          從基礎復原到世界級速解，結合 AI 智能分析，帶您全面掌握魔術方塊的各項技術與歷史。
        </p>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={Cuboid}
          title="WCA 全項目解析"
          description="涵蓋所有世界魔方協會 (WCA) 正式比賽項目，從二階到七階，以及魔表、金字塔等異形魔方。"
        />
        <FeatureCard
          icon={Trophy}
          title="世界紀錄與歷史"
          description="追蹤各大洲及世界紀錄保持人的輝煌歷史，觀看創紀錄的珍貴影片與演進過程。"
        />
        <FeatureCard
          icon={BrainCircuit}
          title="AI 智能解法創新"
          description="透過 AI 綜整頂尖選手解法，為您提供最佳、最快速的創新魔方復原策略。"
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-800 hover:border-cyan-500/30 transition-colors"
    >
      <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-cyan-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
