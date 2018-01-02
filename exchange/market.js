const request = require('../util/request')
const db = require('../database/db')
const time = require('../util/time')

const table = 'market'

function prices () {
  return new Promise(async resolve => {
    const prices = await request.get('/api/v1/ticker/allPrices')
    resolve(prices.filter(bySymbol))
  })
}

async function record (prices) {
  const data = prices
    .filter(bySymbol)
    .map(timestamp)

  return db.batchInsert(table, data)
}

function dump (prices) {
  return db.batchInsert(table, prices)
}

function history (range) {
  return range ? db.selectRange(table, range)
               : db.select(table)
}

function atTime(currentTime, symbol){
  return db.selectRecent(table, {start: time.minus(1, 'hours', currentTime), current: currentTime}, symbol)
}

function bySymbol (price) {
  return price.symbol.endsWith('BTC')
}

function timestamp (item) {
  item.time = time.now()
  return item
}

module.exports = {
  prices,
  record,
  history,
  atTime,
  dump
}
