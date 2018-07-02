# Extending View Demo: Steps

**Note**: Steps assume development environment has been previously set up.

Please refer to the following for more information:

- [Setting up TypeScript](https://developers.arcgis.com/javascript/latest/guide/typescript-setup/index.html)
- [Widget Development](https://developers.arcgis.com/javascript/latest/guide/custom-widget/index.html)
____________

1. First we'll take a look at the main files that make up our demo:
    - `index.html` - simple app setup: imports app and custom CSS
    - `main.ts` - simple app with a map and our custom widget
    - `CustomBookmarks.tsx` - widget extension boilerplate
    - `CustomBookmarks.css` - precooked widget CSS

1. For the next step, we'll look at how the current Bookmarks widget works
    - Go to [Bookmarks SDK](https://developers.arcgis.com/javascript/latest/api-reference/esri-widgets-Bookmarks.html) and navigate to view file (TSX).
        - all widget views are available on GitHub
        - inside look at how we develop widgets
    - We'll focus on `render()`. For our demo, we want to modify the markup for individual basemap items, which is produced by `_renderBookmark`.

1. Let's copy over `_renderBookmark` and some dependencies to finish setting up our custom widget.

    ```tsx
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
    
      const imageSource = (thumbnail && thumbnail.url) || "";
    
      const imageNode = imageSource ? (
        <div class={CSS.bookmarkContainer}>
          <img src={imageSource} alt={name} class={CSS.bookmarkImage} />
        </div>
      ) : (
        <span aria-hidden="true" class={this.classes(CSS.bookmarkIcon, CSS.widgetIcon)} />
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
    }
    ```

    TypeScript will let us know that we are missing some imports and variables, so let's copy those too.

    ```tsx
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
      widgetIcon: "esri-icon-bookmark"
    };
    ```

    Our code now compiles and renders as it originally did, so let's start customizing!

1. Let's start by adding a method to play a sound effect when called

    ```tsx
    private _play(): void {
      const sfx = new Audio(require.toUrl("./assets/pipe.wav"));
      sfx.play();
    }
    ```

1. Let's call this method when a bookmark is clicked in `_goToBookmark`.


    ```tsx
    @accessibleHandler()
    private _goToBookmark(event: Event): void {
      const node = event.currentTarget as Element;
      const bookmark = node["data-bookmark-item"] as Bookmark;
      this.viewModel.goTo(bookmark);
  
      this._play();
    }
    ```

    *Demo Time*

1. We want to update the styles when the sound is played, so let's update `_play` to keep track of playing bookmarks.

    ```tsx
    // update signature to accept bookmark
    private _play(bookmark: Bookmark): void {
      const sfx = new Audio(require.toUrl("./assets/pipe.wav"));
  
      // register bookmark as active 
      this._playingBookmarks[bookmark.name] = true;
  
      // register bookmark as inactive when playback ends
      sfx.play().then(() => {
        sfx.addEventListener("ended", () => {
          this._playingBookmarks[bookmark.name] = false;
          this.scheduleRender();  // ensure rendering after updating bookmark status
        });
      });
    }
    ```

    TypeScript will complain about the missing `_playingBookmarks`, so let's define it.

    ```tsx
    //--------------------------------------------------------------------------
    //
    //  Variables
    //
    //--------------------------------------------------------------------------
  
    private _playingBookmarks: HashMap<boolean> = {};  
    ```

    **Note:** We have now updated the widget to play a sound effect whenever a bookmark is clicked and the bookmark is also marked as active during the sound effect playback. Let's add some visual flair to the demo.

1. For our purposes, we want to always show an icon, so let's simplify `_renderBookmark` by removing the code to render bookmark thumbnails.

    ```tsx
    // thumbnail-less `_renderBookmark`
    private _renderBookmark(bookmark: Bookmark): any {
      const { active, name } = bookmark;
  
      const bookmarkClasses = {
        [CSS.bookmarkActive]: active
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
          <span aria-hidden="true" class={this.classes(CSS.bookmarkIcon)} />
          <span class={CSS.bookmarkName}>{name}</span>
        </li>
      );
    }
    ```

2. Now, let's modify the icon node and add a custom CSS class to replace `CSS.widgetIcon`.

    ```tsx
    <span
      aria-hidden="true"
      class={this.classes(CSS.bookmarkIcon, CSS.customBookmarkIcon)}
    />
    ```

    TypeScript will let us know that `CSS.customBookmarkIcon` isn't defined. Let's take care of that.

    ```tsx
    // custom
    customBookmarkIcon: "esri-bookmarks__bookmark-icon--custom",
    ```

    If we look at our demo, we can see that our custom icon now shows up. Let's now add a dynamic class to toggle a CSS class when the bookmark's sound effect is playing.

    ```tsx
    const bookmarkIconClasses = {
      [CSS.bookmarkIconActive]: !!this._playingBookmarks[bookmark.name]
    };
    
    // ...
    
    <span
      aria-hidden="true"
      class={this.classes(CSS.bookmarkIcon, CSS.customBookmarkIcon, bookmarkIconClasses)}
    />
    ```

    Once again, TypeScript reminds us that we're referencing properties that don't exist on `CSS`.

    ```tsx
    bookmarkIconActive: "esri-bookmarks__bookmark-icon--active"
    ```

    At this point we are done customizing, so let's take it for a spin. **shine get!** 🌟
