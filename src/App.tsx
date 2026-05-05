import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Leaf, 
  History, 
  Info, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  X,
  MapPin,
  ChevronRight,
  Loader2,
  Scan,
  Database,
  Settings,
  BarChart3
} from 'lucide-react';
import { FORAGE_SPECIES, Species, IdentificationResult } from './types';
import { identifyForage } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';

// --- Components ---

const Header = ({ title, showBack, onBack }: { title: string, showBack?: boolean, onBack?: () => void }) => (
  <header className="flex items-center justify-between px-6 py-4 bg-panel-bg backdrop-blur-md sticky top-0 z-40 border-b border-border-slate">
    <div className="flex items-center gap-3">
      {showBack && (
        <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400">
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}
      <h1 className="text-sm font-bold tracking-[0.2em] text-emerald-500 uppercase">{title}</h1>
    </div>
    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
      <Leaf className="w-4 h-4" />
    </div>
  </header>
);

const Landing = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center h-[calc(100vh-180px)] px-8 text-center bg-dark-bg">
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="p-8 bg-panel-bg rounded-[2rem] mb-10 relative border border-border-slate shadow-2xl"
    >
      <div className="absolute -top-3 -right-3 p-3 bg-emerald-500 text-dark-bg rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
        <Scan className="w-5 h-5" />
      </div>
      <Leaf className="w-20 h-20 text-emerald-500" />
    </motion.div>
    
    <motion.h2 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-2xl font-bold text-white mb-4 tracking-tight"
    >
      Forage Scanner V1.0
    </motion.h2>
    
    <motion.p 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-slate-400 mb-8 max-w-xs text-sm leading-relaxed"
    >
      Deep learning classification for Philippine species. Optimized for field deployment with MobileNetV3.
    </motion.p>
    
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      onClick={onStart}
      className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-emerald-900/40 flex items-center gap-3 transition-all"
    >
      INITIALIZE SCANNER
      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </motion.button>
  </div>
);

