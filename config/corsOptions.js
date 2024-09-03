const allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS)

const corsOptions = {
    origin: (origin, callback) => {
      if(allowedOrigins.indexOf(origin) !== -1 || !origin){
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    optionsSuccessStatus: 200
  }


module.exports = corsOptions
