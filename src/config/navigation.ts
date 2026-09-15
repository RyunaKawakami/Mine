import { CircleUserRound, Images, Map, Plus } from "lucide-react";

export const mainNavigation = [
  { href: "/", label: "地図", icon: Map, prominent: false },
  { href: "/memories", label: "思い出", icon: Images, prominent: false },
  { href: "/trips/new", label: "追加", icon: Plus, prominent: true },
  {
    href: "/profile",
    label: "プロフィール",
    icon: CircleUserRound,
    prominent: false,
  },
] as const;
