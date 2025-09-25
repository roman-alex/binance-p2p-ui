import React from 'react';

const AdRow = ({ ad, index }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('uk-UA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatOrderCount = (count) => {
    if (!count) return '0';
    return new Intl.NumberFormat('uk-UA').format(count);
  };

  const formatCompletionRate = (rate) => {
    if (!rate) return '0%';
    return `${(rate * 100).toFixed(1)}%`;
  };

  const getCompletionColor = (rate) => {
    if (!rate) return 'text-gray-400';
    if (rate >= 0.95) return 'text-binance-green';
    if (rate >= 0.9) return 'text-yellow-400';
    return 'text-binance-red';
  };

  const getPayMethodBorderClass = (method) => {
    const name = (method || '').toLowerCase();
    if (name.includes('mono')) return 'border-l-purple-500';
    if (name.includes('privat')) return 'border-l-green-500';
    if (name.includes('pumb')) return 'border-l-red-500';
    if (name.includes('a-bank') || name.includes('abank') || name.includes('a bank')) return 'border-l-lime-500';
    if (name.includes('izi')) return 'border-l-orange-500';
    if (name.includes('otp')) return 'border-l-emerald-500';
    if (name.includes('raiffeisen')) return 'border-l-yellow-500';
    if (name.includes('universal') || name.includes('visa') || name.includes('master')) return 'border-l-blue-500';
    return 'border-l-gray-500';
  };

  return (
    <div className={`bg-dark-surface border-b border-dark-border p-4 hover:bg-gray-800/50 transition-colors ${
      ad.isPromoted ? 'ring-2 ring-binance-yellow/30 bg-yellow-900/10' : ''
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-binance-yellow to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {ad.nick?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-white truncate">{ad.nick}</span>
                {ad.merchant && (
                  <span className="bg-binance-yellow text-black text-xs px-2 py-0.5 rounded-full font-medium">
                    Мерчант
                  </span>
                )}
                {ad.isPromoted && (
                  <span className="bg-yellow-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    Реклама
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{formatOrderCount(ad.monthOrderCount)} замовлень</span>
                <span className={getCompletionColor(ad.monthFinishRate)}>
                  {formatCompletionRate(ad.monthFinishRate)} виконання
                </span>
                <span>~15 хв</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right mx-4">
          <div className="text-lg font-semibold text-white">
            ₴ {formatNumber(ad.price)}
          </div>
          <div className="text-sm text-gray-400">
            {ad.fiat}
          </div>
        </div>

        <div className="text-right mx-4 min-w-[200px]">
          <div className="text-white font-medium">
            {formatNumber(ad.availableAsset)} {ad.asset}
          </div>
          <div className="text-sm text-gray-400">
            {formatNumber(ad.minFiat)} - {formatNumber(ad.maxFiat)} {ad.fiat}
          </div>
        </div>

        <div className="mx-4 min-w-[200px]">
          <div className="flex flex-col gap-1">
            {ad.payMethods.map((method, i) => (
              <span
                key={i}
                className={`bg-dark-bg text-gray-300 text-xs px-2 py-1 rounded border border-dark-border border-l-4 ${getPayMethodBorderClass(method)}`}
                aria-label={`Метод оплати ${method}`}
                tabIndex={0}
              >
                {method}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdRow;
