import { Before } from "@cucumber/cucumber";
import { testMessageProcesssor } from "./utils";
import { accountProcess } from "../../src/core/account";
import { v4 } from "uuid";

Before({ tags: "@operations" }, function () {
  this.accountId;
  this.randomStringError;
  this.writeModel = {};
  this.operations = {};

  this.getOperationType = async operationTypeId => this.operations[operationTypeId];

  this.getRandomString = () => this.randomStringError ? Promise.reject("Something went wrong") : Promise.resolve("abc123");

  this.getUniqueId = () => v4()

  this.processMessage = message =>
    testMessageProcesssor(
      this,
      message,
      accountProcess,
      this.getOperationType,
      this.getRandomString,
      this.getUniqueId
    );
});
