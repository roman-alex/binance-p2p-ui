import React, { useState, useEffect } from 'react';
import FilterBar from './components/FilterBar';
import AdsTable from './components/AdsTable';
import { fetchP2POrders } from './services/api';

function App() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshEverySec, setRefreshEverySec] = useState(8);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filters, setFilters] = useState({
    asset: 'USDT',
    fiat: 'UAH',
    tradeType: 'BUY',
    payTypes: [],
    amountMin: null,
    amountMax: null,
    rows: 20,
    merchantOnly: false,
    sortBy: 'price',
    priceAlert: null
  });

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio notification failed:', error);
    }
  };

  const checkPriceAlert = (newAds) => {
    if (!filters.priceAlert || !newAds.length) return;
    
    const matchingAds = newAds.filter(ad => ad.price <= filters.priceAlert);
    if (matchingAds.length > 0) {
      playNotificationSound();
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const normalized = {
        asset: filters.asset,
        fiat: filters.fiat,
        tradeType: filters.tradeType,
        payTypes: Array.isArray(filters.payTypes) ? filters.payTypes : [],
        rows: filters.rows,
        amountMin: filters.amountMin ?? undefined,
        amountMax: filters.amountMax ?? undefined,
      };
      const results = await fetchP2POrders(normalized);
      setAds(results);
      setLastUpdated(new Date());
      checkPriceAlert(results);
    } catch (err) {
      setError(err.message || 'Помилка завантаження даних');
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    if (!isAutoRefreshing || refreshEverySec <= 0) return;
    setSecondsLeft(refreshEverySec);
    const id = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          handleSearch();
          return refreshEverySec;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isAutoRefreshing, refreshEverySec, filters]);

  useEffect(() => {
    if (!filters.tradeType) return;
    handleSearch();
  }, [filters.tradeType]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
        />

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-red-400 font-medium">Помилка завантаження</h3>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <AdsTable
          ads={ads}
          loading={loading}
          refreshEverySec={refreshEverySec}
          isAutoRefreshing={isAutoRefreshing}
          onToggleAutoRefresh={() => setIsAutoRefreshing(v => !v)}
          onChangeIntervalSec={(val) => setRefreshEverySec(Math.max(0, Math.floor(val)))}
          secondsLeft={secondsLeft}
          lastUpdated={lastUpdated}
        />
      </main>
    </div>
  );
}

export default App;