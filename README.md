# sos-overlays

A [NodeCG](http://github.com/nodecg/nodecg) bundle for [Checkpoint 1's](https://twitter.com/Checkpoint1SPL) in-house Splatoon tournament.

## Before using

This bundle is not intended to be used verbatim. We're open-sourcing this bundle in hopes that people will use it as a thing to learn from, rather than just taking and using it for their own broadcast. We've included all the assets so you can learn from this.

TL;DR: **Do not just download and use this bundle as, make something new for this and learn for it!**

## Install

1.1. Install NodeCG and [nodecg-cli](https://github.com/nodecg/nodecg-cli) (optional)

If you're using nodecg-cli:

2.1. Run `nodecg install inkfarer/checkpoint-overlays`.

2.2. Install the dashboard by running `nodecg install inkfarer/ipl-overlay-controls`

Otherwise:

2.1. Clone checkpoint-overlays to `nodecg/bundles/checkpoint-overlays` and clone [ipl-overlay-controls](https://github.com/inkfarer/ipl-overlay-controls) to `nodecg/bundles/ipl-overlay-controls`.

2.2. Install dependencies by running `npm install` in `nodecg/bundles/checkpoint-overlays` and `nodecg/bundles/ipl-overlay-controls`.

3.1. For last.fm integration to work, create the configuration file at `nodecg/cfg/ipl-overlay-controls.json`.

Example configuration file:
```
{
	"lastfm": {
		"targetAccount": "Your last.fm account name",
		"apiKey": "your API key",
		"secret": "your secret"
	}
}
```

## Usage

Start NodeCG. By default, the dashboard can be accessed from `localhost:9090` in your browser.

From the dashboard, URLs to the graphics can be found from the graphics tab. To use them, they should be added as browser sources in a broadcast application such as OBS Studio. The graphics are made to run at a resolution of 1920x1080.

## Credits

Splatoon 2 map portraits are property of Nintendo and were downloaded from the [Splatoon wiki.](https://splatoonwiki.org/)
