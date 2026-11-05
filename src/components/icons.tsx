import type { ComponentType } from 'react';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  LeafIcon,
  MoonIcon,
  PlayIcon,
  PrinterIcon,
  SunIcon,
  XIcon,
} from '@phosphor-icons/react/ssr';
import type { IconProps } from '@phosphor-icons/react';

export type { IconProps };

function withDefaults(Icon: ComponentType<IconProps>, name: string) {
  function PortfolioIcon({ className, ...props }: IconProps) {
    return (
      <Icon
        size={24}
        className={['icon', `icon-${name}`, className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  }
  PortfolioIcon.displayName = `Icon(${name})`;
  return PortfolioIcon;
}

export const ArrowDown = withDefaults(ArrowDownIcon, 'arrow-down');
export const ArrowLeft = withDefaults(ArrowLeftIcon, 'arrow-left');
export const ArrowRight = withDefaults(ArrowRightIcon, 'arrow-right');
export const ArrowUpRight = withDefaults(ArrowUpRightIcon, 'arrow-up-right');
export const Check = withDefaults(CheckIcon, 'check');
export const Copy = withDefaults(CopyIcon, 'copy');
export const Leaf = withDefaults(LeafIcon, 'leaf');
export const Moon = withDefaults(MoonIcon, 'moon');
export const Play = withDefaults(PlayIcon, 'play');
export const Printer = withDefaults(PrinterIcon, 'printer');
export const Sun = withDefaults(SunIcon, 'sun');
export const X = withDefaults(XIcon, 'x');
