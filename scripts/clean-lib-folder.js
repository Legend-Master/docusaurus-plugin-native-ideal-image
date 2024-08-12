import { existsSync } from 'node:fs'
import { rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const libDirectory = fileURLToPath(import.meta.resolve('../lib'))
if (existsSync(libDirectory)) {
	await rm(libDirectory, { recursive: true })
}
