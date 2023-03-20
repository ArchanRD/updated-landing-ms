"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/index.tsx
var src_exports = {};
__export(src_exports, {
  Button: () => Button_default,
  Emoji: () => Emoji,
  H1: () => H1,
  H2: () => H2
});
module.exports = __toCommonJS(src_exports);

// src/Button/Button.tsx
var import_react2 = __toESM(require("react"));

// src/Button/Spinner.tsx
var import_react = __toESM(require("react"));
var Spinner = (props) => {
  return /* @__PURE__ */ import_react.default.createElement("svg", {
    className: "animate-spin h-5 w-5",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24"
  }, /* @__PURE__ */ import_react.default.createElement("circle", {
    className: "opacity-25",
    cx: "12",
    cy: "12",
    r: "10",
    stroke: "currentColor",
    strokeWidth: "4"
  }), /* @__PURE__ */ import_react.default.createElement("path", {
    className: "opacity-75",
    fill: "currentColor",
    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  }));
};
var Spinner_default = Spinner;

// src/Button/Button.tsx
function disabledButtonOnClick(event) {
  event.preventDefault();
}
function getButtonSizeStyles(size, iconOnly) {
  switch (size) {
    case "sm":
      return {
        fontSize: "text-sm",
        padding: iconOnly ? "p-2" : "py-2 px-3.5"
      };
    case "md":
      return {
        fontSize: "text-sm",
        padding: iconOnly ? "p-2.5" : "py-2.5 px-4"
      };
    case "lg":
      return {
        fontSize: "text-base",
        padding: iconOnly ? "p-3" : "py-2.5 px-4.5"
      };
    case "xl":
      return {
        fontSize: "text-base",
        padding: iconOnly ? "p-3.5" : "py-3 px-5"
      };
    case "2xl":
      return {
        fontSize: "text-lg",
        padding: iconOnly ? "p-4" : "py-4 px-7"
      };
  }
}
function getNonDestructiveTypeStyles(buttonType) {
  switch (buttonType) {
    case "primary":
      return {
        defaultState: "bg-primary-600 text-white",
        hoverState: "hover:bg-primary-700",
        focusState: "focus:bg-primary-600 focus:outline-none focus:ring focus:ring-primary-200"
      };
    case "secondary-gray":
      return {
        defaultState: "bg-white text-gray-700 border border-gray-300 ",
        hoverState: "hover:bg-gray-50 hover:text-gray-800",
        focusState: "focus:bg-gray-50 focus:text-gray-700 focus:ring focus:ring-gray-200 focus:outline-none"
      };
    case "secondary-color":
      return {
        defaultState: "bg-primary-50 text-primary-700 border border-primary-200",
        hoverState: "hover:bg-primary-100 hover:text-primary-800",
        focusState: "focus:bg-primary-100 focus:text-primary-700 focus:ring focus:ring-primary-200 focus:outline-none"
      };
    case "tertiary-gray":
      return {
        defaultState: "bg-white text-gray-500 border border-transparent",
        hoverState: "hover:bg-gray-50 hover:text-gray-600",
        focusState: "focus:bg-gray-50 focus:text-gray-500 focus:ring focus:ring-gray-200 focus:outline-none"
      };
    case "tertiary-color":
      return {
        defaultState: "bg-white text-primary-700 border border-transparent",
        hoverState: "hover:bg-primary-50 hover:text-primary-800",
        focusState: "focus:bg-primary-50 focus:outline-none focus:ring focus:ring-primary-100"
      };
    case "link-gray":
      return {
        defaultState: "bg-white text-gray-500",
        hoverState: "hover:text-gray-600",
        focusState: "focus:bg-gray-50 focus:text-gray-500 focus:outline-none"
      };
    case "link-color":
      return {
        defaultState: "bg-white text-primary-700",
        hoverState: "hover:text-primary-800",
        focusState: "focus:bg-primary-50 focus:text-primary-700 focus:outline-none"
      };
  }
}
function getDestructiveTypeStyles(buttonType) {
  switch (buttonType) {
    case "primary":
      return {
        defaultState: "bg-error-600 text-white",
        hoverState: "hover:bg-error-700",
        focusState: "focus:bg-error-600 focus:outline-none focus:ring focus:ring-error-200"
      };
    case "secondary-gray":
      return {
        defaultState: "bg-white text-error-700 border border-error-300 ",
        hoverState: "hover:bg-error-50 hover:text-error-800",
        focusState: "focus:bg-error-50 focus:text-error-700 focus:ring focus:ring-error-200 focus:outline-none"
      };
    case "secondary-color":
      return {
        defaultState: "bg-error-50 text-error-700 border border-transparent",
        hoverState: "hover:bg-error-100 hover:text-error-800",
        focusState: "focus:bg-error-100 focus:text-error-700 focus:ring focus:ring-error-200 focus:outline-none"
      };
    case "tertiary-gray":
      return {
        defaultState: "bg-white text-error-500 border border-transparent",
        hoverState: "hover:bg-error-50 hover:text-error-600",
        focusState: "focus:bg-error-50 focus:text-error-500 focus:ring focus:ring-error-200 focus:outline-none"
      };
    case "tertiary-color":
      return {
        defaultState: "bg-white text-error-700 border border-transparent",
        hoverState: "hover:bg-error-50 hover:text-error-800",
        focusState: "focus:bg-error-50 focus:outline-none focus:ring focus:ring-error-100"
      };
    case "link-gray":
      return {
        defaultState: "bg-white text-error-500",
        hoverState: "hover:text-error-600",
        focusState: "focus:bg-error-50 focus:text-error-500 focus:outline-none"
      };
    case "link-color":
      return {
        defaultState: "bg-white text-error-700",
        hoverState: "hover:text-error-800",
        focusState: "focus:bg-error-50 focus:text-error-700 focus:outline-none"
      };
  }
}
var Button = ({ children, ...btnProps }) => {
  const {
    type = "primary",
    tag = "button",
    size = "md",
    Icon,
    iconPosition = "left",
    destructive = false,
    disabled = false,
    iconOnly = false,
    onClick,
    loading = false,
    LoadingSpinner = Spinner_default,
    loadingText,
    className = "",
    rounded = false,
    ...otherProps
  } = btnProps;
  const defaultStyles = "font-medium";
  const borderRadius = rounded ? "rounded-full" : "rounded-lg";
  const { fontSize, padding } = getButtonSizeStyles(size, iconOnly);
  const buttonTypeStyles = [borderRadius, padding].join(" ");
  const typeStyles = destructive ? getDestructiveTypeStyles(type) : getNonDestructiveTypeStyles(type);
  const disabledStyles = disabled || loading ? [
    "opacity-40 cursor-not-allowed",
    typeStyles.defaultState,
    typeStyles.focusState
  ].join(" ") : Object.values(typeStyles).join(" ");
  const finalStyles = type !== "link-color" && type !== "link-gray" ? disabledStyles + " " + buttonTypeStyles : disabledStyles;
  const spacer = size !== "2xl" ? "space-x-2" : "space-x-3";
  const withIconStyles = Icon ? `${spacer} flex items-center` : "";
  const disabledProps = disabled || loading ? { onClick: disabledButtonOnClick, "aria-disabled": true } : { onClick, "aria-disabled": false };
  const iconProps = size !== "2xl" ? {
    height: 20,
    width: 20
  } : {
    height: 24,
    width: 24
  };
  const IconComponent = loading ? LoadingSpinner : Icon;
  return tag === "button" ? /* @__PURE__ */ import_react2.default.createElement("button", {
    className: `${defaultStyles} ${fontSize} ${finalStyles} ${withIconStyles} ${className}`,
    ...disabledProps,
    ...otherProps
  }, iconOnly ? IconComponent && /* @__PURE__ */ import_react2.default.createElement(IconComponent, {
    ...iconProps
  }) : /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, iconPosition === "left" && IconComponent && /* @__PURE__ */ import_react2.default.createElement(IconComponent, {
    ...iconProps
  }), /* @__PURE__ */ import_react2.default.createElement("span", null, loading && loadingText ? loadingText : children), iconPosition === "right" && IconComponent && /* @__PURE__ */ import_react2.default.createElement(IconComponent, {
    ...iconProps
  }))) : /* @__PURE__ */ import_react2.default.createElement("a", {
    className: `${defaultStyles} ${fontSize} ${finalStyles} ${withIconStyles} ${className}`,
    ...disabledProps,
    ...otherProps
  }, iconOnly ? IconComponent && /* @__PURE__ */ import_react2.default.createElement(IconComponent, {
    ...iconProps
  }) : /* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, iconPosition === "left" && IconComponent && /* @__PURE__ */ import_react2.default.createElement(IconComponent, {
    ...iconProps
  }), /* @__PURE__ */ import_react2.default.createElement("span", null, loading && loadingText ? loadingText : children), iconPosition === "right" && IconComponent && /* @__PURE__ */ import_react2.default.createElement(IconComponent, {
    ...iconProps
  })));
};
Button.displayName = "Button";

// src/Button/index.tsx
var Button_default = Button;

// src/Typography/index.tsx
var import_react3 = __toESM(require("react"));
var import_clsx = __toESM(require("clsx"));
var Emoji = ({
  emoji,
  className = "text-4xl"
}) => {
  return /* @__PURE__ */ import_react3.default.createElement("div", {
    className: "flex items-center justify-center"
  }, /* @__PURE__ */ import_react3.default.createElement("div", {
    className: (0, import_clsx.default)("leading-none ml-0 text-black", className)
  }, /* @__PURE__ */ import_react3.default.createElement("span", {
    role: "image",
    "aria-hidden": true,
    "aria-label": emoji,
    className: "leading-none whitespace-nowrap h-8 w-8"
  }, emoji)));
};
var H1 = ({ children, className = "" }) => {
  return /* @__PURE__ */ import_react3.default.createElement("h1", {
    className: (0, import_clsx.default)("text-4xl font-bold text-gray-800", className)
  }, children);
};
var H2 = ({ children, className = "" }) => {
  return /* @__PURE__ */ import_react3.default.createElement("h2", {
    className: (0, import_clsx.default)("text-xl font-medium text-gray-800", className)
  }, children);
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Button,
  Emoji,
  H1,
  H2
});
