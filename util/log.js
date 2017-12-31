const Table = require('cli-table2')
const color = require('chalk')

function strategy ({ fund, target, abort, fee, limit }){
  const table = new Table({ head: [ 'fund', 'target', 'abort', 'fee', 'limit/profit', 'limit/loss' ] })
  table.push([ fund, target, abort, fee, limit.profit, limit.loss ])
  console.log(table.toString())
}

function hTable(data){
  const table = new Table({head: Object.keys(data)})
  table.push(Object.values(data))
  console.log(table.toString())
}

function vTable (report){
  const table = new Table()
  table.push(
    { 'symbol': report.symbol },
    { 'price': report.price },
    { 'amount': report.amount },
    { 'target': report.target },
    { 'abort': report.abort },
    { 'increase': report.increase }
  )
  console.log(table.toString())
}

// function strategy({ fund, target, abort, fee, limit }){
//   console.log(`Strategy | ${e('fund', 7)} | ${e('target', 12)} | ${e('abort', 12)} | ${s('fee', 6)} | ${e('profit', 6)} | ${e('loss', 6)}`)
//   console.log(`${s('BTC', 8)} | $${e(fund, 6)} | ${e(target, 12)} | ${e(abort, 12)} | ${s(fee, 6)} | ${e(limit.profit, 6)} | ${e(limit.loss, 6)}`)
// }

function buy({symbol, price, amount, target, abort, increase, decrease}){
  console.log(color.green(` BUYING: ${e(symbol, 8)} |price: ${e(price, 10)} |amount: ${ne(amount, 16)} |target: ${ne(target, 12)} |abort: ${ne(abort, 12)} |increase: ${ne(increase, 12)} |decrease: ${ne(decrease, 12)}`))
}

function sell({symbol, price, saleprice, amount, success}){
  console.log(color.yellowBright(`SELLING: ${e(symbol, 7)} |status: ${e(rg(success), 8)} |purchase price: ${e(price, 10)} |sale price: ${e(saleprice, 10)} |amount: ${ne(amount, 16)} `))
}

function rg(bool){
  return bool ? color.bgGreen('success') : color.bgRed('aborted')
}

function s(x, n){
  return x.toString().padStart(n)
}

function e(x, n) {
  return x.toString().padEnd(n)
}

function ns(x, n){
  return x.toString().padStart(n)
}

function ne(x, n) {
  return parseFloat(x).toFixed(10).toString().padEnd(n)
}

module.exports = {
  hTable,
  vTable,
  buy,
  sell,
  strategy
}
