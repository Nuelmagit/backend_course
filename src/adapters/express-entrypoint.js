import { connect } from "./database/conection";
import {
  jsonApiResponse,
  jsonApiErrorResponse
} from "../utils/jsonapi-utils";
import { computeOperation, deleteOperation, paginateRecords, login, listOperationTypes } from "./http_adapters";
const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();
require('dotenv').config();
app.use(express.json())
app.use(cors())

const adaptRequest = (adapter, req, res) => {
  const authData = {
    token: req.headers?.authorization?.split("Bearer ").pop()
  }
  return adapter(req.params, req.query, req.body, authData)
    .then(jsonApiResponse)
    .catch(err => jsonApiErrorResponse(err))
    .then(jsonResponse => {
      res.status(jsonResponse.statusCode);
      res.set(jsonResponse.headers);
      res.send(jsonResponse.body);
    })
}

router.post('/user/login', (req, res) => adaptRequest(login, req, res))
router.post('/operate', (req, res) => adaptRequest(computeOperation, req, res))
router.get('/records', (req, res) => adaptRequest(paginateRecords, req, res))
router.get('/operationTypes', (req, res) => adaptRequest(listOperationTypes, req, res))
router.delete('/records/:id', (req, res) => adaptRequest(deleteOperation, req, res))


app.use(`/${process.env.API_MAPPING}`, router);
app.get('*', (req, res) => Promise.reject(
  makeError("NoSuchRoute", `Route not found`)
).catch(err => jsonApiErrorResponse(err)));




(async () => {
  await connect();
  app.listen(process.env.EXPRESS_PORT || 2000, () => {
    console.log(`App listening on port ${process.env.EXPRESS_PORT || 3000}`)
  })
})()


