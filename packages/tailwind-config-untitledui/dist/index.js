"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/picocolors/picocolors.js
var require_picocolors = __commonJS({
  "../../node_modules/picocolors/picocolors.js"(exports, module2) {
    var tty = require("tty");
    var isColorSupported = !("NO_COLOR" in process.env || process.argv.includes("--no-color")) && ("FORCE_COLOR" in process.env || process.argv.includes("--color") || process.platform === "win32" || tty.isatty(1) && process.env.TERM !== "dumb" || "CI" in process.env);
    var formatter = (open, close, replace = open) => (input) => {
      let string = "" + input;
      let index = string.indexOf(close, open.length);
      return ~index ? open + replaceClose(string, close, replace, index) + close : open + string + close;
    };
    var replaceClose = (string, close, replace, index) => {
      let start = string.substring(0, index) + replace;
      let end = string.substring(index + close.length);
      let nextIndex = end.indexOf(close);
      return ~nextIndex ? start + replaceClose(end, close, replace, nextIndex) : start + end;
    };
    var createColors = (enabled = isColorSupported) => ({
      isColorSupported: enabled,
      reset: enabled ? (s) => `\x1B[0m${s}\x1B[0m` : String,
      bold: enabled ? formatter("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m") : String,
      dim: enabled ? formatter("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m") : String,
      italic: enabled ? formatter("\x1B[3m", "\x1B[23m") : String,
      underline: enabled ? formatter("\x1B[4m", "\x1B[24m") : String,
      inverse: enabled ? formatter("\x1B[7m", "\x1B[27m") : String,
      hidden: enabled ? formatter("\x1B[8m", "\x1B[28m") : String,
      strikethrough: enabled ? formatter("\x1B[9m", "\x1B[29m") : String,
      black: enabled ? formatter("\x1B[30m", "\x1B[39m") : String,
      red: enabled ? formatter("\x1B[31m", "\x1B[39m") : String,
      green: enabled ? formatter("\x1B[32m", "\x1B[39m") : String,
      yellow: enabled ? formatter("\x1B[33m", "\x1B[39m") : String,
      blue: enabled ? formatter("\x1B[34m", "\x1B[39m") : String,
      magenta: enabled ? formatter("\x1B[35m", "\x1B[39m") : String,
      cyan: enabled ? formatter("\x1B[36m", "\x1B[39m") : String,
      white: enabled ? formatter("\x1B[37m", "\x1B[39m") : String,
      gray: enabled ? formatter("\x1B[90m", "\x1B[39m") : String,
      bgBlack: enabled ? formatter("\x1B[40m", "\x1B[49m") : String,
      bgRed: enabled ? formatter("\x1B[41m", "\x1B[49m") : String,
      bgGreen: enabled ? formatter("\x1B[42m", "\x1B[49m") : String,
      bgYellow: enabled ? formatter("\x1B[43m", "\x1B[49m") : String,
      bgBlue: enabled ? formatter("\x1B[44m", "\x1B[49m") : String,
      bgMagenta: enabled ? formatter("\x1B[45m", "\x1B[49m") : String,
      bgCyan: enabled ? formatter("\x1B[46m", "\x1B[49m") : String,
      bgWhite: enabled ? formatter("\x1B[47m", "\x1B[49m") : String
    });
    module2.exports = createColors();
    module2.exports.createColors = createColors;
  }
});

// ../../node_modules/tailwindcss/lib/util/log.js
var require_log = __commonJS({
  "../../node_modules/tailwindcss/lib/util/log.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function _export(target, all) {
      for (var name in all)
        Object.defineProperty(target, name, {
          enumerable: true,
          get: all[name]
        });
    }
    _export(exports, {
      dim: () => dim,
      default: () => _default
    });
    var _picocolors = /* @__PURE__ */ _interopRequireDefault(require_picocolors());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var alreadyShown = /* @__PURE__ */ new Set();
    function log(type, messages, key) {
      if (typeof process !== "undefined" && process.env.JEST_WORKER_ID)
        return;
      if (key && alreadyShown.has(key))
        return;
      if (key)
        alreadyShown.add(key);
      console.warn("");
      messages.forEach((message) => console.warn(type, "-", message));
    }
    function dim(input) {
      return _picocolors.default.dim(input);
    }
    var _default = {
      info(key, messages) {
        log(_picocolors.default.bold(_picocolors.default.cyan("info")), ...Array.isArray(key) ? [
          key
        ] : [
          messages,
          key
        ]);
      },
      warn(key, messages) {
        log(_picocolors.default.bold(_picocolors.default.yellow("warn")), ...Array.isArray(key) ? [
          key
        ] : [
          messages,
          key
        ]);
      },
      risk(key, messages) {
        log(_picocolors.default.bold(_picocolors.default.magenta("risk")), ...Array.isArray(key) ? [
          key
        ] : [
          messages,
          key
        ]);
      }
    };
  }
});

