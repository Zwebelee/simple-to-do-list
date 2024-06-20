class HttpService {

  // eslint-disable-next-line class-methods-use-this
  ajax(method, url, data) {
    return fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(x => x.json());
  }

  // eslint-disable-next-line class-methods-use-this
  async fetch(method, url, data) {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
  }
}

export const httpService = new HttpService();