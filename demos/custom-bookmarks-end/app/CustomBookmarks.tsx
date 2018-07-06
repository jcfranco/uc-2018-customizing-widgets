/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

// dojo
import i18n = require("dojo/i18n!esri/widgets/Bookmarks/nls/Bookmarks");

// esri.core.accessorSupport
import { declared, subclass } from "esri/core/accessorSupport/decorators";

// esri.widgets
import Bookmarks = require("esri/widgets/Bookmarks");

// esri.widgets.Bookmarks
import Bookmark = require("esri/widgets/Bookmarks/Bookmark");

// esri.widgets.support
import { accessibleHandler, tsx } from "esri/widgets/support/widget";

const CSS = {
  bookmark: "esri-bookmarks__bookmark",
  bookmarkIcon: "esri-bookmarks__bookmark-icon",
  bookmarkName: "esri-bookmarks__bookmark-name",
  bookmarkActive: "esri-bookmarks__bookmark--active",

  // custom
  customBookmarkIcon: "esri-bookmarks__bookmark-icon--custom",
  bookmarkIconActive: "esri-bookmarks__bookmark-icon--active"
};

@subclass("esri.widgets.CustomBookmarks")
class CustomBookmarks extends declared(Bookmarks) {
  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  private _playingBookmarks: HashMap<boolean> = {};

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _renderBookmark(bookmark: Bookmark): any {
    const { active, name } = bookmark;

    const bookmarkClasses = {
      [CSS.bookmarkActive]: active
    };

    const bookmarkIconClasses = {
      [CSS.bookmarkIconActive]: !!this._playingBookmarks[bookmark.name]
    };

    return (
      <li
        bind={this}
        data-bookmark-item={bookmark}
        class={this.classes(CSS.bookmark, bookmarkClasses)}
        onclick={this._goToBookmark}
        onkeydown={this._goToBookmark}
        tabIndex={0}
        role="button"
        title={i18n.goToBookmark}
        aria-label={name}
      >
        <span
          aria-hidden="true"
          class={this.classes(CSS.bookmarkIcon, CSS.customBookmarkIcon, bookmarkIconClasses)}
        />
        <span class={CSS.bookmarkName}>{name}</span>
      </li>
    );
  }

  @accessibleHandler()
  private _goToBookmark(event: Event): void {
    const node = event.currentTarget as Element;
    const bookmark = node["data-bookmark-item"] as Bookmark;
    this.viewModel.goTo(bookmark);

    this._play(bookmark);
  }

  private _play(bookmark: Bookmark): void {
    const sfx = new Audio(require.toUrl("./assets/pipe.wav"));

    // mark bookmark as having active sound
    this._playingBookmarks[bookmark.name] = true;

    // when audio ends, mark bookmark as not having active sound
    sfx.addEventListener("ended", () => {
      this._playingBookmarks[bookmark.name] = false;

      // ensure rendering after updating bookmark status
      this.scheduleRender();
    });

    sfx.play();
  }
}

export = CustomBookmarks;
