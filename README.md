# vue-sfc-rollup

vue-sfc-rollup is a CLI templating utility that scaffolds a minimal setup for compiling a Vue Single File Component (SFC) - or library of multiple SFCs - into a form ready to share via npm. It doesn't assume any particular flavor of CSS or docs generator, so you can use what you're already used to. It's the fastest way to produce npm-ready vue components!

## TL;DR
Install globally
```bash
# Install globally (recommended)
npm install -g vue-sfc-rollup
sfc-init
```
**OR** use via npx
```bash
# For immediate, no-install usage
npx vue-sfc-rollup
```
Then...
```bash
# Fill in prompts

# Navigate to library folder
cd path/to/my-component-or-lib
npm install

# Do dev stuff
npm run serve

# Run build process
npm run build

# Ready to publish!
```


## Details

The vue-sfc-rollup utility scaffolds 8-13 files (depending on whether you choose library mode and/or typescript support) for you to kick of your SFC development. These files include:
- a minimal [rollup](https://rollupjs.org) config
- a corresponding package.json file with build/dev scripts and dependencies
- a minimal babel.config.js and .browserslistrc file for transpiling
- a wrapper used by rollup when packaging your SFC
- a sample SFC to kick-start development
- a sample usage file which can be used to load/test your component/library during development

In library mode, there is also an 'index' which declares the components exposed as part of your library.

When developing typescript-based components/libraries, the following supporting files will also be created:
- A basic typescript declaration file for your component/library
- Two basic typescript shim declaration files common to vue-typescript development
- A basic tsconfig.json file

If you wish to integrate this into an existing SFC, please check out [the vue-sfc-rollup source](https://github.com/team-innovation/vue-sfc-rollup). The files generated by this utility are located inside the `templates` directory of the repository. Merge the important bits of those file with your existing code, and you'll be good to go.

### Install

If you just want to try [vue-sfc-rollup](https://www.npmjs.com/package/vue-sfc-rollup), you can run it directly via `npx vue-sfc-rollup`.

For repeated use, however, you really should install it globally. To do so, simply open a terminal and execute the following:

```bash
npm install -g vue-sfc-rollup
```

Now, whenever you want to start a new component, you can just type `sfc-init` to run the wizard, and it will scaffold a new SFC for you!

### Using the vue-sfc-rollup wizard

Using the vue-sfc-rollup wizard is simple. With vue-sfc-rollup installed globally, enter the following:
```bash
sfc-init
# Fill in prompts
```
The wizard will then prompt you for the following:

  - *select mode*: Declare whether you want to scaffold a single component or a library of components.
  - *npm name*: This is how people will find your component/library in npm. Please refer to [the official npm docs](https://docs.npmjs.com/files/package.json#name) for details of what to enter here
  - *component name* (Single Component Mode Only): This is the kebab-case version of your SFC component name - what your component's tag would be if you were to use this in an HTML page or another component. Since any kebab-case tag name would also be a safe file name, this will also be the name of the generated files.
  - *javascript/typescript*: Do you wish to use typescript to develop your component/library?
  - *save path*: Where do you want to save this component? By default, the wizard will use your current directory and create a new folder with the kebab-case name as your component/library (eg. ./my-component-or-library).

After prompting you for this information, the wizard then creates copies of the files found in the `templates` directory and performs some variable replacement using the information entered.

### Developing your SFC

vue-sfc-rollup is focused on packaging your SFC for distribution via npm. The [Vue CLI](https://cli.vuejs.org/) is excellent for the actual development process of your SFC, and vue-sfc-rollup comes pre-wired to use this process. With v3 of the Vue CLI installed, you can truly develop your SFC with zero configuration just by entering the following commands:

```bash
# Navigate to library folder
cd path/to/my-component-or-lib
npm install

# Do dev stuff
npm run serve
```

This will start up a webpack dev server with hot reloading and all the other awesomeness!

## Packaging your SFC

Once your development is done, it's time to package your component to publish to npm. The actual process of [publishing to npm](https://docs.npmjs.com/getting-started/publishing-npm-packages) is left up to you, but the whole purpose of this project is to compile your SFC/library so that it's packaged and ready to go.

```bash
# Navigate to library folder
cd path/to/my-component-or-lib

# Run build process
npm run build

# Rollup does its thing...done!
# Ready to publish!
```

Running the build script results in 3 compiled files in the `dist` directory, one for each of the `main`, `module`, and `unpkg` properties listed in your package.json file. With these files are generated, you're ready to go!
