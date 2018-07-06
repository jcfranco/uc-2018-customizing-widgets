/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

// esri.core.accessorSupport
import { declared, subclass } from "esri/core/accessorSupport/decorators";

// esri.widgets
import Bookmarks = require("esri/widgets/Bookmarks");

@subclass("esri.widgets.CustomBookmarks")
class CustomBookmarks extends declared(Bookmarks) {

}

export = CustomBookmarks;
