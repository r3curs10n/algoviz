import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import {exec} from 'child_process'
import crypto from 'crypto'
import fs from 'fs'

const app = express()
const port = 3000

const getAbsolutePath = (relativePath: string) => {
  return path.join(__dirname, '..', '..', relativePath)
}

app.get('/hello', (req, res) => {
  res.send('Hello World!')
})

app.post('/trace', bodyParser.json(), function(req, res) {
  console.log(req.body.code)
  const content = req.body.code + `
import os, sys
currentdir = os.path.dirname(os.path.realpath(__file__))
parentdir = os.path.dirname(currentdir)
sys.path.append(parentdir)
import tracer

main()
print(tracer.history)
`
  const fileName = crypto.createHash('md5').update(content).digest("hex") + '.py'
  const filePath = getAbsolutePath(`tracer/inputs/${fileName}`)
  fs.writeFile(filePath, content, err => {
    if (err) {
      res.sendStatus(404)
      return
    }
    exec(`python3 ${filePath}`, (error, stdout, stderr) => {
      if (error) {
        res.sendStatus(404)
        return
      }
      res.json(JSON.parse(stdout)).status(200).send()
    })
  })
})

app.use(express.static(getAbsolutePath('algovizui/build')))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
