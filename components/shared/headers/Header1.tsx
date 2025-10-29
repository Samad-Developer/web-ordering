"use client";

import React, { useState } from "react";
import { ChangeLocation } from "./partials/LocationButton";
import { PhoneNumber } from "./partials/PhoneButton";
import { Logo } from "./partials/Logo";
import { ActionButton } from "./partials/Extra";
import { Cart } from "./partials/CartButton";
import { UserProfile } from "./partials/UserProfileButton";
import { HamburgerMenu } from "./partials/HamburgerMenu";
import { SvgIcon } from "../../common/SvgIcon";

const headerConfig = {
  phoneNumber: "+923485497976",
  cartHref: "/cart",
  logoSrc: "/assets/images/logo/logo.webp",
  profileHref: "/profile",
  actionButton: {
    text: "Submit Complaint",
    href: "/complaint",
    openInNewTab: true,
  },
};

const Header1 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="w-full bg-color-background border-b border-color-border">
      <div className="w-full md:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-4">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Left Section — will be move to right side on mobile */}
          <div className="flex items-center gap-3 order-2 md:order-1 mr-3 md:mr-0">
            <ChangeLocation
              locationIcon={<SvgIcon src="/assets/images/svgIcons/location.svg" alt="Location" />}
            />
            <PhoneNumber
              phoneIcon={<SvgIcon src="/assets/images/svgIcons/phone-call.svg" alt="Phone" />}
              phoneNumber={headerConfig.phoneNumber}
            />
          </div>

          {/* Center Section — Logo  */}
          <div className="order-1 md:order-2 flex-1 flex items-center justify-start md:justify-center">
            <Logo src={headerConfig.logoSrc} href="/" alt="logo" />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 lg:gap-4 order-3 md:order-3">
            <div className="hidden md:flex">
              <ActionButton {...headerConfig.actionButton} />
            </div>

            <Cart
              cartIcon={<SvgIcon src="/assets/images/svgIcons/cart.svg" alt="Cart" />}
              href={headerConfig.cartHref}
            />

            <UserProfile
              profileIcon={<SvgIcon src="/assets/images/svgIcons/user.svg" alt="Profile" />}
              href={headerConfig.profileHref}
            />

            <HamburgerMenu
              menuIcon={<SvgIcon src="/assets/images/svgIcons/humburger-menu.svg" alt="Menu" />}
              isOpen={sidebarOpen}
              onToggle={setSidebarOpen}
            />

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header1;