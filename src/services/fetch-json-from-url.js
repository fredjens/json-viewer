import axios from 'axios';

export function fetchJSONfromUrl(url) {
  return axios.get(url)
  .then(json => ({ data: json.data }))
  .catch(error => ({
    error: error
  }));
}