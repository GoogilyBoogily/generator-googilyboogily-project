'use strict';

const Generator = require('yeoman-generator');
const mkdirp = require('mkdirp');

module.exports = class extends Generator {
  initializing() {
    this.props = {};
    this.answers = {};
  }

  prompting() {
    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name.',
        default: this.appname.replace(/ /g, '-') // Default to current folder name
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description.',
        default: ''
      },
      {
        type: 'input',
        name: 'repositoryName',
        message: 'Project repo name.',
        default: this.appname.replace(/ /g, '-') // Default to current folder name
      }
    ]).then((answers) => {
      this.log('App name', answers.name);
      this.log('App description', answers.description);
      this.log('App repository name', answers.repositoryName);

      this.answers = answers;
    });
  }

  writing() {
    this._copyProjectFiles();
  }

  configuring() {
    this._copyDotfiles();
  }

  _copyDotfiles() {
    this.log('-- Copying dotfiles --');

    mkdirp.sync(this.destinationPath('.vscode/'));

    this.fs.copy(
      this.templatePath('.vscode/launch.json'),
      this.destinationPath('.vscode/launch.json')
    );

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    );

    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copy(
      this.templatePath('eslintignore'),
      this.destinationPath('.eslintignore')
    );

    this.fs.copy(
      this.templatePath('eslintrc.json'),
      this.destinationPath('.eslintrc.json')
    );

    this.fs.copy(
      this.templatePath('npmignore'),
      this.destinationPath('.npmignore')
    );
  }

  _copyProjectFiles() {
    this.log('-- Copying project files --');
    mkdirp.sync(this.destinationPath('src/'));
    mkdirp.sync(this.destinationPath('test/unit/src/'));
    mkdirp.sync(this.destinationPath('test/integration/'));

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {
        projectName: this.answers.name
      }
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        projectName: this.answers.name,
        projectDescription: this.answers.description,
        projectRepositoryName: this.answers.repositoryName
      }
    );

    this.fs.copy(
      this.templatePath('src/index.js'),
      this.destinationPath('src/index.js')
    );
    this.fs.copy(
      this.templatePath('src/config.js'),
      this.destinationPath('src/config.js')
    );
    this.fs.copy(
      this.templatePath('test/unit/src/index.spec.js'),
      this.destinationPath('test/unit/src/index.spec.js')
    );
    this.fs.copy(
      this.templatePath('test/integration/integration.spec.js'),
      this.destinationPath('test/integration/integration.spec.js')
    );
  }

  install() {
    this._installNpmPackages();
    this._runGitInit();
  }

  _installNpmPackages() {
    this.log('-- Installing dev dependencies via NPM --');
    this.spawnCommandSync(
      'npm',
      [
        'install',
        'eslint-config-googilyboogily',
        'eslint',
        'rimraf',
        '--save-dev',
        '--save-exact'
      ]
    );
  }

  _runGitInit() {
    this.log('-- Initializing Git repository --');
    this.spawnCommandSync(
      'git',
      [
        'init'
      ]
    );

    const generatedPackageJson = require(this.destinationPath('package.json'));

    if (generatedPackageJson.repository) {
      const repoGit = generatedPackageJson.repository.url;

      this.log(`Setting Git origin to '${repoGit}'.`);
      this.spawnCommandSync('git',
        [
          'remote',
          'add',
          'origin',
          repoGit
        ]);
    }

    this.log('-- Git add all --');
    this.spawnCommandSync(
      'git',
      [
        'add',
        '--all'
      ]
    );

    this.log('-- Making initial commit --');
    this.spawnCommandSync(
      'git',
      [
        'commit',
        '-m',
        'Initial commit.',
        '--quiet'
      ]
    );

    this.log('-- Creating and checking out to "development" --');
    this.spawnCommandSync(
      'git',
      [
        'checkout',
        '-b',
        'development',
        '--quiet'
      ]
    );

    this.log('-- Repo all set up, but you still need to push! --');
  }
};
