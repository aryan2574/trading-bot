import { DepthManager } from "./DepthManager";
import { cancelAllOrders, createOrder } from "./order";

const pepeInrMarket = new DepthManager("B-PEPE_INR");
const usdInrMarket = new DepthManager("B-USDT_INR");
const pepeUsdtMarket = new DepthManager("B-PEPE_USDT");

const feePercentage = 0.001; // 0.6% trading fee

setInterval(async () => {
  // Fetch all depths at once
  const pepeInrDepth = await pepeInrMarket.getRelevantDepth();
  const usdInrDepth = await usdInrMarket.getRelevantDepth();
  const pepeUsdtDepth = await pepeUsdtMarket.getRelevantDepth();

  console.log("Market Depths:");
  console.log("PEPE-INR", pepeInrDepth);
  console.log("USD-INR", usdInrDepth);
  console.log("PEPE-USDT", pepeUsdtDepth);
  console.log("----");

  // Path 1: 1 SOL -> INR -> USDT -> SOL
  const canGetInr = pepeInrDepth.lowestAsk * (1 - feePercentage);
  const canGetUsdt = (canGetInr / usdInrDepth.lowestAsk) * (1 - feePercentage);
  const canGetSol =
    (canGetUsdt / pepeUsdtDepth.lowestAsk) * (1 - feePercentage);

  console.log(
    `Path 1: You can convert 1 PEPE into ${canGetSol.toFixed(6)} PEPE`
  );

  // Path 2: INR -> USDT -> SOL -> INR
  const initalINR = pepeInrDepth.highestBid * (1 + feePercentage);
  const canGetUsdt2 = 1 * pepeUsdtDepth.highestBid * (1 - feePercentage);
  const canGetInr2 = canGetUsdt2 * usdInrDepth.highestBid * (1 - feePercentage);

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

async function main() {
  const highestBid = (await pepeInrMarket.getRelevantDepth()).highestBid;
  await createOrder(
    "buy",
    "PEPEINR",
    highestBid + 0.0001,
    50000,
    Math.random().toString()
  );
  await new Promise((r) => setTimeout(r, 10000));
  await cancelAllOrders("PEPEINR");
  await new Promise((r) => setTimeout(r, 10000));
  main();
}

setTimeout(main, 1000);
