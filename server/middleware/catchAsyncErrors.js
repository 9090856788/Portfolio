const catchAsyncErrors = (errorFunction) => {
  return (req, res, next) => {
    Promise.resolve(errorFunction(req, res, next)).catch(next);
  };
};

export default catchAsyncErrors;
