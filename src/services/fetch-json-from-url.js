export function fetchJSONfromUrl(url) {
  return fetch(url)
  .then(res => res.json())
  .then(json => ({ data: json }))
  .catch(error => ({
    error: error
  }));
}