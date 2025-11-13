import { getApiBaseUrl } from "./config";

type HttpMethod = "GET" | "POST";

type ApiRequestInit = Omit<RequestInit, "method"> & {
  method?: HttpMethod;
};

type ApiErrorPayload = {
  statusCode?: number;
  message?: string | string[];
  error?: string;
};

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorPayload;

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

const baseUrl = getApiBaseUrl();

export async function apiFetch<TResponse>(
  path: string,
  init: ApiRequestInit = {},
): Promise<TResponse> {
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let payload: ApiErrorPayload | undefined;
    try {
      payload = await response.json();
    } catch {
      // ignore parse error
    }

    const message =
      payload?.message ??
      payload?.error ??
      `API request failed with status ${response.status}`;

    throw new ApiError(response.status, Array.isArray(message) ? message.join(", ") : message, payload);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  return (await response.json()) as TResponse;
}

export type CityDto = {
  id: string;
  name: string;
  isActive: boolean;
};

export type ParticipationFormatDto = {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
};

export type TariffDto = {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  isActive: boolean;
};

export async function fetchCities() {
  return apiFetch<CityDto[]>("/cities");
}

export async function fetchParticipationFormats() {
  return apiFetch<ParticipationFormatDto[]>("/participation-formats");
}

export async function fetchTariffs() {
  return apiFetch<TariffDto[]>("/tariffs");
}

export type CreateIndividualApplicationPayload = {
  fullName: string;
  phone: string;
  email: string;
  cityId: string;
  participationFormatId: string;
  comment?: string;
};

export type CreateCompanyApplicationPayload = {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  tariffId: string;
  comment?: string;
};

export async function submitIndividualApplication(payload: CreateIndividualApplicationPayload) {
  await apiFetch("/applications/individual", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitCompanyApplication(payload: CreateCompanyApplicationPayload) {
  await apiFetch("/applications/company", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
