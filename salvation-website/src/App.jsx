import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import useScrollReveal from './hooks/useScrollReveal';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import BibleSchool from './pages/BibleSchool';
import Publications from './pages/Publications';
import Videos from './pages/Videos';
import Counseling from './pages/Counseling';
import PrayerPrograms from './pages/PrayerPrograms';
import LiveTv from './pages/LiveTv';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Legal from './pages/Legal';
import Updates from './pages/Updates';
import Support from './pages/Support';
import Team from './pages/Team';
import FAQ from './pages/FAQ';

function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || '#home');
  const [pageKey, setPageKey] = useState(0);

  // Drive scroll-reveal whenever the page changes
  useScrollReveal(pageKey);

  // Monitor url hashes for routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      setCurrentHash(hash);
      setPageKey(k => k + 1); // bump key → re-run scroll reveal
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Set default hash in url on first render
  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#home';
    }
  }, []);

  // Router logic mapping to the Salvation Series page structure
  const renderPage = () => {
    switch (currentHash) {
      case '#home':
        return <Home />;
      case '#about':
        return <About />;
      case '#gallery':
        return <Gallery />;
      case '#bible-school':
        return <BibleSchool />;
      case '#publications':
        return <Publications />;
      case '#videos':
        return <Videos />;
      case '#counseling':
        return <Counseling />;
      case '#prayer-programs':
        return <PrayerPrograms />;
      case '#live-tv':
        return <LiveTv />;
      case '#contact':
        return <Contact />;
      case '#admin':
        return <Admin />;
      case '#updates':
        return <Updates />;
      case '#support':
        return <Support />;
      case '#team':
        return <Team />;
      case '#faq':
        return <FAQ />;
      case '#privacy':
        return <Legal policyType="privacy" />;
      case '#terms':
        return <Legal policyType="terms" />;
      case '#donation-policy':
        return <Legal policyType="donation-policy" />;
      default:
        return <Home />;
    }
  };

  return (
    <AppProvider>
      <div className="app-container">
        <Navbar currentHash={currentHash} />
        <main className="main-content">
          <div key={pageKey} className="page-enter">
            {renderPage()}
          </div>
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
