// DepthManager.ts
export class DepthManager {
  private market: string;
  private bids: Record<string, string>;
  private asks: Record<string, string>;

  constructor(market: string) {
    this.market = market;
    this.bids = {};
    this.asks = {};

    // Fetch data immediately
    this.pollMarket();

    setInterval(() => {
      this.pollMarket();
    }, 2000);
  }

  async pollMarket() {
    try {
      const response = await fetch(
        `https://public.coindcx.com/market_data/orderbook?pair=${this.market}`
      );
      const depth = await response.json();
      this.bids = depth.bids;
      this.asks = depth.asks;
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  }

  async getRelevantDepth() {
    let highestBid = -Infinity;
    let lowestAsk = Infinity;
    let bidQuantity = 0;
    let askQuantity = 0;

    for (const [price, quantity] of Object.entries(this.bids)) {
      const bidValue = parseFloat(price);
      if (bidValue > highestBid) {
        highestBid = bidValue;
        bidQuantity = parseFloat(quantity);
      }
    }

    for (const [price, quantity] of Object.entries(this.asks)) {
      const askValue = parseFloat(price);
      if (askValue < lowestAsk) {
        lowestAsk = askValue;
        askQuantity = parseFloat(quantity);
      }
    }

    return {
      highestBid,
      bidQuantity,
      lowestAsk,
      askQuantity,
    };
  }
}
