describe("Shrouded Dagger (Part 2)", function() {

    describe("Public Test 1", function() {
  
        it("Should dummy test in Hardhat", async function() {
            // Test Hardhat is initialized
            const Dagger = await ethers.getContractFactory("ShroudedDagger");
            await Dagger.deploy([]);
        });
  
    });
  
});
  