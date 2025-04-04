import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [scenario, setScenario] = useState('');
  const [constraints, setConstraints] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null); // Clear previous results

    try {
      const res = await axios.post('http://localhost:8080/scenario/analyze', {
        scenario,
        constraints: constraints.split(',').map(str => str.trim())
      });
      setResponse(res.data);
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>Scenario Analysis AI</h1>

      <form onSubmit={handleSubmit} className="input-form">
        <label>Scenario:</label>
        <textarea
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          placeholder="Describe your scenario..."
          required
        />

        <label>Constraints (comma separated):</label>
        <textarea
          value={constraints}
          onChange={(e) => setConstraints(e.target.value)}
          placeholder='e.g., "Budget: $10,000", "Deadline: 6 weeks"'
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {/* 🔄 Loading Indicator */}
      {loading && <p className="loading">⏳ Analyzing your scenario...</p>}

      {/* ❌ Error Message */}
      {error && <p className="error">{error}</p>}

      {/* ✅ AI Response */}
      {response && (
        <div className="results">
          <h2>Scenario Summary</h2>
          <p>{response.scenarioSummary}</p>

          {response.potentialPitfalls?.length > 0 && (
            <>
              <h2>Potential Pitfalls</h2>
              <ul>
                {response.potentialPitfalls.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {response.proposedStrategies?.length > 0 && (
            <>
              <h2>Proposed Strategies</h2>
              <ul>
                {response.proposedStrategies.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          {response.recommendedResources?.length > 0 && (
            <>
              <h2>Recommended Resources</h2>
              <ul>
                {response.recommendedResources.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          <h2>Disclaimer</h2>
          <p>{response.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

export default App;
