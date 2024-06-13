class HttpService {
  static ajax(method, url, data) {
    return fetch(url, {
      method,
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(data)
    }).then(x => x.json());
  }
}

export const httpService = new HttpService();