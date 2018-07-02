import WebMap = require("esri/WebMap");
import Expand = require("esri/widgets/Expand");
import MapView = require("esri/views/MapView");

import CustomBookmarks = require("./CustomBookmarks");

//----------------
//  map setup
//----------------

const map = new WebMap({
  portalItem: {
    id: "dfd8f2a1d61d4d9abd16d625aca6331b"
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
