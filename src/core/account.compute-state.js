const operations = {
  accountCreated: (state, payload) => ({
    accountId: payload.accountId,
    userId: payload.userId,
    dateAccountCreated: payload.date,
    balance: payload.initialBalance,
    operations: {}
  }),
  operationComputed: (state, payload) => ({
    ...state,
    balance: payload.balanceAfterOperation,
    operations: {
      ...state.operations,
      [payload.operationId]: {
        operationId: payload.operationId,
        operationTypeId: payload.operationTypeId,
        date: payload.date,
        operationCost: payload.operationCost,
        operationResult: payload.operationResult
      }
    }
  }),
  operationDeleted: (state, payload) => ({
    ...state,
    operations: {
      ...state.operations,
      [payload.operationId]: {
        ...state.operations[payload.operationId],
        deleted: true,
        deletedDate: payload.date
      }
    }
  })
}

export const accountComputeState = (state, { eventName, payload }) =>
  operations[eventName]
    ? operations[eventName](state, payload)
    : new Error(`Unrecognized event ${eventName}`);