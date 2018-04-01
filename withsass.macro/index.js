const { createMacro } = require("babel-plugin-macros");
const path = require('path')

module.exports = createMacro(rawMacros);

function rawMacros({ references, state, babel }) {
  references.default.forEach(referencePath => {
    if (referencePath.parentPath.type === "CallExpression") {
      requireRaw({ referencePath, state, babel });
    } else {
      throw new Error(
        `This is not supported: \`${referencePath
          .findParent(babel.types.isExpression)
          .getSource()}\`. Please see the withsass.macro documentation`,
      );
    }
  });
}

function requireRaw({ referencePath, state, babel }) {
  const t = babel.types;

  const params = referencePath.parentPath.node.arguments.map(e => e.value)

  referencePath.parentPath.replaceWithSourceString(
    `require(${JSON.stringify(path.resolve(__dirname, "./withSASS.es6"))}).default(
        ${params.map(e => `  require(${JSON.stringify(e)})`).join(',\n')}
    )
    `
  );
}