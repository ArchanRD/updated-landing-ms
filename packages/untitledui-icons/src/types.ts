export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
type IconProps =
  | {
      size: IconSize
      height?: never
      width?: never
    }
  | {
      size?: never
      height?: number
      width?: number
    }

export type SvgIconProps = Omit<React.ComponentProps<'svg'>, 'height' | 'width'> & IconProps
