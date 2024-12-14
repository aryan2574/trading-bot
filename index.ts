import { DepthManager } from "./DepthManager";

const solInrMarket = new DepthManager("B-SOL_INR");
const usdInrMarket = new DepthManager("B-USDT_INR");
const solUsdtMarket = new DepthManager("B-SOL_USDT");

const feePercentage = 0.001; // 0.1% trading fee

setInterval(async () => {
  // Fetch all depths at once
  const solInrDepth = await solInrMarket.getRelevantDepth();
  const usdInrDepth = await usdInrMarket.getRelevantDepth();
  const solUsdtDepth = await solUsdtMarket.getRelevantDepth();

  console.log("Market Depths:");
  console.log("SOL-INR", solInrDepth);
  console.log("USD-INR", usdInrDepth);
  console.log("SOL-USDT", solUsdtDepth);
  console.log("----");

  // Path 1: 1 SOL -> INR -> USDT -> SOL
  const canGetInr = solInrDepth.lowestAsk * (1 - feePercentage);
  const canGetUsdt = (canGetInr / usdInrDepth.lowestAsk) * (1 - feePercentage);
  const canGetSol = (canGetUsdt / solUsdtDepth.lowestAsk) * (1 - feePercentage);

  console.log(`Path 1: You can convert 1 SOL into ${canGetSol.toFixed(6)} SOL`);

  // Path 2: INR -> USDT -> SOL -> INR
  const initalINR = solInrDepth.highestBid * (1 + feePercentage);
  const canGetUsdt2 = 1 * usdInrDepth.highestBid * (1 - feePercentage);
  const canGetInr2 =
    canGetUsdt2 * solUsdtDepth.highestBid * (1 - feePercentage);

  console.log(
    `Path 2: You can convert ${initalINR.toFixed(
      6
    )} INR into ${canGetInr2.toFixed(6)} INR`
  );

  console.log("----");

  // Arbitrage detection
  if (canGetSol > 1) {
    console.log("Arbitrage opportunity: Path 1 is profitable.");
  }
  if (canGetInr2 > initalINR) {
    console.log("Arbitrage opportunity: Path 2 is profitable.");
  }
}, 5000);
