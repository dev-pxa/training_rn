import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import BellIcon from './BellIcon';
import SearchIcon from './SearchIcon';
import ChartIcon from './ChartIcon';
import CupIcon from './CupIcon';
import MedalIcon from './MedalIcon';
import PlayIcon from './PlayIcon';
import ClockIcon from './ClockIcon';
import CollectionIcon from './CollectionIcon';
import HomeIcon from './HomeIcon';
import LearnIcon from './LearnIcon';
import ExamIcon from './ExamIcon';
import ProfileIcon from './ProfileIcon';
import CrownIcon from './CrownIcon';
import StarIcon from './StarIcon';
import CheckCircleIcon from './CheckCircleIcon';
import PlayCircleIcon from './PlayCircleIcon';
import ReorderIcon from './ReorderIcon';
import SettingsIcon from './SettingsIcon';
import CloudDownloadIcon from './CloudDownloadIcon';
import ArrowRightIcon from './ArrowRightIcon';
import VerifiedCheckIcon from './VerifiedCheckIcon';
import UserIcon from './UserIcon';
import LockIcon from './LockIcon';
import ChevronDownIcon from './ChevronDownIcon';
import CheckIcon from './CheckIcon';
import XIcon from './XIcon';
import LogoIcon from './LogoIcon';
import EyeIcon from './EyeIcon';
import PlusIcon from './PlusIcon';
import BookIcon from './BookIcon';

export type IconName =
  | 'Bell'
  | 'Search'
  | 'Chart'
  | 'Cup'
  | 'Medal'
  | 'Play'
  | 'Clock'
  | 'Collection'
  | 'Home'
  | 'Learn'
  | 'Exam'
  | 'Profile'
  | 'Crown'
  | 'Star'
  | 'CheckCircle'
  | 'PlayCircle'
  | 'Reorder'
  | 'Settings'
  | 'CloudDownload'
  | 'ArrowRight'
  | 'VerifiedCheck'
  | 'User'
  | 'Lock'
  | 'ChevronDown'
  | 'Check'
  | 'X'
  | 'Logo'
  | 'Eye'
  | 'Plus'
  | 'Book';

interface IconProps {
  name: IconName;
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  opacity?: number;
}

interface BaseIconProps {
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  opacity?: number;
}

const IconMap: Record<IconName, React.FC<BaseIconProps>> = {
  Bell: BellIcon,
  Search: SearchIcon,
  Chart: ChartIcon,
  Cup: CupIcon,
  Medal: MedalIcon,
  Play: PlayIcon,
  Clock: ClockIcon,
  Collection: CollectionIcon,
  Home: HomeIcon,
  Learn: LearnIcon,
  Exam: ExamIcon,
  Profile: ProfileIcon,
  Crown: CrownIcon,
  Star: StarIcon,
  CheckCircle: CheckCircleIcon,
  PlayCircle: PlayCircleIcon,
  Reorder: ReorderIcon,
  Settings: SettingsIcon,
  CloudDownload: CloudDownloadIcon,
  ArrowRight: ArrowRightIcon,
  VerifiedCheck: VerifiedCheckIcon,
  User: UserIcon,
  Lock: LockIcon,
  ChevronDown: ChevronDownIcon,
  Check: CheckIcon,
  X: XIcon,
  Logo: LogoIcon,
  Eye: EyeIcon,
  Plus: PlusIcon,
  Book: BookIcon,
};

const Icon = ({ name, color, size, style, opacity }: IconProps) => {
  const IconComponent = IconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <IconComponent color={color} size={size} style={style} opacity={opacity} />;
};

export default Icon;
