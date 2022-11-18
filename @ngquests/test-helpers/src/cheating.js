const { expect, assert } = require("chai");
const parser = require("@solidity-parser/parser");
const ast = require("./ast.js")
const fs = require('fs/promises') 

const NON_ASSEMBLY_ERROR = "Function can only have 1 assembly block only";
const ASSEMBLY_CREATE_ERROR = "\"create\" keyword detected, contract should no deploy other contracts";
const EXTERNAL_CODE_ERROR = "External contract detected";
const MISSING_VARIABLE_ERROR = "Public Variable Missing";

function testAssembly(solutionPath, funcs) {
  describe("Syntax Detection", async function () {

    before(async function () {  
      const solutionContent = await fs.readFile(solutionPath, { encoding: "utf8"});

      solutionAST = ast.toAst(solutionContent)
    })
  
    it("Should only have assembly", async function () {
      for (const func of funcs) {
        const funcAST = ast.getFunctionDefinitionAST(solutionAST, func);

        expect(funcAST.body.statements.length, NON_ASSEMBLY_ERROR)
          .to.equal(1);

        expect(funcAST.body.statements[0].type, NON_ASSEMBLY_ERROR).
          to.equal("InlineAssemblyStatement");
      }
    })
  })
}

function testAssemblyAll(solutionPath) {
  describe("Syntax Detection", async function () {

    before(async function () {  
      const solutionContent = await fs.readFile(solutionPath, { encoding: "utf8"});

      solutionAST = ast.toAst(solutionContent)
    });
  
    it("Should only have assembly", async function () {
      const funcASTs = ast.getAllFunctionDefinitionAST(solutionAST);
      for (funcAST of funcASTs) {
        expect(funcAST.body.statements.length, NON_ASSEMBLY_ERROR)
          .to.equal(1);
          
        expect(funcAST.body.statements[0].type, NON_ASSEMBLY_ERROR)
          .to.equal("InlineAssemblyStatement");
      }
    });
  
  });
}

function testExternalCode(solutionPath) {
  describe("External Code Detection", async function () {

    before(async function () {  
      const solutionContent = await fs.readFile(solutionPath, { encoding: "utf8"});

      solutionAST = ast.toAst(solutionContent)
    });

    it("Should not have external code", async function () {
      parser.visit(solutionAST, {
        ImportDirective: function(node) {
          assert(false, EXTERNAL_CODE_ERROR);
        },
        AssemblyCall: function(expression) {
          expect(expression.functionName, ASSEMBLY_CREATE_ERROR)
            .to.not.equal("create");
          expect(expression.functionName, ASSEMBLY_CREATE_ERROR)
            .to.not.equal("create2");
        }
      });
      
      const numContracts = solutionAST.children.filter(
        child => child.type == "ContractDefinition"
      ).length;

      expect(numContracts, EXTERNAL_CODE_ERROR)
        .to.equal(1);
    });
  });
}

function testPublicVariables(solutionPath, variables) {
  describe("Public Variable Test", async function () {

    before(async function () {  
      const solutionContent = await fs.readFile(solutionPath, { encoding: "utf8"});

      solutionAST = ast.toAst(solutionContent)
    });

    for (const variable of variables) {
      
      it(`Should have public variable ${variable}`, async function () {

        let hasVariable = false;
        parser.visit(solutionAST, {
          VariableDeclaration: function(node) {
            if (node.visibility == 'public' && node.name == variable) {
              hasVariable = true;
            }
          }
        });
  
        assert(hasVariable, MISSING_VARIABLE_ERROR);

      });
    }
  });
}

