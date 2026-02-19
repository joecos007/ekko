module.exports = {
  extends: ["stylelint-config-standard"],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "layer",
          "variants",
          "responsive",
          "screen",
          "config",
          "theme",
          "plugin",
          "custom-variant",
          "source",
        ],
      },
    ],
    "selector-class-pattern": null,
  },
};
