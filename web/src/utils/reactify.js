/**
 * Wraps AlpineJS $store vars in a getter, which allows for reactivity after a $store var is passed as a string prop between Astro components
 *
 * If Component X imports Component Y.
 * And Y expects certain props that need to be Alpine $store vars,
 * pass through the $store vars as String props from X.
 * Then in Y, call reactify() on them in the code-fences and pass them to x-data.
 *
 * @param {String} $storeObj - The $store object as String, for ex. "$store.x.y"
 * @param {String} objName - String "y" in "$store.x.y(arg)"" || "$store.x.y()"" || "$store.x.y"
 */
export default ($storeObj, objName) => {
  //
  //  How the SIGNATURE_ARG_REGEX regex works -
  //
  //  if $storeObj is "$store.x.y(arg)"
  //  regex grabs "(arg)"
  //
  //  if $storeObj is "$store.x.y()" || "$store.x.y"
  //  regex grabs ""
  //

  const SIGNATURE_ARG_REGEX = /\([^()]*[^() ][^()]*\)/;
  const REGEX_RESULT = $storeObj.match(SIGNATURE_ARG_REGEX);

  // if arg present, returns `get objName(arg) { return (arg) => { return $store.x.y(arg); } }`
  if (REGEX_RESULT)
    return `get ${objName}() { return ${REGEX_RESULT} => ${$storeObj}; }`;
  // if no arg, returns `get objName() { return $store.x.y(); }` || `get objName() { return $store.x.y; }`
  else {
    return `get ${objName}() { return ${$storeObj}; }`;
  }
};
