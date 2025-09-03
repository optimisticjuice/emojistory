import { useState, useEffect } from 'react'; // import useEffect for reacting to input changes
const API_KEY = import.meta.env.VITE_API_KEY;
const API_URL = 'https://api.api-ninjas.com/v1/emoji?name=';
function App() {
  
  const [word, setWord] = useState('');
  const [emoji, setEmoji] = useState(``);
  const [error, setError] = useState('');
  
  const fetchEmoji = async () => {
    if (!word.trim()) {
      setError('Please enter a word to search');
      return;
    }

    try {
      const response = await fetch(`${API_URL}${word}`, {
        headers: { 
          'X-Api-Key': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) { 
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.length > 0) {
        setEmoji(data.map((item) => item.character));
        setError('');
      } else {
        setEmoji(''); // clear previous result
        setEmoji([word]); // show the word itself when no emoji is found
        setError(''); // no error because we fall back to the word
      }
    } catch (err) {
      console.error('Error fetching emoji:', err);
      setEmoji('');
      setEmoji([word]); // also show the word if the API fails
      setError(`Error: ${err.message || 'Failed to fetch emoji'}`);
    }
  };

  // Fetch a new emoji every time the word changes
  useEffect(() => {
    if (word.trim()) {
      fetchEmoji();
    } else {
      setEmoji('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word]);

  return (
    <>
      <h1>Emojistory</h1>
      <div className="App">
      <h1>🔍 Emoji Finder</h1>
      <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchEmoji()
            }
          }}
          placeholder="Enter a word (e.g. cat, fire)"
        />
      <button onClick={fetchEmoji}>Find Emoji</button>
      <div className="result">
        {emoji[0]}
          <hr/>
          <q>{word}</q> {/* display the typed word as a quote */}
          {/* Rember you can map or Object.entries within an array or object in react.js within useState whilst useState is immutable  */}
        {error && <p>{error}</p>}
      </div>
    </div>

    </>
  )
}
export default App;
