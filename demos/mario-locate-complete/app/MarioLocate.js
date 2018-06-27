/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "dojo/i18n!./nls/MarioLocate", "esri/Graphic", "esri/core/watchUtils", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/widgets/Locate/LocateViewModel", "esri/widgets/support/widget"], function (require, exports, __extends, __decorate, i18n, Graphic, watchUtils, decorators_1, Widget, LocateViewModel, widget_1) {
    "use strict";
    var CSS = {
        base: "demo-mario-locate"
    };
    var MarioLocate = /** @class */ (function (_super) {
        __extends(MarioLocate, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function MarioLocate(params) {
            var _this = _super.call(this) || this;
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  label
            //----------------------------------
            _this.label = i18n.widgetLabel;
            //----------------------------------
            //  scale
            //----------------------------------
            _this.scale = null;
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            //----------------------------------
            //  viewModel
            //----------------------------------
            _this.viewModel = new LocateViewModel();
            _this.viewModel.graphic = new Graphic({
                popupTemplate: {
                    title: "Mario",
                    content: "It's-a Me, Mario!"
                },
                symbol: {
                    type: "picture-marker",
                    url: require.toUrl("./img/mario-map.gif"),
                    width: "32px",
                    height: "42px"
                }
            });
            return _this;
        }
        MarioLocate.prototype.postInitialize = function () {
            this.own(watchUtils.watch(this, "viewModel.state", function (state, oldState) {
                var soundUrl = state === "locating"
                    ? "./wav/warp.wav"
                    : state === "ready" && oldState === "locating"
                        ? "./wav/newscreen.wav"
                        : null;
                if (soundUrl) {
                    new Audio(require.toUrl(soundUrl)).play();
                }
            }));
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        MarioLocate.prototype.locate = function () { };
        MarioLocate.prototype.render = function () {
            var state = this.viewModel.state;
            var imgSrc = state === "locating" ? "./img/warp.gif" : "./img/locate.png";
            return (widget_1.tsx("div", { class: CSS.base, bind: this, hidden: state === "feature-unsupported", onclick: this._locate, onkeydown: this._locate, role: "button", tabIndex: 0, "aria-label": i18n.title, title: i18n.title, style: "box-shadow:none" },
                widget_1.tsx("img", { width: "32", src: require.toUrl(imgSrc) })));
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        MarioLocate.prototype._locate = function () {
            this.locate();
        };
        __decorate([
            decorators_1.property()
        ], MarioLocate.prototype, "label", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.scale")
        ], MarioLocate.prototype, "scale", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.view")
        ], MarioLocate.prototype, "view", void 0);
        __decorate([
            decorators_1.property({
                type: LocateViewModel
            }),
            widget_1.renderable("viewModel.state"),
            widget_1.vmEvent(["locate", "locate-error"])
        ], MarioLocate.prototype, "viewModel", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.locate")
        ], MarioLocate.prototype, "locate", null);
        __decorate([
            widget_1.accessibleHandler()
        ], MarioLocate.prototype, "_locate", null);
        MarioLocate = __decorate([
            decorators_1.subclass("demo.MarioLocate")
        ], MarioLocate);
        return MarioLocate;
    }(decorators_1.declared(Widget)));
    return MarioLocate;
});
//# sourceMappingURL=MarioLocate.js.map