const { market } = require('../exchange')

/**
 * Get the top best or worst performers based on their change percentage
 * over some duration of time
 *
 * @param size the number of entries to return
 * @param data the data to parse
 * @returns {Promise} an array containing results as:
 *
 * {
 *  beginning: // earliest time in range
 *    current: // latest time in range
 *    data: [
 *      symbol: // currency symbol
 *      change: // change percentage during the selected range of time,
 *      originalPrice: // price at the earliest time in range
 *      currentPrice: // price at the latest time in range
 *    ]
 * }
 */
function top (size, data) {
  return new Promise(async (resolve, reject) => {
    if(data.length === 0) {
      reject(`error: no data is present`)
    }

    const blocks = [... new Set(data.sort(byTime).map(item => item.time))]
    const beginning = blocks[0], current = blocks[blocks.length - 1]

    const currentPrices = await market.prices()

    const mapped = await mapChange(
      await whereTimeEquals(beginning, data),
      await whereTimeEquals(current, data)
      , currentPrices
    )

    const sorted = mapped.sort(byWorst).slice(0, size)
    const result = {
      beginning: beginning,
      current: current,
      data: sorted
    }
    resolve(result)
  })
}

function mapChange (beginning, latest, currentPrices) {
  return new Promise(resolve => {
    let result = []
    let count = 0
    beginning.forEach(async item => {
      const endpoint = latest.filter(elem => elem.symbol === item.symbol)[0]

      if(endpoint) {
        result.push({
          symbol: item.symbol,
          change: change(item.price, endpoint.price),
          originalPrice: item.price,
          currentPrice: currentPrices.filter(elem => elem.symbol === item.symbol)[0].price
        })
      }

      if(++count === beginning.length) {
        resolve(result)
      }
    })
  })
}

function whereTimeEquals (time, data) {
  return new Promise(resolve => {
    let result = []
    let count = 0

    data.forEach(item => {
      if(item.time === time) {
        result.push({
          symbol: item.symbol,
          price: item.price
        })
      }

      if(++count === data.length) {
        resolve(result)
      }
    })
  })
}

function byBest (a, b) {
  return b.change - a.change
}

function byWorst (a, b) {
  return a.change - b.change
}

function byTime (a, b) {
  if(a.time > b.time) return 1
  if(a.time < b.time) return -1
  return 0
}

function change (current, original) {
  return (((original - current) / original) * 100).toFixed(3)
}

module.exports = {
  top,
  change
}