function testFilesModificationAndAssemblyOnly(templatePath, solutionPath, funcs) {
  describe("Cheating Detection", async function () {

    before(async function () {  
      const templateContent = await fs.readFile(templatePath, { encoding: "utf8"});
      const solutionContent = await fs.readFile(solutionPath, { encoding: "utf8"});

      templateAST = ast.toAst(templateContent);
      solutionAST = ast.toAst(solutionContent)
    })
  
    it("test that the files were not modified", async function() {
      const templateContractAST = ast.getContractDefinitionAST(templateAST)
      const solutionContractAST = ast.getContractDefinitionAST(solutionAST)
      ast.compareContractsDefinitionAST(templateContractAST, solutionContractAST);
    })
  
    for (const func of funcs) {
      it("test that only assembly was used in " + func, async function () {
          const solutionFuncAST = ast.getFunctionDefinitionAST(solutionAST, func);

          expect(solutionFuncAST.body.statements.length, "Not a single assembly block").to.equal(1);
          expect(solutionFuncAST.body.statements[0].type, "Not an assembly block").to.equal("InlineAssemblyStatement");
        }
      )
    }
  })
}

function testFilesModificationAndSameFunctionsAST(templatePath, solutionPath, funcs) {
  describe("Cheating Detection", async function () {

    before(async function () {  
      const templateContent = await fs.readFile(templatePath, { encoding: "utf8"});
      const solutionContent = await fs.readFile(solutionPath, { encoding: "utf8"});

      templateAST = ast.toAst(templateContent);
      solutionAST = ast.toAst(solutionContent)
    })
  
    it("test that the files were not modified", async function() {
      const templateContractAST = ast.getContractDefinitionAST(templateAST)
      const solutionContractAST = ast.getContractDefinitionAST(solutionAST)

      ast.compareContractsDefinitionAST(templateContractAST, solutionContractAST);
    })
  
    for (const func of funcs) {
      it("test that the template function body structure is respected" + func, async function () {
          const solutionFuncAST = ast.getFunctionDefinitionAST(solutionAST, func);
          const templateFuncAST = ast.getFunctionDefinitionAST(templateAST, func);

          ast.compareFunctionsBodyAST(templateFuncAST, solutionFuncAST);
        }
      )
    }
  })
}

function testFilesModificationAndSameFunctionsBody(templatePath, solutionPath, funcs) {
  describe("Cheating Detection", async function () {

    before(async function () {  
      const templateContent = await fs.readFile(templatePath, { encoding: "utf8"});
      const solutionContent = await fs.readFile(solutionPath, { encoding: "utf8"});

      templateAST = ast.toAst(templateContent);
      solutionAST = ast.toAst(solutionContent)
    })
  
    it("test that the files were not modified", async function() {
      const templateContractAST = ast.getContractDefinitionAST(templateAST)
      const solutionContractAST = ast.getContractDefinitionAST(solutionAST)

      ast.compareContractsDefinitionAST(templateContractAST, solutionContractAST);
    })
  
    for (const func of funcs) {
      it("test that the template provided function body is unchanged" + func, async function () {
          const solutionFuncAST = ast.getFunctionDefinitionAST(solutionAST, func);
          const templateFuncAST = ast.getFunctionDefinitionAST(templateAST, func);

          ast.compareFunctionsBody(templateFuncAST, solutionFuncAST);
        }
      )
    }
  })
}

function testFilesSameStateAST(templatePath, solutionPath) {
  describe("Cheating Detection", async function () {

    before(async function () {  
      const templateContent = await fs.readFile(templatePath, { encoding: "utf8"});
      const solutionContent = await fs.readFile(solutionPath, { encoding: "utf8"});

      templateAST = ast.toAst(templateContent);
      solutionAST = ast.toAst(solutionContent);
    })
  
    it("test that the state variables were not modified", async function() {
      const templateContractAST = ast.getContractDefinitionAST(templateAST)
      const solutionContractAST = ast.getContractDefinitionAST(solutionAST)

      ast.compareContractsStateAST(templateContractAST, solutionContractAST);
    })

  })
}

module.exports.testAssembly = testAssembly;
module.exports.testAssemblyAll = testAssemblyAll;
module.exports.testExternalCode = testExternalCode;
module.exports.testPublicVariables = testPublicVariables;

module.exports.testFilesModificationAndAssemblyOnly = testFilesModificationAndAssemblyOnly;
module.exports.testFilesModificationAndSameFunctionsAST = testFilesModificationAndSameFunctionsAST;
module.exports.testFilesModificationAndSameFunctionsBody = testFilesModificationAndSameFunctionsBody;
module.exports.testFilesSameStateAST = testFilesSameStateAST;