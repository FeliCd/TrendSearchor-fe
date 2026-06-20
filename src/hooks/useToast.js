import { useState, useCallback, useRef } from 'react';

const TOAST_DURATION_MS = 4000;

/**
 * Hook to manage a queue of toast notifications with auto-dismiss.
 * Returns { toasts, addToast, removeToast }.
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'error') => {
    const id = ++idCounter.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), TOAST_DURATION_MS);
    return id;
  }, [removeToast]);

  return { toasts, addToast, removeToast };
}
