import { PRICE_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const priceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPriceList: builder.query({
      query: ({ keyword, pageNumber }) => ({
        url: PRICE_URL,
        params: { keyword, pageNumber },
      }),
      keepUnusedDataFor: 5,
      providesTags: ['Price'],
    }),
    getPriceListDetails: builder.query({
      query: (priceId) => ({
        url: `${PRICE_URL}/${priceId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createPriceList: builder.mutation({
      query: () => ({
        url: `${PRICE_URL}`,
        method: 'POST',
      }),
      invalidatesTags: ['Price'],
    }),
    updatePriceList: builder.mutation({
      query: (data) => ({
        url: `${PRICE_URL}/${data.priceId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Price'],
    }),
    uploadPriceListImage: builder.mutation({
      query: (data) => ({
        url: `/api/upload`,
        method: 'POST',
        body: data,
      }),
    }),
    deletePriceList: builder.mutation({
      query: (priceId) => ({
        url: `${PRICE_URL}/${priceId}`,
        method: 'DELETE',
      }),
      providesTags: ['Price'],
    }),
  }),
});

export const {
  useGetPriceListQuery,
  useGetPriceListDetailsQuery,
  useCreatePriceListMutation,
  useUpdatePriceListMutation,
  useUploadPriceListImageMutation,
  useDeletePriceListMutation,
} = priceApiSlice;
