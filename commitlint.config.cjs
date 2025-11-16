module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Allow any subject case (including capitalized first letter)
    "subject-case": [0],
  },
};