import { makeError } from "../utils/make-error";
import { runMessageOnAccount } from "./actors";
import { findRecords } from "./database/views/records";
import { loginUser, verifyToken } from "./auth";
import { listOperationType } from "./database/views/operation-type";

const isAuthorized = token => verifyToken(token)
  .catch(error => {
    throw makeError("Forbidden", "No permissions found")
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
        values: body.values
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

export const paginateRecords = (pathArgs, queryStringArgs, body, authData) =>
  isAuthorized(authData?.token)
    .then(user => findRecords(
      {
        accountId: user.accountId,
        ...(queryStringArgs.operationTypeId ? { operationTypeId: new RegExp(`^${queryStringArgs.operationTypeId}`) } : {})
      },
      queryStringArgs.page || 1
    ))

export const login = (pathArgs, queryStringArgs, body) => !body.username || !body.password
  ? Promise.reject(makeError("BadRequest", "No credentials found"))
  : loginUser(body.username, body.password)
    .catch(err =>
      Promise.reject(makeError("BadRequest", "Invalid credenrials"))
    )

export const listOperationTypes = (pathArgs, queryStringArgs, body, authData) =>
  isAuthorized(authData?.token)
    .then(() => listOperationType())