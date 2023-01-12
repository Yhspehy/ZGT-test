const codeMessage: {
  [index: number]: string;
} = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
  2002: "请先实名认证",
  2003: "模拟交易",
};

export interface NewOptions extends RequestInit {
  params?: object;
  data?: object;
  notJson?: boolean;
  disableAlert?: boolean;
  jstime?: number;
  blob?: boolean;
  file?: boolean;
}

const checkStatus = async (response: Response, newOptions: NewOptions) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (newOptions.disableAlert) {
    return response;
  }
  const errorObj = await response.text();
  const status = response.status;
  const errortext = JSON.parse(errorObj).message || codeMessage[status];
  const error = new Error(errortext);
  error.name = response.status + "";
  throw error;
};

export const baseUrl = import.meta.env.VITE_APP_URL;
/**
 * @param {String} url
 * @param {Object} options
 * @param {String} fullUrl
 */
export default async function Fetch(
  url: string,
  options: NewOptions = {},
  fullUrl = ""
) {
  const finalUrl = fullUrl ? fullUrl : baseUrl + url;
  const defaultOptioins = {
    method: "POST",
    headers: new Headers({
      Accept: "application/json",
    }),
  };

  if (!options.file) {
    defaultOptioins.headers.set("Content-Type", "application/json");
  }

  const newOptions: NewOptions = {
    ...defaultOptioins,
    ...options,
  };

  if (newOptions.method === "GET") {
    if (newOptions.params) {
      // finalUrl = getQueryPath(finalUrl, newOptions.params);
    }
  } else {
    if (newOptions.data) {
      if (!options.file) {
        if (JSON.stringify(newOptions.data)) {
          newOptions.body = JSON.stringify(newOptions.data);
        }
      } else {
        newOptions.body = newOptions.data as FormData;
      }
    }
  }

  let filename = "";
  return fetch(finalUrl, newOptions)
    .then((res) => checkStatus(res, newOptions))
    .then((response) => {
      if (newOptions.blob) {
        const header = response.headers.get("Content-Disposition");
        try {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const parts = header!.split(";");
          filename = parts[1].split("=")[1];
          console.log(filename);
        } catch (e) {
          console.error(e);
        }
        return response.blob();
      }
      if (newOptions.notJson) {
        return true;
      }
      return response.json();
    })
    .then((result) => {
      if (result.code !== 200 && (result.message || result.msg)) {
        console.error(result.message || result.msg);
        return result;
      }

      if (newOptions.blob) {
        return {
          data: result,
          filename: filename,
        };
      }

      return result;
    })
    .catch((e) => {
      const errortext = e.message;
      console.log(`error:${errortext}`);
      console.error(e.message);
    });
}
