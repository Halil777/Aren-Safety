import {
  createObservationOffline,
  createTaskOffline,
  getObservationsLocal,
  getTasksLocal,
  getObservationLocalById,
  getTaskLocalById,
  persistObservationsFromServer,
  persistTasksFromServer,
  persistProjectsFromServer,
  persistDepartmentsFromServer,
  persistSupervisorsFromServer,
  persistCategoriesFromServer,
  persistSubcategoriesFromServer,
  persistLocationsFromServer,
  getProjectsLocal,
  getDepartmentsLocal,
  getSupervisorsLocal,
  getCategoriesLocal,
  getSubcategoriesLocal,
  getLocationsLocal,
} from "../offline/store";

// Prefer build-time injected Expo public env vars; fall back to LAN IP so devices don't hit localhost
const API_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  process.env.EXPO_PUBLIC_API_URL ??
  "https://api.arensafety.com/api";
// "https://api.arensafety.com/api";

type FetchOptions = {
  token?: string | null;
  method?: string;
  body?: any;
  signal?: AbortSignal;
};

async function request<T>(
  path: string,
  { token, method = "GET", body, signal }: FetchOptions = {}
) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => undefined);
    const message = errorData?.message || res.statusText || "Request failed";
    console.error("API Error:", {
      status: res.status,
      statusText: res.statusText,
      message,
      errorData,
    });
    const normalizedMessage = Array.isArray(message)
      ? message.join(", ")
      : message;
    const error = new Error(normalizedMessage);
    (error as any).status = res.status;
    (error as any).data = errorData;
    throw error;
  }
  return (await res.json()) as T;
}

export type LoginResponse = {
  access_token: string;
  user_id: string;
  role: "SUPERVISOR";
  user?: {
    id: string;
    role: "SUPERVISOR";
    fullName?: string;
    full_name?: string;
    email?: string;
    phoneNumber?: string;
    phone_number?: string;
    profession?: string;
    projectName?: string;
    project_name?: string;
    companyName?: string;
    company_name?: string;
  };
  full_name?: string;
  email?: string;
  phone_number?: string;
  profession?: string;
  project_name?: string;
  company_name?: string;
};

export type MobileProfile = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  profession?: string | null;
  role: "SUPERVISOR";
  projectName?: string;
  companyName?: string | null;
  projects?: { id: string; name: string }[];
  company?: { id: string; name: string } | null;
};

export async function loginRequest(login: string, password: string) {
  const data = await request<LoginResponse>("/mobile-auth/login", {
    method: "POST",
    body: { login, password },
  });
  return {
    ...data,
    user: {
      id: data.user?.id ?? data.user_id,
      role: data.user?.role ?? data.role,
      fullName: data.user?.fullName ?? data.user?.full_name ?? data.full_name,
      email: data.user?.email ?? data.email,
      phoneNumber:
        data.user?.phoneNumber ?? data.user?.phone_number ?? data.phone_number,
      profession: data.user?.profession ?? data.profession,
      projectName: data.user?.projectName ?? data.project_name,
      companyName: data.user?.companyName ?? data.company_name,
    },
  };
}

export async function fetchProfile(token: string, signal?: AbortSignal) {
  const res = await request<MobileProfile>("/mobile/profile", {
    token,
    signal,
  });
  const primaryProject = res.projects?.[0]?.name ?? res.projectName;
  const companyName = res.company?.name ?? res.companyName;
  return {
    ...res,
    projectName: primaryProject,
    companyName,
  };
}

export type ObservationDto = {
  id: string;
  locationId: string;
  projectId: string;
  departmentId: string;
  categoryId: string;
  subcategoryId: string;
  createdByUserId: string;
  supervisorId: string;
  workerFullName: string;
  workerProfession: string;
  riskLevel: number;
  description: string;
  deadline: string;
  status: string;
  locationName?: string;
  companyId?: string | null;
  createdAt?: string;
  location?: { id: string; name: string; projectId: string };
  projectName?: string;
  departmentName?: string;
  categoryName?: string;
  subcategoryName?: string;
  companyName?: string | null;
  supervisorName?: string;
  createdByName?: string;
  supervisorAnswer?: string | null;
  answeredAt?: string | null;
  rejectionReason?: string | null;
  media?: {
    id: string;
    type: "IMAGE" | "VIDEO";
    url: string;
    isCorrective: boolean;
    uploadedByUserId: string;
  }[];
};

