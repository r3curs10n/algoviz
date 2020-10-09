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
  const content = req.body.code
  const hash = crypto.createHash('md5').update(content).digest("hex")
  const fileName = hash + '.py'
  const filePath = getAbsolutePath(`tracer/inputs/${fileName}`)
  fs.writeFile(filePath, content, err => {
    if (err) {
      res.sendStatus(404)
      return
    }
    const moduleName = "inputs." + hash
    exec(`cd ../tracer && python3 runner.py --module ${moduleName}`, (error, stdout, stderr) => {
      console.log(stdout)
      if (error || stderr) {
        console.log(stderr)
        res.status(404).send()
        return
      }
      res.json(JSON.parse(stdout)).status(200).send()
    })
  })
})

app.get('/programs/:pid', function(req, res) {
  res.sendfile(getAbsolutePath('algovizui/build/index.html'))
})

app.use(express.static(getAbsolutePath('algovizui/build')))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
