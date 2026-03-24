'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { contactApi } from '@/api';
import { API_BASE_URL, toApiErrorMessage } from '@/api/http';

type Props = {
  className?: string;
  submitLabel?: string;
};

export function ContactRequestForm({
  className,
  submitLabel = 'Gửi yêu cầu khảo sát',
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const canSubmit =
    name.trim().length > 1 &&
    phone.trim().length > 5 &&
    status !== 'submitting';

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => {
      if (notice.type === 'success') {
        router.push('/');
      }
      setNotice(null);
    }, 2200);
    return () => window.clearTimeout(id);
  }, [notice, router]);

  return (
    <form
      className={className}
      onSubmit={async (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        setStatus('submitting');
        setError('');

        try {
          await contactApi.sendContactSubmission({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim().length ? email.trim() : undefined,
            message: message.trim().length ? message.trim() : undefined,
            imageUrls: imageUrls.length ? imageUrls : undefined,
          });
          setStatus('success');
          setName('');
          setPhone('');
          setEmail('');
          setMessage('');
          setImageUrls([]);
          setUploadError('');
          setNotice({
            type: 'success',
            message: 'Gửi thành công! Floring sẽ liên hệ sớm để xác nhận lịch khảo sát.',
          });
        } catch (err) {
          setStatus('error');
          const msg = err instanceof Error ? err.message : toApiErrorMessage(err);
          setError(msg);
          setNotice({ type: 'error', message: msg || 'Gửi thất bại, vui lòng thử lại.' });
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Họ và tên</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-emerald-200 focus:ring-4 focus:ring-emerald-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-emerald-900/60 dark:focus:ring-emerald-900/20"
            placeholder="Nhập họ và tên"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Số điện thoại</label>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-emerald-200 focus:ring-4 focus:ring-emerald-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-emerald-900/60 dark:focus:ring-emerald-900/20"
            placeholder="Nhập số điện thoại"
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Email (tuỳ chọn)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 h-11 w-full rounded-2xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-emerald-200 focus:ring-4 focus:ring-emerald-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-emerald-900/60 dark:focus:ring-emerald-900/20"
            placeholder="Nhập email của bạn"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Upload hiện trạng ảnh (tuỳ chọn)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={async (e) => {
              const files = e.target.files;
              if (!files || files.length === 0) return;

              setUploadError('');
              setUploadingImages(true);

              try {
                const uploaded: string[] = [];
                for (const file of Array.from(files)) {
                  const fd = new FormData();
                  fd.append('file', file);

                  const res = await fetch(`${API_BASE_URL}/upload/contact-request-image`, {
                    method: 'POST',
                    body: fd,
                  });

                  if (!res.ok) throw new Error('Upload ảnh thất bại');
                  const data = await res.json();
                  if (data?.url) uploaded.push(data.url as string);
                }

                setImageUrls((prev) => [...prev, ...uploaded]);
              } catch (err) {
                const msg = err instanceof Error ? err.message : toApiErrorMessage(err);
                setUploadError(msg);
                setNotice({ type: 'error', message: msg || 'Upload ảnh thất bại.' });
              } finally {
                setUploadingImages(false);
              }
            }}
            className="mt-2 block w-full text-sm text-zinc-700 file:mr-3 file:rounded-full file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100 dark:text-zinc-300"
            disabled={uploadingImages || status === 'submitting'}
          />

          {uploadingImages ? (
            <div className="mt-2 text-xs text-zinc-500">Đang upload ảnh...</div>
          ) : null}
          {uploadError ? <div className="mt-2 text-xs text-rose-700">{uploadError}</div> : null}

          {imageUrls.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {imageUrls.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={url}
                  src={url}
                  alt="preview"
                  className="h-16 w-16 rounded-xl border border-zinc-200 object-cover"
                />
              ))}
            </div>
          ) : null}

          <div className="mt-1 text-xs text-zinc-500">
            Upload ảnh hiện trạng căn hộ/khu vực cần thi công để đội kỹ thuật dễ đánh giá hơn.
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="text-sm font-medium">Nội dung</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="mt-2 w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-200 focus:ring-4 focus:ring-emerald-200/40 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-emerald-900/60 dark:focus:ring-emerald-900/20"
          placeholder="Mô tả nhu cầu thi công..."
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'submitting' || !canSubmit}
          className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'submitting' ? 'Đang gửi...' : submitLabel}
        </button>

        {status === 'success' ? (
          <div className="text-sm text-emerald-700 dark:text-emerald-300">
            Đã gửi! Floring sẽ liên hệ để lên lịch khảo sát & thi công sớm nhất.
          </div>
        ) : status === 'error' ? (
          <div className="text-sm text-red-600 dark:text-red-400">
            {error || 'Gửi thất bại, vui lòng thử lại.'}
          </div>
        ) : (
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Thường phản hồi trong vòng 1 ngày làm việc.
          </div>
        )}
      </div>

      {notice ? (
        <div
          className={[
            'fixed left-1/2 top-3 z-[1200] w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 rounded-xl px-4 py-3 text-sm font-medium shadow-lg backdrop-blur',
            notice.type === 'success'
              ? 'border border-emerald-200 bg-emerald-50/95 text-emerald-800'
              : 'border border-rose-200 bg-rose-50/95 text-rose-700',
          ].join(' ')}
        >
          {notice.message}
        </div>
      ) : null}
    </form>
  );
}

