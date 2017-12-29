const axios = require('axios').create({
  baseURL: 'https://api.binance.com',
  headers: {}
})

function get(endpoint){
  return new Promise(resolve => {
    axios.get(endpoint)
      .then(response => resolve(response.data))
      .catch(err => console.log(err.message))
  })
}

module.exports = {
  get
}