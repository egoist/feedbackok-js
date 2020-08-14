import { watch } from 'rollup'
import express from 'express'

process.env.NODE_ENV = 'development'

const { default: configs } = require('../rollup.config')

async function main() {
  watch(configs).on('event', (event) => {
    if (event.code === 'ERROR') {
      console.error(event.error)
      process.exitCode = 1
    }
  })

  const server = express()

  server.use('/', express.static('example'))
  server.use('/cdn', express.static('public'))

  server.listen(3030)
  console.log(`> http://localhost:3030`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
