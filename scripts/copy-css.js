import { copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

await copyFile(
	fileURLToPath(import.meta.resolve('../src/theme/NativeIdealImage.css')),
	fileURLToPath(import.meta.resolve('../lib/theme/NativeIdealImage.css'))
)
