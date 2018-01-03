const { market } = require('../exchange')
const { now, minus, range } = require('../util/time')
const stats = require('../trading/stats')

function analyze (size, data) {
  return new Promise(async resolve => {
    const currentPrices = await market.prices()
    const keys = [... new Set(data.map(item => item.symbol))]

    const result = keys
      .map(symbol => toStats(symbol, data, currentPrices))
      .filter(peaks)
      .sort(diff)
      .slice(0, size)

    // console.log(JSON.stringify(result, null, 2))

    resolve(result)
  })
}

function toStats (symbol, prices, currentPrices) {
  const currencies = prices.filter(curr => curr.symbol === symbol).sort(byUnixTime)
  const { open, close } = openClose(currencies)
  const change = parseFloat(close - open).toFixed(8)
  const changePercent = stats.change(open, close)
  const time = currencies[currencies.length - 1].time
  const currentPrice = currentPrices.filter(item => item.symbol === symbol)[0].price

  let high = 0, low = Number.MAX_SAFE_INTEGER
  let highdiff = 0, lowdiff = 0, body = 0

  currencies.forEach(item => {
    if(item.price > high) high = item.price
    if(item.price < low) low = item.price
  })

  if(upwardTrend(change)) {
    highdiff = high - close
    lowdiff = open - low
    body = close - open

  } else if(!upwardTrend(change)) {
    highdiff = high - open
    lowdiff = close - low
    body = open - close
  }

  lowdiff = lowdiff.toFixed(8)
  highdiff = highdiff.toFixed(8)
  body = body.toFixed(8)

  return { symbol, currentPrice, time, high, low, open, close, change, changePercent, highdiff, lowdiff, body }
}

function peaks ({ highdiff, lowdiff, body }) {
  return highdiff > (body * 3) || lowdiff > (body * 3)
}

function diff (a, b) {
  return (b.lowdiff > b.highdiff ? b.lowdiff : b.highdiff) - (a.lowdiff > a.highdiff ? a.lowdiff : a.highdiff)
}

function upwardTrend (change) {
  return change >= 0
}

function byChange (a, b) {
  return a.change - b.change
}

function byUnixTime (a, b) {
  return b.time - a.time
}

function byTime (a, b) {
  if(a.time > b.time) return 1
  if(a.time < b.time) return -1
  return 0
}

function openClose (currencies) {
  const open = currencies[0].price
  const close = currencies[currencies.length - 1].price
  return { open, close }
}

// analyze()

module.exports = {
  analyze
}
