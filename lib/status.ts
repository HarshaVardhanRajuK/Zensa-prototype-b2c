import type { BadgeProps } from "@/components/ui/badge";
import type {
  BookingStatus,
  EnrollmentStatus,
  HeldStatus,
  OrderStatus,
  ShareStatus,
  StayStatus,
  SubStatus,
} from "@/lib/mock/types";

type Variant = NonNullable<BadgeProps["variant"]>;
export interface StatusMeta {
  label: string;
  variant: Variant;
  dot: string;
}

export const BOOKING_STATUS: Record<BookingStatus, StatusMeta> = {
  upcoming: { label: "Upcoming", variant: "info", dot: "bg-info" },
  confirmed: { label: "Confirmed", variant: "success", dot: "bg-success" },
  in_progress: { label: "In progress", variant: "default", dot: "bg-primary" },
  completed: { label: "Completed", variant: "muted", dot: "bg-muted-foreground" },
  cancelled: { label: "Cancelled", variant: "secondary", dot: "bg-muted-foreground" },
};

export const HELD_STATUS: Record<HeldStatus, StatusMeta> = {
  active: { label: "Active", variant: "success", dot: "bg-success" },
  expiring: { label: "Expiring soon", variant: "warning", dot: "bg-warning" },
  expired: { label: "Expired", variant: "muted", dot: "bg-muted-foreground" },
  paused: { label: "Paused", variant: "warning", dot: "bg-warning" },
  cancelled: { label: "Cancelled", variant: "secondary", dot: "bg-muted-foreground" },
};

export const SUB_STATUS: Record<SubStatus, StatusMeta> = {
  active: { label: "Active", variant: "success", dot: "bg-success" },
  paused: { label: "Paused", variant: "warning", dot: "bg-warning" },
  cancelled: { label: "Cancelled", variant: "secondary", dot: "bg-muted-foreground" },
};

export const ENROLLMENT_STATUS: Record<EnrollmentStatus, StatusMeta> = {
  active: { label: "In progress", variant: "default", dot: "bg-primary" },
  completed: { label: "Completed", variant: "success", dot: "bg-success" },
  paused: { label: "Paused", variant: "warning", dot: "bg-warning" },
};

export const STAY_STATUS: Record<StayStatus, StatusMeta> = {
  reserved: { label: "Reserved", variant: "warning", dot: "bg-warning" },
  confirmed: { label: "Confirmed", variant: "info", dot: "bg-info" },
  checked_in: { label: "Checked in", variant: "default", dot: "bg-primary" },
  completed: { label: "Completed", variant: "muted", dot: "bg-muted-foreground" },
};

export const ORDER_STATUS: Record<OrderStatus, StatusMeta> = {
  processing: { label: "Processing", variant: "info", dot: "bg-info" },
  ready: { label: "Ready for pickup", variant: "success", dot: "bg-success" },
  completed: { label: "Completed", variant: "muted", dot: "bg-muted-foreground" },
  cancelled: { label: "Cancelled", variant: "secondary", dot: "bg-muted-foreground" },
};

export const SHARE_STATUS: Record<ShareStatus, StatusMeta> = {
  active: { label: "Sharing", variant: "success", dot: "bg-success" },
  revoked: { label: "Revoked", variant: "muted", dot: "bg-muted-foreground" },
};
