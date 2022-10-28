const BANDIT_CAMP_ADDRESS = "0xebde34D161332550cb17b52Bd60ab03F4399C54F"

async function main() {
  const camp = await ethers.getContractAt(
    "BanditCamp", BANDIT_CAMP_ADDRESS);

  await camp.clearCamp();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});