export type ObservationMediaInput = {
  url: string;
  type: "IMAGE" | "VIDEO";
  isCorrective?: boolean;
};

export type CreateObservationPayload = {
  createdByUserId: string;
  supervisorId: string;
  workerFullName: string;
  workerProfession: string;
  riskLevel: number;
  description: string;
  deadline: string;
  status?: string;
  projectId: string;
  departmentId: string;
  categoryId: string;
  subcategoryId?: string;
  media?: ObservationMediaInput[];
};

export async function fetchObservations(token: string, signal?: AbortSignal) {
  try {
    const res = await request<ObservationDto[]>("/mobile/observations", {
      token,
      signal,
    });
    const normalized = res.map(normalizeObservation);
    await persistObservationsFromServer(normalized);
    return normalized;
  } catch (err) {
    const local = await getObservationsLocal();
    if (local.length) return local.map(normalizeObservation);
    throw err;
  }
}

export async function createObservation(
  token: string,
  payload: CreateObservationPayload
) {
  try {
    const created = await request<ObservationDto>("/mobile/observations", {
      token,
      method: "POST",
      body: payload,
    });
    const normalized = normalizeObservation(created);
    await persistObservationsFromServer([normalized]);
    return normalized;
  } catch (err) {
    const status = (err as any)?.status as number | undefined;
    if (status && status >= 400 && status < 500) {
      throw err;
    }
    const local = await createObservationOffline(payload as any);
    return normalizeObservation(local as any);
  }
}

// Online-only helpers (used by sync worker)
export async function createObservationOnline(token: string, payload: CreateObservationPayload) {
  const created = await request<ObservationDto>("/mobile/observations", {
    token,
    method: "POST",
    body: payload,
  });
  return normalizeObservation(created);
}

export type UpdateObservationPayload = Partial<CreateObservationPayload>;

export async function updateObservationOnline(token: string, id: string, payload: UpdateObservationPayload) {
  const updated = await request<ObservationDto>(`/mobile/observations/${id}`, {
    token,
    method: "PATCH",
    body: payload,
  });
  return normalizeObservation(updated);
}

export async function fetchObservation(
  token: string,
  id: string,
  signal?: AbortSignal
) {
  try {
    const res = await request<ObservationDto>(`/mobile/observations/${id}`, {
      token,
      signal,
    });
    const normalized = normalizeObservation(res);
    await persistObservationsFromServer([normalized]);
    return normalized;
  } catch (err) {
    const local = await getObservationLocalById(id);
    if (local) return normalizeObservation(local as any);
    throw err;
  }
}

export type LocationDto = {
  id: string;
  name: string;
  projectId: string;
};

export async function fetchLocations(token: string, signal?: AbortSignal) {
  try {
    const res = await request<LocationDto[]>("/mobile/locations", { token, signal });
    await persistLocationsFromServer(res.map((l) => ({ ...l, projectId: l.projectId })));
    return res;
  } catch (err) {
    const local = await getLocationsLocal();
    if (local.length) return local.map((l) => ({ id: l.id, name: l.name, projectId: l.project_id ?? "" }));
    throw err;
  }
}

export async function answerObservation(
  token: string,
  id: string,
  payload: {
    answer?: string;
    media?: { url: string; type: "IMAGE" | "VIDEO"; isCorrective?: boolean }[];
  }
) {
  const updated = await request<ObservationDto>(
    `/mobile/observations/${id}/answer`,
    {
      token,
      method: "POST",
      body: payload,
    }
  );
  return normalizeObservation(updated);
}

export async function closeObservation(token: string, id: string) {
  const updated = await request<ObservationDto>(`/mobile/observations/${id}`, {
    token,
    method: "PATCH",
    body: { status: "CLOSED" },
  });
  return normalizeObservation(updated);
}