// ../../node_modules/tailwindcss/lib/public/colors.js
var require_colors = __commonJS({
  "../../node_modules/tailwindcss/lib/public/colors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    Object.defineProperty(exports, "default", {
      enumerable: true,
      get: () => _default
    });
    var _log = /* @__PURE__ */ _interopRequireDefault(require_log());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    function warn({ version, from, to }) {
      _log.default.warn(`${from}-color-renamed`, [
        `As of Tailwind CSS ${version}, \`${from}\` has been renamed to \`${to}\`.`,
        "Update your configuration file to silence this warning."
      ]);
    }
    var _default = {
      inherit: "inherit",
      current: "currentColor",
      transparent: "transparent",
      black: "#000",
      white: "#fff",
      slate: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a"
      },
      gray: {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827"
      },
      zinc: {
        50: "#fafafa",
        100: "#f4f4f5",
        200: "#e4e4e7",
        300: "#d4d4d8",
        400: "#a1a1aa",
        500: "#71717a",
        600: "#52525b",
        700: "#3f3f46",
        800: "#27272a",
        900: "#18181b"
      },
      neutral: {
        50: "#fafafa",
        100: "#f5f5f5",
        200: "#e5e5e5",
        300: "#d4d4d4",
        400: "#a3a3a3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717"
      },
      stone: {
        50: "#fafaf9",
        100: "#f5f5f4",
        200: "#e7e5e4",
        300: "#d6d3d1",
        400: "#a8a29e",
        500: "#78716c",
        600: "#57534e",
        700: "#44403c",
        800: "#292524",
        900: "#1c1917"
      },
      red: {
        50: "#fef2f2",
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d"
      },
      orange: {
        50: "#fff7ed",
        100: "#ffedd5",
        200: "#fed7aa",
        300: "#fdba74",
        400: "#fb923c",
        500: "#f97316",
        600: "#ea580c",
        700: "#c2410c",
        800: "#9a3412",
        900: "#7c2d12"
      },
      amber: {
        50: "#fffbeb",
        100: "#fef3c7",
        200: "#fde68a",
        300: "#fcd34d",
        400: "#fbbf24",
        500: "#f59e0b",
        600: "#d97706",
        700: "#b45309",
        800: "#92400e",
        900: "#78350f"
      },
      yellow: {
        50: "#fefce8",
        100: "#fef9c3",
        200: "#fef08a",
        300: "#fde047",
        400: "#facc15",
        500: "#eab308",
        600: "#ca8a04",
        700: "#a16207",
        800: "#854d0e",
        900: "#713f12"
      },
      lime: {
        50: "#f7fee7",
        100: "#ecfccb",
        200: "#d9f99d",
        300: "#bef264",
        400: "#a3e635",
        500: "#84cc16",
        600: "#65a30d",
        700: "#4d7c0f",
        800: "#3f6212",
        900: "#365314"
      },
      green: {
        50: "#f0fdf4",
        100: "#dcfce7",
        200: "#bbf7d0",
        300: "#86efac",
        400: "#4ade80",
        500: "#22c55e",
        600: "#16a34a",
        700: "#15803d",
        800: "#166534",
        900: "#14532d"
      },
      emerald: {
        50: "#ecfdf5",
        100: "#d1fae5",
        200: "#a7f3d0",
        300: "#6ee7b7",
        400: "#34d399",
        500: "#10b981",
        600: "#059669",
        700: "#047857",
        800: "#065f46",
        900: "#064e3b"
      },
      teal: {
        50: "#f0fdfa",
        100: "#ccfbf1",
        200: "#99f6e4",
        300: "#5eead4",
        400: "#2dd4bf",
        500: "#14b8a6",
        600: "#0d9488",
        700: "#0f766e",
        800: "#115e59",
        900: "#134e4a"
      },
      cyan: {
        50: "#ecfeff",
        100: "#cffafe",
        200: "#a5f3fc",
        300: "#67e8f9",
        400: "#22d3ee",
        500: "#06b6d4",
        600: "#0891b2",
        700: "#0e7490",
        800: "#155e75",
        900: "#164e63"
      },
      sky: {
        50: "#f0f9ff",
        100: "#e0f2fe",
        200: "#bae6fd",
        300: "#7dd3fc",
        400: "#38bdf8",
        500: "#0ea5e9",
        600: "#0284c7",
        700: "#0369a1",
        800: "#075985",
        900: "#0c4a6e"
      },
      blue: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a"
      },
      indigo: {
        50: "#eef2ff",
        100: "#e0e7ff",
        200: "#c7d2fe",
        300: "#a5b4fc",
        400: "#818cf8",
        500: "#6366f1",
        600: "#4f46e5",
        700: "#4338ca",
        800: "#3730a3",
        900: "#312e81"
      },
      violet: {
        50: "#f5f3ff",
        100: "#ede9fe",
        200: "#ddd6fe",
        300: "#c4b5fd",
        400: "#a78bfa",
        500: "#8b5cf6",
        600: "#7c3aed",
        700: "#6d28d9",
        800: "#5b21b6",
        900: "#4c1d95"
      },
      purple: {
        50: "#faf5ff",
        100: "#f3e8ff",
        200: "#e9d5ff",
        300: "#d8b4fe",
        400: "#c084fc",
        500: "#a855f7",
        600: "#9333ea",
        700: "#7e22ce",
        800: "#6b21a8",
        900: "#581c87"
      },
      fuchsia: {
        50: "#fdf4ff",
        100: "#fae8ff",
        200: "#f5d0fe",
        300: "#f0abfc",
        400: "#e879f9",
        500: "#d946ef",
        600: "#c026d3",
        700: "#a21caf",
        800: "#86198f",
        900: "#701a75"
      },
      pink: {
        50: "#fdf2f8",
        100: "#fce7f3",
        200: "#fbcfe8",
        300: "#f9a8d4",
        400: "#f472b6",
        500: "#ec4899",
        600: "#db2777",
        700: "#be185d",
        800: "#9d174d",
        900: "#831843"
      },
      rose: {
        50: "#fff1f2",
        100: "#ffe4e6",
        200: "#fecdd3",
        300: "#fda4af",
        400: "#fb7185",
        500: "#f43f5e",
        600: "#e11d48",
        700: "#be123c",
        800: "#9f1239",
        900: "#881337"
      },
      get lightBlue() {
        warn({
          version: "v2.2",
          from: "lightBlue",
          to: "sky"
        });
        return this.sky;
      },
      get warmGray() {
        warn({
          version: "v3.0",
          from: "warmGray",
          to: "stone"
        });
        return this.stone;
      },
      get trueGray() {
        warn({
          version: "v3.0",
          from: "trueGray",
          to: "neutral"
        });
        return this.neutral;
      },
      get coolGray() {
        warn({
          version: "v3.0",
          from: "coolGray",
          to: "gray"
        });
        return this.gray;
      },
      get blueGray() {
        warn({
          version: "v3.0",
          from: "blueGray",
          to: "slate"
        });
        return this.slate;
      }
    };
  }
});

