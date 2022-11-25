const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middle wares
app.use(cors())
app.use(express.json())



async function run() {
  try {
    
  }
  finally {
  }
}

run().catch(error => console.error(error))

app.get('/', (req, res) => {
  res.send('Server is running')
})

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})
