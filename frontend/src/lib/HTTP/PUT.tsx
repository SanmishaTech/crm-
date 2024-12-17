import React, { useMemo } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";

// Define types for request and response data
interface RequestData {
  [key: string]: any;
}

interface ParamsType {
  headers?: Record<string, string>;
  queryKey?: string | string[];
  onSuccess?: (data: AxiosResponse<Response>) => void;
  onError?: (error: AxiosError) => void;
  retry?: number;
}

// Memoized POST function
const postData = (() => {
  const memoizedResponses = new Map<string, Promise<AxiosResponse<Response>>>();

  return async ({
    endpoint,
    data,
    headers,
  }: {
    endpoint: string;
    data: RequestData;
    headers?: Record<string, string>;
  }): Promise<AxiosResponse<Response>> => {
    const cacheKey = `${endpoint}-${JSON.stringify(data)}-${JSON.stringify(
      headers
    )}`;

    if (memoizedResponses.has(cacheKey)) {
      return memoizedResponses.get(cacheKey)!;
    }

    const config = headers ? { headers } : {};
    const request = axios
      .put<Response>(endpoint, data, config)
      .then((res) => res.data);

    memoizedResponses.set(cacheKey, request);
    return request;
  };
})();

// Custom hook to handle PUT requests
const usePutData = (() => {
  const memoizedHooks = new Map<
    string,
    UseMutationResult<AxiosResponse<Response>, AxiosError, RequestData>
  >();

  return ({
    endpoint,
    params,
  }: {
    endpoint: string;
    params: ParamsType;
  }): UseMutationResult<AxiosResponse<Response>, AxiosError, RequestData> => {
    const cacheKey = `${endpoint}-${JSON.stringify(params)}`;

    if (memoizedHooks.has(cacheKey)) {
      return memoizedHooks.get(cacheKey)!;
    }

    const mutation = useMutation<
      AxiosResponse<Response>,
      AxiosError,
      RequestData
    >({
      mutationFn: (data) =>
        postData({
          endpoint,
          data,
          headers: params.headers ?? {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }),
      onSuccess:
        params.onSuccess ??
        (() => {
          toast.success("Data updated successfully");
        }),

      onError:
        params.onError ?? ((error: AxiosError) => toast.error(error.message)),
      retry: params.retry ?? 3,
      onSettled: (data) => {
        console.log(data);
      },
    });

    memoizedHooks.set(cacheKey, mutation);
    return mutation;
  };
})();

export { usePutData };
