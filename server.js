const server = require('express')()
const cors = require('cors')

const port = process.env.PORT || 8080

server.use(cors())
server.use('/', require('./routes'))

server.listen(port, console.log(`server listening on port ${port}`))

module.exports = server
