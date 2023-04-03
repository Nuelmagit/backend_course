import { makeError } from "../utils/make-error";
import { DateTime } from "luxon";

const isEmptyState = state => Object.keys(state).length === 0;

const invalidCommand = (message,) =>
  Promise.reject(
    makeError("InvalidCommand", message)
  );

export const getOperationExecutor = getRandomString => ({
  addition: async values => values.reduce((partialResult, currentValue) => partialResult + currentValue, 0),
  subtraction: async values => values.reduce((partialResult, currentValue) => partialResult ? partialResult - currentValue : currentValue, undefined),
  multiplication: async values => values.reduce((partialResult, currentValue) => partialResult ? partialResult * currentValue : currentValue, undefined),
  division: async values => values.reduce((partialResult, currentValue) => partialResult ? partialResult / currentValue : currentValue, undefined),
  squareRoot: async value => Math.sqrt(value),
  randomString: () => getRandomString().catch(err => Promise.reject(
    makeError("NotFound", "Random string service unavailable")
  ))
})

const handlers = {
  computeOperation: (state, stateId, { payload }, getOperationType, getRandomString, getUniqueId) =>
    isEmptyState(state)
      ? invalidCommand("Account does not exist", payload)
      : getOperationType(payload.operationTypeId)
        .then(operation => !operation
          ? invalidCommand("Operation type does not exist", { operationId: payload.operationTypeId })
          : operation.cost > state.balance
          ? invalidCommand("Insufficient balance", { cost: operation.cost, balance: state.balance })
          : getOperationExecutor(getRandomString)[operation.type](payload.values || payload.value)
            .then(operationResult => [{
              eventName: "operationComputed",
              payload: {
                operationId: getUniqueId(),
                accountId: stateId,
                operationTypeId: payload.operationTypeId,
                date: DateTime.utc().toISO(),
                operationCost: operation.cost,
                operationResult,
                balanceAfterOperation: state.balance - operation.cost
              }
            }])
        ),
  deleteOperation: (state, stateId, { payload }) =>
    !state.operations?.[payload.operationId]
      ? invalidCommand("Operation does not exist", { operationId: payload.operationTypeId })
      : state.operations[payload.operationId].deleted
      ? invalidCommand("Operation was already deleted", { operationId: payload.operationTypeId })
      : [{
          eventName: "operationDeleted",
          payload: {
            accountId: stateId,
            operationId: payload.operationId,
            date: DateTime.utc().toISO(),
          }
      }]
};

export const accountHandler = (getOperationType, getRandomString, getUniqueId) => async (state, trigger, stateId) =>
  handlers[trigger.action]
    ? handlers[trigger.action](state, stateId, trigger, getOperationType, getRandomString, getUniqueId)
    : Promise.reject(
      makeError("InvalidMessage", "Message is not valid in context")
    );
