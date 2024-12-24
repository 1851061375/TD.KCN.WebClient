import axios, { AxiosResponse, AxiosError } from 'axios';

import { getAuth } from '@/app/modules/auth/core/AuthHelpers';

export const API_URL = import.meta.env.VITE_APP_API_URL;
export const GATEWAY_URL = import.meta.env.VITE_APP_GATEWAY_URL;
export const GATEWAY_TOKEN = import.meta.env.VITE_APP_GATEWAY_TOKEN;

export const HOST_API = `${API_URL}/api/v1/`;
export const FILE_URL = `${import.meta.env.VITE_APP_FILE_URL}/`;

// Types
type ApiResponse<T = unknown> = {
  data?: T;
  status: number;
  statusText: string;
  headers?: Record<string, string>;
};

// Common headers
const commonHeaders = {
  'Content-Type': 'application/json',
};

interface UploadResponse {
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

interface DownloadProgress {
  loaded: number;
  total?: number;
  percentage: number;
}

interface DownloadOptions {
  onProgress?: (progress: DownloadProgress) => void;
  fileName?: string;
  responseType?: 'blob' | 'arraybuffer';
}

export const requestGET = async <T>(URL: string): Promise<ApiResponse<T>> => {
  try {
    const res = await axios({
      method: 'GET',
      headers: commonHeaders,
      url: `${API_URL}/${URL}`,
    });

    return {      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      return {
        data: err.response.data as T,
        status: err.response.status,
        statusText: err.response.statusText,
      };
    }
    return {
      data: null as T,
      status: 500,
      statusText: err.message,
    };
  }
};
export const requestGET_New = async <T>(URL: string): Promise<ApiResponse<T>> => {
  try {
    const res = await axios({
      method: 'GET',
      headers: commonHeaders,
      url: `${API_URL}/${URL}`,
    });

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      return {
        data: err.response.data as T,
        status: err.response.status,
        statusText: err.response.statusText,
      };
    }
    return {
      data: null as T,
      status: 500,
      statusText: err.message,
    };
  }
};

export const requestPOST = async <T, D = unknown>(URL: string, data: D): Promise<ApiResponse<T>> => {
  try {
    const res = await axios<T>({
      method: 'POST',
      headers: commonHeaders,
      url: `${API_URL}/${URL}`,
      data,
    });

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    const err = error as AxiosError<T>;
    if (err.response) {
      return {
        data: err.response.data,
        status: err.response.status,
        statusText: err.response.statusText,
      };
    }
    return {
      data: null as T,
      status: 500,
      statusText: err.message,
    };
  }
};

export const requestPOST_NEW = async (URL, data) => {
  try {
    const res = await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      url: `${API_URL}/${URL}`,
      data,
    });

    return res;
  } catch (error) {

  }
};

export const requestDELETE = async <T>(URL: string): Promise<ApiResponse<T>> => {
  try {
    const res = await axios<T>({
      method: 'DELETE',
      headers: commonHeaders,
      url: `${API_URL}/${URL}`,
    });

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    const err = error as AxiosError<T>;
    if (err.response) {
      return {
        data: err.response.data,
        status: err.response.status,
        statusText: err.response.statusText,
      };
    }
    return {
      data: null as T,
      status: 500,
      statusText: err.message,
    };
  }
};

export const requestPUT = async <T, D = unknown>(URL: string, data: D): Promise<ApiResponse<T>> => {
  try {
    const res = await axios<T>({
      method: 'PUT',
      headers: commonHeaders,
      url: `${API_URL}/${URL}`,
      data,
    });

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    const err = error as AxiosError<T>;
    if (err.response) {
      return {
        data: err.response.data,
        status: err.response.status,
        statusText: err.response.statusText,
      };
    }
    return {
      data: null as T,
      status: 500,
      statusText: err.message,
    };
  }
};

export const requestPUT_NEW = async (URL, data) => {
  try {
    const res = await axios({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      url: `${API_URL}/${URL}`,
      data,
    });

    return res;
  } catch (error) {

  }
};

export const requestDownloadFile = async <D = unknown>(URL: string, data: D, options: DownloadOptions = {}): Promise<ApiResponse<Blob>> => {
  const { onProgress, fileName, responseType = 'blob' } = options;

  try {
    const res = await axios({
      method: 'POST',
      responseType,
      headers: {
        'Content-Type': 'application/json',
      },
      url: `${API_URL}/${URL}`,
      data,
      onDownloadProgress: progressEvent => {
        if (onProgress) {
          const progress: DownloadProgress = {
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0,
          };
          onProgress(progress);
        }
      },
    });

    // Handle file name from response headers
    const contentDisposition = res.headers['content-disposition'];
    const serverFileName = contentDisposition ? decodeURIComponent(contentDisposition.split('filename=')[1]?.replace(/['"]/g, '')) : fileName;

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: {
        'content-disposition': contentDisposition,
        'content-type': res.headers['content-type'],
        'content-length': res.headers['content-length'],
      },
    };
  } catch (error) {
    const err = error as AxiosError;
    if (err.response) {
      return {
        data: new Blob(),
        status: err.response.status,
        statusText: err.response.statusText,
      };
    }
    return {
      data: new Blob(),
      status: 500,
      statusText: err.message,
    };
  }
};

export const requestUploadFile = async <T = UploadResponse>(
  URL: string,
  data: FormData,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<T>> => {
  const token = getAuth()?.token;

  try {
    const res = await axios<T>({
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      url: `${API_URL}/${URL}`,
      data,
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
    };
  } catch (error) {
    const err = error as AxiosError<T>;
    if (err.response) {
      return {
        data: err.response.data,
        status: err.response.status,
        statusText: err.response.statusText,
      };
    }
    return {
      data: null as T,
      status: 500,
      statusText: err.message,
    };
  }
};

export const requestGETAttachment = async (URL: string): Promise<AxiosResponse | null> => {
  try {
    const res = await axios({
      withCredentials: true,
      method: 'GET',
      headers: {
        tenant: 'root',
      },
      url: `${API_URL}/${URL}`,
      responseType: 'blob',
    });
    return res;
  } catch (error) {
    return null;
  }
};

export const requestPOSTAttachment = async (URL, data) => {
  try {
    const res = await axios({
      method: "POST",
      headers: {
        tenant: "root",
      },
      url: `${API_URL}/${URL}`,
      responseType: "blob",
      data,
    });
    return res;
  } catch (error) {
    return null;
  }
};

