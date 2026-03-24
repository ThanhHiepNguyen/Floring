import { api, toApiErrorMessage } from './http';

export type SubscribeNewsletterInput = {
    email: string;
};

export async function subscribeNewsletter(input: SubscribeNewsletterInput) {
    try {
        const res = await api.post('/newsletter', input);
        return res.data;
    } catch (err) {
        throw new Error(toApiErrorMessage(err));
    }
}

