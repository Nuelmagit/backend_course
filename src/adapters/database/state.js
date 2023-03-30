import { Schema, model } from 'mongoose'

const stateModel = model('State', Schema({ _id: { type: String } }, { strict: false, versionKey: false }));

export const getState = id => stateModel.findById(id).then(document => document?._doc || {});

export const setState = (id, payload) => stateModel.findByIdAndUpdate(id, { _id: id, ...payload }, { upsert: true })