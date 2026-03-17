import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Globe, Clock, AlertCircle, Loader2, LogIn, LogOut } from 'lucide-react';

interface WCAUser {
  id: number;
  wca_id: string;
  name: string;
  gender: string;
  country_iso2: string;
  avatar: {
    url: string;
    thumb_url: string;
  };
}

interface PersonalBest {
  eventId: string;
  best: number;
  type: 'single' | 'average';
  worldRanking: number;
  continentRanking: number;
  nationalRanking: number;
}

export default function HeroBoardPage() {
  const [user, setUser] = useState<WCAUser | null>(null);
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // 確保訊息來自同一個網域 (支援 Vercel, Localhost, AI Studio 等任何部署環境)
      if (event.origin !== window.location.origin) {
        return;
      }
      if (event.data?.type === 'WCA_AUTH_SUCCESS' && event.data.token) {
        setAccessToken(event.data.token);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (accessToken) {
      fetchUserData(accessToken);
    }
  }, [accessToken]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const clientId = process.env.WCA_CLIENT_ID;
      if (!clientId) {
        throw new Error('無法取得 WCA_CLIENT_ID，請確認環境變數設定。如果您是在 Vercel 等平台部署，請確保該平台也設定了此環境變數。');
      }

      const redirectUri = `${window.location.origin}/auth/callback`;
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "token",
        scope: "public",
      });

      const url = `https://www.worldcubeassociation.org/oauth/authorize?${params}`;
      
      const authWindow = window.open(
        url,
        'wca_oauth_popup',
        'width=600,height=700'
      );

      if (!authWindow) {
        throw new Error('彈出視窗被封鎖，請允許此網站開啟彈出視窗。');
      }
    } catch (err: any) {
      setError(err.message || '登入過程發生錯誤');
    } finally {
      setIsLoading(false);
    }
  };

  const [medals, setMedals] = useState<{gold: number, silver: number, bronze: number} | null>(null);

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);
    setPersonalBests([]);
    setMedals(null);
  };

  const fetchUserData = async (token: string) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Fetch user profile
      const profileRes = await fetch('https://www.worldcubeassociation.org/api/v0/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!profileRes.ok) {
        throw new Error('無法取得使用者資料');
      }
      
      const profileData = await profileRes.json();
      setUser(profileData.me);
      
      // Fetch personal bests
      if (profileData.me.wca_id) {
        const pbsRes = await fetch(`https://www.worldcubeassociation.org/api/v0/persons/${profileData.me.wca_id}`);
        if (pbsRes.ok) {
          const pbsData = await pbsRes.json();
          
          if (pbsData.person && pbsData.person.medals) {
            setMedals({
              gold: pbsData.person.medals.gold || 0,
              silver: pbsData.person.medals.silver || 0,
              bronze: pbsData.person.medals.bronze || 0
            });
          } else if (pbsData.medals) {
            setMedals({
              gold: pbsData.medals.gold || 0,
              silver: pbsData.medals.silver || 0,
              bronze: pbsData.medals.bronze || 0
            });
          }

          if (pbsData.personal_records) {
            const formattedPBs: PersonalBest[] = [];
            
            // Format single records
            Object.keys(pbsData.personal_records).forEach(eventId => {
              const record = pbsData.personal_records[eventId];
              if (record.single) {
                formattedPBs.push({
                  eventId,
                  best: record.single.best,
                  type: 'single',
                  worldRanking: record.single.world_rank,
                  continentRanking: record.single.continent_rank,
                  nationalRanking: record.single.country_rank
                });
              }
              if (record.average) {
                formattedPBs.push({
                  eventId,
                  best: record.average.best,
                  type: 'average',
                  worldRanking: record.average.world_rank,
                  continentRanking: record.average.continent_rank,
                  nationalRanking: record.average.country_rank
                });
              }
            });
            
            setPersonalBests(formattedPBs);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || '取得資料時發生錯誤');
      setAccessToken(null); // Reset token on error
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (centiseconds: number, eventId: string) => {
    if (eventId === '333fm') {
      return centiseconds.toString();
    }
    if (eventId === '333mbf') {
      // Multi-blind formatting is complex, simplified here
      return centiseconds.toString();
    }
    
    const totalSeconds = centiseconds / 100;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2);
    
    if (minutes > 0) {
      return `${minutes}:${seconds.padStart(5, '0')}`;
    }
    return seconds;
  };

  const formatEventName = (eventId: string) => {
    const eventNames: Record<string, string> = {
      '333': '3x3x3 方塊',
      '222': '2x2x2 方塊',
      '444': '4x4x4 方塊',
      '555': '5x5x5 方塊',
      '666': '6x6x6 方塊',
      '777': '7x7x7 方塊',
      '333bf': '3x3x3 盲解',
      '333fm': '3x3x3 最少步數',
      '333oh': '3x3x3 單手',
      'clock': '魔術鐘',
      'minx': '五魔方',
      'pyram': '金字塔方塊',
      'skewb': '斜轉方塊',
      'sq1': 'Square-1',
      '444bf': '4x4x4 盲解',
      '555bf': '5x5x5 盲解',
      '333mbf': '3x3x3 多顆盲解'
    };
    return eventNames[eventId] || eventId;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center">
            <Trophy className="w-8 h-8 text-amber-400 mr-3" />
            英雄板
          </h1>
          <p className="text-slate-400 mt-2">
            登入 WCA 帳號，查看您的官方賽事最佳成績與世界排名。
          </p>
        </div>
        
        {!user && !isLoading && (
          <button
            onClick={handleLogin}
            className="flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-cyan-900/20"
          >
            <LogIn className="w-5 h-5 mr-2" />
            使用 WCA 帳號登入
          </button>
        )}
        
        {user && (
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            登出
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-start">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium">發生錯誤</h3>
            <p className="text-sm opacity-80 mt-1">{error}</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
          <p className="text-slate-400">正在載入資料...</p>
        </div>
      )}

      {user && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* User Profile Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 flex-shrink-0">
              {user.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-500 text-4xl font-bold">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">{user.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400">
                {user.wca_id && (
                  <div className="flex items-center bg-slate-800/50 px-3 py-1 rounded-full">
                    <Globe className="w-4 h-4 mr-2 text-cyan-400" />
                    WCA ID: <strong className="text-slate-200 ml-1">{user.wca_id}</strong>
                  </div>
                )}
                <div className="flex items-center bg-slate-800/50 px-3 py-1 rounded-full">
                  <span className="mr-2">🌍</span>
                  國家/地區: <strong className="text-slate-200 ml-1">{user.country_iso2}</strong>
                </div>
              </div>
              
              {medals && (medals.gold > 0 || medals.silver > 0 || medals.bronze > 0) && (
                <div className="flex items-center justify-center md:justify-start gap-3 mt-4 pt-4 border-t border-slate-800/50">
                  <span className="text-sm text-slate-400 font-medium mr-1">獲獎紀錄:</span>
                  {medals.gold > 0 && (
                    <div className="flex items-center bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-md">
                      <span className="text-yellow-500 mr-1.5">🥇</span>
                      <strong className="text-yellow-400">{medals.gold}</strong>
                    </div>
                  )}
                  {medals.silver > 0 && (
                    <div className="flex items-center bg-slate-400/10 border border-slate-400/20 px-2 py-1 rounded-md">
                      <span className="text-slate-300 mr-1.5">🥈</span>
                      <strong className="text-slate-300">{medals.silver}</strong>
                    </div>
                  )}
                  {medals.bronze > 0 && (
                    <div className="flex items-center bg-amber-700/10 border border-amber-700/20 px-2 py-1 rounded-md">
                      <span className="text-amber-600 mr-1.5">🥉</span>
                      <strong className="text-amber-600">{medals.bronze}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Personal Bests */}
          {personalBests.length > 0 ? (
            <div>
              <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center">
                <Medal className="w-6 h-6 text-amber-400 mr-2" />
                個人最佳成績 (PB) 與排名
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {personalBests.map((pb, index) => (
                  <motion.div
                    key={`${pb.eventId}-${pb.type}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-200 text-lg">{formatEventName(pb.eventId)}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${
                          pb.type === 'single' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'
                        }`}>
                          {pb.type === 'single' ? '單次最佳 (Single)' : '平均最佳 (Average)'}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-cyan-400">
                          {formatTime(pb.best, pb.eventId)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800/50">
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">世界排名</div>
                        <div className="font-mono font-medium text-slate-300">#{pb.worldRanking}</div>
                      </div>
                      <div className="text-center border-l border-r border-slate-800/50">
                        <div className="text-xs text-slate-500 mb-1">洲際排名</div>
                        <div className="font-mono font-medium text-slate-300">#{pb.continentRanking}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">國家排名</div>
                        <div className="font-mono font-medium text-slate-300">#{pb.nationalRanking}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            user.wca_id ? (
              <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">目前沒有官方賽事成績紀錄。</p>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">您的帳號尚未連結 WCA ID，無法查詢成績。</p>
              </div>
            )
          )}
        </motion.div>
      )}
    </div>
  );
}
