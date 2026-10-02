import { createApp } from './app.js'
import { config, features } from './config/env.js'

const app = createApp()

app.listen(config.port, () => {
  console.log(`\n  AI Agent Platform backend`)
  console.log(`  ➜ http://localhost:${config.port}`)
  console.log(`  features:`, features, '\n')
})
