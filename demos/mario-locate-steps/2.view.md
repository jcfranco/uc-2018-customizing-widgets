# `MarioLocate` Widget: View Steps

## Step 1: Create widget view class

Here's our empty view that we are starting with

```ts
/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

// esri.core.accessorSupport
import { subclass, declared } from "esri/core/accessorSupport/decorators";

// esri.widgets
import Widget = require("esri/widgets/Widget");

@subclass("demo.MarioLocate")
class MarioLocate extends declared(Widget) {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(params?: any) {
    super();
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------
}

export = MarioLocate;
```

Add widget decorators

```ts
// esri.widgets.support
import { tsx } from "esri/widgets/support/widget";
```

Render method return node

```tsx
render() {
  return <div>Hello world</div>;
}
```

## Step 2: Add properties

Lets setup the properties we need for our widget.

```ts
//----------------------------------
//  scale
//----------------------------------

@aliasOf("viewModel.scale") scale: number = null;

//----------------------------------
//  view
//----------------------------------

@aliasOf("viewModel.view") view: View = null;

//----------------------------------
//  viewModel
//----------------------------------

@property({
  type: LocateViewModel
})
@renderable("viewModel.state")
@vmEvent(["locate", "locate-error"])
viewModel = new LocateViewModel();
```

Import dependencies from properties.

```ts
// esri.views
import View = require("esri/views/View");

// esri.widgets.Locate
import LocateViewModel = require("esri/widgets/Locate/LocateViewModel");
```

Update decorator import

```ts
// esri.core.accessorSupport
import { aliasOf, subclass, property, declared } from "esri/core/accessorSupport/decorators";
```

Add Widget decorators

```ts
// esri.widgets.support
import { tsx, renderable, vmEvent } from "esri/widgets/support/widget";
```

## Step 3: Add aliased method

Create aliased method for locate();

```ts
@aliasOf("viewModel.locate")
locate(): void {}
```

## Step 4: Setup the `render()` method

Update render method to use state

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
    hidden={state === "feature-unsupported"}
    role="button"
    tabIndex={0}
    aria-label={locate}
  >
    {imageNode}
  </div>
);
```

## Step 5: Add event handler private method

Add private locate method

```ts
@accessibleHandler()
private _locate(): void {
  this.locate();
}
```

Add accessible handler decorator

```ts
// esri.widgets.support
import { accessibleHandler, tsx, renderable, vmEvent } from "esri/widgets/support/widget";
```

add onclick

```ts
bind={this}
onclick={this._locate}
onkeydown={this._locate}
```

## Step 6: Use custom graphic by default

Import `esri/Graphic`

```ts
// esri
import Graphic = require("esri/Graphic");
```

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

## Step 7: Play SFX

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
_audio: HTMLAudioElement = null;
```

## Next steps

[setup the CSS](3.css.md).
