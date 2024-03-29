"use client";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import qs from "query-string";
import { env } from "@/env.mjs";

const controller = new AbortController();

export const apiClient = axios.create({
  baseURL: `${env.NEXT_PUBLIC_SITE_URL}/api`,
  headers: { "Content-type": "application/json" },
});

export const queryFn = async <T>(
  url: string,
  queryParams: Record<string, any> | null = {},
  headers = {}
) => {
  const newUrl = qs.stringifyUrl({
    url,
    query: {
      ...queryParams,
    },
  },
  {
    skipEmptyString: true,
    skipNull:true,
  });

  const { data } = await apiClient.get<T>(newUrl, {
    headers: {
      ...headers,
    },
    signal: controller.signal,
  });
  return data;
};
export const useQueryProcessor = <T>(
  url: string,
  queryParams: Record<string, any> | null = {},
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

export type HttpMutationMethod = "DELETE" | "POST" | "PUT" | "PATCH";

export const mutationFn = async <T>(
  url: string,
  queryParams: Record<string, any> | null = {},
  method: HttpMutationMethod,
  value: T,
  headers = {}
) => {
  const newUrl = qs.stringifyUrl({
    url,
    query: { ...queryParams,},
  }, {
    skipEmptyString: true,
    skipNull:true,
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

export const useMutateProcessor = <T, K>(
  url: string,
  queryParams: Record<string, any> | null = {},
  method: HttpMutationMethod,
  key: any[],
  options = {},
  headers = {}
) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: async (value: T) =>
      mutationFn<T>(url, queryParams, method, value, headers) as K,
    onMutate: (data: T) => {
      const previousData = queryClient.getQueryData<T>(key);
      const isArray = Array.isArray(previousData);
      //checking if the previous data is an array type if yes then update the array data
      if (isArray) {
        queryClient.setQueryData(key, (old: (T | any)[]) => {
          if (method === "DELETE") {
            // if delete method we assume it's an id to delete
            return old.filter((value) => value?.id != data);
          }
          if (method === "POST") {
            // else its an object of new data
            if (Array.isArray(data)) {
              return [...old, ...data];
            } else {
              return [...old, data];
            }
          }
        });
      }
      // else {
      //   // if not then update the single object data with the new data
      //   queryClient.setQueryData(key, data);
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
    onSettled: async (data) => {
      console.log(" 🚀 settled mutate processor 🚀");
      return await queryClient.invalidateQueries({
        queryKey: key,
      });
    },
  });
};
