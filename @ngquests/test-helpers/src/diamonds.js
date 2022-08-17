const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 }

// get function selectors from ABI
function getSelectors (contract) {
  const signatures = Object.keys(contract.interface.functions)
  const selectors = signatures.reduce((acc, val) => {
    if (val !== 'init(bytes)') {
      acc.push(contract.interface.getSighash(val))
    }
    return acc
  }, [])
  return selectors
}

// Shuffling selectors are useful for slightly more challenging puzzles
function getShuffledSelectors (contract) {
  return getSelectors(contract)
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

// get function selector from function signature
function getSelector (func) {
  func = "function " + func;
  const abiInterface = new ethers.utils.Interface([func])
  return abiInterface.getSighash(ethers.utils.Fragment.from(func))
}

exports.getSelectors = getSelectors
exports.getShuffledSelectors = getShuffledSelectors
exports.getSelector = getSelector
exports.FacetCutAction = FacetCutAction
