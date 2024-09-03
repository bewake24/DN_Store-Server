// const asyncHandler = (requestHaner) => {
//   async (res, res, next) => {
//     try {
//       await requestHandler(rq, res, next);
//     } catch (error) {
//       res
//         .status(error.code || 500)
//         .json({ success: false, message: error.message });
//     }
//   };
// };

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

module.exports = asyncHandler;
