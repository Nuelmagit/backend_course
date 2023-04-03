import { makeError } from "../utils/make-error";
import { runMessageOnAccount } from "./actors";
import { findRecords } from "./database/views/records";
import { loginUser, verifyToken } from "./auth";
import { listOperationType } from "./database/views/operation-type";

const isAuthorized = token => verifyToken(token)
  .catch(error => {
    throw makeError("Unauthorized", "No permissions found")
  })

const extractRecordProjectorResult = response => response
  .find(([actorName]) => actorName === "recordProjector")
  .pop()

export const computeOperation = (pathArgs, queryStringArgs, body, authData) =>
  isAuthorized(authData?.token)
    .then(user => runMessageOnAccount({
      action: "computeOperation",
      payload: {
        accountId: user.accountId,
        operationTypeId: body.operationTypeId,
        ...(body.values ? { values: body.values } : {}),
        ...(body.value ? { value: body.value } : {})
      }
    }))
    .then(extractRecordProjectorResult)

export const deleteOperation = (pathArgs, queryStringArgs, body, authData) =>
  isAuthorized(authData?.token)
    .then(user => runMessageOnAccount({
      action: "deleteOperation",
      payload: {
        accountId: user.accountId,
        operationId: pathArgs.id
      }
    }))
    .then(() => ({ deleted: true }))

const getSearchQuery = search => {
  if (!search) return;
  const regExp = new RegExp(`^${search}`);
  return {
    $or: [
      { operationType: regExp },
      { cost: regExp },
      { date: regExp },
      { operationResult: regExp },
      { balanceAfterOperation: regExp },
    ]
  };
}

const sanatizeNumber = number => isNaN(number) ? 1 : Number(number);

export const paginateRecords = (pathArgs, queryStringArgs, body, authData) =>
  isAuthorized(authData?.token)
    .then(user => findRecords(
      {
        $and: [
          { accountId: user.accountId },
          ...queryStringArgs?.search ? [getSearchQuery(queryStringArgs.search)] : []
        ]
      },
      queryStringArgs?.page ? sanatizeNumber(queryStringArgs?.page) : 1,
      queryStringArgs?.sortField,
      queryStringArgs?.sortCriteria
    ))

export const login = (pathArgs, queryStringArgs, body) => !body.username || !body.password
  ? Promise.reject(makeError("BadRequest", "No credentials found"))
  : loginUser(body.username, body.password)
    .catch(err =>
      Promise.reject(makeError("BadRequest", "Invalid credentials"))
    )

export const listOperationTypes = (pathArgs, queryStringArgs, body, authData) =>
  isAuthorized(authData?.token)
    .then(() => listOperationType())