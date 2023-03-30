import {
  jsonApiResponse,
  jsonApiErrorResponse
} from "../utils/jsonapi-utils";
import { makeError } from "../utils/make-error";
import { connect, disconnect } from "./database/conection";
import { computeOperation, deleteOperation, paginateRecords, login, listOperationTypes } from "./http_adapters";

const parseJson = str => {
  try {
    return Promise.resolve(JSON.parse(str));
  } catch (err) {
    return Promise.reject(
      makeError("InvalidJson", "Request body is NOT valid JSON")
    )
  }
};

const adaptRequest = async (adapter, awsEvent, noBody = false) => {
  const authData = {
    token: awsEvent.headers?.authorization?.split("Bearer ").pop()
  }
  return connect()
    .then(() => noBody ? Promise.resolve(undefined) : parseJson(awsEvent.body))
    .then(body => adapter(awsEvent.pathParameters, awsEvent.queryStringParameters, body, authData))
    .then(response => disconnect().then(() => response))
    .then(jsonApiResponse);
};

const matchesUrl = awsEvent => route => {
  const routeKey = awsEvent.routeKey
    ? awsEvent.routeKey
    : `${awsEvent?.httpMethod} ${awsEvent?.resource}`;
  return routeKey === route;
};

export const index = async awsEvent => {
  console.log(JSON.stringify(awsEvent, null, 2));

  const matches = matchesUrl(awsEvent);

  return (matches("POST /operate")
    ? adaptRequest(computeOperation, awsEvent)
    : matches("DELETE /records/{id}")
    ? adaptRequest(deleteOperation, awsEvent, true)
    : matches("GET /records")
    ? adaptRequest(paginateRecords, awsEvent)
    : matches("GET /operationTypes")
    ? adaptRequest(listOperationTypes, awsEvent)
    : matches("POST /user/login")
    ? adaptRequest(login, awsEvent)
    : Promise.reject(
      makeError(
        "NoSuchRoute",
        `Route not found, ${awsEvent?.requestContext?.requestId}`
      )
    )
  ).catch(err => jsonApiErrorResponse(err));
};
