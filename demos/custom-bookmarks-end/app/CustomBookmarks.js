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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "dojo/i18n!esri/widgets/Bookmarks/nls/Bookmarks", "esri/core/accessorSupport/decorators", "esri/widgets/Bookmarks", "esri/widgets/support/widget"], function (require, exports, __extends, __decorate, i18n, decorators_1, Bookmarks, widget_1) {
    "use strict";
    var CSS = {
        bookmark: "esri-bookmarks__bookmark",
        bookmarkIcon: "esri-bookmarks__bookmark-icon",
        bookmarkName: "esri-bookmarks__bookmark-name",
        bookmarkActive: "esri-bookmarks__bookmark--active",
        // custom
        customBookmarkIcon: "esri-bookmarks__bookmark-icon--custom",
        bookmarkIconActive: "esri-bookmarks__bookmark-icon--active"
    };
    var CustomBookmarks = /** @class */ (function (_super) {
        __extends(CustomBookmarks, _super);
        function CustomBookmarks() {
            //--------------------------------------------------------------------------
            //
            //  Variables
            //
            //--------------------------------------------------------------------------
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._playingBookmarks = {};
            return _this;
        }
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        CustomBookmarks.prototype._renderBookmark = function (bookmark) {
            var active = bookmark.active, name = bookmark.name;
            var bookmarkClasses = (_a = {},
                _a[CSS.bookmarkActive] = active,
                _a);
            var bookmarkIconClasses = (_b = {},
                _b[CSS.bookmarkIconActive] = !!this._playingBookmarks[bookmark.name],
                _b);
            return (widget_1.tsx("li", { bind: this, "data-bookmark-item": bookmark, class: this.classes(CSS.bookmark, bookmarkClasses), onclick: this._goToBookmark, onkeydown: this._goToBookmark, tabIndex: 0, role: "button", title: i18n.goToBookmark, "aria-label": name },
                widget_1.tsx("span", { "aria-hidden": "true", class: this.classes(CSS.bookmarkIcon, CSS.customBookmarkIcon, bookmarkIconClasses) }),
                widget_1.tsx("span", { class: CSS.bookmarkName }, name)));
            var _a, _b;
        };
        CustomBookmarks.prototype._goToBookmark = function (event) {
            var node = event.currentTarget;
            var bookmark = node["data-bookmark-item"];
            this.viewModel.goTo(bookmark);
            this._play(bookmark);
        };
        CustomBookmarks.prototype._play = function (bookmark) {
            var _this = this;
            var sfx = new Audio(require.toUrl("./assets/pipe.wav"));
            // mark bookmark as having active sound
            this._playingBookmarks[bookmark.name] = true;
            // when audio ends, mark bookmark as not having active sound
            sfx.addEventListener("ended", function () {
                _this._playingBookmarks[bookmark.name] = false;
                // ensure rendering after updating bookmark status
                _this.scheduleRender();
            });
            sfx.play();
        };
        __decorate([
            widget_1.accessibleHandler()
        ], CustomBookmarks.prototype, "_goToBookmark", null);
        CustomBookmarks = __decorate([
            decorators_1.subclass("esri.widgets.CustomBookmarks")
        ], CustomBookmarks);
        return CustomBookmarks;
    }(decorators_1.declared(Bookmarks)));
    return CustomBookmarks;
});
//# sourceMappingURL=CustomBookmarks.js.map