export async function rejectObservation(
  token: string,
  id: string,
  reason?: string
) {
  const updated = await request<ObservationDto>(`/mobile/observations/${id}`, {
    token,
    method: "PATCH",
    body: { status: "REJECTED", rejectionReason: reason },
  });
  return normalizeObservation(updated);
}

export async function deleteObservationOnline(token: string, id: string) {
  await request<{ success: boolean }>(`/mobile/observations/${id}`, {
    token,
    method: "DELETE",
  });
}

export type TaskDto = {
  id: string;
  projectId: string;
  departmentId: string;
  categoryId: string;
  createdByUserId: string;
  supervisorId: string;
  description: string;
  deadline: string;
  status: string;
  companyId?: string | null;
  createdAt?: string;
  projectName?: string;
  departmentName?: string;
  categoryName?: string;
  companyName?: string | null;
  supervisorName?: string;
  createdByName?: string;
  supervisorAnswer?: string | null;
  answeredAt?: string | null;
  rejectionReason?: string | null;
  media?: {
    id: string;
    type: "IMAGE" | "VIDEO" | "FILE";
    url: string;
    isCorrective: boolean;
    uploadedByUserId: string;
  }[];
  // Allow backend variants (non-mobile endpoints) to pass nested relations
  project?: { id: string; name: string };
  department?: { id: string; name: string };
  category?: { id: string; categoryName?: string; name?: string };
  supervisor?: { id: string; fullName?: string };
  createdBy?: { id: string; fullName?: string };
  company?: { id: string; companyName?: string; name?: string } | null;
};

export type TaskMediaInput = {
  url: string;
  type: "IMAGE" | "VIDEO" | "FILE";
  isCorrective?: boolean;
};

export type CreateTaskPayload = {
  createdByUserId: string;
  supervisorId: string;
  description: string;
  deadline: string;
  status?: string;
  projectId: string;
  departmentId: string;
  categoryId: string;
  media?: TaskMediaInput[];
};

export async function fetchTasks(token: string, signal?: AbortSignal) {
  try {
    const res = await request<TaskDto[]>("/mobile/tasks", { token, signal });
    const normalized = res.map(normalizeTask);
    await persistTasksFromServer(normalized);
    return normalized;
  } catch (err) {
    const status = (err as any)?.status as number | undefined;
    if (status === 404) {
      try {
        const fallback = await request<TaskDto[]>("/tasks", { token, signal });
        const normalized = fallback.map(normalizeTask);
        await persistTasksFromServer(normalized);
        return normalized;
      } catch (fallbackErr) {
        const local = await getTasksLocal();
        if (local.length) return local.map(normalizeTask);
        throw fallbackErr;
      }
    }
    const local = await getTasksLocal();
    if (local.length) return local.map(normalizeTask);
    throw err;
  }
}

export async function createTask(token: string, payload: CreateTaskPayload) {
  try {
    const created = await request<TaskDto>("/mobile/tasks", {
      token,
      method: "POST",
      body: payload,
    });
    const normalized = normalizeTask(created);
    await persistTasksFromServer([normalized]);
    return normalized;
  } catch (err) {
    const status = (err as any)?.status as number | undefined;
    if (status === 404) {
      const created = await request<TaskDto>("/tasks", {
        token,
        method: "POST",
        body: payload,
      });
      const normalized = normalizeTask(created);
      await persistTasksFromServer([normalized]);
      return normalized;
    }
    if (status && status >= 400 && status < 500) {
      throw err;
    }
    const local = await createTaskOffline(payload as any);
    return normalizeTask(local as any);
  }
}

// Online-only helpers (used by sync worker)
export async function createTaskOnline(token: string, payload: CreateTaskPayload) {
  const created = await request<TaskDto>("/mobile/tasks", {
    token,
    method: "POST",
    body: payload,
  });
  return normalizeTask(created);
}

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export async function updateTaskOnline(token: string, id: string, payload: UpdateTaskPayload) {
  const updated = await request<TaskDto>(`/mobile/tasks/${id}`, {
    token,
    method: "PATCH",
    body: payload,
  });
  return normalizeTask(updated);
}

