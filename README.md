# chromanomicon
A robust color scheme generator -- multiple sections, color harmonies and more. Works with bootstrap 3 and beyond!

## Why?

I liked tools like https://github.com/rriepe/1pxdeep, https://github.com/wizardg/paintstrap, and https://github.com/mquan/lavish, but they either 1. Only offer shades of color, making it very limited, or 2. Were generated without any guidance on preventing clashing or hard-to-read color schemes. In short, it didn't really "design" a scheme, just generated a semblance of color. While totally awesome in their own right, they seemed lacking for a full-fledged website scheme that you might expect a professional to create.

## How?

Having a background in design made this a bit easier, but I spent a lot of time studying up popular designs on sites like behance.net and dribbble.com in search of the "secret sauce" for the perfect color scheme.

After a lot of trial and error, (see the first versions: http://christabor-archive.github.io/schkmer/), I decided to simplify things and focus on creating a *great blueprint for multi-sectional color scheme*.

To that end, chromanomicon focuses on generating 3-color based sectional layouts, that borrow colors from each section to create a single cohesive look. This was a common thread I found in many of the popular app and website designs on dribbble. It also generates a black and white version, with some subtle highlights and colors.

### CSS

CSS Is generated automatically, and used within the page. The CSS is not ultra optimized, but used with a minifier, it can easily work out of the box. Just add bootstrap (or dont, just remember to delete any unecessary CSS), drop the stylesheet in, and add the section classes you want, however you want.

## What?

My focus was to create an overall color scheme, using the following color harmonies:

* Complementary
* Triadic
* Tetradic
* Split Complementary
* Monochromatic

Within each of these harmonies, a multi-section approach to colors has been created. This allows alternating the color harmonies in a few different forms, giving rise to complex designs that are consistent and harmonious.

Other cool stuff out of the box:

* Stylesheet Generation
* Gradient color schemes
* Automatic adjustment of foreground/background colors to preserve clarity
* Hover states

## To-Do

* Finish Bootstrap 3 state-based buttons (auto-adjusting of hue/saturation)
* Any other polish of BS3

### Notes/credits/etc

Most of the heavy lifting is done by the fantastic [tinycolor](https://github.com/bgrins/TinyColor) library. This tool unifies some of the many utilities into one powerful color scheme generator.
