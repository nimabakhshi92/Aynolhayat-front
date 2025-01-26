import axios from "axios";
// import { toast } from "react-toastify";
import { getUserFromLocalStorage } from "./localStorage";
import { saveAs } from 'file-saver';

export const customRequestErrorHandler = ({ error, callbacks, thunkAPI }) => {
  // if (error.response.status === 401) {
  //   thunkAPI.dispatch(
  //     logoutUser("message"   )
  //   );
  // }
  return thunkAPI.rejectWithValue(error.response.data.error);
};

export const customApiCall = {
  post: async function ({ url, data, headers = {}, useToken = true }) {
    const user = getUserFromLocalStorage();
    if (user && useToken)
      headers["Authorization"] = `Bearer ${user.access || user.access_token}`;

    let config = { headers };
    const resp = await axios.post(url, data, config);
    return resp.data;
  },
  patch: async function ({ url, data, headers = {}, useToken = true }) {
    const user = getUserFromLocalStorage();
    if (user && useToken)
      headers["Authorization"] = `Bearer ${user.access || user.access_token}`;

    let config = { headers };
    const resp = await axios.patch(url, data, config);
    return resp.data;
  },
  delete: async function ({ url, headers = {}, useToken = true }) {
    const user = getUserFromLocalStorage();
    if (user && useToken)
      headers["Authorization"] = `Bearer ${user.access || user.access_token}`;

    let config = { headers };
    const resp = await axios.delete(url, config);
    return resp.data;
  },
  get: async function ({ url, headers = {}, useToken = true, onDownloadProgress }) {
    const user = getUserFromLocalStorage();
    if (user && useToken) {
      headers["Authorization"] = `Bearer ${user.access || user.access_token}`;
    }

    let config = {
      headers: {
        ...headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',  // Disable caching
        'Pragma': 'no-cache',  // For HTTP/1.0 compatibility
        'Expires': '0',  // Expired immediately
      }, onDownloadProgress
    };
    const resp = await axios.get(url, config);
    return resp.data;
  },
  download: async function ({ url, headers = {}, useToken = true,
    onDownloadProgress, filename, filetype = 'application/zip' }) {
    const user = getUserFromLocalStorage();
    if (user && useToken) {
      headers["Authorization"] = `Bearer ${user.access || user.access_token}`;
    }

    let config = { headers, responseType: 'blob', onDownloadProgress };
    const resp = await axios.get(url, config)
    const blob = new Blob([resp.data], { type: filetype });
    saveAs(blob, filename);
    return resp.data
  }
  // Create a Blob from the response data with the correct MIME type


  // // Create a temporary URL for the blob
  // const downloadUrl = window.URL.createObjectURL(blob);

  // // Create a temporary link element to trigger the download
  // const link = document.createElement('a');
  // link.href = downloadUrl;
  // // link.setAttribute('download', filename);  // Set the filename with datetime
  // link.setAttribute('download', 'stories.zip');  // Set the filename with datetime

  // // Append the link to the document and trigger the download
  // document.body.appendChild(link);
  // link.click();

  // // Clean up by removing the link and revoking the object URL
  // link.parentNode.removeChild(link);
  // window.URL.revokeObjectURL(downloadUrl);
};
