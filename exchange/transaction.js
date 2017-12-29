const request = require('../util/request')

let pool = 0.05
let investment

/**
 * Fee to make a trade as a percent
 */
const fee = 0.05

/**
 * Perform a limit purchase order
 *
 * @param symbol the currency symbol to buy
 * @param amount the amount of currency to buy
 * @param price  the price limit for a limit order
 */
function buy ({symbol, amount, price}){
  investment = { symbol, amount, price }
  const fund = amount * price
  pool -= fund + (fund * (fee / 100))
}

function sell ({symbol, amount, price}){
  const sale = amount * price
  pool += sale - (sale * (fee / 100))
  investment = null
}

module.exports = {
  buy,
  sell,
  fee
}
