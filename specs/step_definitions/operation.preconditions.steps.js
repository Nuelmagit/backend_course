import { Given } from "@cucumber/cucumber";

Given('the existent account {string} with positive balance {int}', function (accountId, balance) {
  this.accountId = accountId;
  this.writeModel = {
    accountId,
    balance
  }
});

Given('there is NO existent account {string}', function (string) {
  this.accountId = "no-existent-account-123";
  this.writeModel = {
  }
});

Given('an existent operation with type {string} and cost {int}', function (type, cost) {
  this.operations = {
    [type]: { type, cost: 1 }
  }
});

Given('NO registered operation', function () {
  this.operations = {};
});

Given('the operation {string} was computed sucessfully', function (operationId) {
  this.writeModel.operations = {
    [operationId]: {
      operationId,
      operationTypeId: "addition",
      date: "today",
      operationCost: 1,
      operationResult: 20
    }
  }
});

Given('the operation {string} was removed sucessfully', function (operationId) {
  this.writeModel.operations[operationId].deleted = true;
  this.writeModel.operations[operationId].date = "today";
});

Given('NO operation was computed sucessfully', function () {
  this.writeModel.operations = {};
});

Given('the random string service is unavailable', function () {
  this.randomStringError = true;
});