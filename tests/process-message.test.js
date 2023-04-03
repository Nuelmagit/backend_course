import { expect } from "chai";
import sinon from "sinon";
import { processMessage } from "../src/utils/message-processor";

const messageValidator = sinon.fake(message => message);
const deduceInstancesStub = sinon.stub();
const computeStateStub = sinon.stub();
const handleMessageStub = sinon.stub();
const getStateStub = sinon.stub();
const saveStateStub = sinon.stub();

const instanceId = "instance1";
const message = {
  action: "command1",
  payload: { prop1: "cp1" }
};
const event = { eventName: "event1", payload: { prop1: "p1" } };

const processMessageUnderTest = processMessage(
  messageValidator,
  deduceInstancesStub,
  computeStateStub,
  handleMessageStub,
  getStateStub,
  saveStateStub
);

describe("Message processor", function () {
  beforeEach(function () {
    sinon.reset();
    deduceInstancesStub.resolves(instanceId);
    computeStateStub.returns({
      id: "state1",
      foo: "bar"
    });
    handleMessageStub.resolves([event]);
    getStateStub.resolves({});
    saveStateStub.resolves(Promise.resolve(true));
  });

  it("Correctly process the message when there is a deduced instance", function () {

    return processMessageUnderTest(message).then(result => {
      const callAmount = deduceInstancesStub.callCount;
      const callArgumentsAmount = deduceInstancesStub.args[0].length;
      const callMessage = deduceInstancesStub.args[0][0];
      
      expect(callAmount).to.be.equal(1);
      expect(callArgumentsAmount).to.be.equal(1);
      expect(callMessage.action).to.be.equal(message.action);
      expect(callMessage.payload.prop1).to.be.equal(message.payload.prop1);

      expect(handleMessageStub.callCount).to.be.equal(1);
      expect(getStateStub.callCount).to.be.equal(1);
      expect(computeStateStub.callCount).to.be.equal(1);
      expect(saveStateStub.callCount).to.be.equal(1);

      expect(result.instanceId).to.be.equal(instanceId);
      expect(result.state).to.exist;
      expect(result.events.length).to.be.equal(1);
      expect(result.events[0].eventName).to.be.equal(event.eventName);
    });
  });

  it("Correctly handles no instance deductions", function () {
    deduceInstancesStub.resolves(undefined);

    return processMessageUnderTest(message).then(result => {
      expect(Object.keys(result).length).to.be.equal(0);
    });
  });

  it("Does not process the message when there is no instance deduced", function () {
    deduceInstancesStub.resolves(undefined);

    return processMessageUnderTest(message).then(() => {
      expect(handleMessageStub.callCount).to.be.equal(0);
      expect(getStateStub.callCount).to.be.equal(0);
      expect(computeStateStub.callCount).to.be.equal(0);
      expect(saveStateStub.callCount).to.be.equal(0);
    });
  });
});
