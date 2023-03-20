import React, { PropsWithChildren } from "react";
import clsx from "clsx";

type Props = PropsWithChildren<{
  className?: string;
}>;

type EmojiProps = {
  className?: string;
  emoji: string;
};

export const Emoji: React.FC<EmojiProps> = ({
  emoji,
  className = "text-4xl",
}) => {
  return (
    <div className="flex items-center justify-center">
      <div className={clsx("leading-none ml-0 text-black", className)}>
        <span
          role="image"
          aria-hidden
          aria-label={emoji}
          className="leading-none whitespace-nowrap h-8 w-8"
        >
          {emoji}
        </span>
      </div>
    </div>
  );
};

export const H1: React.FC<Props> = ({ children, className = "" }) => {
  return (
    <h1 className={clsx("text-4xl font-bold text-gray-800", className)}>
      {children}
    </h1>
  );
};

export const H2: React.FC<Props> = ({ children, className = "" }) => {
  return (
    <h2 className={clsx("text-xl font-medium text-gray-800", className)}>
      {children}
    </h2>
  );
};
