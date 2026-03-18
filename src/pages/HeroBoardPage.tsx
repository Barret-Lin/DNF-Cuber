import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Medal, Globe, Clock, AlertCircle, Loader2, LogIn, LogOut, Upload, Image as ImageIcon, RefreshCw, MapPin, Calendar } from 'lucide-react';

interface WCAUser {
  id: string | number;
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
  const [displayedUser, setDisplayedUser] = useState<WCAUser | null>(() => {
    const saved = sessionStorage.getItem('wca_displayed_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>(() => {
    const saved = sessionStorage.getItem('wca_personal_bests');
    return saved ? JSON.parse(saved) : [];
  });
  const [medals, setMedals] = useState<{gold: number, silver: number, bronze: number} | null>(() => {
    const saved = sessionStorage.getItem('wca_medals');
    return saved ? JSON.parse(saved) : null;
  });
  const [allResults, setAllResults] = useState<any[]>(() => {
    const saved = sessionStorage.getItem('wca_all_results');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(() => sessionStorage.getItem('wca_access_token'));
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedRecord, setSelectedRecord] = useState<{ eventId: string, type: 'single' | 'average', best: number } | null>(null);

  useEffect(() => {
    if (displayedUser?.wca_id) {
      const savedAvatar = localStorage.getItem(`custom_avatar_${displayedUser.wca_id}`);
      if (savedAvatar) {
        setCustomAvatar(savedAvatar);
      } else {
        setCustomAvatar(null);
      }
    }
  }, [displayedUser?.wca_id]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'WCA_AUTH_SUCCESS' && event.data.token) {
        try {
          sessionStorage.setItem('wca_access_token', event.data.token);
        } catch (e) { console.warn('Failed to cache access token', e); }
        setAccessToken(event.data.token);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!displayedUser) {
      fetchData(accessToken);
    } else {
      // Fetch in background to ensure data is up-to-date
      fetchData(accessToken, true);
    }

    // Auto-refresh data every 1 minute to ensure immediate synchronization
    const intervalId = setInterval(() => {
      fetchData(accessToken, true);
    }, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [accessToken]); // Only run on mount and token change

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const clientId = process.env.WCA_CLIENT_ID;
      if (!clientId) {
        throw new Error('無法取得 WCA_CLIENT_ID，請確認環境變數設定。');
      }

      const redirectUri = `${window.location.origin}/auth/callback`;
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "token",
        scope: "public",
      });

      const url = `https://www.worldcubeassociation.org/oauth/authorize?${params}`;
      
