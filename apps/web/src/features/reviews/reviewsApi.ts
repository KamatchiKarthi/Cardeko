import type {
  ApiResponse,
  CreateReviewPayload,
  ICarReview,
  PaginatedResponse,
  ReviewListParams,
} from '@cardeko/types'

import { baseApi } from '@/store/api'
import { buildSearchParams } from '@/utils/query.utils'

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCarReviews: builder.query<PaginatedResponse<ICarReview>, ReviewListParams>({
      query: ({ carId, page, pageSize, sortBy }) => {
        const params = buildSearchParams({ page, pageSize, sortBy })
        return `/cars/${carId}/reviews${params ? `?${params}` : ''}`
      },
      providesTags: (result, _error, { carId }) =>
        result
          ? [
              ...result.data.map((review) => ({ type: 'Review' as const, id: review._id })),
              { type: 'Review', id: carId },
            ]
          : [{ type: 'Review', id: carId }],
    }),

    createReview: builder.mutation<ICarReview, { carId: string; payload: CreateReviewPayload }>({
      query: ({ carId, payload }) => ({
        url: `/cars/${carId}/reviews`,
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: ApiResponse<ICarReview>) => response.data,
      invalidatesTags: (_result, _error, { carId }) => [{ type: 'Review', id: carId }],
    }),
  }),
})

export const { useGetCarReviewsQuery, useCreateReviewMutation } = reviewsApi
