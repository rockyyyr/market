const db = require('./db')

setInterval(() => {
  db.selectLast('market')
}, 30000);
