# `MarioLocate` Widget Steps

## Dojo Configuration

Setup Dojo Config for custom package.

```html
<script>
  var href = location.href;
  var demoLocation = href.slice(0, href.lastIndexOf("/"));
  var dojoConfig = {
    async: true,
    //locale: "es",
    packages: [{
      name: "demo",
      location: demoLocation + "/app"
    }]
  };

</script>
```

## Import our Widget

Require our `MarioLocate` widget.

```js
"demo/MarioLocate",
```

## Initialize Widget

Initialize `MarioLocate`

```js
locate = new MarioLocate({
  view: view,
  scale: 70000
});
```

## Add widget to DOM

Add widget to view.ui

```js
view.ui.add(locate, "top-left");
```

## Copy `Locate.tsx`

Copy existing [Locate.tsx](Locate.tsx.txt) and paste into [MarioLocate.tsx](../mario-locate-start/app/MarioLocate.tsx).

Change class name to `MarioLocate`

```ts
@subclass("demo.MarioLocate")
class MarioLocate extends declared(Widget) {
```

```ts
export = MarioLocate;
```

## Modify the `render()` method

Replace render method to return simple `div`

```tsx
 render() {
  return <div>Hello World</div>;
}
```

## Build new `render()` method

```ts
const { state } = this.viewModel;
```

Set image path depending on state

```ts
const imagePath = state === "locating" ? "./img/warp.gif" : "./img/locate.png";

const imageSrc = require.toUrl(imagePath);
```

Create image node

```tsx
const locate = "Locate Mario!";
const imageNode = <img alt={locate} class="demo-mario-locate__image" src={imageSrc} />;
```

Return root node

```tsx
return (
  <div
    class="demo-mario-locate"
    bind={this}
    onclick={this._locate}
    onkeydown={this._locate}
    hidden={state === "feature-unsupported"}
    role="button"
    tabIndex={0}
    aria-label={locate}
  >
    {imageNode}
  </div>
);
```

## Use custom graphic by default

Modify locate graphic to match map.

```ts
const title = "It's-a me, Mario!";

const itsMeAudioSrc = require.toUrl("./wav/itsme.wav");
const marioImageSrc = require.toUrl("./img/mario-head.gif");

const content = `
<div style="text-align:center;">
  <img alt="${title}" height="150" src="${marioImageSrc}" />
  <audio autoplay><source src="${itsMeAudioSrc}" type="audio/wav" />
</div>
`;

this.viewModel.graphic = new Graphic({
  popupTemplate: {
    title,
    content
  },
  symbol: {
    type: "picture-marker",
    url: require.toUrl("./img/mario-map.gif"),
    width: "32px",
    height: "42px"
  }
});
```

## Play SFX

Play audio!

Import `esri/core/watchUtils`

```ts
// esri.core
import watchUtils = require("esri/core/watchUtils");
```

Add `postInitialize` lifecycle method.

```ts
postInitialize() {
  this.own(
    watchUtils.watch(this, "viewModel.state", (state, oldState) => {
      if (state === "ready" && oldState === "locating") {
        this._playAudio(["./wav/hello.wav"]);
      }

      if (state === "locating" && oldState === "ready") {
        this._playAudio(["./wav/herewego.wav", "./wav/warp.wav"]);
      }
    })
  );
}
```

Create `_playAudio` private method

```ts
private _playAudio(playlist: string[]): void {
  if (this._audio) {
    this._audio.pause();
    this._audio = null;
  }

  const audioPath = playlist[0];
  const audio = new Audio(require.toUrl(audioPath));

  audio.addEventListener("ended", () => {
    playlist.shift();
    if (playlist.length) {
      this._playAudio(playlist);
    }
  });

  this._audio = audio;

  audio.play();
}
```

Add private variable for `_audio`

```ts
//--------------------------------------------------------------------------
//
//  Variables
//
//--------------------------------------------------------------------------

_audio: HTMLAudioElement = null;
```

## We're done

Yay!
