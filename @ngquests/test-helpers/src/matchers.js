function closeTo(expected, threshold) {
  return function (x) {
    return x >= expected - threshold && x <= expected + threshold;
  }
}

module.exports.closeTo = closeTo;