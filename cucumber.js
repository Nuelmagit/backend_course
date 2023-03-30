const requires = [
  `--require-module @babel/register`,
  `--require specs/step_definitions/*.js`
];

module.exports = {
  default: `--format-options '{"snippetInterface": "synchronous"}' --publish-quiet ${requires.join(
    " "
  )}`
};
