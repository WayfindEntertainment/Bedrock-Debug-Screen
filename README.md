# Bedrock Debug Screen

[![Licensed under the GPL version 3.0](https://img.shields.io/github/license/GraphicArtQuest/Blender-Scripting-Assistant?color=blue)][license]
[![Maintained](https://img.shields.io/badge/Maintained%3F-Yes-brightgreen.svg)][maintainer]
[![Contributions welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg?style=flat)](#contributions)

![Debug Screen Logo, a block of bedrock with a red bug logo crawling on the side](./Source%20Behavior%20Pack/pack_icon.png)

# What Does This Pack Do?

Minecraft Bedrock lacks a debug screen (unless you have one of the developers' copies, that is). If you have played the Java version, you might be familiar with how useful that screen is. This behavior pack brings some of that functionality into Bedrock.


# Adding It To Your Worlds

## How to Install

Download the [latest version](https://github.com/GraphicArtQuest/Bedrock-Debug-Screen/releases/latest) of the addon. Once downloaded, double click it to run. Minecraft will automatically import the addon.

Your world will need to enable the Beta APIs in the game settings for this addon to work. Please note that this is an irreversible setting change.

## Using In Game

Once you are playing, bring up the chat menu (default key binding is <kbd>T</kbd>). Then, type

    !debug on

and press enter. When you close the chat window, you'll now see a debug screen like this:

![Bedrock debug screenshot in action](./images/Debug%20screen%20in%20action.jpg)

When you no longer want to see this information, open the chat menu again and type

    !debug off

then press enter. Now when you close the window that debug screen will go away.

## Troubleshooting

### Requesting dependency on beta APIs

```
[Scripting][error]-Plugin [Minecraft Bedrock Debug Screen - 2.0.0] - requesting dependency on beta APIs [@minecraft/server - 1.12.0-beta], but the Beta APIs experiment is not enabled.
```

You have activated the add-on correctly, but you need to activate the Beta APIs in your game settings.

### Unknown command: !

```
Unknown command: !. Please check that the command exists and that you have prmission to use it.
```

You have accidentally entered the command with the '/' preceding the '!'. You must remove the slash before entering the command.

## Debug Screen Limitations

- Weather will display as "Not yet identified" until there is a weather change event. This is an API limitation I have not figured out how to overcome yet.
- When looking at blocks that are in unloaded chunks, the "Looking at Block" section will say "None".
- I have not found a way to identify block lighting levels yet. There does not seem to be an API call for this info.

# Contributions

Contributions are welcome! Please help keep this project open and inclusive. Refer to the [Code of Conduct](https://github.com/GraphicArtQuest/.github/blob/main/CODE_OF_CONDUCT.md) before your first contribution.

***REMEMBER THIS IS A PROJECT WITH CHILDREN AS A SIGNIFICANT PART OF THE TARGET AUDIENCE!***

While I don't expect most children to delve into the intricacies of software development, the older they get the more likely they are to search things like this out. And even if they don't come to this particular project repository, they are still the target audience of the developed mod itself. Therefore, keep the rating for this project at a PG level or better.

<details>
<summary><i>See more contributing instructions</i></summary>

Here are some ways you can contribute.

## Submit Issues

**Bug Reports**: Be as detailed as possible, and fill out all information requested in the [bug report template][choose issue].

*For security related issues, see the [security policy][security policy].*

**Documentation Requests**: Is something unclear in the documentation or the API? Submit a [documentation change request][choose issue]! Be as detailed as possible. If you have the question, chances are someone else will also who isn't as willing to speak up as you are.

## Propose New Features

Feature requests are welcome! Before submitting, take a moment to make sure your feature idea fits within the scope and aims of this project. This behavior pack aims to provide a light weight and non-intrusive way to show debug information to players. Be as detailed as possible when filling out a [new feature request][choose issue]. It is up to you to make your case of why the feature should get included!

**Please ask** before embarking on any significant undertaking by opening an issue for the proposal, otherwise you risk wasting time on something that might not fit well with the project. 

## Submit a Pull Request

Good pull requests are outstanding help. They should remain focused in scope and avoid unrelated commits.

To submit a pull request,

1. Fork and clone the repository
1. Create a branch for your edits
1. Make sure your work follows the [Common Commit Guidance][wf common commit] guidance

## Development Environment

This project uses a Node environment to help with linting, formatting, testing, and distribution. To install a local copy, clone the repository:

```bash
git clone https://github.com/GraphicArtQuest/Bedrock-Debug-Screen.git
cd Bedrock-Debug-Screen
```

Use the command `npm run dev` to package the source files into the Minecraft behavior pack development folder.

All commits must follow the [Wayfind Entertainment Common Commit Guidance][wf common commit]. *This specification is inspired by and supersedes the [Angular Commit Message](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit).* This project has no custom scopes.

</details>

# License

To help as many fellow developers as possible, this behavior pack and all other files in this repository are distributed as free and open-source software under the [GPL v3.0 License][license], © 2023.

# Contact

If you find this project useful, please leave a :star2: and subscribe to the Graphic Art Quest YouTube channel for tutorials and 3D graphic art adventures!

[![Subscribe to the Graphic Art Quest YouTube channel](https://img.shields.io/badge/Subscribe%20to%20Graphic%20Art%20Quest-FF0000?style=plastic&logo=youtube&logoColor=white)][subscribe]

Maintained by [M. Scott Lassiter][maintainer].


[![GitHub Badge Profile](https://img.shields.io/badge/GitHub-100000?style=plastic&logo=github&logoColor=white)](https://github.com/M-Scott-Lassiter)
[![Twitter Badge Profile](https://img.shields.io/badge/Twitter-1DA1F2?style=plastic&logo=twitter&logoColor=white)](https://twitter.com/MScottLassiter)
[![LinkedIn Badge Profile](https://img.shields.io/badge/LinkedIn-0077B5?style=plastic&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mscottlassiter)
[![Stackoverflow Badge Profile](https://img.shields.io/badge/stackoverflow-orange.svg?longCache=true&style=plastic&logo=stackoverflow&logoColor=white)](https://stackoverflow.com/users/6186333/sandpiper)

[license]: LICENSE.txt
[maintainer]: https://graphicartquest.com/author/scott-lassiter/
[subscribe]: https://www.youtube.com/channel/UCFYKeFMbQnY5CdzFH62PAhg?sub_confirmation=1
[security policy]: https://github.com/GraphicArtQuest/Bedrock-Debug-Screen/security/policy
[choose issue]: https://github.com/GraphicArtQuest/Bedrock-Debug-Screen/issues/new/choose
[enhancements requested]: https://github.com/GraphicArtQuest/Bedrock-Debug-Screen/labels/enhancement
[wf common commit]: https://github.com/WayfindEntertainment/Common-Commit-Guidance/
