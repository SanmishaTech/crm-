import axios, { AxiosError } from "axios";
import { useEffect, useRef } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { toast } from "sonner";

interface ParamsType {
  queryKey?: string | string[];
  headers?: Record<string, string>;
  queryKeyId?: number | string | undefined;
  retry?: number;
  refetchOnWindowFocus?: boolean;
  enabled?: boolean;
  onSuccess?: (data: Response) => void;
  onError?: (error: AxiosError) => void;
}

const fetchData = async ({
  endpoint,
  headers,
}: {
  endpoint: string;
  headers?: Record<string, string>;
}): Promise<Response> => {
  const config = headers ? { headers } : {};
  const response = await axios.get<Response>(endpoint, config);
  return response.data;
};

// Custom hook to fetch data
const useGetData = ({
  endpoint,
  params,
}: {
  endpoint: string;
  params: ParamsType;
}): UseQueryResult<Response, AxiosError> => {
  const onSuccessRef = useRef<ParamsType["onSuccess"]>(params.onSuccess);
  const onErrorRef = useRef<ParamsType["onError"]>(params.onError);

  useEffect(() => {
    onSuccessRef.current = params.onSuccess;
  }, [params.onSuccess]);

  useEffect(() => {
    onErrorRef.current = params.onError;
  }, [params.onError]);

  const queryResult = useQuery<Response, AxiosError>({
    queryKey: Array.isArray(params.queryKey) ? params.queryKey : [params.queryKey],
    queryFn: () =>
      fetchData({
        endpoint,
        headers: params.headers ?? {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }),
    retry: params.retry ?? 1,
    refetchOnWindowFocus: params.refetchOnWindowFocus ?? true,
    enabled: params.enabled ?? true,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  useEffect(() => {
    if (queryResult.isSuccess) {
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

export { useGetData };
