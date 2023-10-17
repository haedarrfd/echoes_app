import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { dark } from "@clerk/themes";

export function TopBar() {
  return (
    <nav className="topbar">
      {/* Logo Navbar */}
      <Link href="/" className="flex items-center gap-4">
        <Image src="/logo.svg" alt="Logo" width={30} height={30} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Echoes</p>
      </Link>

      <div className="flex items-center gap-1">
        {/* it'll appear on mobile devices */}
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="Logout"
                  width={25}
                  height={25}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        {/* Profile */}
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
}

export default TopBar;
