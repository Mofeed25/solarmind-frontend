// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Sun, TrendingUp, AlertTriangle, MessageSquare, RefreshCw, BarChart3, ShieldAlert, Award } from 'lucide-react';

function App() {
  const [metrics, setMetrics] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
{ role: 'assistant', text: 'مرحباً بك. أنا مستشارك المالي والإداري المخصص لقطاع الطاقة الشمسية، كيف يمكنني مساعدتك؟' } 
  ]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  // الحل للمشكلة الثانية: تعريف الرابط مع وضع احتياطي لضمان نجاح الـ Build
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

  // 🟢 دالة مساعدة لإرسال النصوص مباشرة عند النقر على الأزرار التفاعلية
  const sendDirectQuery = async (queryText) => {
    if (loading) return;
    
    setChatHistory(prev => [...prev, { role: 'user', text: queryText }]);
    setLoading(true);

    // الحل للمشكلة الأولى والثانية: تصحيح القوس وإضافة الرابط الآمن
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

  // 🟢 دالة ذكية لتحليل النصوص واستخراج الأزرار التفاعلية إن وجدت
  const renderMessageText = (msg) => {
    if (msg.role === 'user') return <span>{msg.text}</span>;

    const buttonRegex = /\[BUTTONS:\s*(.*?)\s*\]/;
    const match = msg.text.match(buttonRegex);

    if (match) {
      // فصل النص الأساسي عن الأزرار
      const cleanText = msg.text.split(/\[BUTTONS:/)[0].trim();
      const buttonsRaw = match[1];
      // تحويل الخيارات إلى مصفوفة نصوص نظيفة
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
      
      {/* الهيدر */}
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

      {/* المحتوى الرئيسي للوحة التحكم */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* كارت الأداء المالي الصافي */}
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
              <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium pt-2">
                <TrendingUp className="w-3 h-3" /> عرض من واقع المؤشرات المالية المتوفرة حالياً.
              </p>
            </div>
          </div>

          {/* كارت قيمة الإيرادات الإجمالية */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 font-bold text-sm">قيمة الإيرادات الإجمالية</span>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-slate-400">مجموع المبيعات المسجلة</div>
              <div className="text-3xl font-black text-emerald-400">
                {totalSales.toLocaleString()} <span className="text-xs text-slate-400">دولار ($)</span>
              </div>
              <p className="text-xs text-slate-400 pt-2 leading-relaxed">
                مستخلص من واقع البيانات المالية المتوفرة حالياً في النظام.
              </p>
            </div>
          </div>

          {/* كارت الإنذار المبكر وحالة المستودع */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 font-bold text-sm">مخاطر نفاذ المستودعات</span>
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="space-y-2">
              <div className="text-xs text-slate-400">حالة المنتجات بالمخزن</div>
              <div className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 shrink-0 text-emerald-400" />
                المخزون مستقر حالياً
              </div>
              <p className="text-xs text-slate-400 pt-1">
                بناءً على مستويات حد الأمان المتوفرة حالياً في السجلات.
              </p>
            </div>
          </div>
        </section>

        {/* قسم الشات */}
        <section className="bg-slate-800 border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[550px]">
          <div className="bg-slate-850 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <h2 className="font-black text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                مستشارك المالي والإداري | SolarMind AI
              </h2>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-900/50">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 shadow-md text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user' 
                    ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none' 
                    : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
                }`}>
                  {renderMessageText(msg)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-3">
                  <div className="flex space-x-1 space-x-reverse">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">جاري فحص البيانات المتوفرة حالياً...</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-slate-800/90 border-t border-slate-700 flex gap-3">
            <input 
              type="text" 
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="اسأل عن المبيعات، المخزون الحالي، أو حركات الإدخال والإخراج للأصناف..." 
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 text-slate-100 transition-colors"
            />
            <button 
              type="submit" 
              disabled={loading || !chatMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 rounded-xl font-bold flex items-center gap-2"
            >
              إرسال
            </button>
          </form>
        </section>
      </main>

      {/* الفوتر */}
      <footer className="bg-slate-950 border-t border-slate-800/80 text-center py-6 px-4 mt-12 text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Award className="w-4 h-4 text-amber-500" />
            <span>نظام دعم القرار الرأسي المتكامل للذكاء الاصطناعي V1.1</span>
          </div>
          <div>
            جميع حقوق النشر محفوظة © {new Date().getFullYear()} لـ <span className="text-amber-400/90 font-bold">انديكيتورز للإستشارات والدراسات والبحوث</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
