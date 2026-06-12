import type { Request, Response } from 'express'

import { connectDB, getDBStatus, getLastDBError } from '../../db/mongoose'

export async function getHealth(_req: Request, res: Response) {
  // Serverless cold starts can miss the module-load connect — retry on demand
  if (getDBStatus() === 'disconnected') {
    await connectDB().catch(() => {})
  }

  const dbStatus = getDBStatus()
  const isHealthy = dbStatus === 'connected'
  const mem = process.memoryUsage()

  const mb = (bytes: number) => Math.round(bytes / 1024 / 1024)

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    status: isHealthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV,
    node: process.version,
    services: {
      database: {
        status: dbStatus,
        healthy: isHealthy,
        lastError: getLastDBError(),
      },
    },
    memory: {
      heapUsedMb: mb(mem.heapUsed),
      heapTotalMb: mb(mem.heapTotal),
      rssMb: mb(mem.rss),
      externalMb: mb(mem.external),
    },
  })
}
