import { FERTILIZERS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const fertilizersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFertilizers: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: FERTILIZERS_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Fertilizers'],
    }),
    getFertilizerDetails: builder.query({
      query: (fertilizerId) => ({
        url: `${FERTILIZERS_URL}/${fertilizerId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createFertilizer: builder.mutation({
      query: () => ({
        url: `${FERTILIZERS_URL}`,
        method: 'POST',
      }),
      invalidatesTags: ['Fertilizer'],
    }),
    updateFertilizer: builder.mutation({
      query: (data) => ({
        url: `${FERTILIZERS_URL}/${data.fertilizerId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Fertilizers'],
    }),
    uploadFertilizerImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    deleteFertilizer: builder.mutation({
      query: (fertilizerId) => ({
        url: `${FERTILIZERS_URL}/${fertilizerId}`,
        method: 'DELETE',
      }),
      providesTags: ['Fertilizer'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${FERTILIZERS_URL}/${data.fertilizerId}/reviews`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Fertilizer'],
    }),
    getTopFertilizers: builder.query({
      query: () => `${FERTILIZERS_URL}/top`,
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useGetFertilizersQuery,
  useGetFertilizerDetailsQuery,
  useCreateFertilizerMutation,
  useUpdateFertilizerMutation,
  useUploadFertilizerImageMutation,
  useDeleteFertilizerMutation,
  useCreateReviewMutation,
  useGetTopFertilizersQuery,
} = fertilizersApiSlice;
