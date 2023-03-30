import { Schema, model } from 'mongoose'

const userModel = model('User', Schema({
  _id: {
    type: String
  },
  username: {
    type: String
  },
  password: {
    type: String
  },
  status: {
    type: String
  },
  accountId: {
    type: String
  }
}, { versionKey: false }));

export const getUser = id => userModel.findById(id);

export const getUserByUsername = username => userModel.findOne({ username })

export const setUser = (id, payload) => userModel.findByIdAndUpdate(id, { _id: id, ...payload }, { new: true, upsert: true })