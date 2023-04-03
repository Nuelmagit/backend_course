const errorCodeMap = {
  UnknownCommand: 404,
  InvalidCommand: 400,
  InvalidJson: 400,
  NoRequestBody: 400,
  NoSuchRoute: 404,
  BadRequest: 400,
  Conflict: 409,
  NotFound: 404,
  Forbidden: 403,
  Unauthorized: 401
};

export const jsonApiResponse = (results, statusCode = 200) => ({
  statusCode: statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ data: results })
});

export const jsonApiErrorResponse = error => ({
  statusCode: errorCodeMap[error.name] || 500,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    error: {
      status: errorCodeMap[error.name] || 500,
      detail: error.message,
      ...(error.name ? { title: error.name } : {}),
    }
  })
});

