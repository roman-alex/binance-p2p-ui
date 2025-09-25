import React, { useState, useMemo } from 'react';
import AdRow from './AdRow';

const AdsTable = ({ ads, loading, refreshEverySec, isAutoRefreshing, onToggleAutoRefresh, onChangeIntervalSec, secondsLeft, lastUpdated }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'price', direction: 'asc' });

  const sortedAds = useMemo(() => {
    if (!ads || ads.length === 0) return [];

    const sorted = [...ads].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'amount':
          aValue = a.maxFiat;
          bValue = b.maxFiat;
          break;
        case 'merchant':
          aValue = a.merchant ? 1 : 0;
          bValue = b.merchant ? 1 : 0;
          break;
        case 'completion':
          aValue = a.monthFinishRate || 0;
          bValue = b.monthFinishRate || 0;
          break;
        case 'orders':
          aValue = a.monthOrderCount || 0;
          bValue = b.monthOrderCount || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [ads, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortConfig.direction === 'asc' ? (
      <svg className="w-4 h-4 text-binance-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-binance-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-lg">
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-binance-green"></div>
          <p className="mt-4 text-gray-400">Завантаження оголошень...</p>
        </div>
      </div>
    );
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="bg-dark-surface border border-dark-border rounded-lg">
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 6.709A7.962 7.962 0 0112 4.5c-2.34 0-4.47.881-6.08 2.33" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-400">Оголошень не знайдено</h3>
          <p className="mt-1 text-sm text-gray-500">Спробуйте змінити параметри пошуку</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden">
      
      <div className="bg-dark-bg border-b border-dark-border px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Оголошення ({ads.length})
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">
              Оновлено: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString('uk-UA') : '-'}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">кожні</label>
              <input
                type="number"
                min={3}
                step={1}
                value={refreshEverySec}
                onChange={(e) => onChangeIntervalSec?.(Number(e.target.value) || 0)}
                className="w-16 bg-dark-surface border border-dark-border text-gray-200 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-binance-yellow"
                aria-label="Інтервал автооновлення у секундах"
              />
              <span className="text-sm text-gray-300">сек</span>
              <button
                className={`text-sm px-3 py-1 rounded border ${isAutoRefreshing ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-green-600/20 border-green-500 text-green-300'}`}
                onClick={() => onToggleAutoRefresh?.()}
              >
                {isAutoRefreshing ? 'Зупинити' : 'Старт'}
              </button>
              {isAutoRefreshing && (
                <div className="flex items-center gap-2 text-sm text-gray-300" aria-live="polite">
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-binance-green border-t-transparent"></span>
                  <span>оновлення через {secondsLeft}s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark-bg border-b border-dark-border px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex-1">
            <span>Продавець</span>
          </div>
          <div className="mx-4 min-w-[100px] text-right">
            <button
              onClick={() => handleSort('price')}
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <span>Ціна</span>
              <SortIcon columnKey="price" />
            </button>
          </div>
          <div className="mx-4 min-w-[200px] text-right">
            <button
              onClick={() => handleSort('amount')}
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <span>Доступно / Ліміти</span>
              <SortIcon columnKey="amount" />
            </button>
          </div>
          <div className="mx-4 min-w-[200px]">
            <span>Платіжні методи</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-dark-border">
        {sortedAds.map((ad, index) => (
          <AdRow key={ad.id || index} ad={ad} index={index} />
        ))}
      </div>

      {ads.length > 0 && (
        <div className="bg-dark-bg border-t border-dark-border px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <div>
              Показано {ads.length} з {ads.length} оголошень
            </div>
            <div className="flex items-center space-x-4">
              <span>Середня ціна: ₴ {ads.reduce((sum, ad) => sum + ad.price, 0) / ads.length}</span>
              <span>Мерчанти: {ads.filter(ad => ad.merchant).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsTable;
