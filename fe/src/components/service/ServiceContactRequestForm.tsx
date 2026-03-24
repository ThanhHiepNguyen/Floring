'use client';

import { useEffect, useMemo, useState } from 'react';

import { contactRequestApi } from '@/api';
import { Dialog } from '@/components/ui/Dialog';
import { API_BASE_URL, toApiErrorMessage } from '@/api/http';
import { backendGet } from '@/lib/backend';
import type { ServiceContactRequestFormProps, ServiceContactRequestFormState } from '@/types/contact-request';

export function ServiceContactRequestForm({
  serviceId,
  serviceName,
  productVariantId,
  mode = 'inline',
  triggerLabel = 'Request a site measure',
  triggerClassName,
  triggerVariant = 'form',
}: ServiceContactRequestFormProps) {
  type ServiceRow = { id: string; name: string; slug: string };
  type VariantRow = { id: string; title: string; swatchImage?: string | null; primaryImage?: string | null };
  type ProductRow = { id: string; title: string; variants: VariantRow[] };

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [state, setState] = useState<ServiceContactRequestFormState>('idle');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [open, setOpen] = useState(false);
  const [openChooser, setOpenChooser] = useState(false);

  const shouldFetch = mode === 'inline' ? true : open;

  const [services, setServices] = useState<ServiceRow[]>([]);
  const [products, setProducts] = useState<ProductRow[]>([]);

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(serviceId ?? null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(productVariantId ?? null);

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const selectedService = useMemo(() => {
    return services.find((s) => s.id === selectedServiceId) ?? null;
  }, [services, selectedServiceId]);

  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) ?? null;
  }, [products, selectedProductId]);

  const selectedVariants = selectedProduct?.variants ?? [];

  useEffect(() => {
    if (!shouldFetch) return;
    if (services.length) return;

    let cancelled = false;
    (async () => {
      try {
        type ServiceListResponse = {
          data: ServiceRow[];
          totalPages: number;
          page: number;
        };

        const limit = 50;
        let page = 1;
        let all: ServiceRow[] = [];

        while (page <= 20) {
          const res = await backendGet<ServiceListResponse>('/service', {
            searchParams: { page, limit },
          }).catch(() => null);

          const batch = res?.data ?? [];
          all = all.concat(batch);

          if (!res || res.page >= res.totalPages) break;
          page += 1;
        }

        if (cancelled) return;
        setServices(all);
      } catch (err: unknown) {
        // If services load fails, just keep form usable for caller-provided serviceId.
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to load services');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [shouldFetch, services.length]);

  useEffect(() => {
    if (!shouldFetch) return;
    if (!selectedServiceId) return;

    let cancelled = false;
    (async () => {
      try {
        type ProductVariant = {
          id: string;
          title: string;
          swatchImage?: string | null;
          primaryImage?: string | null;
        };

        type ProductApi = {
          id: string;
          title: string;
          variants: ProductVariant[];
          currentVariant?: ProductVariant | null;
        };

        type ProductListResponse = {
          data: { products: ProductApi[] };
          meta?: { hasMoreItems?: boolean };
        };

        const limitPerPage = 50;
        let page = 1;
        let hasMore = true;
        let all: ProductApi[] = [];

        while (hasMore && page <= 50) {
          const res = await backendGet<ProductListResponse>('/product', {
            searchParams: { serviceId: selectedServiceId, page, limit: limitPerPage },
          }).catch(() => null);

          const batch = res?.data?.products ?? [];
          all = all.concat(batch);

          if (res?.meta?.hasMoreItems === false) hasMore = false;
          else if (batch.length < limitPerPage) hasMore = false;
          else page += 1;
        }

        if (cancelled) return;

        const mappedProducts: ProductRow[] = all.map((p) => ({
          id: p.id,
          title: p.title,
          variants: p.variants.map((v) => ({
            id: v.id,
            title: v.title,
            swatchImage: v.swatchImage,
            primaryImage: v.primaryImage,
          })),
        }));

        setProducts(mappedProducts);

        const variantInProducts = selectedVariantId
          ? all.find((p) => p.variants?.some((v) => v.id === selectedVariantId))
          : null;

        const nextProductId = variantInProducts?.id ?? mappedProducts?.[0]?.id ?? null;
        const nextVariantId =
          (variantInProducts?.variants?.find((v) => v.id === selectedVariantId)?.id ??
            mappedProducts?.find((p) => p.id === nextProductId)?.variants?.[0]?.id ??
            null) ?? null;

        setSelectedProductId(nextProductId);
        setSelectedVariantId(nextVariantId);
      } catch (err: unknown) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Unable to load products');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [shouldFetch, selectedServiceId]);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 1 &&
      phone.trim().length > 5
    );
  }, [name, phone]);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(id);
  }, [notice]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setState('submitting');
    setError('');

    try {
      await contactRequestApi.createContactRequest({
        name,
        phone,
        email: email.trim().length ? email.trim() : undefined,
        message: message.trim().length ? message.trim() : undefined,
        serviceId: selectedServiceId ?? undefined,
        productVariantId: selectedVariantId ?? undefined,
        imageUrls: imageUrls.length ? imageUrls : undefined,
        status: 'new',
      });

      setState('success');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
      setImageUrls([]);
      setUploadError('');
      setNotice({
        type: 'success',
        message: "Sent successfully! We'll contact you soon to confirm the site measure.",
      });
    } catch (err: unknown) {
      setState('error');
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(msg);
      setNotice({ type: 'error', message: msg || 'Submit failed, please try again.' });
    }
  };

  const uploadSelectedImages = async (files: FileList | null) => {
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

        if (!res.ok) throw new Error('Image upload failed');

        const data = await res.json();
        if (data?.url) uploaded.push(data.url as string);
      }

      setImageUrls((prev) => [...prev, ...uploaded]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : toApiErrorMessage(err);
      setUploadError(msg);
      setNotice({ type: 'error', message: msg || 'Image upload failed.' });
    } finally {
      setUploadingImages(false);
    }
  };

  const form = (
    <section className={mode === 'inline' ? 'rounded-xl border border-zinc-200 bg-white p-6' : ''}>
      {mode === 'inline' ? (
        <>
          <h2 className="text-base font-semibold text-zinc-900">Request a site measure & quote</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Choose the right material and send your enquiry. We'll contact you to confirm a site measure, then provide an installation plan.
          </p>
        </>
      ) : (
        <div className="text-sm text-zinc-600">
          Service: <span className="font-medium text-zinc-900">{selectedService?.name ?? serviceName}</span>
        </div>
      )}

      <form
        className={mode === 'inline' ? 'mt-6 space-y-4' : 'mt-4 space-y-4'}
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium text-zinc-700">
            Service
            <select
              value={selectedServiceId ?? ''}
              onChange={(e) => {
                const next = e.target.value || null;
                setSelectedServiceId(next);
                setSelectedProductId(null);
                setSelectedVariantId(null);
                setProducts([]);
              }}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              disabled={!shouldFetch || services.length === 0}
            >
              <option value="">Select service...</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm font-medium text-zinc-700">
            Product
            <select
              value={selectedProductId ?? ''}
              onChange={(e) => {
                const nextProductId = e.target.value || null;
                setSelectedProductId(nextProductId);
                const p = products.find((x) => x.id === nextProductId) ?? null;
                setSelectedVariantId(p?.variants?.[0]?.id ?? null);
              }}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              disabled={!shouldFetch || products.length === 0}
            >
              <option value="">Select product...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Colour / Range
          <select
            value={selectedVariantId ?? ''}
            onChange={(e) => setSelectedVariantId(e.target.value || null)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            disabled={!shouldFetch || selectedVariants.length === 0}
          >
            <option value="">Choose colour/range...</option>
            {selectedVariants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Upload apartment/site condition photos (optional)
          <div className="text-xs font-normal text-zinc-500">
            Please upload photos of the current apartment condition and the area that needs to be installed.
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => uploadSelectedImages(e.target.files)}
            disabled={uploadingImages || state === 'submitting'}
            className="block w-full text-xs text-zinc-700 file:mr-2 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
          />
          {uploadingImages ? <div className="text-xs text-zinc-500">Uploading images...</div> : null}
          {uploadError ? <div className="text-xs text-rose-700">{uploadError}</div> : null}
          {imageUrls.length ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {imageUrls.map((url) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={url} src={url} alt="preview" className="h-16 w-16 rounded-lg border border-zinc-200 object-cover" />
              ))}
            </div>
          ) : null}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium text-zinc-700">
            Full name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Enter your full name"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm font-medium text-zinc-700">
            Phone number
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              required
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Enter your phone number"
            />
          </label>

          <label className="space-y-1 text-sm font-medium text-zinc-700">
            Email (optional)
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="your@email.com"
              type="email"
            />
          </label>
        </div>

        <label className="space-y-1 text-sm font-medium text-zinc-700">
          Message (optional)
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            placeholder="Tell us about your requirements, timing, and preferred materials."
          />
        </label>

        {state === 'error' && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        )}

        {state === 'success' && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Sent! We'll contact you to arrange a site measure & quote as soon as possible.
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={!canSubmit || state === 'submitting'}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state === 'submitting' ? 'Submitting...' : 'Submit enquiry'}
          </button>

          <div className="text-sm text-zinc-500">
            We respond within <span className="font-medium text-zinc-700">1 business day</span>.
          </div>
        </div>

        {notice ? (
          <div
            className={[
              'fixed bottom-5 right-5 z-[1000] rounded-xl px-4 py-3 text-sm font-medium shadow-lg backdrop-blur',
              notice.type === 'success'
                ? 'border border-emerald-200 bg-emerald-50/95 text-emerald-800'
                : 'border border-rose-200 bg-rose-50/95 text-rose-700',
            ].join(' ')}
          >
            {notice.message}
          </div>
        ) : null}
      </form>
    </section>
  );

  if (mode === 'dialog') {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            if (triggerVariant === 'chooser') setOpenChooser(true);
            else setOpen(true);
          }}
          className={
            triggerClassName ??
            'inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700'
          }
        >
          {triggerLabel}
        </button>

        <Dialog open={openChooser} onClose={() => setOpenChooser(false)} title="Choose contact method">
          <div className="text-sm text-zinc-600">
            Service: <span className="font-medium text-zinc-900">{selectedService?.name ?? serviceName}</span>
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() => {
                setOpenChooser(false);
                setOpen(true);
              }}
              className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Fill out the enquiry form
            </button>
          </div>
        </Dialog>

        <Dialog open={open} onClose={() => setOpen(false)} title="Enquiry form">
          {form}
        </Dialog>
      </>
    );
  }

  return form;
}

