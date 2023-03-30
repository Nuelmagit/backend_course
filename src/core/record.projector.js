const ignoreEvent = () => Promise.resolve(false);

export const recordProjector = (setRecord) => ({
  eventName,
  payload
}) => ((
  {
    operationComputed: () =>
      setRecord(payload.operationId, {
        accountId: payload.accountId,
        operationTypeId: payload.operationTypeId,
        cost: payload.operationCost,
        date: payload.date,
        operationResult: payload.operationResult,
        balanceAfterOperation: payload.balanceAfterOperation
      }),
    operationDeleted: () =>
      setRecord(payload.operationId, {
        deleted: true
      })
  }[eventName] || ignoreEvent
)().catch(res => console.log("recordProjector err--::", res) || res));
