import { readFileSync, writeFileSync } from 'fs'

const packageJsonPath = './package.json'

// Read current package.json (with new version)
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

// Add back the "type" field
packageJson.type = 'module'

// Write back package.json with "type" field restored
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
