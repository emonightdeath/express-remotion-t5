const express = require('express');
const app = express();
const PORT = 3000;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const dexArr = [
  getRandomInt(1, 800),
  getRandomInt(1, 800),
  getRandomInt(1, 800),
  getRandomInt(1, 800),
  getRandomInt(1, 800),
  getRandomInt(1, 800)
]

console.log(dexArr); // [570, 27, 373, 752, 253, 162]

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});