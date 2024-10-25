import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Timer, Sparkles, ArrowRight, RotateCcw, ShoppingCart } from 'lucide-react';

const GAME_DURATION = 30;

// Our symptoms and their related supplements
const symptoms = [
  { id: 1, text: "I always feel tired and drained", supplements: ["Cordyceps", "Rhodiola"] },
  { id: 2, text: "I have trouble falling asleep", supplements: ["Ashwagandha", "Reishi"] },
  { id: 3, text: "I can't focus on my work", supplements: ["Lion's Mane", "Rhodiola"] },
  { id: 4, text: "I feel stressed and overwhelmed", supplements: ["Ashwagandha", "Reishi"] },
  { id: 5, text: "My immune system needs support", supplements: ["Reishi", "Cordyceps"] },
  { id: 6, text: "I get anxious in social situations", supplements: ["Ashwagandha", "Lion's Mane"] },
  { id: 7, text: "My mind isn't as sharp anymore", supplements: ["Lion's Mane", "Cordyceps"] },
  { id: 8, text: "I feel weak after exercising", supplements: ["Cordyceps", "Rhodiola"] },
  { id: 9, text: "I often feel mentally exhausted", supplements: ["Lion's Mane", "Rhodiola"] },
  { id: 10, text: "My mood needs balancing", supplements: ["Ashwagandha", "Reishi"] },
  { id: 11, text: "I need better exercise recovery", supplements: ["Cordyceps", "Ashwagandha"] },
  { id: 12, text: "I get overwhelmed by deadlines", supplements: ["Rhodiola", "Lion's Mane"] },
  { id: 13, text: "My energy crashes mid-day", supplements: ["Cordyceps", "Rhodiola"] },
  { id: 14, text: "I need memory support", supplements: ["Lion's Mane", "Reishi"] },
  { id: 15, text: "I feel burnout from work", supplements: ["Ashwagandha", "Rhodiola"] },
  { id: 16, text: "I need better stress resilience", supplements: ["Ashwagandha", "Reishi"] },
  { id: 17, text: "I want to boost productivity", supplements: ["Lion's Mane", "Cordyceps"] },
  { id: 18, text: "I need better mental clarity", supplements: ["Lion's Mane", "Rhodiola"] },
  { id: 19, text: "I want to feel more balanced", supplements: ["Ashwagandha", "Reishi"] },
  { id: 20, text: "I need better focus", supplements: ["Lion's Mane", "Rhodiola"] }
];

// Our supplement database with details
const supplements = [
  { 
    name: "Lion's Mane",
    benefits: ["Cognitive enhancement", "Mental clarity", "Memory support"],
    score: 0,
    image: "🦁"
  },
  { 
    name: "Ashwagandha",
    benefits: ["Stress relief", "Sleep support", "Anxiety reduction"],
    score: 0,
    image: "🌿"
  },
  { 
    name: "Reishi",
    benefits: ["Immune support", "Stress relief", "Sleep quality"],
    score: 0,
    image: "🍄"
  },
  { 
    name: "Rhodiola",
    benefits: ["Energy boost", "Stress resistance", "Mental performance"],
    score: 0,
    image: "🌺"
  },
  { 
    name: "Cordyceps",
    benefits: ["Physical energy", "Exercise performance", "Vitality"],
    score: 0,
    image: "🍄"
  }
];

const SupplementQuiz = () => {
  const [gameState, setGameState] = useState('intro');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [currentPair, setCurrentPair] = useState([]);
  const [rankings, setRankings] = useState([...supplements]);
  const [selected, setSelected] = useState([]);
  const [lastPicked, setLastPicked] = useState(null);
  const timerRef = useRef(null);
  const listRef = useRef(null);

  const getNewPair = () => {
    const available = symptoms.filter(s => !selected.includes(s.id));
    if (available.length < 2) {
      endGame();
      return null;
    }
    return available.sort(() => Math.random() - 0.5).slice(0, 2);
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);
    setSelected([]);
    setRankings(supplements.map(s => ({ ...s, score: 0 })));
    setCurrentPair(getNewPair());
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    clearInterval(timerRef.current);
    setGameState('results');
  };

  const handleChoice = (symptom) => {
    setLastPicked(symptom);
    setSelected(prev => [...prev, symptom.id]);

    const newRankings = rankings.map(supp => ({
      ...supp,
      score: supp.score + (symptom.supplements.includes(supp.name) ? 1 : 0)
    })).sort((a, b) => b.score - a.score);

    setRankings(newRankings);
    const nextPair = getNewPair();
    if (nextPair) setCurrentPair(nextPair);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const renderChoice = (symptom, index) => (
    <button
      onClick={() => handleChoice(symptom)}
      className={`
        w-full h-36 md:h-48 p-6 rounded-xl text-white text-center
        transition-all duration-300 transform hover:scale-105
        flex flex-col items-center justify-center
        ${index === 0 
          ? 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500' 
          : 'bg-gradient-to-br from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500'}
      `}
    >
      <div className="max-w-[280px] mx-auto">
        <div className="text-sm md:text-base opacity-75 mb-2">I feel like this:</div>
        <div className="text-lg md:text-xl font-bold leading-tight">
          {symptom.text}
        </div>
      </div>
    </button>
  );

  const renderRanking = (supp, index) => (
    <div
      key={supp.name}
      className={`
        p-4 rounded-xl mb-2 transition-all duration-300
        ${index === 0 ? 'bg-gradient-to-r from-yellow-500/30 to-amber-500/30' : 'bg-white/10'}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold text-slate-300 w-8">
          #{index + 1}
        </div>
        <span className="text-2xl">{supp.image}</span>
        <div className="flex-1">
          <h4 className="font-bold">{supp.name}</h4>
          <p className="text-sm text-slate-300">Score: {supp.score}</p>
        </div>
        {lastPicked?.supplements.includes(supp.name) && (
          <Badge className="bg-green-500">+1</Badge>
        )}
      </div>
    </div>
  );

  if (gameState === 'intro') {
    return (
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <CardContent className="p-6 text-center space-y-6">
          <h1 className="text-3xl font-bold">Find Your Perfect Supplements</h1>
          <p className="text-lg opacity-75">Quick quiz to match your needs with the right supplements</p>
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            Start Quiz
            <Sparkles className="ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="bg-purple-600 px-4 py-2 rounded-lg flex items-center gap-2">
            <Timer className="w-5 h-5" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
          <div className="text-slate-300">
            {selected.length} of {symptoms.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPair.map((symptom, index) => renderChoice(symptom, index))}
        </div>

        <div className="bg-black/20 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 text-center">Leaderboard</h3>
          <div className="space-y-2">
            {rankings.map((supp, index) => renderRanking(supp, index))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <CardContent className="p-6 space-y-6">
        <div className="text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold">Your Top Matches</h2>
        </div>

        <div className="space-y-4">
          {rankings.slice(0, 3).map((supp, index) => (
            <div
              key={supp.name}
              className={`
                p-4 rounded-xl
                ${index === 0 ? 'bg-yellow-500/20' : 'bg-white/10'}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{supp.image}</span>
                <div>
                  <h3 className="font-bold">{supp.name}</h3>
                  <p className="text-sm text-slate-300">
                    {supp.benefits.join(' • ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={startGame}>
            <RotateCcw className="mr-2 w-4 h-4" />
            Try Again
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <ShoppingCart className="mr-2 w-4 h-4" />
            View Products
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupplementQuiz;