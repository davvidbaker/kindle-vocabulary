import React from 'react';

const Word = ({ word, stem, usage }) => {
  const re = new RegExp(`\\b(${word})\\b`, 'gi');
  const parts = usage.split(re);

  const output = parts.map(
    (part, i) =>
      i % 2 ? (
        <span className="highlight" style={{ background: '#FEFBE7' }}>
          {part}
        </span>
      ) : (
        part
      )
  );

  return (
    <div className="word">
      <strong>{word}</strong>
      <p>{output}</p>
    </div>
  );
};

export default Word;
