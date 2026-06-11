import type {
  ApiResponse,
  CarSearchParams,
  CollectionLimitParams,
  ICar,
  ICarListItem,
  ICarSummary,
  IHomeStats,
  IPopularBrand,
  IRecommendedCar,
  PaginatedResponse,
  PopularBrandsParams,
  RecommendParams,
} from '@cardeko/types'

import { baseApi } from '@/store/api'
import { buildSearchParams } from '@/utils/query.utils'

export const carsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Collections ───────────────────────────────────────────────────────────

    getCars: builder.query<PaginatedResponse<ICarListItem>, CarSearchParams>({
      query: (params) => `/cars?${buildSearchParams(params)}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((car) => ({ type: 'Car' as const, id: car._id })),
              { type: 'Car', id: 'LIST' },
            ]
          : [{ type: 'Car', id: 'LIST' }],
    }),

    getPopularCars: builder.query<ICarSummary[], number | CollectionLimitParams>({
      query: (arg) => {
        const limit = typeof arg === 'number' ? arg : (arg.limit ?? 10)
        return `/cars/popular?limit=${limit}`
      },
      transformResponse: (response: ApiResponse<ICarSummary[]>) => response.data,
      providesTags: [{ type: 'Car', id: 'POPULAR' }],
    }),

    getTrendingCars: builder.query<ICarSummary[], number | CollectionLimitParams>({
      query: (arg) => {
        const limit = typeof arg === 'number' ? arg : (arg.limit ?? 10)
        return `/cars/trending?limit=${limit}`
      },
      transformResponse: (response: ApiResponse<ICarSummary[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map((car) => ({ type: 'Car' as const, id: car._id })),
              { type: 'Car', id: 'TRENDING' },
            ]
          : [{ type: 'Car', id: 'TRENDING' }],
    }),

    getPremiumCars: builder.query<ICarSummary[], number | CollectionLimitParams>({
      query: (arg) => {
        const limit = typeof arg === 'number' ? arg : (arg.limit ?? 10)
        return `/cars/premium?limit=${limit}`
      },
      transformResponse: (response: ApiResponse<ICarSummary[]>) => response.data,
      providesTags: [{ type: 'Car', id: 'PREMIUM' }],
    }),

    getBudgetCars: builder.query<ICarSummary[], number | CollectionLimitParams>({
      query: (arg) => {
        const limit = typeof arg === 'number' ? arg : (arg.limit ?? 10)
        return `/cars/budget?limit=${limit}`
      },
      transformResponse: (response: ApiResponse<ICarSummary[]>) => response.data,
      providesTags: [{ type: 'Car', id: 'BUDGET' }],
    }),

    getUpcomingLaunches: builder.query<ICarSummary[], number | CollectionLimitParams>({
      query: (arg) => {
        const limit = typeof arg === 'number' ? arg : (arg.limit ?? 10)
        return `/cars/upcoming?limit=${limit}`
      },
      transformResponse: (response: ApiResponse<ICarSummary[]>) => response.data,
      providesTags: [{ type: 'Car', id: 'UPCOMING' }],
    }),

    getHomeStats: builder.query<IHomeStats, void>({
      query: () => '/cars/stats',
      transformResponse: (response: ApiResponse<IHomeStats>) => response.data,
    }),

    getPopularBrands: builder.query<IPopularBrand[], PopularBrandsParams>({
      query: ({ bodyType, limit = 12 }) => {
        const params: Record<string, string | number> = { limit }
        if (bodyType) params.bodyType = bodyType
        return `/cars/brands/popular?${buildSearchParams(params)}`
      },
      transformResponse: (response: ApiResponse<IPopularBrand[]>) => response.data,
      providesTags: [{ type: 'CarMake', id: 'POPULAR' }],
    }),

    // ── Recommendation ──────────────────────────────────────────────────────────

    getRecommendations: builder.query<IRecommendedCar[], RecommendParams>({
      query: (params) => `/cars/recommend?${buildSearchParams(params)}`,
      transformResponse: (response: ApiResponse<IRecommendedCar[]>) => response.data,
    }),

    postRecommendations: builder.mutation<IRecommendedCar[], RecommendParams>({
      query: (body) => ({
        url: '/cars/recommend',
        method: 'POST',
        body,
      }),
      transformResponse: (response: ApiResponse<IRecommendedCar[]>) => response.data,
    }),

    // ── Single car ──────────────────────────────────────────────────────────────

    getCarById: builder.query<ICar, string>({
      query: (id) => `/cars/${id}`,
      transformResponse: (response: ApiResponse<ICar>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Car', id }],
    }),
  }),
})

export const {
  useGetCarsQuery,
  useGetPopularCarsQuery,
  useGetTrendingCarsQuery,
  useGetPremiumCarsQuery,
  useGetBudgetCarsQuery,
  useGetUpcomingLaunchesQuery,
  useGetHomeStatsQuery,
  useGetPopularBrandsQuery,
  useGetRecommendationsQuery,
  usePostRecommendationsMutation,
  useGetCarByIdQuery,
  useLazyGetCarsQuery,
  useLazyGetRecommendationsQuery,
} = carsApi
