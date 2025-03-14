import { readFileSync, writeFileSync } from 'fs'

const packageJsonPath = './package.json'

// Read package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

// Remove "type" key for publishing
delete packageJson.type

// Write back package.json without "type" field
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
