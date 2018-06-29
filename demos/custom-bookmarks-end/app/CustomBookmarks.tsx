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
  bookmarkContainer: "esri-bookmarks__bookmark-container",
  bookmarkIcon: "esri-bookmarks__bookmark-icon",
  bookmarkImage: "esri-bookmarks__image",
  bookmarkName: "esri-bookmarks__bookmark-name",
  bookmarkActive: "esri-bookmarks__bookmark--active",

  // custom
  customBookmarkIcon: "esri-bookmarks__bookmark-icon--custom",
  bookmarkIconActive: "esri-bookmarks__bookmark-icon--active"
};

const AUDIO_SFX = require.toUrl("./assets/pipe.wav");

@subclass("esri.widgets.CustomBookmarks")
class CustomBookmarks extends declared(Bookmarks) {
  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  private _animatedBookmarks: HashMap = {};

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _renderBookmark(bookmark: Bookmark): any {
    const { active, name, thumbnail } = bookmark;

    const bookmarkClasses = {
      [CSS.bookmarkActive]: active
    };

    const bookmarkIconClasses = {
      [CSS.bookmarkIconActive]: !!this._animatedBookmarks[bookmark.name]
    };

    const imageSource = (thumbnail && thumbnail.url) || "";

    const imageNode = imageSource ? (
      <div class={CSS.bookmarkContainer}>
        <img src={imageSource} alt={name} class={CSS.bookmarkImage} />
      </div>
    ) : (
      <span
        aria-hidden="true"
        class={this.classes(CSS.bookmarkIcon, CSS.customBookmarkIcon, bookmarkIconClasses)}
      />
    );

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
        {imageNode}
        <span class={CSS.bookmarkName}>{name}</span>
      </li>
    );
  }

  @accessibleHandler()
  private _goToBookmark(event: Event): void {
    const node = event.currentTarget as Element;
    const bookmark = node["data-bookmark-item"] as Bookmark;
    this.viewModel.goTo(bookmark);

    this._cueFX(bookmark);
  }

  private _cueFX(bookmark: Bookmark): void {
    const sfx = new Audio(AUDIO_SFX);
    sfx.play();

    this._animatedBookmarks[bookmark.name] = true;

    setTimeout(() => {
      this._animatedBookmarks[bookmark.name] = false;
      this.scheduleRender();
    }, 1000);
  }
}

export = CustomBookmarks;
