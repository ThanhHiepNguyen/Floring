'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type DialogProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
};

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
    const panelRef = useRef<HTMLDivElement | null>(null);
    const onCloseRef = useRef(onClose);

    // Always use the latest onClose without re-running the main effect.
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCloseRef.current();
        };
        document.addEventListener('keydown', onKeyDown);

        // focus first focusable element
        const t = window.setTimeout(() => {
            const el = panelRef.current;
            if (!el) return;
            const focusable = el.querySelector<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            );
            focusable?.focus();
        }, 0);

        return () => {
            window.clearTimeout(t);
            document.body.style.overflow = prevOverflow;
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [open]);

    if (!open) return null;

    // Render through a portal so `position: fixed` always stays on the viewport,
    // avoiding offset issues when a parent has `transform`.
    if (typeof document === 'undefined') return null;

    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Dialog'}
            className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
        >
            <button
                type="button"
                aria-label="Close"
                onClick={() => onCloseRef.current()}
                className="absolute inset-0 z-0 cursor-default bg-black/40"
            />

            <div
                ref={panelRef}
                className={[
                    'relative z-10 w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl border border-zinc-200 bg-white shadow-xl',
                    className ?? '',
                ].join(' ')}
            >
                {title ? (
                    <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-5 py-4">
                        <div className="text-sm font-semibold text-zinc-900">{title}</div>
                        <button
                            type="button"
                            onClick={() => onCloseRef.current()}
                            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                ) : null}

                <div className="p-5">{children}</div>
            </div>
        </div>,
        document.body,
    );
}

