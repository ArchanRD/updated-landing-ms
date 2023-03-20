import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import React from "react";
import SpinnerIcon from "./Spinner";
import type { SvgIconProps } from "@untitledui/icons/outline";

type ButtonType =
  | "primary"
  | "secondary-gray"
  | "secondary-color"
  | "tertiary-gray"
  | "tertiary-color"
  | "link-gray"
  | "link-color";

type ButtonIconPosition = "left" | "right";
type ButtonSize = "sm" | "md" | "lg" | "xl" | "2xl";

type NativeButtonProps = React.HTMLAttributes<HTMLButtonElement>;
type NativeLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

type IconProps =
  | {
      Icon?: React.FC<SvgIconProps>;
      iconOnly?: boolean;
      "aria-label"?: string;
    }
  | {
      Icon: React.FC<React.ComponentProps<"svg">>;
      iconOnly: true;
      "aria-label": string;
    };

type TypeProps =
  | ({
      tag?: "button";
    } & NativeButtonProps)
  | ({
      tag: "link";
    } & NativeLinkProps);

export type ButtonProps = PropsWithChildren<
  TypeProps & {
    type: ButtonType;
    size?: ButtonSize;
    iconPosition?: ButtonIconPosition;
    destructive?: boolean;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    className?: string;
    rounded?: boolean;
    LoadingSpinner?: React.FC<React.ComponentProps<"svg">>;
  } & IconProps
>;

function disabledButtonOnClick(event: React.MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
}

function getButtonSizeStyles(
  size: ButtonSize,
  iconOnly: boolean
): {
  fontSize: string;
  padding: string;
} {
  switch (size) {
    case "sm":
      return {
        fontSize: "text-sm",
        padding: iconOnly ? "p-2" : "py-2 px-3.5",
      };
    case "md":
      return {
        fontSize: "text-sm",
        padding: iconOnly ? "p-2.5" : "py-2.5 px-4",
      };
    case "lg":
      return {
        fontSize: "text-base",
        padding: iconOnly ? "p-3" : "py-2.5 px-4.5",
      };
    case "xl":
      return {
        fontSize: "text-base",
        padding: iconOnly ? "p-3.5" : "py-3 px-5",
      };
    case "2xl":
      return {
        fontSize: "text-lg",
        padding: iconOnly ? "p-4" : "py-4 px-7",
      };
  }
}

function getNonDestructiveTypeStyles(buttonType: ButtonType) {
  switch (buttonType) {
    case "primary":
      return {
        defaultState: "bg-primary-600 text-white",
        hoverState: "hover:bg-primary-700",
        focusState:
          "focus:bg-primary-600 focus:outline-none focus:ring focus:ring-primary-200",
      };
    case "secondary-gray":
      return {
        defaultState: "bg-white text-gray-700 border border-gray-300 ",
        hoverState: "hover:bg-gray-50 hover:text-gray-800",
        focusState:
          "focus:bg-gray-50 focus:text-gray-700 focus:ring focus:ring-gray-200 focus:outline-none",
      };
    case "secondary-color":
      return {
        defaultState:
          "bg-primary-50 text-primary-700 border border-primary-200",
        hoverState: "hover:bg-primary-100 hover:text-primary-800",
        focusState:
          "focus:bg-primary-100 focus:text-primary-700 focus:ring focus:ring-primary-200 focus:outline-none",
      };
    case "tertiary-gray":
      return {
        defaultState: "bg-white text-gray-500 border border-transparent",
        hoverState: "hover:bg-gray-50 hover:text-gray-600",
        focusState:
          "focus:bg-gray-50 focus:text-gray-500 focus:ring focus:ring-gray-200 focus:outline-none",
      };
    case "tertiary-color":
      return {
        defaultState: "bg-white text-primary-700 border border-transparent",
        hoverState: "hover:bg-primary-50 hover:text-primary-800",
        focusState:
          "focus:bg-primary-50 focus:outline-none focus:ring focus:ring-primary-100",
      };
    case "link-gray":
      return {
        defaultState: "bg-white text-gray-500",
        hoverState: "hover:text-gray-600",
        focusState: "focus:bg-gray-50 focus:text-gray-500 focus:outline-none",
      };
    case "link-color":
      return {
        defaultState: "bg-white text-primary-700",
        hoverState: "hover:text-primary-800",
        focusState:
          "focus:bg-primary-50 focus:text-primary-700 focus:outline-none",
      };
  }
}

