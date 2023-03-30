export const accountInstanceDeducer = () => async message =>
  message.payload?.accountId || undefined;
