const { expect } = require("chai");

async function getArg(transaction, eventSignature, argumentName) {
  let result = await transaction.wait();

  let event = result.events.find(
    (event) => event.eventSignature == eventSignature
  );
  expect(event).to.be.not.undefined;

  return event.args[argumentName];
}

async function testEvent(transaction, eventSignature, eventPredicate) {
  let result = await transaction.wait();
  let event = result.events.find(
    (event) => event.eventSignature == eventSignature 
      && eventPredicate(event)
  );
  expect(event).to.be.not.undefined;
}

module.exports.getArg = getArg;
module.exports.testEvent = testEvent;