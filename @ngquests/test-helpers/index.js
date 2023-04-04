module.exports = {
  get matchers () { return require('./src/matchers.js'); },
  get events () { return require('./src/events.js'); },
  get diamonds () { return require('./src/diamonds.js'); },
  get ast () { return require('./src/ast.js'); },
  get cheating () { return require('./src/cheating.js'); },
  get FoundryReport () { return require('./src/FoundryReport.js'); }
}