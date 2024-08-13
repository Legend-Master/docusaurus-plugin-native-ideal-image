# Docusaurus Native Ideal Image Plugin

A docuaurus plugin for pre-processing images to multiple formats, sizes and low quality image placeholders, replacing [ideal-image](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-ideal-image)

> Note: this is still working in progress

## Usage

First install

```bash
npm install docusaurus-plugin-native-ideal-image
```

And add the configuration to `docusaurus.config.js`/`docusaurus.config.ts`

```js
const config = {
    ...
    plugins: ['native-ideal-image'],
}
```

Then you can use it in your project like this

```tsx
import image from 'ideal-img!../images/some-image.jpeg'

<NativeIdealImage img={image} />

// or with require
<NativeIdealImage img={require('ideal-img!../images/some-image.jpeg')} />
```

By default, this will transform the image into a jpeg source and a webp source and also a webp format low quality placeholder, and end up like this

```html
<picture
    class="native-ideal-img"
    style="--lqip: url(data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADQAQCdASoQAAwABUB8JZQAAudcoVPyIAD+uVyF4iJZsGTWpdieB7utExa6oMeh0PusAA==);"
>
    <source srcset="assets/native-ideal-image/some-image-b0600-2160.webp" type="image/webp" />
    <source srcset="assets/native-ideal-image/some-image-6ee75-2160.jpeg" type="image/jpeg" />
    <img loading="lazy" sizes="auto" width="2160" height="1620" />
</picture>
```

You can use query strings to change the output, currently you can do

- `w`: changes the output sizes
- `formats`: changes the formats used
- `presets`: use a preset set in the config

Example: `import image from 'ideal-img!../images/some-image.jpeg?w=800,1200&formats=avif,webp'`

You can learn more in the example directory or see some live examples in https://legend-master.github.io/docusaurus-plugin-native-ideal-image

## TypeScript

To use with TypeScript, put `"docusaurus-plugin-native-ideal-image/types"` in `compilerOptions > types` in your `tsconfig.json` or put `/// <reference type="docusaurus-plugin-native-ideal-image/types"` in a `.d.ts` file to get `@theme/NativeIdealImage` and `ideal-img!*` type
