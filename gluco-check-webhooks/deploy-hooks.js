// @ts-check
/* eslint-disable node/no-unpublished-require */
/* eslint-disable no-prototype-builtins */

const filenamePackage = 'package.json';
const filenamePackageBackup = 'package.json.backup';
const localPackagePrefix = 'gluco-check-';

const package = require(`./${filenamePackage}`);
const fs = require('fs');
const {resolve} = require('path');
const shell = require('shell-exec');
const currentDir = resolve('.');

/*
 * Firebase Functions do not support monorepos or 'local' packages.
 * I'm using a workaround described here:
 * https://github.com/cjmyles/firebase-monorepo/tree/fc18b58c38f475aabf7125cda4a6ee0c0e09ca97
 * Pre deploy, webhooks' package.json is scanned for gluco-check-* dependencies.
 * These are then packed into tarballs, and copied into this directory.
 * Then package.json is updated to point to these tarballs instead of the local package dirs
 * In post deploy, we undo these changes again.
 */

const preDeploy = () => {
  // Find gluco-check-* packages
  const localPackages = [];
  for (const key in package.dependencies) {
    if (
      key.startsWith(localPackagePrefix) &&
      package.dependencies.hasOwnProperty(key)
    ) {
      localPackages.push(key);
    }
  }

  // Pack local packages into tarballs
  localPackages.forEach(async pkgName => {
    const pkgDir = resolve('../', pkgName);
    package.dependencies[pkgName] = `file:./${pkgName}.tar.gz`;
    await shell(`yarn pack . --filename ${currentDir}/${pkgName}.tar.gz`, {
      cwd: pkgDir,
    });
  });

  // Write updated package.json
  fs.existsSync(filenamePackageBackup) && fs.unlinkSync(filenamePackageBackup);
  fs.renameSync(filenamePackage, filenamePackageBackup);
  fs.writeFileSync(filenamePackage, JSON.stringify(package));
};

const postDeploy = () => {
  // Restore original package.json
  fs.unlinkSync(filenamePackage);
  fs.renameSync(filenamePackageBackup, filenamePackage);

  // Delete tarballs
  fs.readdirSync(currentDir).forEach(file => {
    if (file.startsWith(localPackagePrefix) && file.endsWith('tar.gz')) {
      fs.unlinkSync(file);
    }
  });
};

switch (process.argv[2]) {
  case '--pre':
    console.log('Running pre-deploy hook');
    preDeploy();
    break;
  case '--post':
    console.log('Running post-deploy hook');
    postDeploy();
    break;
  default:
    throw 'deploy-hooks must be called with either --pre or --post';
}
