const sh = require('shelljs');
const isUpToDate = require('.');
const assert = require('assert');

describe('isUpToDate', () => {
  before((done) => {
    // Make name somwhat unique, to avoid erasing good stuff even by remote chance
    const testDir = 'testdir-source-and-targets';
    if (sh.test('-d', testDir)) {
      sh.rm('-rf', testDir);
    }

    // Make clean test directory and switch to it
    sh.mkdir(testDir);
    sh.cd(testDir);

    // Files with earlier date
    sh.touch('oldSrc1.txt');
    sh.touch('oldSrc2.txt');
    sh.touch('oldTarget1.txt');
    setTimeout(() => {
      // Files with newer date
      sh.touch('newSrc1.txt');
      sh.touch('newSrc2.txt');
      sh.touch('newTarget1.txt');
      done();
    }, 100);
  });
  it('should return true, if target file is newer than all source files', () => {
    assert.strictEqual(isUpToDate('oldSrc*.*', 'newTarget1.txt', { verbose: true }), true);
  });
  it('should return false, if target file is older than at least some source files', () => {
    assert.strictEqual(isUpToDate('*Src*.*', 'oldTarget1.txt', { verbose: true }), false);
  });
  it('should work without options', () => {
    assert.strictEqual(isUpToDate('oldSrc*.*', 'newTarget1.txt'), true);
    assert.strictEqual(isUpToDate('*Src*.*', 'oldTarget1.txt'), false);
  });
  it('should support several patterns', () => {
    assert.strictEqual(isUpToDate(['oldSrc1.txt', 'oldSrc2.txt'], 'newTarget1.txt', { verbose: true }), true);
    assert.strictEqual(isUpToDate(['oldSrc*', 'newSrc*'], 'oldTarget1.txt', { verbose: true }), false);
  });
});
