import { Router } from 'express'

import { carRouter } from './modules/car'
import { healthRouter } from './modules/health'

/**
 * Master API router.
 * Mounted at /api in app.ts — add new module routers here.
 */
export const apiRouter = Router()

apiRouter.use('/health', healthRouter)
apiRouter.use('/cars', carRouter)