const Scanner = ({ onScan }: { onScan: (image: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }
    setupCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      setIsCapturing(true);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');
        onScan(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-panel-bg border border-border-slate rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
        <div className="relative aspect-square bg-black overflow-hidden border-b border-border-slate">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover grayscale-[0.2]"
          />
          
          {/* Corner Brackets */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] pointer-events-none">
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-emerald-500"></div>
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-emerald-500"></div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-emerald-500"></div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-emerald-500"></div>
            <div className="scan-line" />
          </div>

          <button 
            onClick={() => window.location.reload()} 
            className="absolute top-6 right-6 p-2 bg-black/40 backdrop-blur-md rounded-full text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <span className="text-[9px] font-mono tracking-widest bg-black/80 px-3 py-1.5 text-emerald-400 border border-emerald-500/30 uppercase">
              Sensor active • 0.27ms
            </span>
          </div>
        </div>
        
        <div className="p-8 flex flex-col items-center gap-6">
          <div className="flex gap-4 w-full justify-center">
            <button 
              onClick={capture}
              disabled={isCapturing}
              className="w-20 h-20 rounded-full border-4 border-slate-800 flex items-center justify-center disabled:opacity-50 group transition-all hover:border-emerald-500/30"
            >
              <div className="w-16 h-16 bg-emerald-600 rounded-full transition-all active:scale-90 active:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)] group-hover:scale-110" />
            </button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">Press to Classify</p>
            <button 
              onClick={() => {
                // Simulate a "simple" result for quick testing
                const randomSpecies = FORAGE_SPECIES[Math.floor(Math.random() * FORAGE_SPECIES.length)];
                onScan('SIMULATED_DATA_URL'); // This is a flag for simplicity
              }}
              className="text-[9px] text-emerald-500/60 uppercase tracking-widest hover:text-emerald-500 transition-colors py-1 px-3 border border-emerald-500/20 rounded-full"
            >
              Demo: Quick Classify
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const ResultView = ({ 
  result, 
  onClose, 
  onSave 
}: { 
  result: IdentificationResult, 
  onClose: () => void,
  onSave: (res: IdentificationResult) => void
}) => (
  <motion.div 
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    exit={{ y: '100%' }}
    className="fixed inset-0 bg-dark-bg z-[60] overflow-y-auto"
  >
    <Header title="Analysis Deep Dive" showBack onBack={onClose} />
    
    <div className="px-6 py-8 pb-32">
      <div className="bg-panel-bg rounded-3xl p-8 mb-10 border border-border-slate shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <span className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
            result.species.type === 'Legume' ? 'bg-amber-950/30 text-amber-400 border border-amber-900/50' : 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/50'
          }`}>
            {result.species.type}
          </span>
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-mono">CONF: {(result.confidence * 100).toFixed(2)}%</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">{result.species.name}</h2>
        <p className="text-lg italic text-slate-400 font-serif mb-8">{result.species.scientificName}</p>
        
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden mb-10">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence * 100}%` }}
            className="h-full bg-emerald-500"
          />
        </div>

        <button 
          onClick={() => onSave(result)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-colors"
        >
          <CheckCircle2 className="w-5 h-5" />
          Archive Result
        </button>
      </div>

      <div className="space-y-10">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Botanical Notes
          </h3>
          <p className="text-slate-300 leading-relaxed text-sm">
            {result.species.description}
          </p>
          {result.species.philippineContext && (
            <div className="mt-6 p-5 bg-panel-bg rounded-2xl border border-border-slate border-l-4 border-l-amber-500">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-2">Regional Context (PH)</p>
              <p className="text-sm text-slate-300 italic leading-relaxed">{result.species.philippineContext}</p>
            </div>
          )}
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Nutritional Parameters</h3>
          <div className="grid grid-cols-1 gap-3">
            {result.species.benefits.map((benefit, i) => (
              <div key={i} className="p-4 bg-panel-bg border border-border-slate rounded-xl text-xs text-slate-300 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {benefit}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </motion.div>
);

const Encyclopedia = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ x: '100%' }}
    animate={{ x: 0 }}
    exit={{ x: '100%' }}
    className="fixed inset-0 bg-dark-bg z-[60] overflow-y-auto"
  >
    <Header title="Species Library" showBack onBack={onClose} />
    <div className="p-6 pb-24">
      <div className="space-y-12">
        <div>
          <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.4em] mb-6">Taxonomy: Legumes</h3>
          <div className="grid gap-4">
            {FORAGE_SPECIES.filter(s => s.type === 'Legume').map(s => (
              <div key={s.id} className="p-5 bg-panel-bg rounded-xl border border-border-slate">
                <div className="font-bold text-white text-base">{s.name}</div>
                <div className="text-[11px] italic text-slate-500 mb-3 font-serif">{s.scientificName}</div>
                <div className="text-xs text-slate-400 leading-relaxed line-clamp-2">{s.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.4em] mb-6">Taxonomy: Grasses</h3>
          <div className="grid gap-4">
            {FORAGE_SPECIES.filter(s => s.type === 'Grass').map(s => (
              <div key={s.id} className="p-5 bg-panel-bg rounded-xl border border-border-slate">
                <div className="font-bold text-white text-base">{s.name}</div>
                <div className="text-[11px] italic text-slate-500 mb-3 font-serif">{s.scientificName}</div>
                <div className="text-xs text-slate-400 leading-relaxed line-clamp-2">{s.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const HistoryView = ({ 
  history, 
  onClose,
  onClear
}: { 
  history: IdentificationResult[], 
  onClose: () => void,
  onClear: () => void 
}) => (
  <motion.div 
    initial={{ x: '100%' }}
    animate={{ x: 0 }}
    exit={{ x: '100%' }}
    className="fixed inset-0 bg-dark-bg z-[60] overflow-y-auto"
  >
    <Header title="Mission Logs" showBack onBack={onClose} />
    <div className="p-6 pb-24">
      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-32 text-slate-700">
          <History className="w-20 h-20 mb-6 opacity-10" />
          <p className="text-xs uppercase tracking-widest font-bold">Log Cache Empty</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{history.length} Entries Recorded</span>
            <button onClick={onClear} className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Wipe Memory</button>
          </div>
          {history.map((item, i) => (
            <div key={i} className="flex gap-5 p-5 bg-panel-bg rounded-xl border border-border-slate relative group hover:border-emerald-500/50 transition-colors">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border ${
                item.species.type === 'Legume' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
              }`}>
                <Leaf className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-white mb-1">{item.species.name}</div>
                <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1.5 uppercase">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  LOC: FIELD_B • {new Date(item.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="mt-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 inline-block">
                  {Math.round(item.confidence * 100)}% Match
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

const SettingsView = ({ onClose }: { onClose: () => void }) => (
  <motion.div 
    initial={{ y: '100%' }}
    animate={{ y: 0 }}
    exit={{ y: '100%' }}
    className="fixed inset-0 bg-dark-bg z-[60] overflow-y-auto"
  >
    <Header title="System Config" showBack onBack={onClose} />
    <div className="p-8 flex flex-col gap-8">
      <div className="p-6 bg-panel-bg border border-border-slate rounded-3xl">
        <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-6">Device Status</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Classification Model</span>
            <span className="text-slate-100 font-mono">MobileNetV3-S</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Engine Build</span>
            <span className="text-slate-100 font-mono">v1.2.4-PROD</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">API Latency</span>
            <span className="text-emerald-500 font-mono">0.27ms</span>
          </div>
        </div>
      </div>

      <div className="p-6 bg-panel-bg border border-border-slate rounded-3xl">
        <h3 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-6">User Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <div className="text-sm font-bold text-white uppercase tracking-tight">Agricultural Analyst</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">LVL 4 SPECIALIST</div>
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-700 text-center uppercase tracking-[0.5em] mt-12 font-bold italic">
        PastoID System • Visayas State University
      </p>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'scanner' | 'result' | 'encyclopedia' | 'history' | 'settings'>('landing');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<IdentificationResult | null>(null);
  const [history, setHistory] = useLocalStorage<IdentificationResult[]>('forage-history', []);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (image: string) => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (image === 'SIMULATED_DATA_URL') {
        // Simple mock for demonstration
        const randomSpecies = FORAGE_SPECIES[Math.floor(Math.random() * FORAGE_SPECIES.length)];
        result = {
          species: randomSpecies,
          confidence: 0.95 + Math.random() * 0.04,
          detectedAt: new Date().toISOString(),
          reasoning: "Demonstration mode: Pattern recognition simulation success."
        };
        // Artificial delay for better UX
        await new Promise(r => setTimeout(r, 1500));
      } else {
        result = await identifyForage(image);
      }
      setCurrentResult(result);
      setView('result');
    } catch (err) {
      console.error(err);
      setError("AI Analysis failed. Check internet connection.");
      setView('landing');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (res: IdentificationResult) => {
    setHistory([res, ...history]);
    setView('landing');
  };

  return (
    <div className="max-w-[100vw] overflow-x-hidden min-h-screen pb-24">
      <AnimatePresence>
        {view === 'landing' && (
          <motion.div exit={{ opacity: 0 }}>
            <Header title="PastoID" />
            <Landing onStart={() => setView('scanner')} />
          </motion.div>
        )}
        
        {view === 'scanner' && <Scanner onScan={handleScan} />}
        
        {view === 'result' && currentResult && (
          <ResultView 
            result={currentResult} 
            onClose={() => setView('landing')} 
            onSave={handleSave}
          />
        )}

        {view === 'encyclopedia' && (
          <Encyclopedia onClose={() => setView('landing')} />
        )}

        {view === 'history' && (
          <HistoryView 
            history={history} 
            onClose={() => setView('landing')} 
            onClear={() => setHistory([])}
          />
        )}

        {view === 'settings' && (
          <SettingsView onClose={() => setView('landing')} />
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
          <div className="relative mb-8">
            <Loader2 className="w-16 h-16 text-emerald-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <p className="font-bold text-emerald-500 uppercase tracking-[0.4em] text-xs">CNN Analysis</p>
          <div className="w-48 h-1 bg-slate-900 rounded-full mt-6 overflow-hidden border border-slate-800">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="h-full w-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
            />
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-20 left-6 right-6 bg-red-950/40 backdrop-blur-md text-red-400 p-5 rounded-xl border border-red-900/50 shadow-2xl z-[110] flex items-center gap-4">
          <AlertCircle className="w-6 h-6 shrink-0" />
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1 text-red-500">System Error</p>
            <p className="text-xs leading-relaxed">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="p-2 hover:bg-red-400/10 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-panel-bg/90 backdrop-blur-lg border-t border-border-slate px-6 py-5 flex items-center justify-around z-40 max-w-lg mx-auto md:rounded-t-[2.5rem] md:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => setView('landing')}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'landing' ? 'text-emerald-500 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
        >
          <Leaf className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Home</span>
        </button>
        <button 
          onClick={() => setView('encyclopedia')}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'encyclopedia' ? 'text-emerald-500 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
        >
          <Database className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Lib</span>
        </button>
        
        {/* CENTER CAMERA BUTTON */}
        <button 
          onClick={() => setView('scanner')}
          className="flex flex-col items-center gap-1 -mt-12 group px-2"
        >
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center text-dark-bg group-active:scale-90 transition-all group-hover:bg-emerald-500 border-4 border-dark-bg">
            <Camera className="w-8 h-8" />
          </div>
        </button>

        <button 
          onClick={() => setView('history')}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'history' ? 'text-emerald-500 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
        >
          <History className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Logs</span>
        </button>
        <button 
          onClick={() => setView('settings')}
          className={`flex flex-col items-center gap-1.5 transition-all ${view === 'settings' ? 'text-emerald-500 scale-110' : 'text-slate-600 hover:text-slate-400'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-[0.2em]">Set</span>
        </button>
      </nav>
    </div>
  );
}
