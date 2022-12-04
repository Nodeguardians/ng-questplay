const PROXY_ADDR = "0x481FE2240E5C7cd4eC9C669e07E7a5b19Ff7dE85"

async function main() {
  const camp = await ethers.getContractAt(
    "SuitLogicV0", PROXY_ADDR);

  await camp.consumeFuel();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});