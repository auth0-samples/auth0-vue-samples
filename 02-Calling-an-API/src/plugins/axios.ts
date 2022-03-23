import { App, inject } from "vue";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosStatic } from "axios";
import { useAuth0 } from "@auth0/auth0-vue";

export function createAxios() {
  return {
    install(app: App) {
      app.config.globalProperties["axios"] = axios;
      app.provide("axios", axios);
    },
  };
}

export function useAxios(config?: AxiosRequestConfig): AxiosInstance {
  const axios = inject("axios") as AxiosStatic;
  const { getAccessTokenSilently } = useAuth0();
  const instance = axios.create(config);

  instance.interceptors.request.use(async (config) => {
    const token = await getAccessTokenSilently();

    config.headers = {
      Authorization: `Bearer ${token}`,
      ...config.headers,
    };

    return config;
  });

  return instance;
}
