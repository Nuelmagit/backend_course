import { Schema, model } from 'mongoose'

const operationTypeModel = model('OperationType', Schema({
  _id: {
    type: String
  },
  type: {
    type: String
  },
  cost: {
    type: Number
  }
}, { versionKey: false }));

export const getOperationType = id => operationTypeModel.findById(id);

export const listOperationType = () => operationTypeModel.find({});

export const setOperationType = (id, payload) => operationTypeModel.findByIdAndUpdate(id, { _id: id, ...payload }, { new: true, upsert: true })
