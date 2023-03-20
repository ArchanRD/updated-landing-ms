import { ComponentStory, ComponentMeta } from "@storybook/react";
import * as DuoColorIcons from "@untitledui/icons/duocolor";
import * as DuoToneIcons from "@untitledui/icons/duotone";
import * as OutlineIcons from "@untitledui/icons/outline";
import * as IntegrationIcons from "@untitledui/icons/integration";
import * as SocialIcons from "@untitledui/icons/social";
import * as FlagIcons from "@untitledui/icons/flags";
import type { SvgIconProps, IconSize } from "@untitledui/icons/flags";
import { getCountry } from "countries-code";

function getCountryFullName(countryCode) {
  const res = getCountry(countryCode);
  console.log({ countryCode, res });
  return res;
}

type IconBoxProps = {
  Icon: React.FC<SvgIconProps>;
  iconName: string;
  className: string;
  isFlags: boolean;
  flagName: string;
  size: IconSize;
};

const IconBox: React.FC<IconBoxProps> = ({
  Icon,
  iconName,
  className,
  isFlags,
  flagName = "",
  size,
}) => (
  <div className="space-y-4 flex flex-col items-center w-48 justify-center mx-auto">
    <div className="p-4 rounded-lg shadow-md text-gray-800 border border-gray-100">
      <Icon className={className} size={size} />
    </div>
    <div className="text-xs text-gray-600">{iconName}</div>
    {isFlags && <div className="text-xs text-gray-800">{flagName}</div>}
  </div>
);

export default {
  title: "Components/Icons",
  component: IconBox,
  argTypes: {
    size: {
      control: { type: "inline-radio" },
      options: ["xs", "sm", "md", "lg", "xl", "2xl"],
    },
    iconNames: {
      control: false,
    },
    iconSet: {
      control: false,
    },
    className: {
      control: false,
    },
    isFlags: {
      control: false,
    },
  },
} as ComponentMeta<typeof IconBox>;

const DuoColorIconNames = Object.keys(DuoColorIcons);
const DuoToneIconsName = Object.keys(DuoToneIcons);
const OutlineIconsName = Object.keys(OutlineIcons);
const IntegrationIconsName = Object.keys(IntegrationIcons);
const SocialIconsName = Object.keys(SocialIcons);
const FlagIconsName = Object.keys(FlagIcons);
const icons = Object.values(FlagIcons);

console.log({ icons });

const IconsSet = ({
  iconNames,
  iconSet,
  className = "",
  isFlags = false,
  size,
}) => {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-8">
      {iconNames.map((iconName) => {
        const Icon = iconSet[iconName];
        const flagName = getCountryFullName(iconName.replace("FlagIcon", ""));

        return (
          Icon && (
            <IconBox
              key={iconName}
              Icon={Icon}
              iconName={iconName}
              className={className}
              isFlags={isFlags}
              flagName={flagName}
              size={size}
            />
          )
        );
      })}
    </div>
  );
};

export const DuoColorIconSet = IconsSet.bind({});
DuoColorIconSet.args = {
  iconNames: DuoColorIconNames,
  iconSet: DuoColorIcons,
};
DuoColorIconSet.storyName = "DuoColor Icons";

export const DuoToneIconSet = IconsSet.bind({});
DuoToneIconSet.args = {
  iconNames: DuoToneIconsName,
  iconSet: DuoToneIcons,
};
DuoToneIconSet.storyName = "DuoTone Icons";

export const OutlineIconSet = IconsSet.bind({});
OutlineIconSet.args = {
  iconNames: OutlineIconsName,
  iconSet: OutlineIcons,
};
OutlineIconSet.storyName = "Outline Icons";

export const IntegrationIconSet = IconsSet.bind({});
IntegrationIconSet.args = {
  iconNames: IntegrationIconsName,
  iconSet: IntegrationIcons,
};
IntegrationIconSet.storyName = "Integration Icons";

export const SocialIconsSet = IconsSet.bind({});
SocialIconsSet.args = {
  iconNames: SocialIconsName,
  iconSet: SocialIcons,
  className: "text-gray-400 hover:text-gray-600",
};
SocialIconsSet.storyName = "Social Icons";

export const FlagIconsSet = IconsSet.bind({});
FlagIconsSet.args = {
  iconNames: FlagIconsName,
  iconSet: FlagIcons,
  isFlags: true,
};
FlagIconsSet.storyName = "Country Flag Icons";