      const authWindow = window.open(url, 'wca_oauth_popup', 'width=600,height=700');
      if (!authWindow) throw new Error('彈出視窗被封鎖，請允許此網站開啟彈出視窗。');
    } catch (err: any) {
      setError(err.message || '登入過程發生錯誤');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('wca_access_token');
    sessionStorage.removeItem('wca_displayed_user');
    sessionStorage.removeItem('wca_personal_bests');
    sessionStorage.removeItem('wca_medals');
    sessionStorage.removeItem('wca_all_results');
    setAccessToken(null);
    setDisplayedUser(null);
    setPersonalBests([]);
    setMedals(null);
    setAllResults([]);
    setCustomAvatar(null);
    setSelectedRecord(null);
    // Fetch default user after logout
    fetchData(null);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('請上傳圖片檔案');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      setCustomAvatar(base64String);
      if (displayedUser?.wca_id) {
        try {
          localStorage.setItem(`custom_avatar_${displayedUser.wca_id}`, base64String);
        } catch (e) {
          if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            alert('儲存空間已滿！無法儲存自訂頭像。');
          } else {
            console.error('Failed to save avatar:', e);
          }
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const fetchData = async (token: string | null, isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError('');
      
      let targetWcaId = '2024linc05'; // Default user
      let userData: any = null;

      if (token) {
        const profileRes = await fetch('https://www.worldcubeassociation.org/api/v0/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          userData = profileData.me;
          targetWcaId = profileData.me.wca_id;
        } else {
          // Token might be invalid, fallback to default
          sessionStorage.removeItem('wca_access_token');
          setAccessToken(null);
        }
      }

      // Fetch person details (records, medals, etc.)
      const pbsRes = await fetch(`https://www.worldcubeassociation.org/api/v0/persons/${targetWcaId}`);
      if (!pbsRes.ok) throw new Error('無法取得使用者資料');
      const pbsData = await pbsRes.json();

      if (!userData) {
        userData = pbsData.person;
      }

      setDisplayedUser(userData);
      try {
        sessionStorage.setItem('wca_displayed_user', JSON.stringify(userData));
      } catch (e) { console.warn('Failed to cache user data', e); }

      // Parse medals
      let medalsData = { gold: 0, silver: 0, bronze: 0 };
      if (pbsData.person && pbsData.person.medals) {
        medalsData = {
          gold: pbsData.person.medals.gold || 0,
          silver: pbsData.person.medals.silver || 0,
          bronze: pbsData.person.medals.bronze || 0
        };
      } else if (pbsData.medals) {
        medalsData = {
          gold: pbsData.medals.gold || 0,
          silver: pbsData.medals.silver || 0,
          bronze: pbsData.medals.bronze || 0
        };
      }
      setMedals(medalsData);
      try {
        sessionStorage.setItem('wca_medals', JSON.stringify(medalsData));
      } catch (e) { console.warn('Failed to cache medals', e); }

      // Parse personal records
      const formattedPBs: PersonalBest[] = [];
      if (pbsData.personal_records) {
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
      }
      setPersonalBests(formattedPBs);
      try {
        sessionStorage.setItem('wca_personal_bests', JSON.stringify(formattedPBs));
      } catch (e) { console.warn('Failed to cache personal bests', e); }

      // Fetch all results for the map feature
      const resultsRes = await fetch(`https://www.worldcubeassociation.org/api/v0/persons/${targetWcaId}/results`);
      if (resultsRes.ok) {
        const resultsData = await resultsRes.json();
        setAllResults(resultsData);
        try {
          sessionStorage.setItem('wca_all_results', JSON.stringify(resultsData));
        } catch (e) { console.warn('Failed to cache all results', e); }
      }

    } catch (err: any) {
      setError(err.message || '取得資料時發生錯誤');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRecordClick = (eventId: string, type: 'single' | 'average', best: number) => {
    if (selectedRecord?.eventId === eventId) {
      // Toggle off if clicking the same event
      setSelectedRecord(null);
      return;
    }

    setSelectedRecord({ eventId, type, best });
  };

  const formatTime = (centiseconds: number, eventId: string, type?: 'single' | 'average') => {
    if (eventId === '333fm') {
      if (type === 'average') {
        return (centiseconds / 100).toFixed(2);
      }
      return centiseconds.toString();
    }
    if (eventId === '333mbf') {
      const difference = 99 - Math.floor(centiseconds / 10000000);
      const timeInSeconds = centiseconds % 100000;
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${difference} points, ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    const totalSeconds = centiseconds / 100;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = (totalSeconds % 60).toFixed(2);
    
    if (minutes > 0) return `${minutes}:${seconds.padStart(5, '0')}`;
    return seconds;
  };

  const formatEventName = (eventId: string) => {
    const eventNames: Record<string, string> = {
      '333': '3x3x3 方塊', '222': '2x2x2 方塊', '444': '4x4x4 方塊',
      '555': '5x5x5 方塊', '666': '6x6x6 方塊', '777': '7x7x7 方塊',
      '333bf': '3x3x3 盲解', '333fm': '3x3x3 最少步數', '333oh': '3x3x3 單手',
      'clock': '魔錶', 'minx': '五魔方', 'pyram': '金字塔方塊',
      'skewb': '斜轉方塊', 'sq1': 'Square-1', '444bf': '4x4x4 盲解',
      '555bf': '5x5x5 盲解', '333mbf': '3x3x3 多顆盲解'
    };
    return eventNames[eventId] || eventId;
  };

  const formatResultTime = (time: number, eventId: string, type: 'single' | 'average') => {
    if (time === -1) return 'DNF';
    if (time === -2) return 'DNS';
    if (time === 0) return '';
    return formatTime(time, eventId, type);
  };

  const roundNames: Record<string, string> = {
    '1': '第一輪',
    '2': '第二輪',
    '3': '準決賽',
    'c': '初賽',
    'd': '第一輪',
    'e': '第二輪',
    'f': '決賽',
    'g': '決賽',
    'h': '決賽',
    'b': 'B 組決賽'
  };

  const renderAttemptColumn = (result: any, eventId: string, idx: number) => {
    if (!result.attempts || idx >= result.attempts.length || result.attempts[idx] === 0) {
      return <td key={idx} className="px-2 py-3 text-center text-slate-500">-</td>;
    }
    
    const attempt = result.attempts[idx];
    const isBest = idx === result.best_index;
    const isWorst = idx === result.worst_index;
    const isDNF = attempt === -1;
    const isDNS = attempt === -2;
    
    let displayStr = '';
    if (isDNF) displayStr = 'DNF';
    else if (isDNS) displayStr = 'DNS';
    else displayStr = formatTime(attempt, eventId, 'single');

    const showParentheses = (isBest || isWorst) && result.average > 0 && result.attempts.filter((a: number) => a > 0 || a === -1).length >= 5;

    return (
      <td key={idx} className={`px-2 py-3 text-center font-mono ${showParentheses ? 'text-slate-500' : 'text-slate-300'}`}>
        {showParentheses ? `(${displayStr})` : displayStr}
      </td>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center">
            <Trophy className="w-8 h-8 text-amber-400 mr-3" />
            英雄板
          </h1>
          <p className="text-slate-400 mt-2">
            查看官方賽事最佳成績與世界排名。點擊成績可查看賽事地圖。
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => fetchData(accessToken, true)}
            disabled={isRefreshing || isLoading}
            className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            手動更新
          </button>

          {!accessToken && !isLoading && (
            <button
              onClick={handleLogin}
              className="flex items-center px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-cyan-900/20"
            >
              <LogIn className="w-5 h-5 mr-2" />
              WCA 登入
            </button>
          )}
          
          {accessToken && (
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-900/40 hover:bg-red-900/60 text-red-300 font-medium rounded-lg transition-colors border border-red-800/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              登出
            </button>
          )}
        </div>
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

      {isLoading && !isRefreshing && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
          <p className="text-slate-400">正在載入資料...</p>
        </div>
      )}

      {displayedUser && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* User Profile Card */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
            {!accessToken && (
              <div className="absolute top-0 right-0 bg-cyan-900/40 text-cyan-400 text-xs px-3 py-1 rounded-bl-lg border-b border-l border-cyan-800/50 font-medium">
                預設展示資料
              </div>
            )}
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 flex-shrink-0 relative">
                {customAvatar ? (
                  <img src={customAvatar} alt={displayedUser.name} className="w-full h-full object-cover" />
                ) : displayedUser.avatar?.url ? (
                  <img src={displayedUser.avatar.url} alt={displayedUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-4xl font-bold">
                    {displayedUser.name.charAt(0)}
                  </div>
                )}
                
                {/* Upload Overlay */}
                <div 
                  className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-6 h-6 text-white mb-1" />
                  <span className="text-xs text-white font-medium">更換相片</span>
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">{displayedUser.name}</h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-400">
                {displayedUser.wca_id && (
                  <div className="flex items-center bg-slate-800/50 px-3 py-1 rounded-full">
                    <Globe className="w-4 h-4 mr-2 text-cyan-400" />
                    WCA ID: <strong className="text-slate-200 ml-1">{displayedUser.wca_id}</strong>
                  </div>
                )}
                <div className="flex items-center bg-slate-800/50 px-3 py-1 rounded-full">
                  <span className="mr-2">🌍</span>
                  國家/地區: <strong className="text-slate-200 ml-1">{displayedUser.country_iso2}</strong>
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
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                <h3 className="text-xl font-bold text-slate-200 flex items-center">
                  <Medal className="w-6 h-6 text-amber-400 mr-2" />
                  個人紀錄 (Personal Records)
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-300">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/50 border-b border-slate-700">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-medium">項目 (Event)</th>
                      <th scope="col" className="px-4 py-3 text-center font-medium">NR</th>
                      <th scope="col" className="px-4 py-3 text-center font-medium">CR</th>
                      <th scope="col" className="px-4 py-3 text-center font-medium">WR</th>
                      <th scope="col" className="px-4 py-3 text-right font-medium">單次 (Single)</th>
                      <th scope="col" className="px-4 py-3 text-left font-medium">平均 (Average)</th>
                      <th scope="col" className="px-4 py-3 text-center font-medium">WR</th>
                      <th scope="col" className="px-4 py-3 text-center font-medium">CR</th>
                      <th scope="col" className="px-4 py-3 text-center font-medium">NR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from(new Set(personalBests.map(pb => pb.eventId))).map((eventId, index) => {
                      const single = personalBests.find(pb => pb.eventId === eventId && pb.type === 'single');
                      const average = personalBests.find(pb => pb.eventId === eventId && pb.type === 'average');
                      const isSelected = selectedRecord?.eventId === eventId;
                      
                      return (
                        <React.Fragment key={eventId}>
                          <tr className={`border-b border-slate-800/50 transition-colors ${index % 2 === 0 ? 'bg-slate-900/20' : ''}`}>
                            <td className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">
                              {formatEventName(eventId)}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-400">{single?.nationalRanking || ''}</td>
                            <td className="px-4 py-3 text-center text-slate-400">{single?.continentRanking || ''}</td>
                            <td className="px-4 py-3 text-center text-slate-400">{single?.worldRanking || ''}</td>
                            <td 
                              className={`px-4 py-3 text-right font-mono font-bold cursor-pointer transition-colors ${selectedRecord?.eventId === eventId && selectedRecord?.type === 'single' ? 'text-amber-400 bg-slate-800/80' : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/50'}`}
                              onClick={() => single && handleRecordClick(eventId, 'single', single.best)}
                              title="點擊查看賽事地圖"
                            >
                              {single ? formatTime(single.best, eventId, 'single') : ''}
                            </td>
                            <td 
                              className={`px-4 py-3 text-left font-mono font-bold cursor-pointer transition-colors ${selectedRecord?.eventId === eventId && selectedRecord?.type === 'average' ? 'text-amber-400 bg-slate-800/80' : 'text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/50'}`}
                              onClick={() => average && handleRecordClick(eventId, 'average', average.best)}
                              title="點擊查看賽事地圖"
                            >
                              {average ? formatTime(average.best, eventId, 'average') : ''}
                            </td>
                            <td className="px-4 py-3 text-center text-slate-400">{average?.worldRanking || ''}</td>
                            <td className="px-4 py-3 text-center text-slate-400">{average?.continentRanking || ''}</td>
                            <td className="px-4 py-3 text-center text-slate-400">{average?.nationalRanking || ''}</td>
                          </tr>
                          
                          {/* Expandable Details Row */}
                          <AnimatePresence>
                            {isSelected && (
                              <tr className="bg-slate-900/80 border-b border-slate-800">
                                <td colSpan={9} className="p-0">
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-4 md:p-6 shadow-inner relative">
                                      <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                                      
                                      <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
                                        <Trophy className="w-5 h-5 text-amber-400 mr-2" />
                                        {formatEventName(selectedRecord.eventId)} 參賽紀錄
                                      </h3>

                                      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
                                        <table className="w-full text-sm text-left">
                                          <thead className="text-xs text-slate-400 uppercase bg-slate-800/80">
                                            <tr>
                                              <th className="px-4 py-3">賽事</th>
                                              <th className="px-4 py-3">輪</th>
                                              <th className="px-4 py-3 text-center">排名</th>
                                              <th className="px-4 py-3 text-right">單次</th>
                                              <th className="px-4 py-3 text-right">平均</th>
                                              <th className="px-2 py-3 text-center">1</th>
                                              <th className="px-2 py-3 text-center">2</th>
                                              <th className="px-2 py-3 text-center">3</th>
                                              <th className="px-2 py-3 text-center">4</th>
                                              <th className="px-2 py-3 text-center">5</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {allResults
                                              .filter(r => r.event_id === selectedRecord.eventId)
                                              .map((result, idx) => (
                                              <tr key={result.id || idx} className="border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-slate-200">{result.competition_id}</td>
                                                <td className="px-4 py-3 text-slate-400">{roundNames[result.round_type_id] || result.round_type_id}</td>
                                                <td className="px-4 py-3 text-center text-slate-400">{result.pos}</td>
                                                <td className="px-4 py-3 text-right font-mono text-cyan-400">{formatResultTime(result.best, result.event_id, 'single')}</td>
                                                <td className="px-4 py-3 text-right font-mono text-amber-400">{formatResultTime(result.average, result.event_id, 'average')}</td>
                                                {[0, 1, 2, 3, 4].map(i => renderAttemptColumn(result, result.event_id, i))}
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">目前沒有官方賽事成績紀錄。</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
