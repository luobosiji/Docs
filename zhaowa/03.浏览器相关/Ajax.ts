interface IOptions {
  type?: 'GET' | 'POST';
  url: string;
  data?: any;
  timeout?: number;
}

function formatUrl(url: string, data: any) {
  if (!data) {
    return url;
  }
  const params = Object.keys(data).map(key => {
    return `${key}=${data[key]}`;
  });
  return `${url}?${params.join('&')}`;
}

export function ajax(options: IOptions = {
  type: 'GET',
  url: '',
  data: {},
  timeout: 3000
}) {
  return new Promise((resolve, reject) => {
    if (!options.url) {
      return
    }
    const getUrl = formatUrl(options.url, options.data);
    const xhr = new XMLHttpRequest();
    const onStateChange = () => {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status === 200) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(xhr.statusText));
      }
    }
    if (options.type.toUpperCase() === 'GET') {
      xhr.open('GET', getUrl, true);
      onStateChange();
      xhr.send()
    } else if (options.type.toUpperCase() === 'POST') {
      xhr.open('POST', options.url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      onStateChange();
      xhr.send(options.data)
    }
    xhr.timeout = options.timeout;
    xhr.ontimeout = () => {
      reject(new Error('请求超时'));
    }
  })
}