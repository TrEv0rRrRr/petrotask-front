import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() { }

  /**
   * Stores a value in localStorage
   * @param key Key to store the value
   * @param value Value to store
   */
  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  /**
   * Gets a value from localStorage
   * @param key Key of the value to retrieve
   * @param defaultValue Default value if the key doesn't exist
   * @returns The stored value or the default value
   */
  getItem<T>(key: string, defaultValue: T = null as any): T {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Removes a value from localStorage
   * @param key Key of the value to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  /**
   * Clears all data from localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  /**
   * Checks if a key exists in localStorage
   * @param key Key to check
   * @returns true if exists, false otherwise
   */
  hasKey(key: string): boolean {
    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking key in localStorage:', error);
      return false;
    }
  }
}
