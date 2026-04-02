// Custom middleware (optional)
const customMiddleware = (storeAPI) => (next) => (action) => {
  // console.log('Dispatching action:', action);
  return next(action);
};

export default customMiddleware;
