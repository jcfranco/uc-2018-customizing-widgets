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
  container: "view"
});

//----------------
//  widget setup
//----------------

const widget = new CustomBookmarks({ view });

// store customized widget in expand widget
const expand = new Expand({ content: widget });

view.ui.add(expand, "top-right");
