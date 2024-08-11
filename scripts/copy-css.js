import { copyFile } from 'fs/promises'

await copyFile('src/theme/NativeIdealImage.module.css', 'lib/theme/NativeIdealImage.module.css')
