import { connect, disconnect } from "../src/adapters/database/conection";
import { setState } from "../src/adapters/database/state";
import { setUser } from "../src/adapters/database/views/user";
const bcrypt = require("bcryptjs");

const initialState = {
  accountId: "acc-1",
  userId: "user-1",
  dateAccountCreated: "today",
  balance: 1000,
  operations: {}
}

const user = {
  username: "test@tn.com",
  password: bcrypt.hashSync("tn123", bcrypt.genSaltSync()),
  status: "active",
  accountId: "acc-1"
}

connect()
  .then(() => setState("abc", initialState))
  .then(() => setUser("user-1", user))
  .then(() => disconnect())
