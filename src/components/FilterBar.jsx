import React, { useState } from 'react';
import { PAYMENT_METHODS, ASSETS, FIAT_CURRENCIES } from '../services/api';

const FilterBar = ({ filters, onFiltersChange, onSearch }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleInputChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleMultiSelectChange = (field, value) => {
    const currentValues = filters[field] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFiltersChange({ ...filters, [field]: newValues });
  };

  const handleSearch = () => {
    onSearch();
  };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-lg p-4 mb-6">
      <div className="flex flex-wrap gap-4 items-end mb-4">
        <div className="flex bg-dark-bg rounded-md p-1">
          <button
            onClick={() => handleInputChange('tradeType', 'BUY')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filters.tradeType === 'BUY'
                ? 'bg-binance-green text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Купівля
          </button>
          <button
            onClick={() => handleInputChange('tradeType', 'SELL')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filters.tradeType === 'SELL'
                ? 'bg-binance-green text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Продаж
          </button>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Актив</label>
          <select
            value={filters.asset || 'USDT'}
            onChange={(e) => handleInputChange('asset', e.target.value)}
            className="input-field min-w-[100px]"
          >
            {ASSETS.map(asset => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Валюта</label>
          <select
            value={filters.fiat || 'UAH'}
            onChange={(e) => handleInputChange('fiat', e.target.value)}
            className="input-field min-w-[100px]"
          >
            {FIAT_CURRENCIES.map(fiat => (
              <option key={fiat} value={fiat}>{fiat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Сума угоди</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Мін"
              value={filters.amountMin || ''}
              onChange={(e) => handleInputChange('amountMin', e.target.value ? Number(e.target.value) : null)}
              className="input-field w-24"
            />
            <span className="text-gray-400 self-center">-</span>
            <input
              type="number"
              placeholder="Макс"
              value={filters.amountMax || ''}
              onChange={(e) => handleInputChange('amountMax', e.target.value ? Number(e.target.value) : null)}
              className="input-field w-24"
            />
            <span className="text-gray-400 self-center text-sm">
              {filters.fiat || 'UAH'}
            </span>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Результатів</label>
          <select
            value={filters.rows || 20}
            onChange={(e) => handleInputChange('rows', Number(e.target.value))}
            className="input-field"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <button
          onClick={handleSearch}
          className="btn-primary"
        >
          Пошук
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn-secondary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
          Фільтри
        </button>
      </div>
      {isExpanded && (
        <div className="border-t border-dark-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Платіжні методи</label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {PAYMENT_METHODS.map(method => (
                  <label key={method} className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={(filters.payTypes || []).includes(method)}
                      onChange={() => handleMultiSelectChange('payTypes', method)}
                      className="rounded border-dark-border bg-dark-surface text-binance-green focus:ring-binance-green"
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Тип продавця</label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.merchantOnly || false}
                  onChange={(e) => handleInputChange('merchantOnly', e.target.checked)}
                  className="rounded border-dark-border bg-dark-surface text-binance-green focus:ring-binance-green"
                />
                <span className="text-sm">Тільки мерчанти</span>
              </label>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Сортування</label>
              <select
                value={filters.sortBy || 'price'}
                onChange={(e) => handleInputChange('sortBy', e.target.value)}
                className="input-field w-full"
              >
                <option value="price">За ціною</option>
                <option value="amount">За сумою</option>
                <option value="merchant">Мерчанти спочатку</option>
                <option value="completion">За відсотком виконання</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
