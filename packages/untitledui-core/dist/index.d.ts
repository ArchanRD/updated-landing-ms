import React, { PropsWithChildren, AnchorHTMLAttributes } from 'react';
import { SvgIconProps } from '@untitledui/icons/outline';

type ButtonType = "primary" | "secondary-gray" | "secondary-color" | "tertiary-gray" | "tertiary-color" | "link-gray" | "link-color";
type ButtonIconPosition = "left" | "right";
type ButtonSize = "sm" | "md" | "lg" | "xl" | "2xl";
type NativeButtonProps = React.HTMLAttributes<HTMLButtonElement>;
type NativeLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;
type IconProps = {
    Icon?: React.FC<SvgIconProps>;
    iconOnly?: boolean;
    "aria-label"?: string;
} | {
    Icon: React.FC<React.ComponentProps<"svg">>;
    iconOnly: true;
    "aria-label": string;
};
type TypeProps = ({
    tag?: "button";
} & NativeButtonProps) | ({
    tag: "link";
} & NativeLinkProps);
type ButtonProps = PropsWithChildren<TypeProps & {
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
} & IconProps>;
declare const Button: React.FC<ButtonProps>;

type Props = PropsWithChildren<{
    className?: string;
}>;
type EmojiProps = {
    className?: string;
    emoji: string;
};
declare const Emoji: React.FC<EmojiProps>;
declare const H1: React.FC<Props>;
declare const H2: React.FC<Props>;

export { Button, ButtonProps, Emoji, H1, H2 };
