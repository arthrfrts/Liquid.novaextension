## Version 1.2

**New:**

- **Liquid on Markdown and Liquid on CSS/SCSS**  
  You can now use Liquid in your Markdown, CSS and SCSS files.

**To do:**

- Liquid for Nova still doesn't figure out automatically if you're writing Liquid on Markdown and CSS files. I plan to look further in file matches and detectors to fix this issue.

### Version 1.2.1

**Fixes:**

- Removes the experimental detectors for Liquid on SCSS, CSS and Markdown. I still can't figure it out how make them work.

## Version 1.1

**New:**

- **v1.1 brings Completions!**
  Liquid for Nova now supports code completions for both Liquid and Jekyll tags and filters.

### Version 1.1.1

**Chores:**

- Fixes the extension image, broken in the 1.1 release.
- Updates the CHANGELOG with a new, leaner organization.

### Version 1.1.2

**Fixes:**

- Fixes a `capture` completion which generated an invalid syntax.
- Prevents Nova to spell-check the `{% comment %}` tag.

***

## Version 1.0

Initial release

### Version 1.0.1

**Fixes:**

- Removes YAML block, since that didn't worked.
- Improves Liquid tag support in Nova 4.0+.


### Version 1.0.2

**Enhancements:**

@fifty8 made the following enhancements:

- Modified priority of html to 0.5 (value is valid between 0-1) (#1) (also a bugfix).
- Added content matching rule for liquid handlebar (#1).


### Version 1.0.3

**Fixes:**

- Fix an issue where all `.html` files were identified as Liquid files (#2).
