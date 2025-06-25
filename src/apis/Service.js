// import API from "./API";
import { getAxiosInstance } from "./API";

const Service = {

    //Get
    apiGetCallRequest: function (url, accessToken) {
        const Instance = getAxiosInstance(import.meta.env.VITE_ADMIN_API_BASE_URL); //client base url
        return new Promise((resolve, reject) => {
            Instance.get(`${url}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${accessToken}`,
                },
            })
                .then((res) => resolve(res.data))
                .catch((error) => {
                    reject(error)
                    if (error.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                        window.location.reload();
                    }
                });
        });
    },

    //Post
    apiPostCallRequest: function (url, body = null, accessToken) {
        console.log(body, "body", url)
        const Instance = getAxiosInstance(import.meta.env.VITE_ADMIN_API_BASE_URL); //client base url
        return new Promise((resolve, reject) => {
            Instance.post(`${url}`, body, {
                headers: {
                    "Content-Type": "application/json",
                  Authorization: `${accessToken}`,
                },
            })
                .then((res) => resolve(res.data))
                .catch((error) => {
                    reject(error)
                    if (error.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                        window.location.reload();
                    }
                });
        });
    },

    //Post for change password
    apiPostCallRequestWithAuthBaseUrl: function (url, body = null, accessToken) {
        const Instance = getAxiosInstance(import.meta.env.VITE_AUTH_API_BASE_URL); //auth base url
        return new Promise((resolve, reject) => {
            Instance.post(`${url}`, body, {
                headers: {
                    "Content-Type": "application/json",
                   Authorization: `${accessToken}`,
                },
            })
                .then((res) => resolve(res.data))
                .catch((error) => {
                    reject(error)
                    if (error.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                        window.location.reload();
                    }
                });
        });
    },
    //Post bolb for file/pdf
    apiPostBolbCallRequest: function (url, body = null, accessToken) {
        const Instance = getAxiosInstance(import.meta.env.VITE_CLIENT_API_BASE_URL); //client base url
        return new Promise((resolve, reject) => {
            Instance.post(`${url}`, body, {
                headers: {
                    "Content-Type": "application/json",
                   Authorization: `${accessToken}`,
                },
                responseType: 'arraybuffer'//'blob'
            })
                .then((res) => resolve(res.data))
                .catch((error) => {
                    reject(error)
                    if (error.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                        window.location.reload();
                    }
                });
            // .catch((error) => reject(error));
        });
    },
    //Delete
    apiDeleteCallRequest: function (url, params, accessToken) {
        const Instance = getAxiosInstance(import.meta.env.VITE_CLIENT_API_BASE_URL); //client base url
        return new Promise((resolve, reject) => {
            Instance.delete(`${url}` + params, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${accessToken}`,
                },
            })
                .then((res) => resolve(res.data))
                .catch((error) => {
                    reject(error)
                    if (error.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                        window.location.reload();
                    }
                });
            // .catch((error) => reject(error));
        });
    },
    //Put
    apiPutCallRequest: function (url, body = null, accessToken) {
        const Instance = getAxiosInstance(import.meta.env.VITE_CLIENT_API_BASE_URL); //client base url
        return new Promise((resolve, reject) => {
            Instance.put(`${url}`, body, {
                headers: {
                    "Content-Type": "application/json",
                   Authorization: `${accessToken}`,
                },
            })
                .then((res) => resolve(res.data))
                .catch((error) => {
                    reject(error)
                    if (error.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                        window.location.reload();
                    }
                });
        });
    },



    //FormData
    apiPostCallFormDataRequest: function (url, body = null, accessToken) {
        const Instance = getAxiosInstance(import.meta.env.VITE_CLIENT_API_BASE_URL); //client base url
        return new Promise((resolve, reject) => {
            Instance.post(`${url}`, body, {
                headers: {
                    "Content-Type": "application/form-data",
                   Authorization: `${accessToken}`,
                },
            })
                .then((res) => resolve(res.data))
                .catch((error) => {
                    reject(error)
                    if (error.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                        window.location.reload();
                    }
                });
            // .catch((error) => reject(error));
        });
    },



    //Get Without Token
    apiGetCallRequestWithoutToken: function (url) {
        const Instance = getAxiosInstance(import.meta.env.VITE_AUTH_API_BASE_URL); //auth base url
        return new Promise((resolve, reject) => {
            Instance.get(`${url}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => resolve(res.data))
                .catch((error) => {
                    reject(error)
                    if (error.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                        window.location.reload();
                    }
                });
            // .catch((error) => reject(error));
        });
    },
    //Post Without Token
    apiPostCallRequestWithoutToken: function (url, body = null) {
        const Instance = getAxiosInstance(import.meta.env.VITE_ADMIN_API_BASE_URL); //auth base url
    
        return new Promise((resolve, reject) => {
            Instance.post(`${url}`, body, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => resolve(res.data))
                .catch((error) => {
                    reject(error)
                    if (error.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                        window.location.reload();
                    }
                });
            // .catch((error) => reject(error));
        });
    },


    //Post FormData Without Token
    apiPostCallFormDataRequestWithoutToken: function (url, body = null) {
        const Instance = getAxiosInstance(import.meta.env.VITE_AUTH_API_BASE_URL); //auth base url
        return new Promise((resolve, reject) => {
            Instance.post(`${url}`, body, {
                headers: {
                    "Content-Type": "application/form-data",
                },
            })
                .then((res) => resolve(res.data))
                .catch((error) => {
                    reject(error)
                    if (error.status === 403) {
                        localStorage.clear();
                        window.location.href = "/login";
                        window.location.reload();
                    }
                });
            // .catch((error) => reject(error));
        });
    },
};
export default Service;


export async function apiPostBolbPdfCallRequest(url, body = null, accessToken) {
    return await fetch(`${url}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `${accessToken}`,
        },
        responseType: 'arraybuffer',//'blob',
        body: body
    }).then(response => response.json())
        .then(responseData => responseData)
        .catch(error => error)
}