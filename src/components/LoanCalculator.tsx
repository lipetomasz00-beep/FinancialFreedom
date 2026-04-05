import React, { useState, useEffect } from 'react';
import { m2mService } from '../services/m2m.service';

export const LoanCalculator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  
  const [zrodlo, setZrodlo] = useState('uop');
  const [bik, setBik] = useState('czysty');
  const [amount, setAmount] = useState(75000);
  const [term, setTerm] = useState(48);
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [statusMsg, setStatusMsg] = useState('');
  
  const [liveReports, setLiveReports] = useState(156);

  // PEŁEN ZAKRES - 8 KATEGORII ZGODNYCH Z BACKENDEM
  const categories = [
    {id: 'gotowka', n: 'GOTÓWKA', i: '⚡'}, 
    {id: 'konsolidacja', n: 'KONSOLID.', i: '🛡️'},
    {id: 'firma', n: 'FIRMA', i: '💼'}, 
    {id: 'konta-firmowe', n: 'BIZNES', i: '🏦'},
    {id: 'hipoteka', n: 'DOM', i: '🏠'}, 
    {id: 'karty', n: 'KARTY', i: '💳'},
    {id: 'ubezpieczenia', n: 'POLISY', i: '☂️'}, 
    {id: 'premia', n: 'BONUSY', i: '🎁'}
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveReports(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (id: string) => {
    setCategory(id);
    setStep(2);
    window.scrollTo(0,0);
  };

  const handleCalculate = async () => {
    setLoading(true);
    setOffers([]);
    const steps = ["Szyfrowanie połączenia...", "Skanowanie M2M...", "Finalizacja raportu..."];
    for (const s of steps) { setStatusMsg(s); await new Promise(r => setTimeout(r, 600)); }
    
    const results = await m2mService.getLoanOffers(amount, term, zrodlo, bik, category || 'gotowka');
    setOffers(results || []);
    setLoading(false);
  };

  const Header = () => (
    <div className="flex flex-col items-center w-full mb-10">
      <div className="w-8 h-8 border border-[#DC143C] rounded-md flex items-center justify-center text-[9px] font-black mb-4 text-[#DC143C] shadow-[0_0_15px_rgba(220,20,60,0.4)]">FF</div>
      <h1 className="text-xl font-black tracking-tighter mb-1 uppercase italic">FINANCIAL FREEDOM</h1>
      <p className="text-[#DC143C] text-[8px] tracking-[0.2em] font-black uppercase">MY TO TWÓJ FINANSOWY SUKCES</p>
    </div>
  );

  const AppShell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-6 font-sans antialiased">
      <div className="w-full max-w-[320px] flex flex-col items-center">
        <Header />
        {children}
      </div>
    </div>
  );

  if (step === 1) {
    return (
      <AppShell>
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-8">WYBIERZ PROFIL OPERACYJNY</h2>
        
        {/* PEŁNY BASEN: SIATKA 2x4 */}
        <div className="grid grid-cols-2 gap-3 w-full mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="h-20 border border-zinc-900 bg-zinc-900/10 rounded-xl flex flex-col items-center justify-center hover:border-[#DC143C] hover:bg-[#DC143C]/5 active:scale-95 transition-all shadow-lg border-opacity-50"
            >
              <span className="text-xl mb-1">{cat.i}</span>
              <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-400">{cat.n}</span>
            </button>
          ))}
        </div>

        <div className="w-full border-[1.5px] border-[#DC143C] rounded-2xl p-6 flex flex-col items-center justify-center relative bg-transparent mb-12 shadow-[0_0_30px_rgba(220,20,60,0.15)]">
          <div className="absolute top-4 right-4 flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-[#DC143C] rounded-full animate-pulse shadow-[0_0_8px_#DC143C]"></div>
            <span className="text-[#DC143C] text-[9px] font-black uppercase tracking-wider">LIVE</span>
          </div>
          <span className="text-5xl font-light text-[#DC143C] mb-1 tracking-tighter">{liveReports}</span>
          <span className="text-[9px] font-bold tracking-widest text-white uppercase">
            OBECNIE GENEROWANE RAPORTY
          </span>
        </div>

        <div className="text-center w-full">
          <button className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors flex items-center justify-center mx-auto space-x-1">
            <span>? POKAŻ FAQ</span>
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-1">ANALIZA ZDOLNOŚCI</h2>
      <p className="text-[8px] text-[#DC143C] mb-10 uppercase font-black tracking-widest px-3 py-1 bg-[#DC143C]/10 rounded-full border border-[#DC143C]/20">{categories.find(c => c.id === category)?.n}</p>

      <div className="w-full space-y-2.5 mb-10">
        <div className="flex gap-2">
          <button onClick={() => setBik('czysty')} className={`flex-1 py-3 text-[9px] font-black uppercase border rounded-xl transition-all ${bik === 'czysty' ? 'border-[#DC143C] text-[#DC143C] bg-[#DC143C]/10 shadow-[0_0_15px_rgba(220,20,60,0.2)]' : 'border-zinc-900 text-zinc-700'}`}>BIK CZYSTY</button>
          <button onClick={() => setBik('negatywny')} className={`flex-1 py-3 text-[9px] font-black uppercase border rounded-xl transition-all ${bik === 'negatywny' ? 'border-[#DC143C] text-[#DC143C] bg-[#DC143C]/10 shadow-[0_0_15px_rgba(220,20,60,0.2)]' : 'border-zinc-900 text-zinc-700'}`}>ZŁE BAZY</button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setZrodlo('uop')} className={`flex-1 py-3 text-[9px] font-black uppercase border rounded-xl transition-all ${zrodlo === 'uop' ? 'border-[#DC143C] text-[#DC143C] bg-[#DC143C]/10 shadow-[0_0_15px_rgba(220,20,60,0.2)]' : 'border-zinc-900 text-zinc-700'}`}>UMOWA</button>
          <button onClick={() => setZrodlo('firma')} className={`flex-1 py-3 text-[9px] font-black uppercase border rounded-xl transition-all ${zrodlo === 'firma' ? 'border-[#DC143C] text-[#DC143C] bg-[#DC143C]/10 shadow-[0_0_15px_rgba(220,20,60,0.2)]' : 'border-zinc-900 text-zinc-700'}`}>FIRMA</button>
        </div>
      </div>

      <div className="w-full mb-8 text-center">
        <p className="text-[9px] text-zinc-600 font-black uppercase mb-2 tracking-widest">KWOTA WYPŁATY</p>
        <div className="text-4xl font-black italic mb-4 tracking-tighter">{amount.toLocaleString()}<span className="text-[#DC143C] text-lg ml-1 uppercase not-italic font-bold">PLN</span></div>
        <input type="range" min="100" max="250000" step="100" value={amount} onChange={(e) => setAmount(Number(e.target.value))} 
          className="w-full h-[2px] bg-zinc-900 appearance-none cursor-pointer accent-[#DC143C] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#DC143C] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_#DC143C]" 
        />
      </div>

      <div className="w-full mb-12 text-center">
        <p className="text-[9px] text-zinc-600 font-black uppercase mb-2 tracking-widest">OKRES SPŁATY</p>
        <div className="text-4xl font-black italic mb-4 tracking-tighter">{term}<span className="text-[#DC143C] text-lg ml-1 uppercase not-italic font-bold">M-CY</span></div>
        <input type="range" min="1" max="120" value={term} onChange={(e) => setTerm(Number(e.target.value))} 
          className="w-full h-[2px] bg-zinc-900 appearance-none cursor-pointer accent-[#DC143C] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#DC143C] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-[0_0_10px_#DC143C]" 
        />
      </div>

      <button onClick={handleCalculate} disabled={loading} className="w-full py-5 bg-[#DC143C] text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-xl shadow-[0_10px_30px_rgba(220,20,60,0.4)] active:scale-95 transition-all">
        {loading ? statusMsg : "ODBIERZ DARMOWY RAPORT"}
      </button>

      {offers.map((offer, idx) => (
        <div key={idx} className="w-full mt-8 bg-white rounded-3xl p-6 text-black border-t-[8px] border-[#DC143C] shadow-2xl">
          <h3 className="text-2xl font-black uppercase mb-6 italic tracking-tighter leading-tight">{offer.name}</h3>
          <a href={offer.url} target="_blank" rel="noopener noreferrer" className="block w-full bg-black text-white text-center py-5 rounded-xl font-black uppercase text-[10px] tracking-widest">WYPŁAĆ ŚRODKI</a>
        </div>
      ))}

      <button onClick={() => setStep(1)} className="mt-12 text-[9px] font-black text-zinc-800 uppercase tracking-widest hover:text-white transition-colors underline decoration-[#DC143C]/20">← ZMIEŃ PROFIL</button>
    </AppShell>
  );
};
