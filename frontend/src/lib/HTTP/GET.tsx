import axios, { AxiosError } from "axios";
import { useEffect, useRef } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface ParamsType<T = any> {
  queryKey?: any[];
  headers?: Record<string, string>;
  queryKeyId?: number | string | undefined;
  retry?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
  staleTime?: number;
  gcTime?: number;
}

const fetchData = async <T = any>({
  endpoint,
  headers,
}: {
  endpoint: string;
  headers?: Record<string, string>;
}): Promise<T> => {
  const config = headers ? { headers } : {};
  const response = await axios.get<T>(endpoint, config);
  return response.data;
};

// Custom hook to fetch data
export const useGetData = <T = any>({
  endpoint,
  params,
}: {
  endpoint: string;
  params: ParamsType<T>;
}): UseQueryResult<T, AxiosError> => {
  const onSuccessRef = useRef<ParamsType<T>["onSuccess"]>(params.onSuccess);
  const onErrorRef = useRef<ParamsType<T>["onError"]>(params.onError);

  useEffect(() => {
    onSuccessRef.current = params.onSuccess;
  }, [params.onSuccess]);

  useEffect(() => {
    onErrorRef.current = params.onError;
  }, [params.onError]);

  const queryResult = useQuery<T, AxiosError>({
    queryKey: Array.isArray(params.queryKey) ? params.queryKey : [params.queryKey],
    queryFn: () =>
      fetchData<T>({
        endpoint,
        headers: params.headers ?? {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }),
    retry: params.retry ?? 1,
    refetchOnWindowFocus: params.refetchOnWindowFocus ?? true,
    enabled: params.enabled ?? true,
    staleTime: params.staleTime ?? 5 * 60 * 1000,
    gcTime: params.gcTime ?? 10 * 60 * 1000,
  });

  useEffect(() => {
    if (queryResult.isSuccess && queryResult.data !== undefined) {
      onSuccessRef.current?.(queryResult.data);
    }
  }, [queryResult.isSuccess, queryResult.data]);

  useEffect(() => {
    if (queryResult.isError) {
      onErrorRef.current?.(queryResult.error);
    }
  }, [queryResult.isError, queryResult.error]);

  return queryResult;
};
