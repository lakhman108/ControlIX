import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { getLocalStorage } from "../slices/authSlice";
import Cookies from "js-cookie";

interface PingResponse {
  status: string;
}

export const headerApi = createApi({
  reducerPath: "headerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:8082/api/v1/",
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (build) => ({
    pingUserCheck: build.query<boolean, void>({
      query: () => ({
        url: "pingUserCheck/",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response: PingResponse) => {
        console.log("Response Got from apiWithHeaderSlice: ", response);
        return response.status === "200";
      },
    }),
  }),
});

// export react hook
export const { usePingUserCheckQuery } = headerApi;
