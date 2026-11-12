<script lang="ts">
  import { statusPill } from "./status-pill.styles";

  import * as stylex from "@stylexjs/stylex";
  export type StatusPillStatus =
    "active" | "inactive" | "pending" | "warning" | "info" | "cancelled" | "deleted";

  type Props = {
    status: StatusPillStatus;
    label?: string | null;
  };

  let { status, label = null }: Props = $props();

  const labels: Record<StatusPillStatus, string> = {
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    warning: "Warning",
    info: "Info",
    cancelled: "Cancelled",
    deleted: "Deleted",
  };

  const classes: Record<StatusPillStatus, stylex.StyleXStyles> = {
    active: statusPill.active,
    inactive: statusPill.inactive,
    pending: statusPill.warning,
    warning: statusPill.warning,
    info: statusPill.info,
    cancelled: statusPill.cancelled,
    deleted: statusPill.cancelled,
  };

  const dotClasses: Record<StatusPillStatus, stylex.StyleXStyles> = {
    active: statusPill.activeDot,
    inactive: statusPill.inactiveDot,
    pending: statusPill.warningDot,
    warning: statusPill.warningDot,
    info: statusPill.infoDot,
    cancelled: statusPill.cancelledDot,
    deleted: statusPill.cancelledDot,
  };
</script>

<span class={[stylex.attrs(statusPill.root, classes[status]).class]}>
  <span
    class={[stylex.attrs(statusPill.dot, dotClasses[status]).class]}
    aria-hidden="true"
  ></span>
  {label ?? labels[status]}
</span>
