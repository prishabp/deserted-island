import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function GameInterface() {
  const [player, setPlayer] = useState(null);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(['Welcome to Deserted Island!']);
  const outputEndRef = useRef(null);

  const resetPlayer = async () => {
    if (!player) return;
    try {
      await axios.post('http://localhost:5000/api/player/reset', {
        username: player.username
      });
      window.location.reload();
    } catch (err) {
      setOutput(prev => [...prev, `Reset failed: ${err.response?.data?.message || err.message}`]);
    }
  };

  // Initialize player
  useEffect(() => {
    const initPlayer = async () => {
      try {
        const res = await axios.post('http://localhost:5000/api/player', {
          username: 'Rishab'
        });
        setPlayer(res.data);
        setOutput(prev => [...prev,
          'You wash ashore on a flooded island...',
          'Ahead, a crumbling research facility looms.',
          'Type "help" for available commands'
        ]);
      } catch (err) {
        setOutput(prev => [...prev, `Error: ${err.response?.data?.message || err.message}`]);
      }
    };

    initPlayer();
  }, []);

  // Scroll to bottom of output
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  // Sync time periodically
  useEffect(() => {
    const syncTime = async () => {
      if (!player) return;

      try {
        const res = await axios.post('http://localhost:5000/api/command', {
          playerId: player._id,
          command: 'time-sync'
        });
        setPlayer(res.data.playerState);
      } catch (err) {
        console.error('Time sync error:', err);
      }
    };

    const interval = setInterval(syncTime, 30000);
    return () => clearInterval(interval);
  }, [player]);

  const handleCommand = async () => {
    if (!input.trim() || !player) return;

    const parts = input.trim().toLowerCase().split(' ');
    const [action, arg] = parts;

    const requiresIndex = ['drop', 'store', 'retrieve', 'read'];
    if (requiresIndex.includes(action) && (!arg || isNaN(parseInt(arg)))) {
      setOutput(prev => [...prev, `> ${input}`, '⚠️ Please provide a valid index (e.g., "drop 0")']);
      setInput('');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/command', {
        playerId: player._id,
        command: input
      });

      setPlayer(res.data.playerState);
      setOutput(prev => [...prev, `> ${input}`, res.data.response]);
    } catch (err) {
      setOutput(prev => [...prev, `> ${input}`, `Error: ${err.response?.data?.message || err.message}`]);
    }

    setInput('');
  };

  const renderCommandsHelp = () => (
    <div style={styles.commandsPanel}>
      <h3>Available Commands:</h3>
      <div style={styles.commandsGrid}>
        <div><strong>W</strong> - Move forward</div>
        <div><strong>A</strong> - Move left</div>
        <div><strong>S</strong> - Move backward</div>
        <div><strong>D</strong> - Move right</div>
        <div><strong>Talk</strong> - Talk to NPC</div>
        <div><strong>Pickup</strong> - Pick up items</div>
        <div><strong>Store</strong> - Store items (in base)</div>
        <div><strong>Form</strong> - Switch forms (in base)</div>
        <div><strong>Read [num]</strong> - Read scroll</div>
        <div><strong>Drop [num]</strong> - Drop item</div>
        <div><strong>Retrieve [num]</strong> - Retrieve from storage</div>
        <div><strong>Portal</strong> - Activate portal (Room 3)</div>
        <div><strong>Help</strong> - Show commands</div>
      </div>
      <button style={styles.resetButton} onClick={resetPlayer}>Reset Game</button>
    </div>
  );

  const renderInventory = () => (
    <div style={styles.inventoryPanel}>
      <h3>Inventory:</h3>
      {player?.inventory.length > 0 ? (
        player.inventory.map((item, index) => (
          <div key={index}>
            [{index}] {item.type === 'key' ? `${item.keyType} Key` : 'Scroll'}
          </div>
        ))
      ) : (
        <div>Empty</div>
      )}
    </div>
  );

  const renderStorage = () => (
    <div style={styles.storagePanel}>
      <h3>Storage:</h3>
      {player?.storage.length > 0 ? (
        player.storage.map((item, index) => (
          <div key={index}>
            [{index}] {item.type === 'key' ? `${item.keyType} Key` : 'Scroll'}
          </div>
        ))
      ) : (
        <div>Empty</div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>DESERTED ISLAND</h1>
        <div style={styles.statusBar}>
          <div>Player: {player?.username || 'Loading...'}</div>
          <div>Position: ({player?.position.x}, {player?.position.y})</div>
          <div>Level: {player?.currentLevel} | Form: {player?.form}</div>
          <div>
            Time: {player?.gameTime ? new Date(player.gameTime).toUTCString().match(/\d{2}:\d{2}:\d{2}/)[0] : ''}
          </div>
        </div>
      </div>

      <div style={styles.mainLayout}>
        {renderCommandsHelp()}

        <div style={styles.gameArea}>
          <div style={styles.output}>
            {output.map((line, i) => (
              <div key={i} style={styles.outputLine}>{line}</div>
            ))}
            <div ref={outputEndRef} />
          </div>

          <div style={styles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleCommand()}
              style={styles.input}
              placeholder="Enter command..."
              autoFocus
            />
            <button onClick={handleCommand} style={styles.button}>Go</button>
          </div>
        </div>

        {renderInventory()}
        {renderStorage()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#1e2d3d',
    color: '#e0f0ff',
    fontFamily: '"Courier New", monospace',
    padding: '20px'
  },
  header: {
    marginBottom: '20px',
    textAlign: 'center'
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-around',
    backgroundColor: '#2a3b4d',
    padding: '10px',
    borderRadius: '5px',
    marginTop: '10px'
  },
  mainLayout: {
    display: 'flex',
    flex: 1,
    gap: '20px'
  },
  commandsPanel: {
    width: '250px',
    backgroundColor: '#2a3b4d',
    padding: '15px',
    borderRadius: '5px',
    border: '1px solid #3a4b5c'
  },
  resetButton: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#b22222',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  inventoryPanel: {
    width: '200px',
    backgroundColor: '#2a3b4d',
    padding: '15px',
    borderRadius: '5px',
    border: '1px solid #3a4b5c'
  },
  storagePanel: {
    width: '200px',
    backgroundColor: '#2a3b4d',
    padding: '15px',
    borderRadius: '5px',
    border: '1px solid #3a4b5c'
  },
  commandsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginTop: '10px'
  },
  gameArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  output: {
    height: '300px',
    backgroundColor: '#0f1a25',
    padding: '20px',
    borderRadius: '5px',
    border: '1px solid #3a4b5c',
    overflowY: 'auto',
    marginBottom: '15px'
  },
  outputLine: {
    marginBottom: '8px',
    lineHeight: '1.4',
    whiteSpace: 'pre-wrap'
  },
  inputContainer: {
    display: 'flex'
  },
  input: {
    flex: 1,
    padding: '12px 15px',
    backgroundColor: '#2a3b4d',
    color: '#e0f0ff',
    border: '1px solid #3a4b5c',
    borderRadius: '5px',
    fontSize: '16px'
  },
  button: {
    padding: '0 25px',
    backgroundColor: '#3a6ea5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    marginLeft: '10px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};
