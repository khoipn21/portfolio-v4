import type { ComponentType } from 'react';
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  AsteriskIcon,
  CheckIcon,
  CopyIcon,
  DownloadSimpleIcon,
  GitBranchIcon,
  KeyboardIcon,
  LeafIcon,
  MoonIcon,
  PaperPlaneTiltIcon,
  PathIcon,
  PlayIcon,
  StackIcon,
  SunIcon,
  TrophyIcon,
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
export const DownloadSimple = withDefaults(DownloadSimpleIcon, 'download-simple');
export const Leaf = withDefaults(LeafIcon, 'leaf');
export const Moon = withDefaults(MoonIcon, 'moon');
export const Play = withDefaults(PlayIcon, 'play');
export const Sun = withDefaults(SunIcon, 'sun');
export const X = withDefaults(XIcon, 'x');
export const Asterisk = withDefaults(AsteriskIcon, 'asterisk');
export const GitBranch = withDefaults(GitBranchIcon, 'git-branch');
export const Keyboard = withDefaults(KeyboardIcon, 'keyboard');
export const PaperPlaneTilt = withDefaults(PaperPlaneTiltIcon, 'paper-plane-tilt');
export const Path = withDefaults(PathIcon, 'path');
export const Stack = withDefaults(StackIcon, 'stack');
export const Trophy = withDefaults(TrophyIcon, 'trophy');
