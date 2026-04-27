import React, { useState, useEffect, useCallback } from 'react';

const DINO_POS = 5;
const TRACK_LENGTH = 30;
const JUMP_DURATION = 600; //ms
const GAME_SPEED = 100; 

export default function AsciiDinoGame({ supabase, playerId }) {
  const [isJumping, setIsJumping] = useState(false);
  const [obstaclePos, setObstaclePos] = useState(TRACK_LENGTH);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);


  const jump = useCallback(() => {
    if (!isJumping && !gameOver) {
      setIsJumping(true);
      setTimeout(() => {
        setIsJumping(false);
      }, JUMP_DURATION);
    } else if (gameOver) {
      setScore(0);
      setObstaclePos(TRACK_LENGTH);
      setGameOver(false);
    }
  }, [isJumping, gameOver]);

  // Listen for Spacebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') jump();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setObstaclePos((prevPos) => {
        if (prevPos <= 0) {
          setScore((s) => s + 1);
          return TRACK_LENGTH;
        }
        return prevPos - 1;
      });
    }, GAME_SPEED);

    return () => clearInterval(gameLoop);
  }, [gameOver]);

  // Collision Detection & Supabase Logic
  useEffect(() => {
    // If the obstacle is at the same position as the dino, and the dino is NOT jumping
    if (obstaclePos === DINO_POS && !isJumping) {
      setGameOver(true);
      
      // Handle High Score and Supabase
      if (score > highScore) {
        setHighScore(score);
        saveScoreToSupabase(score);
      }
    }
  }, [obstaclePos, isJumping, score, highScore]);

  // --- SUPABASE INTEGRATION ---
  const saveScoreToSupabase = async (newHighScore) => {
    // Example 1: Inserting a brand new row for this game session
    const { data, error } = await supabase
      .from('gamescore')
      .insert([{ player_id: playerId, score: newHighScore }]);

    if (error) {
      console.error("Error saving score:", error.message);
    } else {
      console.log("High score saved!", data);
    }
  };

  // Render the ASCII Graphics
  const renderGame = () => {
    let airTrack = Array(TRACK_LENGTH).fill(' ');
    let groundTrack = Array(TRACK_LENGTH).fill('_');

    // Place Dino
    if (isJumping) {
      airTrack[DINO_POS] = 'T'; // T-Rex in the air
    } else {
      groundTrack[DINO_POS] = 'T'; // T-Rex on the ground
    }

    // Place Obstacle
    if (obstaclePos >= 0 && obstaclePos < TRACK_LENGTH) {
      groundTrack[obstaclePos] = '#'; // Cactus
    }

    return (
      <div style={{ fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '24px' }}>
        <div>{airTrack.join('')}</div>
        <div>{groundTrack.join('')}</div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#1a1a1a', color: '#00ff00', borderRadius: '8px' }}>
      <h2>ASCII Dino Run</h2>
      <p>Score: {score} | High Score: {highScore}</p>
      
      <div style={{ margin: '40px 0', padding: '20px', border: '1px solid #00ff00' }}>
        {renderGame()}
      </div>

      {gameOver && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          <h3>CRASHED!</h3>
          <p>Press Space to restart</p>
        </div>
      )}

      <p style={{ fontSize: '14px', color: '#888' }}>Press SPACEBAR to jump</p>
    </div>
  );
}