const resolveState = (computeState, initialState = {}) => async events => {
  const state = (events || []).reduce(
    (state, event) => [
      state instanceof Error ? state : computeState(state, event)
    ],
    initialState
  );
  return state instanceof Error ? Promise.reject(state) : state;
};

export const processMessage = (
  deduceInstance,
  computeState,
  handleMessage,
  getState,
  saveState,
) => message => deduceInstance(message).then((instanceId) => instanceId
  ? getState(instanceId)
    .then(state =>
      handleMessage(state, message, instanceId).then(events => [
        state,
        events
      ])
    )
    .then(([state, events = []]) =>
      events.length > 0
        ? resolveState(
          computeState,
          state
        )(events).then(([finalState]) =>
          saveState(instanceId, finalState).then(() => ({
            instanceId,
            state: finalState,
            events
          }))
        )
        : { instanceId, state, events }
    )
  : Promise.resolve({})
);
