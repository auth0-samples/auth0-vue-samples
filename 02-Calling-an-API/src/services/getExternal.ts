import { AxiosInstance } from 'axios';

export async function getExternal(axios: AxiosInstance)  {
    const { data } = await axios.get("/external");
    return data;
}