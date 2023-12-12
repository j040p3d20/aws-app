export const baseUrl =  ''; //'http://pt-340324-mbp32m1p:8080'; // 'http://localhost:8080'; // 

export class JsonRequest {
  url:string;
  opt?:RequestInit;
}

export async function fetchJson<T> (req: JsonRequest, valueOnError?: T): Promise<T> {
  try {
    const opt = {
      ...req.opt,
      headers: {
        "Accept": "application/json",
      }
    };
    const res = await fetch(req.url, opt);
    if (res.ok) {
      const json = await res.json();
      return json;
    } else {
      throw res
    }
  } catch(err) {
    console.error('fetchJson', err);
    return valueOnError as T;
  }
}
