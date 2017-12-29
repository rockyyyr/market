const calculate = require('./calculate')

function top (size, data){
  return new Promise(async (resolve, reject) => {
    if (data.length === 0) {
      reject(`error: no data is present`)
    }

    const blocks = [... new Set(data.sort(byTime).map(item => item.time))]
    const beginning = blocks[0], current = blocks[blocks.length - 1]

    const mapped = await mapChange(
      await whereTimeEquals(beginning, data),
      await whereTimeEquals(current, data))

    const sorted = mapped.sort(byWorst).slice(0, size)
    const result = {
      beginning: beginning,
      current: current,
      data: sorted
    }

    // console.log(result)
    resolve(result)
  })
}

function mapChange(beginning, latest){
  return new Promise(resolve => {
    let result = []
    let count = 0
    beginning.forEach(item => {
      const endpoint = latest.filter(elem => elem.symbol === item.symbol)[0]

      if (endpoint) {
        result.push({
          symbol: item.symbol,
          change: calculate.change(item.price, endpoint.price),
          originalPrice: item.price,
          currentPrice: endpoint.price
        })
      }

      if(++count === beginning.length) resolve(result)
    })
  })
}

function whereTimeEquals(time, data){
  return new Promise(resolve => {
    let result = []
    let count = 0
    data.forEach(item => {
      if(item.time === time) {
        result.push({symbol: item.symbol, price: item.price})
      }

      if(++count === data.length) resolve(result)
    })
  })
}

function byBest(a, b){
  return b.change - a.change
}

function byWorst(a, b){
  return a.change - b.change
}

function byTime(a, b){
  if (a.time > b.time) return 1
  if (a.time < b.time) return -1
  return 0
}

module.exports = {
  top
}