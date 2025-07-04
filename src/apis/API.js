import axios from 'axios';
const axiosInstances = {};

export const BASE_URL = 'http://18.191.105.81:3004';
 
// export const BASE_URL = 'https://adminapi.thefairrummy.com';
// admin.thefairrummy.com ---> frontend page

// adminapi.thefairrummy.com ---> admin:3004
 

export const getAxiosInstance = (baseUrl) => {
    // let base = 'http://3.12.20.117:3004/api/v1'// prod-io
 //let base = 'http://18.191.105.81:3004/api/v1'// stg-ip
    let base = BASE_URL + '/api/v1'
    if (!axiosInstances[base]) {
        axiosInstances[base] = axios.create({
            baseURL: base,

        });
    }

    return axiosInstances[base];
};
