import { copyFile } from 'fs/promises'

await copyFile('src/theme/NativeIdealImage.css', 'lib/theme/NativeIdealImage.css')
