export type ContactSubmissionInput = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  imageUrls?: string[];
};

export async function sendContactSubmission(input: ContactSubmissionInput) {
  const { api, toApiErrorMessage } = await import('./http');
  try {
    const res = await api.post('/contact-request', input);
    return res.data;
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

