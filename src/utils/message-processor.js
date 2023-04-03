import { makeError } from "./make-error";

const resolveState = (computeState, initialState = {}) => async events => {
  const state = (events || []).reduce(
    (state, event) => [
      state instanceof Error ? state : computeState(state, event)
    ],
    initialState
  );
  return state instanceof Error ? Promise.reject(state) : state;
};

const validateMessage = async (validator, message) => {
  try {
    return validator(message);
  } catch (err) {
    return Promise.reject(makeError("InvalidMessage", "Invalid message"));
  }
};

export const processMessage = (
  messageValidator,
  deduceInstance,
  computeState,
  handleMessage,
  getState,
  saveState,
) => message => validateMessage(messageValidator, message).then(validatedMessage =>
  deduceInstance(validatedMessage).then(instanceId =>
    instanceId
      ? getState(instanceId).then(state =>
        handleMessage(state, validatedMessage, instanceId).then(events => [state, events])
      ).then(([state, events = []]) =>
        events.length > 0
          ? resolveState(computeState, state)(events).then(([finalState]) =>
            saveState(instanceId, finalState).then(() => ({
              instanceId,
              state: finalState,
              events
            }))
          )
          : { instanceId, state, events }
      )
      : Promise.resolve({})
  ));
