/**
 * Wrapper to catch errors in controllers and handle them gracefully.
 * @param {Function} middleware - The middleware/controller function to wrap.
 * @returns {Function} - The wrapped controller with error handling.
 */
export function controllerWrapper(middleware) {
  console.log("Middleware received:", middleware); // Log for debugging
  if (typeof middleware !== "function") {
    throw new TypeError("Expected a function"); // Type check to ensure it's a function
  }
  return async (req, res, next) => {
    try {
      await middleware(req, res, next);
    } catch (error) {
      console.error(error); // Log the error to console
      res.status(500).json({ error: "Unexpected server error" });
    }
  };
}
