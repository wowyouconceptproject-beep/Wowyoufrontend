import {
  Globe,
  Mail,
  MessageCircle,
} from "lucide-react";

export const SHARE_PLATFORMS = [
  {
    name: "WhatsApp",
    icon: MessageCircle,
    key: "whatsapp",
  },
  {
  name: "Facebook",
  icon: Globe,
  key: "facebook",
},
{
  name: "LinkedIn",
  icon: Globe,
  key: "linkedin",
},
  {
    name: "Email",
    icon: Mail,
    key: "email",
  },
] as const;