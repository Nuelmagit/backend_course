import { Schema, model } from 'mongoose'

const recordModel = model('Record', Schema({
  _id: {
    type: String
  },
  accountId: {
    type: String
  },
  operationType: {
    type: String
  },
  cost: {
    type: String
  },
  date: {
    type: String
  },
  operationResult: {
    type: String
  },
  balanceAfterOperation: {
    type: String
  },
  deleted: {
    type: Boolean
  }
}, { versionKey: false }));

export const getRecord = id => recordModel.findById(id);

export const setRecord = (id, payload) => recordModel.findByIdAndUpdate(id, { _id: id, ...payload }, { new: true, upsert: true });


export const findRecords = (query = {}, page = 1, sortField, sortCriteria, limit = 5) => Promise.resolve({ deleted: { $ne: true }, ...query, })
  .then(query => recordModel.count(query).then(count => Math.ceil(count / limit))
    .then(totalPages => totalPages > 0 ? totalPages : 1)
    .then(totalPages => ({
      totalPages,
      currentPage: page > totalPages
        ? totalPages
        : page < 1
        ? 1
        : page
    }))
    .then(({ totalPages, currentPage }) => recordModel
      .find(
        query,
        { _id: 1, operationType: 1, cost: 1, date: 1, operationResult: 1, balanceAfterOperation: 1 },
        { skip: (currentPage - 1) * limit, limit }
      ).sort([
        [
          recordModel.schema.paths[sortField] ? sortField : "date",
          ["asc", "desc"].includes(sortCriteria) ? sortCriteria : "desc"
        ]
      ]).then(rows => ({ totalPages, currentPage, rows }))
    )

  )

