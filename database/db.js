const knex = require('knex')({
  client: 'mysql2',
  connection: process.env.CLEARDB_DATABASE_URL || require('./connection.json'),
  pool: { max: 10, min: 0 }
})

function raw (sql) {
  return new Promise(resolve => {
    knex.raw(sql)
      .then(result => resolve(result[0][0]))
      .catch(error)
  })
}

function batchInsert (table, data) {
  return new Promise(resolve => {
    knex.batchInsert(table, data, 3000)
      .then(resolve)
      .catch(error)
  })
}

function insert (table, data) {
  return new Promise(resolve => {
    knex.insert(data).into(table)
      .then(resolve)
      .catch(error)
  })
}

function select (table) {
  return new Promise(resolve => {
    knex.select().from(table)
      .then(resolve)
      .catch(error)
  })
}

function selectLast (table, columns) {
  return new Promise(resolve => {
    knex.select().from(table).orderBy('id', 'desc').limit(1).first()
      .then(resolve)
      .catch(error)
  })
}

function selectRange (table, { start, current }) {
  return new Promise(resolve => {
    knex.select().from(table).whereBetween('time', [start, current])
      .then(resolve)
      .catch(error)
  })
}

function deleteFrom (table) {
  return new Promise(resolve => {
    knex(table).del()
      .then(resolve)
      .catch(error)
  })
}

function resetIncrement (table) {
  return new Promise(resolve => {
    knex.raw(`ALTER TABLE ${table} AUTO_INCREMENT = 1`)
      .then(resolve)
      .catch(error)
  })
}

function error (err) {
  console.log(err.message)
}

knex.schema.hasTable('market').then(exists => {
  if(!exists) createTable()
})

// knex.schema.hasTable('pool').then(exists => {if (!exists) createPoolTable()})

function createPoolTable () {
  knex.schema.createTable('pool', column => {
    column.increments()
    column.string('symbol')
    column.string('time')
    column.decimal('amount', 20, 8)
    column.decimal('dollars', 20, 2)
    column.decimal('change', 6, 3)
    column.string('currentPrice')
    column.string('purchasePrice')

  }).then('pool table created')
    .catch(error)
}

function createTable () {
  knex.schema.createTableIfNotExists('market', column => {
    column.string('symbol')
    column.string('time')
    column.string('price')

  }).then('market table created')
    .catch(error)
}

module.exports = {
  raw,
  insert,
  batchInsert,
  select,
  selectRange,
  selectLast,
  deleteFrom,
  resetIncrement
}
