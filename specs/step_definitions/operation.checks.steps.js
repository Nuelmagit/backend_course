import { Then } from "@cucumber/cucumber";
import { expect } from "chai";

Then('the operation is processed', function () {
  const raisedEvent = this.results.events.some(({ eventName, payload }) =>
    eventName === "operationComputed" &&
    payload.accountId === this.accountId
  );
  expect(raisedEvent).to.be.true;
});

Then('the new account balance is {int}', function (balanceAfterOperation) {
  const raisedEvent = this.results.events.some(({ eventName, payload }) =>
    eventName === "operationComputed" &&
    payload.accountId === this.accountId &&
    payload.balanceAfterOperation === balanceAfterOperation
  );
  expect(raisedEvent).to.be.true;
});

Then('the request is rejected with error {string}', function (errorString) {
  expect(this.errors.message).to.be.equal(errorString);
});

Then('the operation {string} is deleted sucessfully', function (operationId) {
  const raisedEvent = this.results.events.some(({ eventName, payload }) =>
    eventName === "operationDeleted" &&
    payload.accountId === this.accountId &&
    payload.operationId === operationId
  );
  expect(raisedEvent).to.be.true;
});
