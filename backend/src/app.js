import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { config } from './config/env.js'
import routes from './routes/index.js'
import { auth } from './middleware/auth.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.use(cors({ origin: config.corsOrigin }))
  app.use(express.json({ limit: '1mb' }))
  app.use(morgan('dev'))
  app.use(auth)

  app.use('/', routes)

  app.use(notFound)
  app.use(errorHandler)

  return app
}
