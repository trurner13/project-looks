# project-looks

Animated backdrops for the Claude desktop app, one per project, so you can tell at a glance which project a window is. A wide window puts the art beside the chat. A narrow one moves it to the top-right corner.

## Install

In Claude Code, type:

```
/plugin install project-looks --marketplace trurner13/project-looks
```

Answer `y` to add the marketplace, then pick a scope (user scope gives you the looks in every project). The looks show in new sessions.

## Use

| Command | What it does |
| --- | --- |
| `/project-look` | lists the looks |
| `/project-look <name>` | sets the look for this project |
| `/project-look <name> everywhere` | sets the default for projects with no look of their own |
| `/project-look reset` | makes this project follow the default again |
| `/project-look off` | turns the backdrop off in this project |

## The looks

| Name | What it shows |
| --- | --- |
| `night-reef` | a turtle and a manta ray in tile mosaic, gliding over a lagoon at night (the default) |
| `atomic-goats` | the Atomic Goats goat-and-orbit mark in gold dots on plum, with orbiting electrons |
| `body-scan` | a wireframe body with a measuring band scanning down it |
| `applications-board` | an amber LED departure board of job applications |
| `night-lab` | a school chemistry bench after hours, with a bubbling flask over a Bunsen burner |
| `cyanotype` | a blueprint orbit plot and a drop pod in white lines |
| `heraldic-banners` | two swaying army banners with their troops facing off |
| `black-hole` | six halftone planets orbiting a black hole |
| `hex-station` | a honeycomb space-station wall, its window onto a banded planet |
| `observatory` | a brass porthole and a telescope, a ringed planet drifting by |
| `alien-aurora` | green and blue aurora over an alien ridge with two moons |

## Give your own repos a look automatically

`REPO_LOOKS` in `hooks/register.tsx` is empty. Add your folders to it, for example `'c:/code/my-repo': 'night-lab'`, and each one starts on its look before you ever pick one.

## Credits

Night Reef is copied unchanged from Anthropic's theme-examples plugin, under the Apache License 2.0 (see `LICENSE-night-reef`). `hooks/make-colors.js` is the colour helper from Claude Code's plugin-authoring kit. The Atomic Goats mark belongs to Atomic Goats. Don't reuse it outside this plugin.
