/**
 * Local Storage Repository Adapter
 * Provides safe JSON storage, quota guard, and backup/restore.
 */
export class LocalStorageAdapter {
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Error reading key "${key}":`, e);
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): boolean {
    try {
      const data = JSON.stringify(value);
      localStorage.setItem(key, data);
      return true;
    } catch (e) {
      console.error(`[LocalStorageAdapter] Error setting key "${key}":`, e);
      return false;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[LocalStorageAdapter] Error removing key "${key}":`, e);
    }
  }

  /**
   * Export all application data into a single JSON object for backup
   */
  static exportFullBackupJSON(): string {
    const backupData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('ice_')) {
        try {
          backupData[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          backupData[key] = localStorage.getItem(key);
        }
      }
    }
    return JSON.stringify(backupData, null, 2);
  }

  /**
   * Restore full application data from JSON backup file
   */
  static importFullBackupJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (typeof parsed !== 'object' || parsed === null) return false;

      Object.keys(parsed).forEach((key) => {
        if (key.startsWith('ice_')) {
          localStorage.setItem(key, JSON.stringify(parsed[key]));
        }
      });
      return true;
    } catch (e) {
      console.error('[LocalStorageAdapter] Import backup error:', e);
      return false;
    }
  }
}
