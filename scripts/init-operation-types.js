import { connect, disconnect } from "../src/adapters/database/conection"
import { setOperationType } from "../src/adapters/database/views/operation-type"

const types = [
    { type: "addition", cost: 1 },
    { type: "subtraction", cost: 1 },
    { type: "multiplication", cost: 1 },
    { type: "division", cost: 1 },
    { type: "squareRoot", cost: 1 },
    { type: "randomString", cost: 1 },
]

connect()
    .then(() => Promise.all(types.map(current => setOperationType(current.type, current))))
    .then(() => disconnect())