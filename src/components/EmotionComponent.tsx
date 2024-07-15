import { useState } from 'react';
import 'tailwindcss/tailwind.css'; // Ensure you import Tailwind CSS
import '../styles/globals.css'; // Ensure you import the global CSS
import { TypeAnimation } from 'react-type-animation';

type Emotion = {
  emoji: string;
  label: string;
  verses: string[];
};

const emotions: Emotion[] = [
  { emoji: '😊', label: 'Happy', verses: [] },
  { emoji: '😢', label: 'Sad', verses: [] },
  { emoji: '😠', label: 'Angry', verses: [] },
  { emoji: '😱', label: 'Fearful', verses: [] },
  { emoji: '😮', label: 'Surprise', verses: [] },
  { emoji: '🤢', label: 'Disgust', verses: [] }
  // Add more emotions and verses as needed
];

const EmotionSelector = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [verses, setVerses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmotionSelect = async (emotion: Emotion) => {
    setSelectedEmotion(null); // Reset the selected emotion
    setVerses([]); // Reset verses
    setLoading(true); // Set loading to true
    setError(null); // Reset error

    try {
      const response = await fetch('/api/getResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: `I'm feeling ${emotion.label.toLowerCase()}. Give me comforting words from the Bible in 25 to 30 words. Format: 'verse location, line break, verse'. Respond only in this format.` },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setVerses([data.content]);
      setSelectedEmotion(emotion); // Set the new emotion after a brief delay
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative">
      {/* Header Section */}
      <header className="absolute top-0 left-0 p-4">
        <h2 className="text-xl font-bold text-black">Live the Verse</h2>
      </header>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-black">How are you feeling?</h1>
      {/* Hide emotion buttons on smaller screens if an emotion is selected */}
      <div className={`${selectedEmotion ? 'hidden sm:grid' : 'grid'} grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8`}>
        {emotions.map((emotion) => (
          <button
            key={emotion.label}
            onClick={() => handleEmotionSelect(emotion)}
            className="flex flex-col items-center text-black p-4 rounded-lg shadow-lg transition transform hover:scale-105 focus:outline-none"
          >
            <span className="text-6xl">{emotion.emoji}</span>
            <span className="mt-2 text-lg font-semibold">{emotion.label}</span>
          </button>
        ))}
      </div>
      {loading && <p className="text-2xl text-black">Loading...</p>}
      {error && <p className="text-2xl text-red-500">{error}</p>}
      {selectedEmotion && !loading && !error && (
        <div className="relative slide-up mt-10 w-full max-w-2xl mx-auto">
          <div className="flex items-center justify-center bg-opacity-75 text-black p-6 rounded-lg shadow-lg">
            <div className="text-center max-h-full overflow-y-auto pl-10 pr-10">
              {verses.map((verse, index) => (
                <p key={index} className="text-xl sm:text-2xl md:text-3xl mb-2">
                  <TypeAnimation
                    sequence={[verse, 1000]} // Wait 1s before repeating the text
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                  />
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionSelector;
