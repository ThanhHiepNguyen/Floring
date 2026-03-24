'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { contactRequestApi } from '@/api';
import { Dialog } from '@/components/ui/Dialog';

const DEFAULT_REPLY_MESSAGE = `Floring đã nhận được yêu cầu của bạn thành công.

Đội ngũ đang xử lý và sẽ liên hệ lại trong thời gian sớm nhất.

Bạn vui lòng chờ phản hồi từ Floring. Cảm ơn bạn!`;

type DetailRow = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  status?: string | null;
  createdAt: string;
  service?: { id: string; name: string; slug: string } | null;
  productVariant?: { id: string; name: string; imageUrl?: string | null } | null;
  images?: Array<{ id: string; imageUrl: string; createdAt: string }>;
};

export default function AdminContactRequestDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [row, setRow] = useState<DetailRow | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replySubject, setReplySubject] = useState('Floring phản hồi yêu cầu khảo sát của bạn');
  const [replyMessage, setReplyMessage] = useState(DEFAULT_REPLY_MESSAGE);
  const [sendingReply, setSendingReply] = useState(false);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const id = String(params?.id ?? '');
    if (!id) return;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await contactRequestApi.getContactRequestDetail(id);
        setRow(data as DetailRow);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không tải được chi tiết yêu cầu');
      } finally {
        setLoading(false);
      }
    })();
  }, [params?.id]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">Chi tiết yêu cầu</h2>
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            ← Quay lại
          </button>
          <Link
            href="/admin/contact-requests"
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
          >
            Danh sách
          </Link>
          <button
            type="button"
            disabled={!row?.email}
            onClick={() => {
              setReplySubject('Floring phản hồi yêu cầu khảo sát của bạn');
              setReplyMessage(DEFAULT_REPLY_MESSAGE);
              setReplyOpen(true);
            }}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            title={!row?.email ? 'Khách không có email để phản hồi' : 'Phản hồi email'}
          >
            Phản hồi mail
          </button>
        </div>
      </div>

      {loading ? <div className="mt-5 text-sm text-zinc-500">Đang tải chi tiết...</div> : null}
      {error ? (
        <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {row ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <section className="space-y-4 lg:col-span-5">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-xs uppercase tracking-wide text-zinc-500">Khách hàng</div>
              <div className="mt-2 text-base font-semibold text-zinc-900">{row.name}</div>
              <div className="mt-2 text-sm">
                <a href={`tel:${row.phone}`} className="text-emerald-700 hover:underline">
                  {row.phone}
                </a>
              </div>
              {row.email ? (
                <div className="mt-1 text-sm">
                  <a href={`mailto:${row.email}`} className="text-emerald-700 hover:underline">
                    {row.email}
                  </a>
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-xs uppercase tracking-wide text-zinc-500">Thông tin yêu cầu</div>
              <div className="mt-2 text-sm text-zinc-700">
                Dịch vụ: <span className="font-medium">{row.service?.name ?? '-'}</span>
              </div>
              <div className="mt-1 text-sm text-zinc-700">
                Mẫu: <span className="font-medium">{row.productVariant?.name ?? '-'}</span>
              </div>
              <div className="mt-1 text-sm text-zinc-700">
                Trạng thái: <span className="font-medium">{row.status ?? 'new'}</span>
              </div>
              <div className="mt-1 text-sm text-zinc-700">
                Ngày gửi: <span className="font-medium">{new Date(row.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </section>

          <section className="space-y-4 lg:col-span-7">
            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="text-xs uppercase tracking-wide text-zinc-500">Nội dung khách gửi</div>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">
                {row.message || '-'}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 p-4">
              <div className="text-xs uppercase tracking-wide text-zinc-500">Ảnh hiện trạng</div>
              {row.images?.length ? (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {row.images.map((img) => (
                    <a
                      key={img.id}
                      href={img.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block overflow-hidden rounded-xl border border-zinc-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.imageUrl} alt="Ảnh hiện trạng" className="h-28 w-full object-cover" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="mt-2 text-sm text-zinc-500">Không có ảnh đính kèm.</div>
              )}
            </div>
          </section>
        </div>
      ) : null}

      <Dialog open={replyOpen} onClose={() => setReplyOpen(false)} title="Phản hồi email cho khách">
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!row) return;
            if (!replyMessage.trim()) {
              setNotice({ type: 'error', message: 'Vui lòng nhập nội dung phản hồi.' });
              return;
            }
            try {
              setSendingReply(true);
              await contactRequestApi.replyContactRequestByEmail(row.id, {
                subject: replySubject.trim() || undefined,
                message: replyMessage.trim(),
              });
              setNotice({
                type: 'success',
                message: 'Đã gửi thành công. Đang chờ khách phản hồi lại.',
              });
              setReplyOpen(false);
              setReplyMessage(DEFAULT_REPLY_MESSAGE);
              const fresh = await contactRequestApi.getContactRequestDetail(row.id);
              setRow(fresh as DetailRow);
            } catch (err) {
              setNotice({
                type: 'error',
                message: err instanceof Error ? err.message : 'Gửi phản hồi thất bại.',
              });
            } finally {
              setSendingReply(false);
              setTimeout(() => setNotice(null), 2800);
            }
          }}
        >
          <div className="text-sm text-zinc-600">
            Người nhận: <span className="font-medium text-zinc-900">{row?.email || '(không có email)'}</span>
          </div>

          <label className="block text-sm font-medium text-zinc-700">
            Tiêu đề
            <input
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Nhập tiêu đề email"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-700">
            Nội dung phản hồi
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={7}
              className="mt-2 w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Nhập nội dung phản hồi gửi đến khách..."
              required
            />
          </label>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setReplyOpen(false)}
              className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              disabled={sendingReply}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={sendingReply}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {sendingReply ? 'Đang gửi...' : 'Gửi phản hồi'}
            </button>
          </div>
        </form>
      </Dialog>

      {notice ? (
        <div
          className={[
            'mt-4 rounded-xl px-4 py-3 text-sm',
            notice.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border border-rose-200 bg-rose-50 text-rose-700',
          ].join(' ')}
        >
          {notice.message}
        </div>
      ) : null}
    </div>
  );
}

