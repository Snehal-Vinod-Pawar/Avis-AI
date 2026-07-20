import { useState, useEffect } from 'react';
import { FaRobot, FaExclamationTriangle, FaSyncAlt, FaPlug, FaSearch } from 'react-icons/fa';

const EmptyState = ({ 
  type = 'empty', 
  title, 
  message, 
  onRetry,
  icon: CustomIcon 
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (type !== 'loading') return;
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, [type]);

  const states = {
    loading: {
      icon: FaRobot,
      title: title || 'Waking up the AI',
      message: message || 'Connecting to the neural network',
      gradient: 'from-cyan-400 to-blue-500',
      glow: 'shadow-cyan-500/20',
      border: 'border-cyan-500/20'
    },
    error: {
      icon: FaExclamationTriangle,
      title: title || 'Connection Lost',
      message: message || 'The AI seems to be daydreaming. Try waking it up again.',
      gradient: 'from-orange-400 to-red-500',
      glow: 'shadow-red-500/20',
      border: 'border-red-500/20'
    },
    empty: {
      icon: FaSearch,
      title: title || 'Nothing Here Yet',
      message: message || 'Start a conversation and the magic will appear here.',
      gradient: 'from-purple-400 to-indigo-500',
      glow: 'shadow-purple-500/20',
      border: 'border-purple-500/20'
    },
    disconnected: {
      icon: FaPlug,
      title: title || 'No Connection',
      message: message || 'Check your connection and try again.',
      gradient: 'from-yellow-400 to-orange-500',
      glow: 'shadow-yellow-500/20',
      border: 'border-yellow-500/20'
    }
  };

  const current = states[type] || states.empty;
  const Icon = CustomIcon || current.icon;

  return (
    <div className="flex items-center justify-center w-full h-full min-h-[400px]">
      <div className="relative flex flex-col items-center gap-6 p-8">
        {/* Animated background glow */}
        <div className={`absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-[0.03] rounded-3xl blur-3xl animate-pulse`} />
        
        {/* Icon container with animation */}
        <div className={`relative ${type === 'loading' ? 'animate-bounce' : type === 'error' ? 'animate-shake' : 'animate-float'}`}>
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${current.gradient} ${current.glow} shadow-lg flex items-center justify-center border ${current.border} backdrop-blur-sm`}>
            <Icon className="text-white text-3xl" />
          </div>
          
          {/* Loading spinner ring */}
          {type === 'loading' && (
            <div className="absolute -inset-2 rounded-2xl border-2 border-transparent border-t-cyan-400 animate-spin" />
          )}
          
          {/* Error pulse ring */}
          {type === 'error' && (
            <div className="absolute -inset-2 rounded-2xl border-2 border-red-500/30 animate-ping" />
          )}
        </div>

        {/* Text content */}
        <div className="flex flex-col items-center gap-2 text-center max-w-sm">
          <h3 className="text-lg font-semibold text-slate-200">
            {current.title}
            {type === 'loading' && <span className="text-cyan-400 animate-pulse">{dots}</span>}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            {current.message}
          </p>
        </div>

        {/* Action button */}
        {(type === 'error' || type === 'disconnected') && onRetry && (
          <button
            onClick={onRetry}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 border border-white/[0.06] transition-all duration-200 cursor-pointer"
          >
            <FaSyncAlt className="text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
            Try Again
          </button>
        )}

        {/* Subtle decorative dots */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${current.gradient} opacity-30`}
              style={{ animationDelay: `${i * 200}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Keyframes for custom animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-shake {
          animation: shake 0.8s ease-in-out;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EmptyState;