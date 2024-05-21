const catchAsyncError = (errorFunction) => {
  return (req, res, next) => {
    Promise.resolve(errorFunction(req, res, next)).catch(next);
  };
};

export default catchAsyncError;
