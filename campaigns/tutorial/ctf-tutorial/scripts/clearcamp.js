const BANDIT_CAMP_ADDRESS = "0xaB8116Ad7941EB8f7CbC2cC39c28CE4FB242F31D"

async function main() {
  const camp = await ethers.getContractAt(
    "BanditCamp", BANDIT_CAMP_ADDRESS);

  await camp.clearCamp();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});