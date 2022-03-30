import { useAxios } from '../plugins/axios';
import { AxiosInstance } from 'axios';

export async function getExternal(axios: AxiosInstance)  {
    const { data } = await axios.get("/external");
    return data;
}

export function useExternal() {
    const axios = useAxios({baseURL: '/api'});
    return { get: () => getExternal(axios) };
}