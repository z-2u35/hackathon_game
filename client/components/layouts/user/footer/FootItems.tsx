import { IconType } from "react-icons";
import { FaFacebookF, FaInstagram, FaYoutube, FaGithub } from "react-icons/fa";

type LogoItem = { type: "logo"; href: string; src: string };
type IconItem = { type: "icon"; href: string; icon: IconType };
type LinkItem = { label: string; href: string };
export type FooterItem = LogoItem | IconItem | LinkItem;

export const FootItemsExtended: {
  title: string;
  items: FooterItem[];
}[] = [
  {
    title: "Logo & Social",
    items: [
      { type: "logo", href: "/", src: "/img/TeamLogo.png" },
      { type: "icon", href: "https://facebook.com", icon: FaFacebookF },
      { type: "icon", href: "https://instagram.com", icon: FaInstagram },
      { type: "icon", href: "https://youtube.com", icon: FaYoutube },
      { type: "icon", href: "https://github.com", icon: FaGithub },
    ],
  },
  {
    title: "Sản phẩm",
    items: [
      { label: "Tính năng", href: "/features" },
      { label: "Bảng giá", href: "/pricing" },
      { label: "Cập nhật", href: "/updates" },
    ],
  },
  {
    title: "Công ty",
    items: [
      { label: "Về chúng tôi", href: "/about" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Hỗ trợ",
    items: [
      { label: "Liên hệ", href: "/contact" },
      { label: "Trung tâm trợ giúp", href: "/help" },
      { label: "Chính sách bảo mật", href: "/privacy" },
    ],
  },
  {
    title: "Pháp lý",
    items: [
      { label: "Điều khoản dịch vụ", href: "/terms" },
      { label: "Chính sách cookie", href: "/cookies" },
    ],
  },
];
