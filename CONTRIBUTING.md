# Contributing to Anima theme
First of all, hats off for thinking about contributing.

The following is a set of guidelines for contributing to Anima theme. These are mostly guidelines, not rules. Use your best judgement, and feel free to propose changes to this document in a pull requet.

#### How can I contribute?
- [Reporting bugs](#reporting-bugs)
- [Contributing code](#contributing-code)
- [Feature requests and ideas](#feature-requests-and-ideas)

## Reporting bugs
Bugs are tracked as GitHub issues. Before opening a new issue bug on the project's issues page, first make sure that the issues is caused by Anima theme.

If you found a bug, the quickest way to get help would be to look through existing open and closed GitHub issues. If the issue is already being discussed and hasn't been resolved yet, you can join the discussion and provide details about your problem. If this is a new bug, please [open a new issue](https://github.com/pixelgrade/anima/issues/new?assignees=&labels=%5BType%5D+Bug&template=bug_report.md&title=).

## Contributing code
An overview of the process for contributors is:
1. Fork the Anima repository.
2. Clone the forked repository locally.
3. Create a new branch.
4. Make your changes and test thoroughly.
5. Commit your changes when you’re happy with them.
6. Push the branch to the forked repository.
7. Submit a pull request to the Anima repository.

### Prerequisites
We require certain **Node.js (v14)** and **PHP (v7.4**) versions and the easiest way to install and manage node is to use the [Node Version Manager ](https://github.com/nvm-sh/nvm) (nvm).

For the `zsh` shell you can use [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh) with the `nvm` [plugin](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/nvm) activated.

We use the following list of `oh-my-zsh` plugins: `plugins=(composer git nvm npm)` configured in `~/.zshrc`. 

For automatic node version switching, place the following line in `~/.zshrc` file, just below the plugins line: `NVM_AUTOLOAD=1`. 

Now whenever you enter a directory through the shell, if it finds a `.nvmrc` file, it will switch to the specified node version.

### Getting the Anima theme code
Fork the Anima repository and then clone it to your computer using the terminal:
```
$ git clone https://github.com/your-username/anima
$ cd anima
```

### Building Anima theme
The Anima theme build system uses NodeJS. To set up it up, you first need to make sure you have NodeJS installed on your machine. Then run the following command in the project root folder to install dependencies:
```
npm install
npm run dev
```

## Feature requests and ideas
We track discussions of new features, proposed changes, and other ideas as GitHub issues. If you would like to discuss one of those, please first look through existing open and closed GitHub issues and see if there is already a discussion on this topic which you can join. If there isn't, please [open a new issue](https://github.com/pixelgrade/anima/issues/new?assignees=&labels=%5BType%5D+Feature&template=feature_request.md&title=).

When discussing new ideas or proposing changes, please take the time to be as descriptive as possible about the topic at hand. Please take the time to explain the issue you are facing, or the problem you propose to solve in as much detail as possible.