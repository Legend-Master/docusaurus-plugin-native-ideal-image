# Docusaurus Native Ideal Image Plugin

A docuaurus plugin for pre-processing images to multiple formats, sizes and low quality image placeholders

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
import image from '../images/some-image.jpeg'

export default function App() {
    return (
        <main>
            <NativeIdealImage img={image} />
        </main>
    )
}
```

By default, this will transform the image into a jpeg source and a webp source and also a webp format low quality placeholder, and end up like this

```html
<picture
    class="picture_x2na"
    style="--lqip: url(data:image/webp;base64,UklGRj4AAABXRUJQVlA4IDIAAADQAQCdASoQAAwABUB8JZQAAudcoVPyIAD+uVyF4iJZsGTWpdieB7utExa6oMeh0PusAA==);"
>
    <source srcset="assets/native-ideal-image/some-image-b0600-2160.webp 2160w" type="image/webp" />
    <source srcset="assets/native-ideal-image/some-image-4cb20-2160.jpeg 2160w" type="image/jpeg" />
    <img loading="lazy" sizes="auto" width="2160" height="1620" />
</picture>
```

You can see more in the example directory or see some live examples in https://legend-master.github.io/docusaurus-plugin-native-ideal-image

## TypeScript

To use with TypeScript, put `"docusaurus-plugin-native-ideal-image/types"` in `compilerOptions > types` in your `tsconfig.json` or put `/// <reference type="docusaurus-plugin-native-ideal-image/types"` in a `.d.ts` file to get `@theme/NativeIdealImage` and `ideal-img!*` type
