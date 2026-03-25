import { api, toApiErrorMessage } from './http';

const GUEST_ID_KEY = 'floring_guest_id_v1';

function getGuestId() {
  if (typeof window === 'undefined') return 'guest:anonymous';
  try {
    const existing = window.localStorage.getItem(GUEST_ID_KEY);
    if (existing && existing.trim().length > 0) return existing;
    const uuid =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(GUEST_ID_KEY, uuid);
    return uuid;
  } catch {
    return 'guest:anonymous';
  }
}

export async function getFavoritePermalinks() {
  try {
    const guestId = getGuestId();
    const res = await api.get('/favorites/permalinks', { headers: { 'X-Guest-Id': guestId } });
    return res.data as { data: { permalinks: string[] } };
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

export async function toggleFavorite(permalink: string) {
  try {
    const guestId = getGuestId();
    const res = await api.post('/favorites/toggle', { permalink }, { headers: { 'X-Guest-Id': guestId } });
    return res.data as { data: { isFavorite: boolean; count: number } };
  } catch (err) {
    throw new Error(toApiErrorMessage(err));
  }
}

