import { accountComputeState } from "./account.compute-state";
import { processMessage } from "../utils/message-processor";
import { accountInstanceDeducer } from "./account.instance-deducer";
import { accountHandler } from "./account.handler";

export const accountProcess = (
  getState,
  saveState,
  getOperationType,
  getRandomString,
  getUniqueId,
) =>
  processMessage(
    accountInstanceDeducer(),
    accountComputeState,
    accountHandler(getOperationType, getRandomString, getUniqueId),
    getState,
    saveState
  );