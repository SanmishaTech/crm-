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
const memoize = <T extends (...args: any[]) => Promise<any>>(fn: T): T => {
  const cache = new Map<string, Promise<any>>();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

const postData = memoize(
  async ({
    endpoint,
    data,
    headers,
  }: {
    endpoint: string;
    data: RequestData;
    headers?: Record<string, string>;
  }): Promise<AxiosResponse<Response>> => {
    const config = headers ? { headers } : {};
    const response = await axios.put<Response>(endpoint, data, config);
    return response.data;
  }
);

// Memoize the custom hook
const memoizeHook = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map<string, any>();
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Custom hook to handle PUT requests
const usePutData = memoizeHook(
  ({
    endpoint,
    params,
  }: {
    endpoint: string;
    params: ParamsType;
  }): UseMutationResult<AxiosResponse<Response>, AxiosError, RequestData> => {
    return useMutation<AxiosResponse<Response>, AxiosError, RequestData>({
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
  }
);

export { usePutData };
