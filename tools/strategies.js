function oneToOne (fund, limit, feePercent){
  const fee = applyFee(fund, feePercent)
  const target = fund + limit
  const abort = fund - limit
  return {
    fund: fund,
    target, abort, fee,
    limit: {
      profit: limit,
      loss: limit,
    }
  }
}

function twoToOne (fund, profit){
  const loss = profit / 2
  const target = fund + profit
  const abort = fund - loss
  return {
    fund, target, abort,
    limit: {
      profit,
      loss
    }
  }
}

function applyFee (fund, fee){
  return fund * convertFee(fee)
}

function convertFee (fee){
  return fee / 100
}

module.exports = {
  oneToOne,
  twoToOne
}