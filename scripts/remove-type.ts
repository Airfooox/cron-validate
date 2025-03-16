import { readFileSync, writeFileSync } from 'fs'

const packageJsonPath = './package.json'

// Read package.json
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

// Store the semantic-release-generated version to ensure it's preserved during the process
// This prevents the version from reverting to an older value when modifying package.json
const currentVersion = packageJson.version

// Remove "type" key for publishing
delete packageJson.type

// Ensure the version is preserved
packageJson.version = currentVersion

// Write back package.json without "type" field but with version preserved
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
