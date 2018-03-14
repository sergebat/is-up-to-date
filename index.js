const glob = require('globby');
const fs = require('fs');

module.exports = function isUpToDate(sourceGlob, targetFileName, options) {
  const effectiveOptions = options || {};
  if (!effectiveOptions.verbose) {
    effectiveOptions.verbose = false;
  }

  const sourceGlobArray = Array.isArray(sourceGlob) ? sourceGlob : [sourceGlob];
  const sourceFileNames = glob.sync(sourceGlobArray);

  // If anything did not go well, we'll return false and log warning
  if (!sourceFileNames || sourceFileNames.length === 0) {
    console.warn(`Source glob pattern returned no files: ${sourceGlob}`);
    return false;
  }

  let maxSourceDate = 0;
  for (let i = 0; i < sourceFileNames.length; i += 1) {
    if (effectiveOptions.verbose) {
      console.log(`Source file: ${sourceFileNames[i]}`);
    }
    const fileDate = fs.statSync(sourceFileNames[i]).mtimeMs;
    if (effectiveOptions.verbose) {
      console.log(`File date: ${fileDate}`);
    }
    if (fileDate > maxSourceDate) {
      maxSourceDate = fileDate;
    }
  }

  if (effectiveOptions.verbose) {
    console.log(`Source file date (maximum among files): ${maxSourceDate}`);
  }

  let targetDate;
  try {
    targetDate = fs.statSync(targetFileName).mtimeMs;
  } catch (e) {
    console.warn(`Cannot read target file, assuming it is not generated: ${targetFileName}`);
    return false;
  }

  const result = targetDate > maxSourceDate;
  if (effectiveOptions.verbose) {
    console.log(`Target File: ${targetFileName}`);
    console.log(`Target File Date: ${targetDate}`);
    console.log(`Result (target is up-to-date with source?): ${result}`);
  }

  return result;
};
