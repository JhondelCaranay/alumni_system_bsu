"use client";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import qs from "query-string";

const controller = new AbortController();

export const apiClient = axios.create({
  // baseURL: "http://localhost:3000/api",
  baseURL: "api",
  headers: { "Content-type": "application/json" },
});

export const queryFn = async <T>(url: string, queryParams: Record<string, any>, headers = {}) => {
  const newUrl = qs.stringifyUrl({
    url,
    query: {
      ...queryParams,
    },
  });

  const { data } = await apiClient.get<T>(newUrl, {
    headers: {
      ...headers,
    },
    signal: controller.signal,
  });
  return data;
};
export const query = <T>(
  url: string,
  queryParams: Record<string, any>,
  key: any[] = [],
  options = {},
  headers = {}
) => {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => queryFn(url, queryParams, headers),
    ...options,
  });
};

type HttpMutationMethod = "DELETE" | "POST" | "PUT" | "PATCH";

export const mutationFn = async <T>(
  url: string,
  queryParams: Record<string, any>,
  method: HttpMutationMethod,
  value: T,
  headers = {}
) => {
  const newUrl = qs.stringifyUrl({
    url,
    query: {
      ...queryParams,
    },
  });
  switch (method) {
    case "DELETE": {
      const { data } = await apiClient.delete<T>(newUrl, {
        headers: {
          ...headers,
        },
        signal: controller.signal,
      });
      return data;
    }

    case "PATCH": {
      const { data } = await apiClient.patch<T>(newUrl, value, {
        headers: {
          ...headers,
        },
        signal: controller.signal,
      });
      return data;
    }
    case "POST": {
      const { data } = await apiClient.post<T>(newUrl, value, {
        headers: {
          ...headers,
        },
        signal: controller.signal,
      });
      return data;
    }
    case "PUT": {
      const { data } = await apiClient.put<T>(newUrl, value, {
        headers: {
          ...headers,
        },
        signal: controller.signal,
      });
      return data;
    }
    default:
      throw new Error("Invalid mutation method");
  }
};

export const mutate = <T, K>(
  url: string,
  queryParams: Record<string, any>,
  method: HttpMutationMethod,
  key: string[],
  options = {},
  headers = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async (value: T) => mutationFn<T>(url, queryParams, method, value, headers) as K,
    // When mutate is called:
    onMutate: (newData: T) => {
      // Snapshot the previous value
      const previousData = queryClient.getQueryData<T | T[]>(key);

      // Optimistically update to the new value
      queryClient.setQueryData(key, (old: T[]) => [...old, newData]);

      // const isArray = Array.isArray(previousData);

      // //checking if the previous data is an array type if yes then update the array data
      // if (isArray) {
      //   queryClient.setQueryData(key, (old) => {
      //     return [...old, newData];
      //   });
      // } else {
      //   // if not then update the single object data with the new data
      //   queryClient.setQueryData(key, newData);
      // }
      return { previousData };
    },
    onError: (err, newTodo, context) => {
      if (axios.isAxiosError(err)) {
        // err.response?.data.message if nestjs backend
        // err.response?.data if nextjs backend
        console.error(err.response?.data);
        // toast.error(err.response?.data)
      } else {
        console.error(err);
      }

      queryClient.setQueryData(key, context?.previousData);
      console.log(" 🚀 error mutate processor 🚀");
    },
    onSuccess(data, variables, context) {
      console.log(" 🚀 success mutate processor 🚀");
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({
        queryKey: key,
      });
      console.log(" 🚀 settled mutate processor 🚀");
    },
  });
};
