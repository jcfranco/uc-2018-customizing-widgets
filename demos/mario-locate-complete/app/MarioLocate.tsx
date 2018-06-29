/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

// dojo
import * as i18n from "dojo/i18n!./nls/MarioLocate";

// esri
import Graphic = require("esri/Graphic");

// esri.core
import watchUtils = require("esri/core/watchUtils");

// esri.core.accessorSupport
import {
  aliasOf,
  subclass,
  property,
  declared
} from "esri/core/accessorSupport/decorators";

// esri.views
import View = require("esri/views/View");

// esri.widgets
import Widget = require("esri/widgets/Widget");

// esri.widgets.Locate
import LocateViewModel = require("esri/widgets/Locate/LocateViewModel");

// esri.widgets.support
import {
  accessibleHandler,
  tsx,
  renderable,
  vmEvent
} from "esri/widgets/support/widget";

const CSS = {
  base: "demo-mario-locate",
  image: "demo-mario-locate__image"
};

@subclass("demo.MarioLocate")
class MarioLocate extends declared(Widget) {
  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(params?: any) {
    super();

    const itsMeAudioSrc = require.toUrl("./wav/itsme.wav");
    const marioImageSrc = require.toUrl("./img/mario-head.gif");

    const content = `
    <div style="text-align:center;">
      <img alt="${i18n.mario}" height="150" src="${marioImageSrc}" />
      <audio autoplay><source src="${itsMeAudioSrc}" type="audio/wav" />
    </div>
    `;

    this.viewModel.graphic = new Graphic({
      popupTemplate: {
        title: i18n.mario,
        content
      },
      symbol: {
        type: "picture-marker",
        url: require.toUrl("./img/mario-map.gif"),
        width: "32px",
        height: "42px"
      }
    });
  }

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

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  _audio: HTMLAudioElement = null;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

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

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------

  @aliasOf("viewModel.locate")
  locate(): void {}

  render() {
    const { state } = this.viewModel;

    const imagePath =
      state === "locating" ? "./img/warp.gif" : "./img/locate.png";

    const imageSrc = require.toUrl(imagePath);

    const imageNode = (
      <img alt={i18n.locate} class={CSS.image} src={imageSrc} />
    );

    return (
      <div
        class={CSS.base}
        bind={this}
        hidden={state === "feature-unsupported"}
        onclick={this._locate}
        onkeydown={this._locate}
        role="button"
        tabIndex={0}
        aria-label={i18n.locate}
      >
        {imageNode}
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

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

  @accessibleHandler()
  private _locate(): void {
    this.locate();
  }
}

export = MarioLocate;
