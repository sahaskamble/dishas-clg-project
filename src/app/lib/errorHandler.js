// Error handling utilities for the application

export class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

export const handlePocketBaseError = (error) => {
    console.error('PocketBase Error:', error);
    
    if (error.status === 400) {
        return new AppError('Invalid request. Please check your input.', 400);
    } else if (error.status === 401) {
        return new AppError('Authentication required. Please login.', 401);
    } else if (error.status === 403) {
        return new AppError('Access denied. You do not have permission.', 403);
    } else if (error.status === 404) {
        return new AppError('Resource not found.', 404);
    } else if (error.status >= 500) {
        return new AppError('Server error. Please try again later.', 500);
    }
    
    return new AppError(error.message || 'An unexpected error occurred.', 500);
};

export const showErrorToast = (error) => {
    const message = error instanceof AppError ? error.message : 'An unexpected error occurred.';
    
    // For now, use alert. In a real app, you'd use a toast library
    alert(`Error: ${message}`);
};

export const withErrorHandling = (asyncFn) => {
    return async (...args) => {
        try {
            return await asyncFn(...args);
        } catch (error) {
            const appError = handlePocketBaseError(error);
            showErrorToast(appError);
            throw appError;
        }
    };
};

// Utility to safely execute async operations with loading states
export const safeAsyncOperation = async (operation, setLoading, setError) => {
    try {
        setLoading(true);
        setError(null);
        const result = await operation();
        return result;
    } catch (error) {
        const appError = handlePocketBaseError(error);
        setError(appError.message);
        throw appError;
    } finally {
        setLoading(false);
    }
};
