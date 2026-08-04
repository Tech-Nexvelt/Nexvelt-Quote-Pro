import React, { useEffect } from 'react';

export function useUnsavedChangesWarning(isDirty: boolean, message = 'You have unsaved changes. Are you sure you want to leave?') {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, message]);
}

export const UnsavedChangesGuard: React.FC<{ isDirty: boolean }> = ({ isDirty }) => {
  useUnsavedChangesWarning(isDirty);
  return null;
};