// ../../node_modules/tailwindcss/colors.js
var require_colors2 = __commonJS({
  "../../node_modules/tailwindcss/colors.js"(exports, module2) {
    var colors = require_colors();
    module2.exports = (colors.__esModule ? colors : { default: colors }).default;
  }
});

// src/colors/index.ts
var colors_exports = {};
__export(colors_exports, {
  default: () => colors_default
});
module.exports = __toCommonJS(colors_exports);

// src/colors/base.ts
var baseColors = {
  inherit: "inherit",
  current: "currentColor",
  transparent: "transparent",
  black: "#000",
  white: "#fff"
};
var base_default = baseColors;

// src/colors/gray.ts
var grayShades = {
  25: "rgb(252, 252, 253)",
  50: "rgb(249, 250, 251)",
  100: "rgb(242, 244, 247)",
  200: "rgb(234, 236, 240)",
  300: "rgb(208, 213, 221)",
  400: "rgb(152, 162, 179)",
  500: "rgb(102, 112, 133)",
  600: "rgb(71, 84, 103)",
  700: "rgb(52, 64, 84)",
  800: "rgb(29, 41, 57)",
  900: "rgb(16, 24, 40)"
};
var gray_default = grayShades;

// src/colors/primary.ts
var import_colors = __toESM(require_colors2());
var primaryShades = import_colors.indigo;
var primary_default = primaryShades;

