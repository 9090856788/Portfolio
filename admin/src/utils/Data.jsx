import { HomeIcon, LayoutIcon, CalendarIcon, InvoiceIcon } from "./Icons";

export const SidebarData = [
  {
    id: 1,
    name: "Dashboard",
    path: "/",
    icon: <HomeIcon />,
  },
  {
    id: 2,
    name: "Manage Project",
    path: "manage/project",
    icon: <LayoutIcon />,
  },
  {
    id: 3,
    name: "Manage Skills",
    path: "manage/skills",
    icon: <CalendarIcon />,
  },
  {
    id: 4,
    name: "Manage Timeline",
    path: "manage/timeline",
    icon: <InvoiceIcon />,
  },
  {
    id: 5,
    name: "Update Project",
    path: "update/project",
    icon: <InvoiceIcon />,
  },
  {
    id: 6,
    name: "View Project",
    path: "view/project",
    icon: <InvoiceIcon />,
  },
];
