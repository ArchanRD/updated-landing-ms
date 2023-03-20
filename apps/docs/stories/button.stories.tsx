import Button from "@untitledui/core/src/Button";
import type { ButtonProps } from "@untitledui/core/src/Button";
import { ComponentMeta } from "@storybook/react";
import * as icons from "@untitledui/icons/duocolor";

const buttonSizes = ["sm", "md", "lg", "xl", "2xl"] as ButtonProps["size"][];
export default {
  title: "Components/Buttons",
  component: Button,
  argTypes: {
    size: {
      // options: buttonSizes,
      // control: { type: "select" },
      control: false,
      defaultValue: "md",
      description: "The size of the button `sm` `md` `lg` `xl` `2xl`",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    type: {
      options: [
        "primary",
        "secondary-gray",
        "secondary-color",
        "tertiary-gray",
        "tertiary-color",
        "link-gray",
        "link-color",
      ],
      control: { type: "select" },
      defaultValue: "primary",
      description:
        "The type of the button `primary` `secondary-gray` `secondary-color` `tertiary-gray` `tertiary-color` `link-gray` `link-color`",
      table: {
        defaultValue: { summary: "md" },
      },
    },
    disabled: {
      options: [true, false],
      control: { type: "boolean" },
      defaultValue: false,
      description: "Whether the button is disabled",
      table: {
        defaultValue: { summary: false },
      },
    },
    destructive: {
      options: [true, false],
      control: { type: "boolean" },
      defaultValue: false,
      description: "Whether the button is destructive",
      table: {
        defaultValue: { summary: false },
      },
    },
    icon: {
      control: { type: "select" },
      options: Object.keys(icons),
      defaultValue: "",
      description: "The icon to render inside the button",
    },
    iconPosition: {
      options: ["left", "right"],
      control: { type: "inline-radio" },
      defaultValue: "left",
    },
    iconOnly: {
      control: { type: "boolean" },
      options: [true, false],
      defaultValue: false,
      description: "Whether the button should only render the icon",
      table: {
        defaultValue: { summary: false },
      },
    },
    loading: {
      control: { type: "boolean" },
      options: [true, false],
      defaultValue: false,
      description: "Whether the button state is loading",
      table: {
        defaultValue: { summary: false },
      },
    },
    loadingText: {
      control: { type: "text" },
      defaultValue: "Loading",
      description: "The text to display when the button is loading",
      table: {
        defaultValue: { summary: "Loading" },
      },
    },
    onClick: {
      description: "The function to call when the button is clicked",
      defaultValue: () => {},
    },
  },
} as ComponentMeta<typeof Button>;

const ButtonTemplate = ({
  icon,
  size,
  ...args
}: ButtonProps & { icon: string }) => {
  const Icon = icons[icon];
  return (
    <div className="flex space-x-6 items-end">
      {buttonSizes.map((btnSize) => (
        <div>
          <Button Icon={Icon} size={btnSize} {...args}>
            Button
          </Button>
          <div className="text-center text-xs text-gray-600 mt-2">
            {btnSize}
          </div>
        </div>
      ))}
    </div>
  );
};

export const PrimaryButton = ButtonTemplate.bind({});
PrimaryButton.argTypes = {
  type: {
    control: false,
  },
};
PrimaryButton.args = {
  // size: "md",
  // type: "primary",
  disabled: false,
  destructive: false,
  iconPosition: "left",
  icon: "CircleIcon",
  iconOnly: false,
};

export const SecondaryColor = ButtonTemplate.bind({});
SecondaryColor.args = {
  type: "secondary-color",
  disabled: false,
  destructive: false,
  iconPosition: "left",
  icon: "CircleIcon",
  iconOnly: false,
};
SecondaryColor.argTypes = {
  type: {
    control: false,
  },
};
SecondaryColor.storyName = "Secondary Button";

export const IconButton = ButtonTemplate.bind({});
IconButton.args = {
  type: "secondary-color",
  iconOnly: true,
  disabled: false,
  destructive: false,
  iconPosition: "left",
  icon: "CircleIcon",
};
