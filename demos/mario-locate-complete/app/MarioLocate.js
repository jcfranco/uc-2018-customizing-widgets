/**
 * Provides a simple widget that animates the {@link module:esri/views/View}
 * to the user's current location. The view rotates according to the direction
 * where the tracked device is heading towards. By default the widget looks like the following:
 *
 * ![locate-button](../assets/img/apiref/widgets/widgets-locate.png)
 *
 * ::: esri-md class="panel trailer-1"
 * The Locate widget is not supported on insecure origins.
 * To use it, switch your application to a secure origin, such as HTTPS.
 * Note that localhost is considered "potentially secure" and can be used for easy testing in browsers that supports
 * [Window.isSecureContext](https://developer.mozilla.org/en-US/docs/Web/API/Window/isSecureContext#Browser_compatibility)
 * (currently Chrome and Firefox).
 *
 * As of version 4.2, the Locate Button no longer displays in non-secure web apps. At version
 * [4.1](https://blogs.esri.com/esri/arcgis/2016/04/14/increased-web-api-security-in-google-chrome/)
 * this only applied to Google Chrome.
 * :::
 *
 * If the spatial reference of the {@link module:esri/views/View} is not Web Mercator or WGS84,
 * the user's location must be reprojected to match the
 * {@link module:esri/views/View#spatialReference view's spatial reference}. This is done with the
 * {@link module:esri/tasks/GeometryService} URL referenced in
 * {@link module:esri/config#geometryServiceUrl esriConfig}. You can optionally set the
 * {@link module:esri/config#geometryServiceUrl geometryServiceUrl} in esriConfig to your own
 * {@link module:esri/tasks/GeometryService} instance.
 * If not specified, however, it will refer to the service hosted in the default
 * {@link module:esri/portal/Portal portal} instance. See
 * {@link module:esri/config#geometryServiceUrl esriConfig.geometryServiceUrl} for an example.
 *
 * You can use the view's {@link module:esri/views/ui/DefaultUI} to add widgets
 * to the view's user interface via the {@link module:esri/views/View#ui ui} property on the view.
 * The snippet below demonstrates this.
 *
 * @module esri/widgets/Locate
 * @since 4.0
 *
 * @see [Locate.tsx (widget view)]({{ JSAPI_BOWER_URL }}/widgets/Locate.tsx)
 * @see [button.scss]({{ JSAPI_BOWER_URL }}/themes/base/widgets/_Widget.scss)
 * @see [Sample - locate widget](../sample-code/widgets-locate/index.html)
 * @see module:esri/widgets/Locate/LocateViewModel
 * @see {@link module:esri/views/View#ui View.ui}
 * @see module:esri/views/ui/DefaultUI
 *
 * @example
 * var locateWidget = new Locate({
 *   view: view,   // Attaches the Locate button to the view
 *   graphic: new Graphic({
 *     symbol: { type: "simple-marker" }  // overwrites the default symbol used for the
 *     // graphic placed at the location of the user when found
 *   })
 * });
 *
 * view.ui.add(locateWidget, "top-right");
 */
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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/Graphic", "esri/core/accessorSupport/decorators", "esri/widgets/Widget", "esri/core/watchUtils", "esri/widgets/Locate/LocateViewModel", "esri/widgets/support/widget"], function (require, exports, __extends, __decorate, Graphic, decorators_1, Widget, watchUtils, LocateViewModel, widget_1) {
    "use strict";
    var CSS = {
        base: "esri-locate esri-widget-button esri-widget",
        text: "esri-icon-font-fallback-text",
        icon: "esri-icon",
        locate: "esri-icon-locate",
        loading: "esri-icon-loading-indicator",
        rotating: "esri-rotating",
        widgetIcon: "esri-icon-north-navigation",
        // common
        disabled: "esri-disabled",
        hidden: "esri-hidden"
    };
    var MarioLocate = /** @class */ (function (_super) {
        __extends(MarioLocate, _super);
        /**
         * Fires after the [locate()](#locate) method is called and succeeds.
         *
         * @event module:esri/widgets/Locate#locate
         * @property {Object} position - Geoposition returned from the [Geolocation API](#geolocationOptions).
         *
         * @see [locate()](#locate)
         */
        /**
         * Fires after the [locate()](#locate) method is called and fails.
         *
         * @event module:esri/widgets/Locate#locate-error
         * @property {Error} error - The Error object that occurred while locating.
         *
         * @see [locate()](#locate)
         */
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        /**
         * @constructor
         * @alias module:esri/widgets/Locate
         * @extends module:esri/widgets/Widget
         * @param {Object} [properties] - See the [properties](#properties-summary) for a list of all the properties
         *                              that may be passed into the constructor.
         *
         * @example
         * // typical usage
         * var locate = new Locate({
         *   view: view
         * });
         */
        function MarioLocate(params) {
            var _this = _super.call(this) || this;
            //--------------------------------------------------------------------------
            //
            //  Variables
            //
            //--------------------------------------------------------------------------
            _this._audio = null;
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  geolocationOptions
            //----------------------------------
            /**
             * The HTML5 Geolocation Position options for locating. Refer to
             * [Geolocation API Specification](http://www.w3.org/TR/geolocation-API/#position-options)
             * for details.
             *
             * @name geolocationOptions
             * @instance
             *
             * @type {Object}
             * @default { maximumAge: 0, timeout: 15000, enableHighAccuracy: true }
             */
            _this.geolocationOptions = null;
            //----------------------------------
            //  goToLocationEnabled
            //----------------------------------
            /**
             * Indicates whether the widget should navigate the view to the position and scale of the geolocated result.
             *
             * @name goToLocationEnabled
             * @instance
             * @type {boolean}
             * @default true
             */
            _this.goToLocationEnabled = null;
            //----------------------------------
            //  graphic
            //----------------------------------
            /**
             * The graphic used to show the user's location on the map.
             *
             * @name graphic
             * @instance
             * @autocast
             *
             * @type {module:esri/Graphic}
             *
             * @example
             * var locateWidget = new Locate({
             *   viewModel: { // autocasts as new LocateViewModel()
             *     view: view,  // assigns the locate widget to a view
             *     graphic: new Graphic({
             *       symbol: { type: "simple-marker" }  // overwrites the default symbol used for the
             *       // graphic placed at the location of the user when found
             *     })
             *   }
             * });
             */
            _this.graphic = null;
            //----------------------------------
            //  iconClass
            //----------------------------------
            /**
             * The widget's default icon font.
             *
             * @since 4.7
             * @name iconClass
             * @instance
             * @type {string}
             */
            _this.iconClass = CSS.widgetIcon;
            //----------------------------------
            //  scale
            //----------------------------------
            /**
             * Indicates the scale to set on the view when navigating to the position of the geolocated
             * result once a location is returned from the [track](#event:track) event.
             * If a scale value is not explicitly set, then the view will navigate to a default scale of `2500`.
             * For 2D views the value should be within the {@link module:esri/views/MapView#constraints effectiveMinScale}
             * and {@link module:esri/views/MapView#constraints effectiveMaxScale}.
             *
             * @since 4.7
             * @name scale
             * @instance
             * @type {number}
             * @default null
             *
             * @example
             * mapView.watch("scale", function (currentScale){
             *   console.log("scale: %s", currentScale);
             * });
             *
             * mapView.when(function(){
             *   // Create an instance of the Locate widget
             *   var locateWidget = new Locate({
             *     view: mapView,
             *     scale: 5000
             *   });
             *
             *   // and add it to the view's UI
             *   mapView.ui.add(locateWidget, "top-left");
             *
             *   locateWidget.locate();
             *
             *   locateWidget.on("locate", function(locateEvent){
             *     console.log(locateEvent);
             *     console.log("locate: %s", mapView.scale);
             *   })
             * });
             */
            _this.scale = null;
            //----------------------------------
            //  useHeadingEnabled
            //----------------------------------
            /**
             * Indicates whether the widget will automatically [rotate to user's direction](https://www.w3.org/TR/geolocation-API/#coordinates_interface).
             * Set to `false` to disable this behavior.
             *
             * @since 4.6
             *
             * @name useHeadingEnabled
             * @instance
             *
             * @type {boolean}
             * @default true
             */
            _this.useHeadingEnabled = null;
            //----------------------------------
            //  view
            //----------------------------------
            /**
             * A reference to the {@link module:esri/views/MapView} or {@link module:esri/views/SceneView}. Set this to link the widget to a specific view.
             *
             * @name view
             * @instance
             *
             * @type {module:esri/views/MapView | module:esri/views/SceneView}
             */
            _this.view = null;
            //----------------------------------
            //  viewModel
            //----------------------------------
            /**
             * The view model for this widget. This is a class that contains all the logic
             * (properties and methods) that controls this widget's behavior. See the
             * {@link module:esri/widgets/Locate/LocateViewModel} class to access
             * all properties and methods on the widget.
             *
             * @name viewModel
             * @instance
             * @type {module:esri/widgets/Locate/LocateViewModel}
             * @autocast
             */
            _this.viewModel = new LocateViewModel();
            var title = "It's-a me, Mario!";
            var itsMeAudioSrc = require.toUrl("./wav/itsme.wav");
            var marioImageSrc = require.toUrl("./img/mario-head.gif");
            var content = "\n<div style=\"text-align:center;\">\n  <img alt=\"" + title + "\" height=\"150\" src=\"" + marioImageSrc + "\" />\n  <audio autoplay><source src=\"" + itsMeAudioSrc + "\" type=\"audio/wav\" />\n</div>\n";
            _this.viewModel.graphic = new Graphic({
                popupTemplate: {
                    title: title,
                    content: content
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
            var _this = this;
            this.own(watchUtils.watch(this, "viewModel.state", function (state, oldState) {
                if (state === "ready" && oldState === "locating") {
                    _this._playAudio(["./wav/hello.wav"]);
                }
                if (state === "locating" && oldState === "ready") {
                    _this._playAudio(["./wav/herewego.wav", "./wav/warp.wav"]);
                }
            }));
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        /**
         * Animates the view to the user's location.
         *
         * @return {Promise<Object>} Resolves to an object with the same specification as the event
         *                   object defined in the [locate event](#event:locate).
         *
         * @method
         *
         * @example
         * var locateWidget = new Locate({
         *   view: view,
         *   container: "locateDiv"
         * });
         *
         * locateWidget.locate().then(function(){
         *   // Fires after the user's location has been found
         * });
         */
        MarioLocate.prototype.locate = function () { };
        MarioLocate.prototype.render = function () {
            var state = this.viewModel.state;
            var imagePath = state === "locating" ? "./img/warp.gif" : "./img/locate.png";
            var imageSrc = require.toUrl(imagePath);
            var locate = "Locate Mario!";
            var imageNode = widget_1.tsx("img", { alt: locate, class: "demo-mario-locate__image", src: imageSrc });
            return (widget_1.tsx("div", { class: "demo-mario-locate", bind: this, onclick: this._locate, onkeydown: this._locate, hidden: state === "feature-unsupported", role: "button", tabIndex: 0, "aria-label": locate }, imageNode));
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        MarioLocate.prototype._locate = function () {
            this.locate();
        };
        MarioLocate.prototype._playAudio = function (playlist) {
            var _this = this;
            if (this._audio) {
                this._audio.pause();
                this._audio = null;
            }
            var audioPath = playlist[0];
            var audio = new Audio(require.toUrl(audioPath));
            audio.addEventListener("ended", function () {
                playlist.shift();
                if (playlist.length) {
                    _this._playAudio(playlist);
                }
            });
            this._audio = audio;
            audio.play();
        };
        __decorate([
            decorators_1.aliasOf("viewModel.geolocationOptions")
        ], MarioLocate.prototype, "geolocationOptions", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.goToLocationEnabled")
        ], MarioLocate.prototype, "goToLocationEnabled", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.graphic")
        ], MarioLocate.prototype, "graphic", void 0);
        __decorate([
            decorators_1.property()
        ], MarioLocate.prototype, "iconClass", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.scale")
        ], MarioLocate.prototype, "scale", void 0);
        __decorate([
            decorators_1.aliasOf("viewModel.useHeadingEnabled")
        ], MarioLocate.prototype, "useHeadingEnabled", void 0);
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