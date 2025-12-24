// backend/middleware/errorHandler.js

const notFound = (req, res, next) => {
    // Handles requests to undefined API endpoints
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // Centralized error handler
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
    res.status(statusCode);
    
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };