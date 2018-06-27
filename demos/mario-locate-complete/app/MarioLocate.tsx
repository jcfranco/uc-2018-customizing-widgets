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

    this.viewModel.graphic = new Graphic({
      popupTemplate: {
        title: "It's-a me, Mario!",
        content:
          '<iframe width="auto" height="150" src="https://www.youtube.com/embed/T_xZ7yXiFws?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'
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
        const playNewScreenSound = state === "ready" && oldState === "locating";
        const playWarpSound = state === "locating";

        const soundUrl = playWarpSound
          ? "./wav/warp.wav"
          : playNewScreenSound
            ? "./wav/newscreen.wav"
            : null;

        if (soundUrl) {
          new Audio(require.toUrl(soundUrl)).play();
        }
      })
    );
  }

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

    const imgSrc = state === "locating" ? "./img/warp.gif" : "./img/locate.png";

    return (
      <div
        class={CSS.base}
        bind={this}
        hidden={state === "feature-unsupported"}
        onclick={this._locate}
        onkeydown={this._locate}
        role="button"
        tabIndex={0}
        aria-label={i18n.title}
      >
        <img alt={i18n.title} class={CSS.image} src={require.toUrl(imgSrc)} />
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  @accessibleHandler()
  private _locate() {
    this.locate();
  }
}

export = MarioLocate;
