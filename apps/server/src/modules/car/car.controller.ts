import type { Request, Response } from 'express'

import { getParam, getQuery } from '../../utils/request'
import * as carService from './car.service'
import type {
  CollectionQuery,
  GetAllCarsQuery,
  PopularBrandsQuery,
  RecommendQuery,
} from './car.schema'

// ── Helpers ───────────────────────────────────────────────────────────────────

type Meta = Record<string, string>

function buildMeta(total: number, page: number, totalPages: number): Meta | null {
  if (total === 0) {
    return { hint: 'No cars matched your filters. Try broadening your search criteria.' }
  }
  if (page > totalPages) {
    return { warning: `Page ${page} is out of range — total pages: ${totalPages}` }
  }
  return null
}

// ── Car controllers ───────────────────────────────────────────────────────────

export async function getAllCars(req: Request, res: Response) {
  const query = getQuery<GetAllCarsQuery>(req)
  const result = await carService.getAllCars(query)
  const meta = buildMeta(result.total, query.page, result.totalPages)

  res.json({
    success: true,
    message: result.total === 0 ? 'No cars found' : 'Cars fetched successfully',
    ...result,
    ...(meta && { meta }),
  })
}

export async function getTrendingCars(req: Request, res: Response) {
  const data = await carService.getTrendingCars(getQuery<CollectionQuery>(req))
  res.json({
    success: true,
    message: data.length === 0 ? 'No trending cars at the moment' : 'Trending cars',
    data,
  })
}

export async function getPopularCars(req: Request, res: Response) {
  const data = await carService.getPopularCars(getQuery<CollectionQuery>(req))
  res.json({
    success: true,
    message: data.length === 0 ? 'No cars available' : 'Popular cars',
    data,
  })
}

export async function getPremiumCars(req: Request, res: Response) {
  const data = await carService.getPremiumCars(getQuery<CollectionQuery>(req))
  res.json({
    success: true,
    message: data.length === 0 ? 'No premium cars available' : 'Premium cars',
    data,
  })
}

export async function getBudgetCars(req: Request, res: Response) {
  const data = await carService.getBudgetCars(getQuery<CollectionQuery>(req))
  res.json({
    success: true,
    message: data.length === 0 ? 'No budget cars available' : 'Budget cars',
    data,
  })
}

export async function getUpcomingLaunches(req: Request, res: Response) {
  const data = await carService.getUpcomingLaunches(getQuery<CollectionQuery>(req))
  res.json({
    success: true,
    message: data.length === 0 ? 'No upcoming launches' : 'Upcoming launches',
    data,
  })
}

export async function getPopularBrands(req: Request, res: Response) {
  const data = await carService.getPopularBrands(getQuery<PopularBrandsQuery>(req))
  res.json({
    success: true,
    message: data.length === 0 ? 'No brands found' : 'Popular brands fetched successfully',
    data,
  })
}

export async function getHomeStats(_req: Request, res: Response) {
  const data = await carService.getHomeStats()
  res.json({ success: true, message: 'Home stats fetched successfully', data })
}

export async function getCarById(req: Request, res: Response) {
  const car = await carService.getCarById(getParam(req, 'id'))
  res.json({ success: true, message: 'Car fetched successfully', data: car })
}

function buildRecommendResponse(
  results: Awaited<ReturnType<typeof carService.getRecommendations>>
) {
  return {
    success: true,
    message:
      results.length === 0
        ? 'No matching cars found — try adjusting your budget or preferences'
        : `Found ${results.length} recommended car${results.length > 1 ? 's' : ''} for you`,
    data: results.map((result) => ({
      ...result.car,
      _recommendScore: result.score,
      _matchPercent: result.matchPercent,
    })),
    meta: {
      scoringBreakdown: {
        budget: '30 pts — price within range',
        fuel: '25 pts — fuel type match',
        useCase: '25 pts — body type fits use case',
        seating: '15 pts — seating capacity ≥ requested',
        priority: '10 pts — car excels in your priority field',
      },
    },
  }
}

export async function getRecommendations(req: Request, res: Response) {
  const query = getQuery<RecommendQuery>(req)
  const results = await carService.getRecommendations(query)
  res.json(buildRecommendResponse(results))
}

export async function postRecommendations(req: Request, res: Response) {
  const body = req.body as RecommendQuery
  const results = await carService.getRecommendations(body)
  res.json(buildRecommendResponse(results))
}
