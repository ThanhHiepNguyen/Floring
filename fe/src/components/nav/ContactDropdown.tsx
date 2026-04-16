'use client';

import { ServiceContactRequestForm } from '@/components/service/ServiceContactRequestForm';

export function ContactDropdown() {
  return (
    <ServiceContactRequestForm
      mode="dialog"
      serviceId={null}
      serviceName={null}
      productVariantId={null}
      triggerLabel="Contact"
      triggerVariant="form"
      triggerClassName="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 hover:shadow dark:border-emerald-900/60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
    />
  );
}

