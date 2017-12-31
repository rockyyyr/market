const schedule = require('node-schedule')

const runtimes = '0,5,10,15,20,25,30,35,40,45,50,55'

schedule.scheduleJob(`${runtimes} * * * *`, () => {
  console.log(`running at ${new Date()}`)
})
