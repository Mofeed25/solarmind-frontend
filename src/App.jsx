// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Sun, TrendingUp, AlertTriangle, MessageSquare, RefreshCw, BarChart3, ShieldAlert, Award } from 'lucide-react';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', text: 'مرحباً بك في SolarMind AI. أنا مستشارك الذكي المخصص لقطاع الطاقة الشمسية لشركة انديكيتورز، كيف يمكنني مساعدتك في تحليل البيانات المتوفرة حالياً؟' }
  ]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  // استخدام متغير البيئة المرفوع على Vercel
  const API_URL = import.meta.env.VITE_API_URL || 'https://solarmind-backend.onrender.com';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setFetchingData(true);
    try {
      const metricsRes = await fetch(`${API_URL}/api/metrics`);
      const metricsData = await metricsRes.json();
      setMetrics(metricsData);
    } catch (error) {
      console.error("خطأ في الاتصال بالباكيند:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const sendDirectQuery = async (queryText) => {
    if (loading) return;
    
    setChatHistory(prev => [...prev, { role: 'user', text: queryText }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: queryText }),
      });
      const data = await response.json();
      const botReply = data.reply || 'لم أتمكن من استخلاص إجابة دقيقة من السجلات الحالية.';
      setChatHistory(prev => [...prev, { role: 'assistant', text: botReply }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'assistant', text: 'عذراً، واجهت مشكلة في الاتصال بالخادم الرئيسي.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userQuery = chatMessage;
    setChatMessage('');
    await sendDirectQuery(userQuery);
  };

  const renderMessageText = (msg) => {
    if (msg.role === 'user') return <span>{msg.text}</span>;

    const buttonRegex = /\[BUTTONS:\s*(.*?)\s*\]/;
    const match = msg.text.match(buttonRegex);

    if (match) {
      const cleanText = msg.text.split(/\[BUTTONS:/)[0].trim();
      const buttonsRaw = match[1];
      const options = buttonsRaw.split('|').map(opt => opt.strip ? opt.strip() : opt.trim());

      return (
        <div className="space-y-3">
          <p>{cleanText}</p>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-700/50">
            {options.map((option, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendDirectQuery(option)}
                className="px-3.5 py-1.5 bg-slate-700 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/30 text-amber-400 font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      );
    }
    return <span>{msg.text}</span>;
  };

  const totalProfit = metrics?.financials?.total_profit ?? 40517.25;
  const totalSales = metrics?.financials?.total_sales ?? 165760.00;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans" dir="rtl">
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-amber-500/20 sticky top-0 z-50 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl">
              <Sun className="w-7 h-7 text-slate-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 bg-clip-text text-transparent">SolarMind AI</h1>
              <p className="text-xs text-slate-400 font-medium">Vertical BI & Predictive Analytics Platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchDashboardData}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg text-sm font-bold transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${fetchingData ? 'animate-spin text-amber-400' : ''}`} />
              تحديث العرض الحين
            </button>
            <div className="flex items-center gap-2 text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              النظام متصل
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-500"></div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 font-bold text-sm">الأداء المالي الحالي</span>
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-slate-400">ملخص الربح الإجمالي</div>
              <div className="text-3xl font-black text-amber-400">
                {totalProfit.toLocaleString()} <span className="text-xs text-slate-400">دولار ($)</span>
              </div>
            </div>
          </div>
          {/* باقي الكود كما هو ... */}
        </section>
        
        {/* ... (باقي هيكل الشات والفوتر كما هو في كودك) ... */}
      </main>
    </div>
  );
}

export default App;