// src/colors/error.ts
var errorShades = {
  25: "rgb(255, 251, 250)",
  50: "rgb(254, 243, 242)",
  100: "rgb(254, 228, 226)",
  200: "rgb(254, 205, 202)",
  300: "rgb(253, 162, 155)",
  400: "rgb(249, 112, 102)",
  500: "rgb(240, 68, 56)",
  600: "rgb(217, 45, 32)",
  700: "rgb(180, 35, 24)",
  800: "rgb(145, 32, 24)",
  900: "rgb(122, 39, 26)"
};
var error_default = errorShades;

// src/colors/success.ts
var successShades = {
  25: "rgb(246, 254, 249)",
  50: "rgb(236, 253, 243)",
  100: "rgb(209, 250, 223)",
  200: "rgb(166, 244, 197)",
  300: "rgb(108, 233, 166)",
  400: "rgb(50, 213, 131)",
  500: "rgb(18, 183, 106)",
  600: "rgb(3, 152, 85)",
  700: "rgb(2, 122, 72)",
  800: "rgb(5, 96, 58)",
  900: "rgb(5, 79, 49)"
};
var success_default = successShades;

// src/colors/warning.ts
var warningShades = {
  25: "rgba(255, 252, 245, 1)",
  50: "rgba(255, 250, 235, 1)",
  100: "rgba(254, 240, 199, 1)",
  200: "rgba(254, 223, 137, 1)",
  300: "rgba(254, 200, 75, 1)",
  400: "rgba(253, 176, 34, 1)",
  500: "rgba(247, 144, 9, 1)",
  600: "rgba(220, 104, 3, 1)",
  700: "rgba(181, 71, 8, 1)",
  800: "rgba(147, 55, 13, 1)",
  900: "rgba(122, 46, 14, 1)"
};
var warning_default = warningShades;

// src/colors/moss.ts
var mossShades = {
  25: "rgb(250, 253, 247)",
  50: "rgb(245, 251, 238)",
  100: "rgb(230, 244, 215)",
  200: "rgb(206, 234, 176)",
  300: "rgb(172, 220, 121)",
  400: "rgb(134, 203, 60)",
  500: "rgb(102, 159, 42)",
  600: "rgb(79, 122, 33)",
  700: "rgb(63, 98, 26)",
  800: "rgb(51, 80, 21)",
  900: "rgb(43, 66, 18)"
};
var moss_default = mossShades;

// src/colors/gray-iron.ts
var grayIronShades = {
  25: "rgb(252, 252, 252)",
  50: "rgb(250, 250, 250)",
  100: "rgb(244, 244, 245)",
  200: "rgb(228, 228, 231)",
  300: "rgb(209, 209, 214)",
  400: "rgb(160, 160, 171)",
  500: "rgb(112, 112, 123)",
  600: "rgb(81, 82, 92)",
  700: "rgb(63, 63, 70)",
  800: "rgb(38, 39, 43)",
  900: "rgb(24, 24, 27)"
};
var gray_iron_default = grayIronShades;

// src/colors/gray-blue.ts
var grayBlueShades = {
  25: "rgb(252, 252, 253)",
  50: "rgb(248, 249, 252)",
  100: "rgb(234, 236, 245)",
  200: "rgb(213, 217, 235)",
  300: "rgb(179, 184, 219)",
  400: "rgb(113, 123, 188)",
  500: "rgb(78, 91, 166)",
  600: "rgb(62, 71, 132)",
  700: "rgb(54, 63, 114)",
  800: "rgb(41, 48, 86)",
  900: "rgb(16, 19, 35)"
};
var gray_blue_default = grayBlueShades;

