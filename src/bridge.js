import chalk from 'chalk';
import ethers from 'ethers';
import { ProgressBar } from './utils/progressbar.js'

const FUJI_ENDPOINT = "https://api.avax-test.network/ext/bc/C/rpc";
const BRIDGE_REGISTRY = "0xCDB6dea15633bC05D4A1d63ECe97eE9C6Fb9c9CB";
const BRIDGE_REGISTRY_ABI = ["function bridgeHashes(bytes32) view returns (bool)"];

const PK = "0x48b291fba855b6f79b690eccaf0caa253ee99163dfad74857f2daf7a0e52cff0";

export async function bridge(queryHash) {

  const progressBar = new ProgressBar(350);

  console.log(chalk.grey("\nSigning hash...\n"));
  
  let barLoad = progressBar.start();

  try {

    const signature = await signHash(queryHash);
    
    await barLoad.then(() => progressBar.stop(" Signed."));
    
    console.log("\nSignature: " + chalk.cyan(signature));

  } catch (err) {

    await barLoad.then(() => progressBar.fail(" Sign failed.\n"));

    console.log(chalk.grey(err));

  }

  console.log();

}

async function signHash(queryHash) {

  const FujiProvider = new ethers.providers.JsonRpcProvider(FUJI_ENDPOINT);
  const registry = new ethers.Contract(BRIDGE_REGISTRY, BRIDGE_REGISTRY_ABI, FujiProvider);
  const isValidHash = await registry.bridgeHashes(queryHash);

  if (!isValidHash) {
    throw "Invalid bridge hash! Ensure that your bridge hash is from Avalanche Fuji.";
  }

  const signer = new ethers.Wallet(PK);
  return signer.signMessage(ethers.utils.arrayify(queryHash));

}