export async function deleteTaskOnline(token: string, id: string) {
  await request<{ success: boolean }>(`/mobile/tasks/${id}`, {
    token,
    method: "DELETE",
  });
}

export async function fetchTask(
  token: string,
  id: string,
  signal?: AbortSignal
) {
  try {
    const res = await request<TaskDto>(`/mobile/tasks/${id}`, {
      token,
      signal,
    });
    const normalized = normalizeTask(res);
    await persistTasksFromServer([normalized]);
    return normalized;
  } catch (err) {
    const status = (err as any)?.status as number | undefined;
    if (status !== 404) {
      const local = await getTaskLocalById(id);
      if (local) return normalizeTask(local as any);
      throw err;
    }
    // Some deployments may not have /tasks/:id. Fallback to list + filter.
    const list = await fetchTasks(token, signal);
    const found = list.find((t) => t.id === id);
    if (found) return found;
    const local = await getTaskLocalById(id);
    if (local) return normalizeTask(local as any);
    throw err;
  }
}

export async function answerTask(
  token: string,
  id: string,
  payload: {
    answer?: string;
    media?: {
      url: string;
      type: "IMAGE" | "VIDEO" | "FILE";
      isCorrective?: boolean;
    }[];
  }
) {
  try {
    const updated = await request<TaskDto>(`/mobile/tasks/${id}/answer`, {
      token,
      method: "POST",
      body: payload,
    });
    return normalizeTask(updated);
  } catch (err) {
    if ((err as any)?.status !== 404) throw err;
    const updated = await request<TaskDto>(`/tasks/${id}/answer`, {
      token,
      method: "POST",
      body: payload,
    });
    return normalizeTask(updated);
  }
}

export async function closeTask(token: string, id: string) {
  try {
    const updated = await request<TaskDto>(`/mobile/tasks/${id}`, {
      token,
      method: "PATCH",
      body: { status: "CLOSED" },
    });
    return normalizeTask(updated);
  } catch (err) {
    if ((err as any)?.status !== 404) throw err;
    const updated = await request<TaskDto>(`/tasks/${id}`, {
      token,
      method: "PATCH",
      body: { status: "CLOSED" },
    });
    return normalizeTask(updated);
  }
}

export async function rejectTask(
  token: string,
  id: string,
  payload: { reason?: string; media?: TaskMediaInput[] }
) {
  const body = {
    status: "REJECTED",
    rejectionReason: payload.reason,
    ...(payload.media?.length ? { media: payload.media } : {}),
  };

  try {
    const updated = await request<TaskDto>(`/mobile/tasks/${id}`, {
      token,
      method: "PATCH",
      body,
    });
    return normalizeTask(updated);
  } catch (err) {
    if ((err as any)?.status !== 404) throw err;
    const updated = await request<TaskDto>(`/tasks/${id}`, {
      token,
      method: "PATCH",
      body,
    });
    return normalizeTask(updated);
  }
}

function normalizeTask(raw: any): TaskDto {
  if (!raw || typeof raw !== "object") return raw as TaskDto;

  const projectName = raw.projectName ?? raw.project?.name ?? undefined;
  const departmentName =
    raw.departmentName ?? raw.department?.name ?? undefined;
  const categoryName =
    raw.categoryName ??
    raw.category?.categoryName ??
    raw.category?.name ??
    undefined;
  const locationName =
    raw.locationName ?? raw.location?.name ?? raw.location?.title ?? undefined;
  const companyName =
    raw.companyName ??
    raw.company?.companyName ??
    raw.company?.name ??
    undefined;
  const supervisorName =
    raw.supervisorName ?? raw.supervisor?.fullName ?? undefined;
  const createdByName =
    raw.createdByName ?? raw.createdBy?.fullName ?? undefined;

  return {
    ...raw,
    projectName,
    departmentName,
    categoryName,
    locationName,
    companyName,
    supervisorName,
    createdByName,
  } as TaskDto;
}

