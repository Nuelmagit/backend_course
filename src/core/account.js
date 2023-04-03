import { accountComputeState } from "./account.compute-state";
import { processMessage } from "../utils/message-processor";
import { accountInstanceDeducer } from "./account.instance-deducer";
import { accountHandler } from "./account.handler";
import { validateBySchema } from "../utils/message-validation";
import triggerSchema from "./account.triggers.schema.json";

const validateMessage = validateBySchema(triggerSchema);

export const accountProcess = (
  getState,
  saveState,
  getOperationType,
  getRandomString,
  getUniqueId,
) =>
  processMessage(
    validateMessage,
    accountInstanceDeducer(),
    accountComputeState,
    accountHandler(getOperationType, getRandomString, getUniqueId),
    getState,
    saveState
  );