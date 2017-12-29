const Table = require('cli-table2')

function investment ({ fund, target, abort, fee, limit }){
  const table = new Table({ head: [ 'fund', 'target', 'abort', 'fee', 'limit/profit', 'limit/loss' ] })
  table.push([ fund, target, abort, fee, limit.profit, limit.loss ])
  console.log(table.toString())
}

function table (report){
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

module.exports = {
  table,
  investment
}