function normalizeObservation(raw: any): ObservationDto {
  if (!raw || typeof raw !== "object") return raw as ObservationDto;

  const projectName = raw.projectName ?? raw.project?.name ?? undefined;
  const departmentName =
    raw.departmentName ?? raw.department?.name ?? undefined;
  const categoryName =
    raw.categoryName ??
    raw.category?.categoryName ??
    raw.category?.name ??
    undefined;
  const subcategoryName =
    raw.subcategoryName ??
    raw.subcategory?.subcategoryName ??
    raw.subcategory?.name ??
    undefined;
  const locationName =
    raw.locationName ?? raw.location?.name ?? raw.location?.title ?? undefined;
  const companyName =
    raw.companyName ??
    raw.company?.companyName ??
    raw.company?.name ??
    undefined;
  const supervisorName =
    raw.supervisorName ?? raw.supervisor?.fullName ?? undefined;
  const createdByName =
    raw.createdByName ?? raw.createdBy?.fullName ?? undefined;

  return {
    ...raw,
    projectName,
    departmentName,
    categoryName,
    subcategoryName,
    locationName,
    companyName,
    supervisorName,
    createdByName,
  } as ObservationDto;
}

export type ProjectDto = {
  id: string;
  name: string;
};

export type DepartmentDto = {
  id: string;
  name: string;
};

export type SupervisorDto = {
  id: string;
  fullName: string;
};

export type CategoryDto = {
  id: string;
  name: string;
};

export type SubcategoryDto = {
  id: string;
  name: string;
  categoryId: string;
};

export async function fetchProjects(token: string, signal?: AbortSignal) {
  try {
    const res = await request<ProjectDto[]>("/mobile/projects", { token, signal });
    await persistProjectsFromServer(res);
    return res;
  } catch (err) {
    const local = await getProjectsLocal();
    if (local.length) return local;
    throw err;
  }
}

export async function fetchDepartments(token: string, signal?: AbortSignal) {
  try {
    const res = await request<DepartmentDto[]>("/mobile/departments", { token, signal });
    await persistDepartmentsFromServer(res);
    return res;
  } catch (err) {
    const local = await getDepartmentsLocal();
    if (local.length) return local;
    throw err;
  }
}

export async function fetchSupervisors(token: string, signal?: AbortSignal) {
  try {
    const res = await request<SupervisorDto[]>("/mobile/supervisors", { token, signal });
    await persistSupervisorsFromServer(res);
    return res;
  } catch (err) {
    const local = await getSupervisorsLocal();
    if (local.length) {
      return local.map((s) => ({ id: s.id, fullName: s.full_name ?? s.id }));
    }
    throw err;
  }
}

export async function fetchCategories(
  token: string,
  arg2?: AbortSignal | "observation" | "task",
  arg3?: AbortSignal
) {
  const type = typeof arg2 === "string" ? arg2 : undefined;
  const signal = typeof arg2 === "object" ? arg2 : arg3;
  const qs = type ? `?type=${encodeURIComponent(type)}` : "";
  try {
    const res = await request<CategoryDto[]>(`/mobile/categories${qs}`, { token, signal });
    await persistCategoriesFromServer(res.map((c) => ({ ...c, type })));
    return res;
  } catch (err) {
    const local = await getCategoriesLocal(type);
    if (local.length) return local.map((c) => ({ id: c.id, name: c.name }));
    throw err;
  }
}

export async function fetchSubcategories(
  token: string,
  categoryId: string,
  arg3?: AbortSignal | "observation" | "task",
  arg4?: AbortSignal
) {
  const type = typeof arg3 === "string" ? arg3 : undefined;
  const signal = typeof arg3 === "object" ? arg3 : arg4;
  const base = `/mobile/subcategories?categoryId=${encodeURIComponent(
    categoryId
  )}`;
  const path = type ? `${base}&type=${encodeURIComponent(type)}` : base;
  try {
    const res = await request<SubcategoryDto[]>(path, { token, signal });
    await persistSubcategoriesFromServer(
      res.map((s) => ({ ...s, categoryId: s.categoryId ?? categoryId, type }))
    );
    return res;
  } catch (err) {
    const local = await getSubcategoriesLocal(type, categoryId);
    if (local.length) return local.map((s) => ({ id: s.id, name: s.name, categoryId: s.category_id ?? categoryId }));
    throw err;
  }
}
