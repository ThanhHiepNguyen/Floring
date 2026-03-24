import { api, toApiErrorMessage } from './http';

export type ContactRequestInput = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  serviceId?: string;
  productVariantId?: string;
  imageUrls?: string[];
  status?: string;
};

export async function createContactRequest(input: ContactRequestInput) {
  try {
    const res = await api.post('/contact-request', input);
    return res.data;
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function getContactRequests(
  params?: { page?: number; limit?: number; status?: string },
) {
  try {
    const res = await api.get('/contact-request', { params });
    return res.data;
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function updateContactRequestStatus(
  id: string,
  input: { status: string },
) {
  try {
    const res = await api.patch(`/contact-request/${id}`, input);
    return res.data;
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function deleteContactRequest(id: string) {
  try {
    const res = await api.delete(`/contact-request/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function getContactRequestDetail(id: string) {
  try {
    const res = await api.get(`/contact-request/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function replyContactRequestByEmail(
  id: string,
  input: { subject?: string; message: string },
) {
  try {
    const res = await api.post(`/contact-request/${id}/reply`, input);
    return res.data;
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}
