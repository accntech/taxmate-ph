import * as stylex from "@stylexjs/stylex";
export type PersonPickerItem = {
  id: string;
  label: string;
  description?: string;
  searchText?: string;
  imageUrl?: string | null;
  fallback: string;
  avatarClass?: stylex.StyleXStyles;
  avatarStyle?: string;
  inactive?: boolean;
  deleted?: boolean;
};
