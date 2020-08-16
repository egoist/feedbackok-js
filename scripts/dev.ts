import { watch } from 'chokidar'
import express from 'express'
import { ChildProcess, spawn } from 'child_process'

process.env.NODE_ENV = 'development'

let buildCmd: ChildProcess | undefined

function build() {
  if (buildCmd) {
    buildCmd.kill()
  }
  buildCmd = spawn('yarn', ['build'], { stdio: 'inherit' })
}

async function main() {
  build()

  const watcher = watch(['packages/**/*', '!**/{node_modules,dist}/**'], {
    ignoreInitial: true,
  })
  watcher.on('all', () => {
    build()
  })

  const server = express()

  server.use('/', express.static('example'))
  server.use('/cdn', express.static('packages/feedbackok-widget/dist'))

  server.listen(3030)
  console.log(`> http://localhost:3030`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
