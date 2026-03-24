export type ServiceContactRequestFormProps = {
  serviceId?: string | null;
  serviceName?: string | null;
  productVariantId?: string | null;
  mode?: 'inline' | 'dialog';
  triggerLabel?: string;
  triggerClassName?: string;
  triggerVariant?: 'form' | 'chooser';
};

export type ServiceContactRequestFormState = 'idle' | 'submitting' | 'success' | 'error';

