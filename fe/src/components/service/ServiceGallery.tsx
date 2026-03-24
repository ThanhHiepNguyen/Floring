'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';

type ServiceGalleryProps = {
  coverImage?: string | null;
  name: string;
  colorOptions?: Array<{
    id: string;
    name: string;
    colorCode?: string | null;
    imageUrl?: string | null;
  }>;
  selectedColorOptionId?: string | null;
  onSelectedColorOptionIdChange?: (id: string | null) => void;
};

export function ServiceGallery({
  coverImage,
  name,
  colorOptions,
  selectedColorOptionId,
  onSelectedColorOptionIdChange,
}: ServiceGalleryProps) {
  const [loaded, setLoaded] = useState(false);

  const isControlled = selectedColorOptionId !== undefined;
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    colorOptions?.[0]?.id ?? null,
  );

  const selectedId = isControlled ? selectedColorOptionId : internalSelectedId;

  const selectedColor = useMemo(
    () => colorOptions?.find((c) => c.id === selectedId) ?? null,
    [colorOptions, selectedId],
  );

  const activeImage = selectedColor?.imageUrl ?? coverImage ?? '';

  const setSelectedId = (id: string | null) => {
    if (!isControlled) setInternalSelectedId(id);
    onSelectedColorOptionIdChange?.(id);
  };

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse rounded-xl bg-zinc-200/70" />
        )}
        <div className="relative aspect-[4/3]">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={`Ảnh dịch vụ ${name}`}
              fill
              className={
                'object-cover transition duration-500 ' +
                (loaded ? 'scale-100' : 'scale-105')
              }
              onLoadingComplete={() => setLoaded(true)}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-zinc-100" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10" />
        </div>
      </div>

      {colorOptions && colorOptions.length > 0 ? (
        <div className="mt-6">
          {selectedColor ? (
            <div className="text-sm font-semibold tracking-wide text-zinc-900">
              {selectedColor.name.toUpperCase()}
            </div>
          ) : null}

          <div className="mt-4 text-sm text-zinc-700">Other colours in this range:</div>

          <div className="mt-3 flex flex-wrap gap-3">
            {colorOptions.map((opt) => {
              const isActive = opt.id === selectedId;
              const swatch = opt.imageUrl;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setLoaded(false);
                    setSelectedId(opt.id);
                  }}
                  className={
                    'relative h-11 w-11 overflow-hidden rounded-full border transition ' +
                    (isActive
                      ? 'border-zinc-900 ring-2 ring-zinc-900/20'
                      : 'border-zinc-200 hover:border-zinc-400')
                  }
                  aria-label={`Chọn màu ${opt.name}`}
                  aria-pressed={isActive}
                  title={opt.name}
                >
                  {swatch ? (
                    <Image src={swatch} alt="" fill className="object-cover" />
                  ) : opt.colorCode ? (
                    <span
                      className="absolute inset-0"
                      style={{ backgroundColor: opt.colorCode }}
                      aria-hidden="true"
                    />
                  ) : (
                    <span className="absolute inset-0 bg-zinc-100" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

