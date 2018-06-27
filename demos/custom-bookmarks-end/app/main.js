define(["require", "exports", "esri/WebMap", "esri/widgets/Expand", "esri/views/MapView", "./CustomBookmarks"], function (require, exports, WebMap, Expand, MapView, CustomBookmarks) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //----------------
    //  map setup
    //----------------
    var map = new WebMap({
        portalItem: {
            id: "243cd45ee6ce4415ac119e44fcaca5bf"
        }
    });
    var view = new MapView({
        map: map,
        container: "view",
        zoom: 15,
        center: [-117.1628487109789, 32.706813240831096]
    });
    //----------------
    //  widget setup
    //----------------
    var widget = new CustomBookmarks({ view: view });
    // store customized widget in expand widget
    var expand = new Expand({ content: widget });
    view.ui.add(expand, "top-right");
});
//# sourceMappingURL=main.js.map