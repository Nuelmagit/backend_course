import sinon from "sinon";

const getState = context => () => Promise.resolve(context.writeModel)

export const testMessageProcesssor = (context, message, process, ...params) =>
  process(
    getState(context),
    sinon.stub().resolves(Promise.resolve(true)),
    ...params
  )(message).then(
    results => {
      context.results = results;
      return results;
    },
    err => {
      context.errors = err;
      return err;
    }
  );