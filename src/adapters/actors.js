import { accountProcess } from "../core/account"
import { getState, setState } from "./database/state"
import { getOperationType } from "./database/views/operation-type"
import { v4 as uuidv4 } from "uuid";
import { recordProjector } from "../core/record.projector";
import { setRecord } from "./database/views/records";
import { getRandomString } from "./random";

const actors = [
  ["recordProjector", recordProjector(setRecord)]
]

const runParallelActors = messages => Promise.allSettled(
  actors.map(([name, actor]) =>
    messages.reduce((actorResultPromise, message) =>
      actorResultPromise.then(() => actor(message).then(result => [name, result]))
      , Promise.resolve())
  )
)

export const runMessageOnAccount = message => console.log("Processing Message::", message) ||
  accountProcess(
    getState,
    setState,
    getOperationType,
    getRandomString,
    () => uuidv4()
  )(message)
    .then(({ instanceId, state, events }) => runParallelActors(events || []))
    .then(results => results.map(({ value }) => value));