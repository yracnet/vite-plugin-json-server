export type Post = { id?: number; title: string; author: string };
export type Comment = { id?: number; body: string; postId: number };
export type Profile = { id?: number; name: string; email: string; bio: string };

const json = async (resp: Response) => {
  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }
  return resp.json();
};

export const apiList = <T>(resource: string): Promise<T[]> =>
  fetch(`/api/${resource}`).then(json);

export type ListParams = Record<string, string | number | undefined>;

export const apiListPaged = async <T>(
  resource: string,
  params: ListParams
): Promise<{ data: T[]; total: number }> => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });
  const resp = await fetch(`/api/${resource}?${search.toString()}`);
  if (!resp.ok) {
    throw new Error(`${resp.status} ${resp.statusText}`);
  }
  const data = await resp.json();
  const total = Number(resp.headers.get("X-Total-Count") ?? data.length);
  return { data, total };
};

export const apiGet = <T>(resource: string, id: number): Promise<T> =>
  fetch(`/api/${resource}/${id}`).then(json);

export const apiCreate = <T>(resource: string, body: T): Promise<T> =>
  fetch(`/api/${resource}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(json);

export const apiUpdate = <T>(resource: string, id: number, body: T): Promise<T> =>
  fetch(`/api/${resource}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(json);

export const apiRemove = (resource: string, id: number): Promise<void> =>
  fetch(`/api/${resource}/${id}`, { method: "DELETE" }).then(() => undefined);
