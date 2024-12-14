import { DepthManager } from "./DepthManager";

const solInrMarket = new DepthManager("B-SOL_INR");
const usdInrMarket = new DepthManager("B-USD_INR");
const solUsdtMarket = new DepthManager("B-SOL_USDT");

setInterval(async () => {
  console.log("SOL-INR", await solInrMarket.getRelevantDepth());
  //   console.log("USD-INR", await usdInrMarket.getRelevantDepth());
  //   console.log("SOL-USDT", await solUsdtMarket.getRelevantDepth());
  console.log("----");
}, 5000);
