import PocketBase from 'pocketbase';

// Create PocketBase instance with client-side check
let pb;

if (typeof window !== 'undefined') {
    // Only initialize on client-side
    pb = new PocketBase('http://127.0.0.1:8090');

    // Disable auto cancellation for better persistence
    pb.autoCancellation(false);

    // Save auth state to localStorage on change
    pb.authStore.onChange((token, model) => {
        console.log("Auth state changed:", token ? "Authenticated" : "Not authenticated");
    });
} else {
    // Server-side fallback (should not be used for auth operations)
    pb = null;
}

export { pb };