import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { createJSONStorage, StateStorage } from "zustand/middleware";

class SecureStorageService {
    private isWebPlatform(): boolean {
        return Platform.OS === 'web';
    }

    private getWebStorage(): Storage | null {
        return typeof globalThis.localStorage === 'undefined'
            ? null
            : globalThis.localStorage;
    }

    async getItem(key: string): Promise<string | null> {
        if (this.isWebPlatform()) {
            return this.getWebStorage()?.getItem(key) ?? null;
        }

        return SecureStore.getItemAsync(key);
    }

    async setItem(key: string, value: string): Promise<void> {
        if (this.isWebPlatform()) {
            this.getWebStorage()?.setItem(key, value);
            return;
        }

        await SecureStore.setItemAsync(key, value);
    }

    async deleteItem(key: string): Promise<void> {
        if (this.isWebPlatform()) {
            this.getWebStorage()?.removeItem(key);
            return;
        }

        await SecureStore.deleteItemAsync(key);
    }
}

export const secureStorageService = new SecureStorageService();

export const secureStorageApi: StateStorage = {

    getItem: (name: string) => secureStorageService.getItem(name),

    setItem: (name: string, value: string) => secureStorageService.setItem(name, value),

    removeItem: (name: string) => secureStorageService.deleteItem(name),
};

export const secureStorage = createJSONStorage(() => secureStorageApi);