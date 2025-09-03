import { useState, useEffect, useCallback } from 'react';
import './Style.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = 'https://api.api-ninjas.com/v1/emoji?name=';

function App() {
  const [input, setInput] = useState('');
  const [emojiStory, setEmojiStory] = useState([]);
  const [emojiNames, setEmojiNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isTinyTextDisplayed, setIsTinyTextDisplayed] = useState(false);
  // Memoized function to fetch emoji for a single word
  const fetchEmoji = useCallback(async (word) => {
    if (!word.trim()) return '❓';
    
    try {
      const response = await fetch(`${API_URL}${encodeURIComponent(word.trim())}`, {
        headers: { 
          'X-Api-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Emoji not found');
      }

      const data = await response.json();
      return {
        character: data[0]?.character || '❓',
        name: data[0]?.name || 'unknown'
      };
    } catch (err) {
      console.error('Error fetching emoji:', err);
      return '❓'; // Return question mark if emoji not found
    }
  }, []);

  // Process the input whenever it changes
  useEffect(() => {
    const processInput = async () => {
      if (!input.endsWith(' ') && input !== '') return;
      
      const words = input.trim().split(' ').filter(Boolean);
      if (words.length === 0) return;
      
      const lastWord = words[words.length - 1];
      
      // Only process if we have a new word (after space)
      if (lastWord && (emojiStory.length === 0 || words.length > emojiStory.length)) {
        setIsLoading(true);
        try {
          const emojiData = await fetchEmoji(lastWord);
          setEmojiStory(prev => [...prev, emojiData.character]);
          setEmojiNames(prev => [...prev, emojiData.name]);
          setError('');
        } catch (err) {
          setError('Failed to fetch emoji');
        } finally {
          setIsLoading(false);
        }
      }
    };

    processInput();
  }, [input, fetchEmoji, emojiStory.length]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const toggleTinyText = () => {
    setIsTinyTextDisplayed(prev => !prev);
  };

  

  useEffect(() => {
    const tinytextElement = document.querySelectorAll('.tinytext');
    if (tinytextElement) {
      tinytextElement.forEach(element => {
        element.style.display = isTinyTextDisplayed ? 'block' : 'none';
      });
    }
  }, [isTinyTextDisplayed]);
  return (
    <div className="App" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>📖 Emoji Story</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type words separated by spaces..."
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            marginBottom: '10px'
          }}
          disabled={isLoading}
        />
        {isLoading && <p>Loading emoji...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      
      <div style={{
        minHeight: '100px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '15px',
        fontSize: '24px',
        lineHeight: '1.5',
        whiteSpace: 'pre-wrap',
        backgroundColor: '#f9f9f9'
      }}onDoubleClick={toggleTinyText}>
        <div className='rowlike'>

        {emojiStory.map((emoji, index) => (
          <span key={index}>
            <div className='tinytext'>
              {emojiNames[index]} {`  `}
            </div>
            {emoji} {` `}
          </span>
        ))}  
        </div>

      </div>
      
      <div style={{ marginTop: '20px', color: '#777' }}>
        <p>Tip: Type a word and press space to see it turn into an emoji!</p>
      </div>
    </div>
  );
}

export default App;
