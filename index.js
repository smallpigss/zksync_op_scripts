import fs from 'fs'
import YAML from 'yaml'

const file = fs.readFileSync('./config.yml', 'utf-8')

const config = YAML.parse(file)
console.log(config.lite.transferNumber[0])
console.log(config.notion.dbId)
