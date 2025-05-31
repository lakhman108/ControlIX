"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { activationLinks } from "@/app/_utils/linkConfiguration";
const ActiveLink = (props: { slug: string; addClass?: string }) => {
  const pathname = usePathname();
  const activeLink =
    activationLinks[props.slug as keyof typeof activationLinks];
  return (
    <Link
      className={` ${pathname == activeLink.pathname ? "active" : ""} ${props.addClass}`}
      href={`${activeLink.pathname}`}
    >
      {activeLink.displayName}
    </Link>
  );
};

export default ActiveLink;
