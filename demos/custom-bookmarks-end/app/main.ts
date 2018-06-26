import WebMap = require("esri/WebMap");
import Expand = require("esri/widgets/Expand");
import MapView = require("esri/views/MapView");

import CustomBookmarks = require("./CustomBookmarks");

//----------------
//  map setup
//----------------

const map = new WebMap({
  portalItem: {
    id: "243cd45ee6ce4415ac119e44fcaca5bf"
  }
});

const view = new MapView({
  map,
  container: "view",
  zoom: 15,
  center: [-117.1628487109789, 32.706813240831096]
});

//----------------
//  widget setup
//----------------

const widget = new CustomBookmarks({ view });

// store customized widget in expand widget
const expand = new Expand({ content: widget });

view.ui.add(expand, "top-right");
