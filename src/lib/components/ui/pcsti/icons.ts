// Relevant glyph mappings copied from PCSTI packages/ui/src/icons.ts and component icon registries.
// Only package import paths differ for eBIRForms' installed Solar Icons version.
import type { Component } from "svelte";
import type { IconProps } from "@solar-icons/svelte";
import AddCircle from "@solar-icons/svelte/category/ui/Linear/AddCircle.svelte";
import Trash from "@solar-icons/svelte/category/ui/Linear/TrashBinTrash.svelte";
import ChevronDown from "@solar-icons/svelte/category/arrows/Linear/AltArrowDown.svelte";
import ChevronRight from "@solar-icons/svelte/category/arrows/Linear/AltArrowRight.svelte";
import ChevronLeft from "@solar-icons/svelte/category/arrows/Linear/AltArrowLeft.svelte";
import ChevronUp from "@solar-icons/svelte/category/arrows/Linear/AltArrowUp.svelte";
import Tag from "@solar-icons/svelte/category/money/Linear/Tag.svelte";
import CloseCircle from "@solar-icons/svelte/category/ui/Linear/CloseCircle.svelte";
import Search from "@solar-icons/svelte/category/search/Linear/MinimalisticMagnifier.svelte";
import Compact from "@solar-icons/svelte/category/ui/Linear/HamburgerMenu.svelte";
import Comfortable from "@solar-icons/svelte/category/list/Linear/List.svelte";
import Columns from "@solar-icons/svelte/category/it/Linear/SidebarMinimalistic.svelte";
import Filter from "@solar-icons/svelte/category/ui/Linear/Filter.svelte";
import Layers from "@solar-icons/svelte/category/tools/Linear/Layers.svelte";
import More from "@solar-icons/svelte/category/ui/Bold/MenuDots.svelte";
import MoreOutlined from "@solar-icons/svelte/category/ui/Linear/MenuDots.svelte";
import Pencil from "@solar-icons/svelte/category/messages/Linear/Pen.svelte";
import Archive from "@solar-icons/svelte/category/notes/Linear/Archive.svelte";
import Folder from "@solar-icons/svelte/category/folders/Linear/Folder.svelte";
import Restart from "@solar-icons/svelte/category/arrows/Linear/Restart.svelte";

import Printer from "@solar-icons/svelte/category/devices/Linear/Printer.svelte";
import Send from "@solar-icons/svelte/category/messages/Linear/Plain.svelte";

import CheckCircle from "@solar-icons/svelte/category/ui/Linear/CheckCircle.svelte";

export type IconComponent = Component<IconProps>;
export const glyphs = {
  addCircle: AddCircle,
  checkCircle: CheckCircle,
  printer: Printer,
  send: Send,
  trash: Trash,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  chevronUp: ChevronUp,
  tag: Tag,
  closeCircle: CloseCircle,
  search: Search,
  rowsCompact: Compact,
  rowsComfortable: Comfortable,
  columns: Columns,
  filter: Filter,
  layers: Layers,
  more: More,
  moreOutlined: MoreOutlined,
  pencil: Pencil,
  archive: Archive,
  refresh: Restart,
  folder: Folder,
};
