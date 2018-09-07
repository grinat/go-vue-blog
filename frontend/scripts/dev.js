const { spawn } = require('child_process');
const commands = [
  ['docker-compose', ['-f', 'docker/dev/docker-compose.yml', 'up']],
  ['npm', ['--prefix', 'frontend', 'run', 'serve']],
  /* ['fresh'] */
]
const runners = []

const log = (data) => {
  console.log(`${data}`)
}

const errAndExit = (err) => {
  console.error(err)
  process.exit(1)
}

const closeAll = () => {
  runners.forEach(({proc, name}) => {
    try {
      proc.kill('SIGHUP')
      console.log(name, 'stopped')
    } catch (e) {
      console.log('Failed to kill', name, e.toString())
    }
  })
}

const handledExitCodes = [
  'exit',
  'SIGTERM',
  'SIGINT',
  'SIGBREAK',
  'SIGHUP'
]
handledExitCodes.forEach(code => {
  process.on(code, closeAll)
})

commands.forEach(cmd => {
  let proc = spawn(cmd[0], cmd[1])
  runners.push({
    proc,
    name: cmd[0]
  })
  proc.stdout.on('data', log)
  proc.stdout.on('error', errAndExit)
  proc.stdout.on('close', (data) => {
    console.warn(`${cmd[0]}: ${data}`)
    process.exit(1)
  })
})
