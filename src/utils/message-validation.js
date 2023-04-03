import Ajv from "ajv";
import { makeError } from "./make-error";

export const validateBySchema = schema => {
  const validate = new Ajv().compile(schema);
  return value =>
    validate(value)
      ? value
      : makeError(
          "InvalidStructure",
          "value does not match schema",
          validate.errors
        );
};