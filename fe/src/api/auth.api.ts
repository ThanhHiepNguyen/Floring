import { api, setAccessToken, toApiErrorMessage } from './http';

export type AdminUser = {
  id: string;
  email: string;
  role?: 'admin' | 'staff';
  createdAt?: string;
};

export async function login(input: { email: string; password: string }) {
  try {
    const res = await api.post('/auth/login', input);
    const token: string | undefined = res.data?.data?.accessToken;
    if (token) setAccessToken(token);
    return res.data as {
      message: string;
      data: { accessToken: string; admin: { id: string; email: string } };
    };
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function logout() {
  setAccessToken(null);
}

export async function register(input: { email: string; password: string }) {
  try {
    const res = await api.post('/auth/register', input);
    return res.data as {
      message: string;
      data: AdminUser;
    };
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function changePassword(input: {
  oldPassword: string;
  newPassword: string;
}) {
  try {
    const res = await api.patch('/auth/change-password', input);
    return res.data as { message: string };
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function getAllAdmins() {
  try {
    const res = await api.get('/auth/admins');
    return res.data as { data: AdminUser[] };
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function deleteAdmin(adminId: string) {
  try {
    const res = await api.delete(`/auth/admins/${adminId}`);
    return res.data as { message: string };
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}
