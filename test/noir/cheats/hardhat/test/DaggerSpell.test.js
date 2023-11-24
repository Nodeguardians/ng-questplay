describe("Dagger Spell (Part 3)", function() {

  describe("Public Test 1", function() {

      it("Should dummy test in Hardhat", async function() {
          // Test Hardhat is initialized
          const Dagger = await ethers.getContractFactory("DaggerSpell");
          await Dagger.deploy(
            Array(8).fill(ethers.constants.AddressZero)
          );
      });

  });

});
