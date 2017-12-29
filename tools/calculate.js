function change (a, b){
  return (((b - a) / b) * 100).toFixed(3)
}

function investment (strategy, currency){
  const increase = currency.price / (strategy.fund / strategy.limit.profit)
  return {
    symbol: currency.symbol,
    price: currency.price,
    amount: strategy.fund / currency.price,
    target: parseFloat(currency.price) + increase,
    abort: currency.price - increase,
    increase
  }
}

module.exports = {
  change,
  investment
}
