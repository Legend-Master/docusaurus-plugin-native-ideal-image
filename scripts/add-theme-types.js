import { readFile, writeFile } from 'fs/promises'

const content = await readFile('lib/index.d.ts', { encoding: 'utf-8' })
await writeFile(
	'lib/index.d.ts',
	`declare module 'docusaurus-plugin-native-ideal-image' {
${content}
}
declare module '@theme/NativeIdealImage' {
import type { NativeIdealImageProps } from 'docusaurus-plugin-native-ideal-image';
export default function IdealImage(props: NativeIdealImageProps): JSX.Element;
}
`
)

// I hate this so much 😖
