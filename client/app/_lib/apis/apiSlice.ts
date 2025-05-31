import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const normalApi = createApi({
  reducerPath: 'normalApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:8082/api/v1/', 
  }),
  endpoints: (build) => ({
    websiteVisitCount: build.query({
      query: () => ({
        url: 'websiteVisitCount/',
        method: 'GET',
        credentials: "include",
      })
    }),
  }),
})

// export react hook
export const { useWebsiteVisitCountQuery } = normalApi