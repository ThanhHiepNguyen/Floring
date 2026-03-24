import { api, toApiErrorMessage } from './http';

export type AdminProduct = {
  id: string;
  title: string;
  permalink: string;
  brand: string | null;
  serviceId: string | null;
  serviceName: string | null;
};

export async function getProducts(input: { page?: number; limit?: number; serviceId?: string }) {
  try {
    const res = await api.get('/product', { params: input });
    return res.data as {
      data: { products: AdminProduct[] };
      meta: { page: number; totalPages: number };
    };
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function createProduct(input: {
  serviceId: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  brand?: string;
  style?: string;
  range?: string;
  priceGuide?: string;
  priceSortOrder?: number;
  isActive?: boolean;
}) {
  try {
    const res = await api.post('/product', input);
    return res.data as { message: string; data: { id: string } };
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function updateProduct(
  id: string,
  input: {
    serviceId?: string;
    name?: string;
    slug?: string;
    description?: string;
    imageUrl?: string;
    brand?: string;
    style?: string;
    range?: string;
    priceGuide?: string;
    priceSortOrder?: number;
    isActive?: boolean;
  },
) {
  try {
    const res = await api.patch(`/product/${id}`, input);
    return res.data as { message: string; data: { id: string } };
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function deleteProduct(id: string) {
  try {
    const res = await api.delete(`/product/${id}`);
    return res.data as { message: string };
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