function getDestructiveTypeStyles(buttonType: ButtonType) {
  switch (buttonType) {
    case "primary":
      return {
        defaultState: "bg-error-600 text-white",
        hoverState: "hover:bg-error-700",
        focusState:
          "focus:bg-error-600 focus:outline-none focus:ring focus:ring-error-200",
      };
    case "secondary-gray":
      return {
        defaultState: "bg-white text-error-700 border border-error-300 ",
        hoverState: "hover:bg-error-50 hover:text-error-800",
        focusState:
          "focus:bg-error-50 focus:text-error-700 focus:ring focus:ring-error-200 focus:outline-none",
      };
    case "secondary-color":
      return {
        defaultState: "bg-error-50 text-error-700 border border-transparent",
        hoverState: "hover:bg-error-100 hover:text-error-800",
        focusState:
          "focus:bg-error-100 focus:text-error-700 focus:ring focus:ring-error-200 focus:outline-none",
      };
    case "tertiary-gray":
      return {
        defaultState: "bg-white text-error-500 border border-transparent",
        hoverState: "hover:bg-error-50 hover:text-error-600",
        focusState:
          "focus:bg-error-50 focus:text-error-500 focus:ring focus:ring-error-200 focus:outline-none",
      };
    case "tertiary-color":
      return {
        defaultState: "bg-white text-error-700 border border-transparent",
        hoverState: "hover:bg-error-50 hover:text-error-800",
        focusState:
          "focus:bg-error-50 focus:outline-none focus:ring focus:ring-error-100",
      };
    case "link-gray":
      return {
        defaultState: "bg-white text-error-500",
        hoverState: "hover:text-error-600",
        focusState: "focus:bg-error-50 focus:text-error-500 focus:outline-none",
      };
    case "link-color":
      return {
        defaultState: "bg-white text-error-700",
        hoverState: "hover:text-error-800",
        focusState: "focus:bg-error-50 focus:text-error-700 focus:outline-none",
      };
  }
}

export const Button: React.FC<ButtonProps> = ({ children, ...btnProps }) => {
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
    LoadingSpinner = SpinnerIcon,
    loadingText,
    className = "",
    rounded = false,
    ...otherProps
  } = btnProps;

  const defaultStyles = "font-medium";
  const borderRadius = rounded ? "rounded-full" : "rounded-lg";
  const { fontSize, padding } = getButtonSizeStyles(size, iconOnly);
  const buttonTypeStyles = [borderRadius, padding].join(" ");
  const typeStyles = destructive
    ? getDestructiveTypeStyles(type)
    : getNonDestructiveTypeStyles(type);
  const disabledStyles =
    disabled || loading
      ? [
          "opacity-40 cursor-not-allowed",
          typeStyles.defaultState,
          typeStyles.focusState,
        ].join(" ")
      : Object.values(typeStyles).join(" ");

  const finalStyles =
    type !== "link-color" && type !== "link-gray"
      ? disabledStyles + " " + buttonTypeStyles
      : disabledStyles;

  const spacer = size !== "2xl" ? "space-x-2" : "space-x-3";
  const withIconStyles = Icon ? `${spacer} flex items-center` : "";
  // aria-disabled is better than `disabled` because it's more accessible
  // The disabled Boolean attribute provides CSS styles and semantics and removes the ability to click or focus while not disabling hover.
  // By removing the ability to focus and removing it from the accessibility tree, it makes it invisible to assistive technology users.
  // For good user experience, you want to make sure everyone can access all the visible content, no matter how they access the web.
  // It is important to be aware that using the disabled attribute can harm usability.
  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled
  // https://css-tricks.com/making-disabled-buttons-more-inclusive/#aa-the-difference-between-disabled-and-aria-disabled
  const disabledProps =
    disabled || loading
      ? { onClick: disabledButtonOnClick, "aria-disabled": true }
      : { onClick, "aria-disabled": false };

  const iconProps =
    size !== "2xl"
      ? {
          height: 20,
          width: 20,
        }
      : {
          height: 24,
          width: 24,
        };

  const IconComponent = loading ? LoadingSpinner : Icon;
  return tag === "button" ? (
    <button
      className={`${defaultStyles} ${fontSize} ${finalStyles} ${withIconStyles} ${className}`}
      {...disabledProps}
      {...otherProps}
    >
      {iconOnly ? (
        IconComponent && <IconComponent {...iconProps} />
      ) : (
        <>
          {iconPosition === "left" && IconComponent && (
            <IconComponent {...iconProps} />
          )}
          <span>{loading && loadingText ? loadingText : children}</span>
          {iconPosition === "right" && IconComponent && (
            <IconComponent {...iconProps} />
          )}
        </>
      )}
    </button>
  ) : (
    <a
      className={`${defaultStyles} ${fontSize} ${finalStyles} ${withIconStyles} ${className}`}
      {...disabledProps}
      {...otherProps}
    >
      {iconOnly ? (
        IconComponent && <IconComponent {...iconProps} />
      ) : (
        <>
          {iconPosition === "left" && IconComponent && (
            <IconComponent {...iconProps} />
          )}
          <span>{loading && loadingText ? loadingText : children}</span>
          {iconPosition === "right" && IconComponent && (
            <IconComponent {...iconProps} />
          )}
        </>
      )}
    </a>
  );
};

Button.displayName = "Button";