// src/colors/gray-true.ts
var grayTrueShades = {
  25: "rgb(252, 252, 252)",
  50: "rgb(250, 250, 250)",
  100: "rgb(245, 245, 245)",
  200: "rgb(229, 229, 229)",
  300: "rgb(214, 214, 214)",
  400: "rgb(163, 163, 163)",
  500: "rgb(115, 115, 115)",
  600: "rgb(82, 82, 82)",
  700: "rgb(66, 66, 66)",
  800: "rgb(41, 41, 41)",
  900: "rgb(20, 20, 20)"
};
var gray_true_default = grayTrueShades;

// src/colors/gray-neutral.ts
var grayNeutralShades = {
  25: "rgb(252, 252, 253)",
  50: "rgb(249, 250, 251)",
  100: "rgb(243, 244, 246)",
  200: "rgb(229, 231, 235)",
  300: "rgb(210, 214, 219)",
  400: "rgb(157, 164, 174)",
  500: "rgb(108, 115, 127)",
  600: "rgb(77, 87, 97)",
  700: "rgb(56, 66, 80)",
  800: "rgb(31, 42, 55)",
  900: "rgb(17, 25, 39)"
};
var gray_neutral_default = grayNeutralShades;

// src/colors/gray-cool.ts
var grayCoolShades = {
  25: "rgb(252, 252, 253)",
  50: "rgb(249, 249, 251)",
  100: "rgb(239, 241, 245)",
  200: "rgb(220, 223, 234)",
  300: "rgb(185, 192, 212)",
  400: "rgb(125, 137, 176)",
  500: "rgb(93, 107, 152)",
  600: "rgb(74, 85, 120)",
  700: "rgb(64, 73, 104)",
  800: "rgb(48, 55, 79)",
  900: "rgb(17, 19, 34)"
};
var gray_cool_default = grayCoolShades;

// src/colors/gray-warm.ts
var grayWarmShades = {
  25: "rgb(253, 253, 252)",
  50: "rgb(250, 250, 249)",
  100: "rgb(245, 245, 244)",
  200: "rgb(231, 229, 228)",
  300: "rgb(215, 211, 208)",
  400: "rgb(169, 162, 157)",
  500: "rgb(121, 113, 107)",
  600: "rgb(87, 83, 78)",
  700: "rgb(68, 64, 60)",
  800: "rgb(41, 37, 36)",
  900: "rgb(28, 25, 23)"
};
var gray_warm_default = grayWarmShades;

// src/colors/gray-modern.ts
var grayModernShades = {
  25: "rgb(252, 252, 253)",
  50: "rgb(248, 250, 252)",
  100: "rgb(238, 242, 246)",
  200: "rgb(227, 232, 239)",
  300: "rgb(205, 213, 223)",
  400: "rgb(154, 164, 178)",
  500: "rgb(105, 117, 134)",
  600: "rgb(75, 85, 101)",
  700: "rgb(54, 65, 82)",
  800: "rgb(32, 41, 57)",
  900: "rgb(18, 25, 38)"
};
var gray_modern_default = grayModernShades;

// src/colors/green-light.ts
var greenLightShades = {
  25: "rgb(250, 254, 245)",
  50: "rgb(243, 254, 231)",
  100: "rgb(227, 251, 204)",
  200: "rgb(208, 248, 171)",
  300: "rgb(166, 239, 103)",
  400: "rgb(133, 225, 58)",
  500: "rgb(102, 198, 28)",
  600: "rgb(76, 163, 13)",
  700: "rgb(59, 124, 15)",
  800: "rgb(50, 98, 18)",
  900: "rgb(43, 83, 20)"
};
var green_light_default = greenLightShades;

// src/colors/index.ts
var untitledUIColors = {
  ...base_default,
  gray: gray_default,
  primary: primary_default,
  error: error_default,
  success: success_default,
  warning: warning_default,
  moss: moss_default,
  "gray-iron": gray_iron_default,
  "gray-blue": gray_blue_default,
  "gray-true": gray_true_default,
  "gray-neutral": gray_neutral_default,
  "gray-cool": gray_cool_default,
  "gray-warm": gray_warm_default,
  "gray-modern": gray_modern_default,
  "green-light": green_light_default
};
var colors_default = untitledUIColors;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
