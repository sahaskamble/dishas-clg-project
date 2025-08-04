import PocketBase from 'pocketbase';

// Create PocketBase instance
export const pb = new PocketBase('http://127.0.0.1:8090');

// Disable auto cancellation for better persistence
pb.autoCancellation(false);

// Save auth state to localStorage on change
pb.authStore.onChange((token, model) => {
    console.log("Auth state changed:", token ? "Authenticated" : "Not authenticated");
});