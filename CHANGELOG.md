## Version 2.0 🌳
Released July 30, 2024.

**Tree-sitter!** I finally managed to migrate this extension to be a Tree-sitter language, using the tree-sitter library to support rich syntax rules.

This is an initial release, to prepare for the release of Nova 13, which will drop support for the legacy Regex language extensions later this year. So, somethings to consider before updating:

* There is not support for some custom Jekyll tags, such as `include_cached`, `seo`, and `feed_meta`. I'm looking into adding these custom tags back to the extension soon.
* SCSS (Liquid) and CSS (Liquid) were removed. Both never worked great before, so I'm planning to start fresh this time and try to reimplement it in a better way in the future.
* I plan to rewrite the Completions in the future, stay tuned!

Also, some bugs were fixed --- mostly under the hood (like variables being considered methods). One major fix was in detectors. Now I believe HTML and Markdown files will be properly detected without conflicting with their non-Liquidfied counterparts :)

Please, help me make this new major version better by filing bugs and giving feedback on [GitHub](https://github.com/arthrfrts/Liquid.novaextension). Thanks!

## Version 2.2

**New:**

- **New subsyntaxes**  
  Thanks to @hello-jeff who managed to add subsyntaxes for Liquid in CSS, SCSS, JavaScript and JSON files!
- **Better completions**  
  Removed the v2.0 scripts and brought back our classic completions (with some new additions)

**Updates:**

- Updated the Liquid grammar by @hankthetank27 with some bug fixes.

### Version 2.1

**New:**

- **Completions!**  
  I finally managed to add completions with tree-sitter support back to the language. 🎉
- **Front-matter**  
  Adds support for front-matter in HTML and Markdown files.

### Version 2.0.1

**New:**

- **Initial support for Jekyll-specific syntax**  
	Jekyll-specific tags, such as `{% link %}` and `{% feed_meta %}` are supported.

**Fixes:**

- **Fixes code-injections for Markdown**  
	Prevents HTML (Liquid) files to think they're actually Markdown files. They're not!
- **Fixes support for filters**  
	Sorry about that! Filters are working as it should have since v2.0 release.
  
### Version 2.0.2

**New:**

- **New tags**  
  Added support for Jekyll `include_relative` tag.
- **Updates tree-sitter dylib**  
  Following latest release by @hankthetank27.

***

## Version 1.2

**New:**

- **Liquid on Markdown and Liquid on CSS/SCSS**  
  You can now use Liquid in your Markdown, CSS and SCSS files.

**To do:**

- Liquid for Nova still doesn't figure out automatically if you're writing Liquid on Markdown and CSS files. I plan to look further in file matches and detectors to fix this issue.

### Version 1.2.1

**Fixes:**

- Removes the experimental detectors for Liquid on SCSS, CSS and Markdown. I still can't figure it out how make them work.

### Version 1.2.2

**Chores:**

- Updates extension icon.

### Version 1.2.3

**Fixes:**

- Adds detectors for Liquid on CSS, SCSS and Markdown files.

#### Version 1.2.3-1

**Chores:**

- Updates changelog.


### Version 1.2.4

**Fixes:**

- Fixes an issue with Markdown (Liquid) detector that activated in all cases.

### Version 1.2.5

**Ongoing:**

- Removes detectors for Liquid subsyntaxes other than HTML, since they do not provide the quality I'm aiming for as of yet.

***

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
