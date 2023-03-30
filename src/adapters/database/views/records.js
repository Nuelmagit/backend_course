import { Schema, model } from 'mongoose'

const recordModel = model('Record', Schema({
  _id: {
    type: String
  },
  accountId: {
    type: String
  },
  operationTypeId: {
    type: String
  },
  cost: {
    type: Number
  },
  date: {
    type: String
  },
  operationResult: {
    type: String
  },
  balanceAfterOperation: {
    type: Number
  },
  deleted: {
    type: Boolean
  }
}, { versionKey: false }));

export const getRecord = id => recordModel.findById(id);

export const setRecord = (id, payload) => recordModel.findByIdAndUpdate(id, { _id: id, ...payload }, { new: true, upsert: true });

export const findRecords = (query = {}, page = 1, limit = 5) => Promise.resolve({ deleted: { $ne: true }, ...query, })
  .then(query => Promise.all([
    recordModel.count(query).then(count => Math.ceil(count / limit)),
    recordModel.find(
      query,
      { _id: 1, operationTypeId: 1, cost: 1, date: 1, operationResult: 1, balanceAfterOperation: 1 },
      { skip: (page - 1) * limit, limit }
    )
  ]))
  .then(([totalPages, rows]) => ({ totalPages: totalPages > 0 ? totalPages : 1, rows }))
