function calculate (strategy, currency){
  const float = parseFloat(currency.price)
  const increase = float / (strategy.fund / strategy.limit.profit)
  const decrease = float / (strategy.fund / strategy.limit.loss)
  return {
    symbol: currency.symbol,
    price: parseFloat(currency.price).toFixed(8),
    amount: (strategy.fund / float).toFixed(8),
    target: (float + increase).toFixed(8),
    abort: (float - decrease).toFixed(8),
    increase: increase.toFixed(8),
    decrease: decrease.toFixed(8)
  }
}

module.exports = {
  calculate
}
