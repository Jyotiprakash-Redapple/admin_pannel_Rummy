import axios from 'axios';
const axiosInstances = {};

export const getAxiosInstance = (baseUrl) => {
    let base = 'http://3.12.20.117:3004/api/v1'
    if (!axiosInstances[base]) {
        axiosInstances[base] = axios.create({
            baseURL: base,

        });
    }

    return axiosInstances[base];
};
