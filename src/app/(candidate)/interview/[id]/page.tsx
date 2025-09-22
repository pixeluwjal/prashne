'use client';
import { useEffect, useState, useRef } from 'react';
import { vapi } from '@/lib/vapi.sdk';
import { useParams, useRouter } from 'next/navigation';

interface InterviewQuestion {
  text: string;
  type: string;
  options: any[];
  _id: string;
}

export default function CandidateInterview() {
  const { id } = useParams();
  const router = useRouter();
  const [callActive, setCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [transcripts, setTranscripts] = useState<{ role: string; content: string; timestamp: string }[]>([]);
  const [interviewTitle, setInterviewTitle] = useState('AI Interview');
  const [showTranscript, setShowTranscript] = useState(false);
  const [callState, setCallState] = useState<'idle' | 'starting' | 'active' | 'ending'>('idle');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const audioVisualizerRef = useRef<HTMLDivElement>(null);

  // Format timestamp
  const getTimestamp = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  // Fetch questions
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/interviews/${id}/questions`);
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setQuestions(data.questions || []);
        setInterviewTitle(data.interviewTitle || 'AI Interview');
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions([
          { text: "Tell me about yourself and your background.", type: "text", options: [], _id: "fallback1" },
          { text: "What interests you about this position?", type: "text", options: [], _id: "fallback2" }
        ]);
      }
      setIsLoading(false);
    };

    loadQuestions();
  }, [id]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Audio visualizer
  useEffect(() => {
    if (!callActive || !audioVisualizerRef.current) return;

    const bars = audioVisualizerRef.current.children;
    const interval = setInterval(() => {
      Array.from(bars).forEach((bar: any) => {
        bar.style.height = `${20 + Math.random() * 80}%`;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [callActive]);

  // VAPI event listeners
  useEffect(() => {
    const handleCallStart = () => {
      setCallActive(true);
      setCallState('active');
    };
    
    const handleCallEnd = () => {
      setCallActive(false);
      setCallState('idle');
      setIsSpeaking(false);
    };

    const handleMessage = (msg: any) => {
      if (msg.type === 'transcript' && msg.transcriptType === 'final') {
        setTranscripts((prev) => [...prev, { 
          role: msg.role, 
          content: msg.transcript,
          timestamp: getTimestamp()
        }]);
      }
    };

    vapi.on('call-start', handleCallStart);
    vapi.on('call-end', handleCallEnd);
    vapi.on('message', handleMessage);
    vapi.on('speech-start', () => setIsSpeaking(true));
    vapi.on('speech-end', () => setIsSpeaking(false));

    return () => {
      vapi.off('call-start', handleCallStart);
      vapi.off('call-end', handleCallEnd);
      vapi.off('message', handleMessage);
      vapi.off('speech-start', () => setIsSpeaking(true));
      vapi.off('speech-end', () => setIsSpeaking(false));
    };
  }, []);

  const startCall = async () => {
    if (questions.length === 0 || callState !== 'idle') return;

    setCallState('starting');
    
    try {
      const questionsText = questions.map(q => q.text).join('\n');
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
        variableValues: { questions: questionsText },
      });
    } catch (error) {
      console.error("Error starting call:", error);
      setCallState('idle');
    }
  };

 // In your endCall function
const endCall = async () => {
  setCallState('ending');
  setSaveStatus('saving');
  vapi.stop();

  try {
    // Get user data from your custom auth endpoint
    const userRes = await fetch('/api/auth/me', { 
      credentials: 'include' 
    });
    const userData = await userRes.json();
    
    // Check if user data is valid
    if (!userData.user || !userData.user._id) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`/api/interviews/${id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateId: userData.user._id, // Use _id from your user model
        interviewTitle,
        transcripts,
      }),
    });

    if (response.ok) {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
      router.push("/");
    } else {
      throw new Error('Failed to save interview');
    }
  } catch (error) {
    console.error('Error saving feedback:', error);
    setSaveStatus('error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0C10] to-[#1A1C23] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-800 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent line-clamp-1">
            {interviewTitle}
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setShowTranscript(!showTranscript)}
            className="px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-gray-800/60 hover:bg-gray-700/60 transition-colors flex items-center gap-2 text-sm md:text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="hidden sm:inline">{showTranscript ? 'Hide' : 'Transcript'}</span>
          </button>
          <div className="px-2 py-1 md:px-3 md:py-1 text-xs md:text-sm rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 font-medium">
            Interview
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row p-4 md:p-6 gap-4 md:gap-6">
        {/* Video/Avatar Panel */}
        <div className={`${showTranscript ? 'lg:w-2/3' : 'w-full'} flex flex-col gap-4 md:gap-6`}>
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* AI Interviewer */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-purple-500/10 opacity-50"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative mb-4 md:mb-6">
                  <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl md:text-5xl shadow-lg md:shadow-2xl">
                    <div className="w-16 h-16 md:w-28 md:h-28 rounded-full bg-gray-900 flex items-center justify-center">
                      🤖
                    </div>
                  </div>
                  
                  {isSpeaking && (
                    <div className="absolute -inset-2 md:-inset-4 flex items-center justify-center">
                      <div className="absolute w-24 h-24 md:w-40 md:h-40 rounded-full border-4 border-cyan-400 animate-ping opacity-20"></div>
                      <div className="absolute w-28 h-28 md:w-44 md:h-44 rounded-full border-2 border-cyan-300 animate-pulse opacity-30"></div>
                    </div>
                  )}
                </div>
                
                <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">AI Interviewer</h2>
                <p className="text-gray-400 text-center text-xs md:text-sm">Ask insightful questions and evaluates responses</p>
                
                {callActive && (
                  <div className="mt-4 md:mt-6 flex flex-col items-center">
                    <p className="text-xs md:text-sm text-gray-400 mb-1 md:mb-2">{isSpeaking ? 'Speaking...' : 'Listening...'}</p>
                    <div ref={audioVisualizerRef} className="flex items-end h-6 md:h-8 gap-0.5 md:gap-1">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-1.5 md:w-2 bg-gradient-to-t from-cyan-400 to-cyan-600 rounded-full transition-all duration-300"></div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Candidate - Using User Icon Instead of Real Image */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-cyan-500/10 opacity-50"></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center text-3xl md:text-5xl shadow-lg md:shadow-2xl mb-4 md:mb-6">
                  <div className="w-16 h-16 md:w-28 md:h-28 rounded-full bg-gray-900 flex items-center justify-center border-4 border-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                
                <h2 className="text-lg md:text-2xl font-bold mb-1 md:mb-2">You</h2>
                <p className="text-gray-400 text-center text-xs md:text-sm">Respond to questions and showcase your skills</p>
                
                {callActive && (
                  <div className="mt-4 md:mt-6">
                    <div className="flex items-center justify-center gap-2 bg-gray-800/60 px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span>Live</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls - Only show End Interview button when active */}
          <div className="bg-gray-900/60 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-800">
            <div className="flex justify-center items-center">
              {callState === 'idle' && (
                <button
                  onClick={startCall}
                  disabled={isLoading || questions.length === 0}
                  className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 md:gap-3 text-sm md:text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  {isLoading ? 'Loading...' : 'Start Interview'}
                </button>
              )}
              
              {callState === 'starting' && (
                <button
                  disabled
                  className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-cyan-600 to-purple-700 flex items-center gap-2 md:gap-3 text-sm md:text-base"
                >
                  <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-2 border-white border-t-transparent"></div>
                  Starting Interview...
                </button>
              )}
              
              {callState === 'active' && (
                <button
                  onClick={endCall}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 transition-all shadow-lg hover:shadow-red-500/25 flex items-center gap-3 text-base font-semibold"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  End Interview
                </button>
              )}
              
              {callState === 'ending' && (
                <button
                  disabled
                  className="px-6 py-3 md:px-8 md:py-4 rounded-full bg-gradient-to-r from-red-600 to-rose-700 flex items-center gap-2 md:gap-3 text-sm md:text-base"
                >
                  <div className="animate-spin rounded-full h-5 w-5 md:h-6 md:w-6 border-2 border-white border-t-transparent"></div>
                  Ending Interview...
                </button>
              )}
            </div>

            {/* Save Status Indicator */}
            {saveStatus === 'saving' && (
              <div className="mt-4 text-center text-cyan-400 flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent"></div>
                <span>Saving interview data...</span>
              </div>
            )}
            
            {saveStatus === 'saved' && (
              <div className="mt-4 text-center text-green-400 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Interview saved successfully!</span>
              </div>
            )}
            
            {saveStatus === 'error' && (
              <div className="mt-4 text-center text-red-400 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Failed to save interview. Please try again.</span>
              </div>
            )}
          </div>
        </div>

        {/* Transcript Panel - Fixed to not stretch UI */}
        {showTranscript && (
          <div className="lg:w-1/3 bg-gray-900/60 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-800 flex flex-col">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Live Transcript
              </h3>
              <button 
                onClick={() => setShowTranscript(false)}
                className="p-1.5 md:p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div 
              ref={transcriptContainerRef}
              className="flex-1 overflow-y-auto pr-2 max-h-[400px] md:max-h-[500px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
            >
              <div className="space-y-3 md:space-y-4">
                {transcripts.length > 0 ? (
                  transcripts.map((transcript, index) => (
                    <div 
                      key={index} 
                      className={`p-3 md:p-4 rounded-lg md:rounded-xl ${transcript.role === 'user' ? 'bg-cyan-900/20 border border-cyan-800/50' : 'bg-purple-900/20 border border-purple-800/50'}`}
                    >
                      <div className="flex justify-between items-start mb-1 md:mb-2">
                        <span className={`font-medium text-xs md:text-sm ${transcript.role === 'user' ? 'text-cyan-400' : 'text-purple-400'}`}>
                          {transcript.role === 'user' ? 'You' : 'Interviewer'}
                        </span>
                        <span className="text-xs text-gray-500">{transcript.timestamp}</span>
                      </div>
                      <p className="text-gray-200 text-sm md:text-base">{transcript.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 md:py-8 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm md:text-base">Transcript will appear here once the conversation starts</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-800">
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>This transcript is generated in real-time</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}