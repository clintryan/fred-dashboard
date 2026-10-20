import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { once } from 'node:events'

const temp = await mkdtemp(path.join(tmpdir(), 'fred-api-smoke-'))
let child
async function stop() {
  if (!child || child.exitCode !== null) return
  const exited = once(child, 'exit')
  child.kill('SIGTERM')
  await exited
}
async function start() {
  child = spawn(process.execPath, ['server/index.mjs'], {
    cwd: new URL('..', import.meta.url),
    env: {
      ...process.env,
      HABIT_API_PORT: '0',
      HABIT_API_HOST: '127.0.0.1',
      HABIT_DB_PATH: path.join(temp, 'habits.sqlite'),
      HABIT_REMINDERS_ENABLED: 'false',
      TELEGRAM_BOT_TOKEN: '',
      TELEGRAM_CHAT_ID: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  return await new Promise((resolve, reject) => {
    let output = ''
    const timeout = setTimeout(() => reject(new Error('API startup timed out')), 10000)
    child.on('error', (error) => { clearTimeout(timeout); reject(error) })
    child.on('exit', (code) => { clearTimeout(timeout); reject(new Error('API exited: ' + code)) })
    child.stderr.on('data', (data) => { output += data.toString() })
    child.stdout.on('data', (data) => {
      output += data.toString()
      const match = output.match(/listening on (http:\/\/127\.0\.0\.1:\d+)/)
      if (match) { clearTimeout(timeout); resolve(match[1]) }
    })
  })
}
async function request(base, route, payload) {
  const response = await fetch(base + route, payload ? {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  } : {})
  assert.equal(response.status, 200, route)
  return response.json()
}
try {
  let base = await start()
  const summary = await request(base, '/api/habits/summary')
  assert.equal(summary.reminder.enabled, false)
  assert.deepEqual(summary.entries, [])
  const entry = { date: '2000-01-02', journal: ' One\nTwo\nThree\nIgnored', mealPrepAdherence: true, alcoholFree: true, spendingUnder100: false }
  assert.equal((await request(base, '/api/habits/entries', entry)).ok, true)
  const task = { id: 'cloud-smoke-only', status: 'todo', text: 'Disposable test task', tag: 'coder' }
  assert.equal((await request(base, '/api/tasks', task)).ok, true)
  await stop()
  base = await start()
  const saved = (await request(base, '/api/habits/entries/2000-01-02')).entry
  assert.equal(saved.journal, 'One\nTwo\nThree')
  assert.equal(saved.mealPrepAdherence, true)
  assert.equal(saved.spendingUnder100, false)
  assert.equal((await request(base, '/api/tasks')).tasks[0].id, task.id)
  await request(base, '/api/tasks', { ...task, status: 'done' })
  assert.equal((await request(base, '/api/tasks')).tasks[0].status, 'done')
  assert.equal((await request(base, '/api/habits/summary')).reminder.enabled, false)
  console.log('API smoke passed: isolated SQLite writes, restart persistence, task update, reminders disabled')
} finally {
  await stop()
  await rm(temp, { recursive: true, force: true })
}
