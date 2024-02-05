import queryString from "query-string";
import { METHOD } from "../const/app-const";
import { toast } from "react-toastify";

export interface searchProps {
  params?: any;
  header?: any;
}

export const ApiService = (endpoint: string) => {
  const BASE_URL = "http://localhost:8080/v1";
  const BASE_ENDPOINT: string | undefined = endpoint ?? "";

  const request = {
    get: async (endpoint: string, headers?: any, config?: any) => {
      try {
        const response = await fetch(endpoint, {
          method: METHOD.GET,
          headers: {
            ...headers,
          },
          ...config,
        });
        const result = await response.json();
        if (result.status === false) {
          throw { message: "API error", data: {} };
        }
        return result.data;
      } catch (error) {
        throw { message: "Network error", error };
      }
    },

    post: async (endpoint: string, data: any, config?: any) => {
      try {
        const response = await fetch(endpoint, {
          method: METHOD.POST,
          headers: {
            "content-type": "application/json",
            ...config,
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.status === false) {
          if (typeof result.message === "string") {
            toast.error(result.message);
          } else toast.error(result.message[0]);
          throw { message: "API error", data: {} };
        }
        return result;
      } catch (error) {
        throw { message: "Network error", error };
      }
    },

    put: async (endpoint: string, data: any, config?: any) => {
      try {
        const response = await fetch(endpoint, {
          method: METHOD.PUT,
          headers: {
            "content-type": "application/json",
            ...config,
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.status === false) {
          if (typeof result.message === "string") {
            toast.error(result.message);
          } else toast.error(result.message[0]);
          throw { message: "API error", data: {} };
        }
        return result;
      } catch (error) {
        throw { message: "Network error", error };
      }
    },

    delete: async (endpoint: string, config?: any) => {
      try {
        const response = await fetch(endpoint, {
          method: METHOD.DELETE,
          headers: {
            ...config,
          },
        });
        const result = await response.json();
        if (result.status === false) {
          throw { message: "API error", data: {} };
        }
        return result;
      } catch (error) {
        throw { message: "Network error", error };
      }
    },
  };

  const search = async ({ params, header }: searchProps) => {
    const convertParams = queryString.stringify(
      params ?? { page: 1, pageSize: 10 }
    );
    const endpoint = `${BASE_URL}/${BASE_ENDPOINT}?${convertParams}`;
    return request.get(endpoint, header);
  };

  const find = async (id: string, config?: any) => {
    const endpoint = `${BASE_URL}/${BASE_ENDPOINT}/${id}`;
    return request.get(endpoint, {}, config);
  };

  const remove = async (id: string, config?: any) => {
    const endpoint = `${BASE_URL}/${BASE_ENDPOINT}/${id}`;
    return request.delete(endpoint, config);
  };

  const save = async (data: any, config?: any) => {
    let endpoint = `${BASE_URL}/${BASE_ENDPOINT}`;

    if (data?.id) {
      return request.put(endpoint, data, config);
    }
    return request.post(endpoint, data, config);
  };

  const update = async (data: any, config?: any) => {
    const endpoint = `${BASE_URL}/${BASE_ENDPOINT}`;
    return request.put(endpoint, data, config);
  };

  return { search, update, find, remove, save };
};
