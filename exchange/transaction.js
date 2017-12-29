const request = require('../util/request')

const portfolioSize = 5

let pool = 0.05
let portfolio = []
let buying = true

/**
 * Fee to make a trade as a percent
 */
const fee = 0.05

/**
 * Perform a limit purchase order
 */
function buy (investment) {
  return new Promise((resolve, reject) => {
    const { amount, price } = investment
    const fund = amount * price

    if(fund <= pool) {
      console.log(`buying: ${JSON.stringify(investment, null, 2)}`)

      pool -= fund + (fund * (fee / 100))
      addInvestment(investment)

      resolve({ pool, portfolio })
    } else {
      buying = false
      reject('error: insufficient funds')
    }
  })
}

/**
 * Perform a limit sell order
 *
 * @returns {{pool: number, portfolio: Array}}
 */
function sell (investment) {
  console.log(`selling: ${JSON.stringify(investment, null, 2)}`)

  const { symbol, amount, price } = investment
  const sale = amount * price
  pool += sale - (sale * (fee / 100))

  removeInvestment(symbol)
  return { pool, portfolio }
}

/**
 * Add a new investment to the portfolio after a buy
 *
 * @param investment the new investment to add
 */
function addInvestment (investment) {
  portfolio.push(investment)

  if(portfolio.length === portfolioSize) {
    buying = false
  }
}

/**
 * Remove an investment from the portfolio after a sale
 *
 * @param symbol the currency symbol of the investment to remove
 */
function removeInvestment (symbol) {
  portfolio = portfolio.filter(item => item.symbol !== symbol)
  buying = true
}

module.exports = {
  buy,
  sell,
  fee,
  buying
}
