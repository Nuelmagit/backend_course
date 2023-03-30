import { When } from "@cucumber/cucumber";

When('a request to compute a new operation with type {string} is made with values {string}', function (operationTypeId, csvValues) {
  return this.processMessage({
    action: "computeOperation",
    payload: {
      accountId: this.accountId,
      operationTypeId,
      values: csvValues.split(",").map(string => parseInt(string))
    }
  });
});

When('a request to delete the operation {string} is made', function (operationId) {
  return this.processMessage({
    action: "deleteOperation",
    payload: {
      accountId: this.accountId,
      operationId: operationId,
    }
  });
});
