export type AdminToastType = 'success' | 'error' | 'info';

export type AdminToastPayload = {
  message: string;
  type?: AdminToastType;
};

export const ADMIN_TOAST_EVENT = 'jadimulya:admin-toast';

export function showAdminToast(message: string, type: AdminToastType = 'info') {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<AdminToastPayload>(ADMIN_TOAST_EVENT, {
      detail: { message, type },
    })
  );
}
