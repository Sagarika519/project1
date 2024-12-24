import React from 'react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to Our Platform</h1>
      <p>Your solution to [Your Business Idea]</p>
      <button onClick={() => window.location.href='/register'}>Get Started</button>
    </div>
  );
};

export default LandingPage;
