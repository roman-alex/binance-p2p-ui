import axios from 'axios';

const API_URL = "/api/binance/bapi/c2c/v2/friendly/c2c/adv/search";
const HEADERS = {
  "Content-Type": "application/json"
};

export const fetchP2POrders = async ({
  asset = "USDT",
  fiat = "UAH",
  tradeType = "BUY",
  payTypes = [],
  page = 1,
  rows = 20,
  amountMin,
  amountMax,
} = {}) => {
  try {
    const payload = { asset, fiat, tradeType, page, rows };
    if (Array.isArray(payTypes) && payTypes.length) payload.payTypes = payTypes;

    const { data } = await axios.post(API_URL, payload, { 
      headers: HEADERS, 
      timeout: 15000 
    });

    const raw = Array.isArray(data?.data) ? data.data : [];
    if (!raw.length) return [];

    const ads = raw.map(({ adv, advertiser }) => ({
      id: adv.advNo,
      price: Number(adv.price),
      fiat: adv.fiatUnit,
      asset: adv.asset,
      minFiat: Number(adv.minSingleTransAmount),
      maxFiat: Number(adv.dynamicMaxSingleTransAmount ?? adv.maxSingleTransAmount),
      availableAsset: Number(adv.tradableQuantity),
      payMethods: (adv.tradeMethods || []).map(m => m.tradeMethodName || m.identifier),
      nick: advertiser?.nickName,
      merchant: advertiser?.userType === "merchant",
      monthOrderCount: advertiser?.monthOrderCount,
      monthFinishRate: advertiser?.monthFinishRate,
      isPromoted: adv.isPromoted || false,
    }));

    const filteredByAmount = ads.filter(a =>
      (amountMin == null || a.maxFiat >= amountMin) &&
      (amountMax == null || a.minFiat <= amountMax)
    );

    return filteredByAmount;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const PAYMENT_METHODS = [
  "Monobank",
  "PrivatBank", 
  "PUMBBank",
  "ABank",
  "RaiffeisenBankAval",
  "UniversalBank",
  "BankVlasnyiRakhunok",
  "Kredobank",
  "OTPBank",
  "SportBank",
  "Visa/MasterCard",
  "Cash",
];

export const ASSETS = ["USDT", "BTC", "USDC", "BNB", "ETH", "SOL"];

export const FIAT_CURRENCIES = ["UAH"];
