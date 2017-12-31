const request = require('../util/request')
const { log } = require('../util/index')

const PORTFOLIO_MAX_SIZE = 5
const INITIAL_INVESTMENT = 0.1

let pool = INITIAL_INVESTMENT
let portfolio = []
let history = []
let blacklist = []
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

    if(newInvestment(investment) && !blacklisted(investment)) {
      if(fund <= pool) {
        log.buy(investment)

        pool -= fund + (fund * (fee / 100))
        addInvestment(investment)

        resolve({ pool, portfolio })
      } else {
        buying = false
        reject('error: insufficient funds')
      }
    }
  })
}

/**
 * Perform a limit sell order
 *
 * @returns {{pool: number, portfolio: Array}}
 */
function sell (investment, price) {
  const { symbol, amount } = investment

  const sale = amount * price
  pool += sale - (sale * (fee / 100))

  addToHistory(investment, price)
  removeInvestment(symbol)

  return { pool, portfolio }
}

/**
 * Determines if an investment already exists for a currency
 *
 * @param symbol the currency symbol to check
 * @returns {boolean} true if the investment does not exist, false otherwise
 */
function newInvestment ({ symbol }) {
  return portfolio.filter(item => item.symbol === symbol).length === 0
}

function blacklisted ({symbol}){
  return blacklist.includes(symbol)
}

/**
 * Add a new investment to the portfolio after a buy
 *
 * @param investment the new investment to add
 */
function addInvestment (investment) {
  portfolio.push(investment)

  if(portfolio.length === PORTFOLIO_MAX_SIZE) {
    buying = false
  }
}

/**
 * Add a sold investment to the history
 *
 * @param investment the investment to add
 * @param price      the price the investment was sold at
 */
function addToHistory (investment, price) {
  investment.saleprice = price
  investment.btcprofit = (price * investment.amount) - (investment.price * investment.amount)
  investment.success = price > investment.price

  log.sell(investment)
  history.push(investment)
}

/**
 * Remove an investment from the portfolio after a sale
 *
 * @param symbol the currency symbol of the investment to remove
 */
function removeInvestment (symbol) {
  portfolio = portfolio.filter(item => item.symbol !== symbol)
  // blacklist.push(symbol) //
  buying = true
}

/**
 * @returns {boolean} true if buying is enabled
 */
function buyingEnabled () {
  return buying
}

/**
 * @returns {Array} the current portfolio of investments
 */
function getPortfolio () {
  return portfolio
}

/**
 * @returns {Array} up to date history of investments
 */
function getHistory () {
  return history
}

/**
 * @returns {Object} up to date account break down
 */
function getAccount () {
  return {
    pool,
    investment: INITIAL_INVESTMENT,
    portfolioMax: PORTFOLIO_MAX_SIZE,
    portfolioSize: portfolio.length,
    portfolioCost: portfolio.reduce(toTotalPurchaseCost, 0),
    sales: history.length,
    wins: history.filter(winners).length,
    losses: history.filter(!winners).length,
    profit: history.reduce(profits, 0)
  }
}

/**
 * Reducer function to sum profits from history
 */
function profits(total, current){
  return total + current.btcprofit
}

/**
 * Reducer function to sum total purchase cost of investments in the portfolio
 */
function toTotalPurchaseCost (total, current) {
  return total + (current.price * current.amount)
}

/**
 * Filter function to filter history by successful investments
 */
function winners (investment) {
  return investment.success === true
}

/**
 * After an investment has been sold, it gets blacklisted to prevent
 * a buy/sell loop of the same currency. This is useful when backtesting with
 * current price data.
 *
 * Should not be used in production
 *
 * @returns {Array} the list of blacklisted investments
 */
function getBlacklist () {
  return blacklist
}

module.exports = {
  buy, sell,
  fee, buying,
  buyingEnabled,
  getPortfolio,
  getHistory,
  getAccount,
  getBlacklist
}
