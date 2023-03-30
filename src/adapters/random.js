import axios from 'axios';

export const getRandomString = () => axios.post('https://api.random.org/json-rpc/4/invoke', {
  jsonrpc: "2.0",
  method: "generateStrings",
  params: {
    apiKey: process.env.RANDOM_API_KEY,
    n: 1,
    length: 10,
    characters: "abcdefghijklmnopqrstuvwxyz",
  },
  id: 1
})
  .then(function (response) {
    return response.data.result?.random.data.pop()
  })
  .catch(function (error) {
    console.log("RANDOM API ERROR: ", error);
  })