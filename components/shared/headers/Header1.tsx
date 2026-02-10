"use client";

import React, { useState } from "react";
import { ChangeLocation } from "./partials/LocationButton";
import { PhoneNumber } from "./partials/PhoneButton";
import { Logo } from "./partials/Logo";
import { ActionButton } from "./partials/Extra";
import { CartButton } from "./partials/CartButton";
import { UserProfile } from "./partials/UserProfileButton";
import { HamburgerMenu } from "./partials/HamburgerMenu";
import { SvgIcon } from "../../common/SvgIcon";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAppSelector } from "@/store/hooks";
import { selectAddressApiData } from "@/store/slices/addressSlice";

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
  const addressAndThemeData = useAppSelector(selectAddressApiData);
  const settings = addressAndThemeData?.dataPayload?.Theme?.Settings;

  const showSubmitComplaint = settings?.SUBMIT_COMPLAINT_BUTTON ?? false; // Default: show
  const showMultiLanguage = settings?.MULTI_LANGUAGE ?? false; // Default: show
  const showUserLogin = settings?.USER_LOGIN_ICON ?? false; // Default: show
  const showHamburger = settings?.HAMBURGER_MENU ?? false; // Default: show

  // Get restaurant logo or use default
  const logoSrc = settings?.RESTAURANT_LOGO || headerConfig.logoSrc;

  return (
    <header className="w-full bg-topbar-bg border-b border-color-border relative">
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 md:py-4">
  
      <div className="relative flex items-center h-16 lg:h-20">
  
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <ChangeLocation locationIcon={<SvgIcon src="/assets/images/svgIcons/location.svg" alt="Location" />} />
          <PhoneNumber
            phoneIcon={<SvgIcon src="/assets/images/svgIcons/phone-call.svg" alt="Phone" />}
            phoneNumber={headerConfig.phoneNumber}
          />
        </div>
  
        {/* Center Logo — truly fixed */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Logo src={logoSrc} href="/" alt="logo" />
        </div>
  
        {/* Right Section */}
        <div className="ml-auto flex items-center gap-3 lg:gap-4">
          {showSubmitComplaint && (
            <div className="hidden md:flex">
              <ActionButton {...headerConfig.actionButton} />
            </div>
          )}
  
          {showMultiLanguage && <LanguageSwitcher />}
  
          <CartButton
            cartIcon={<SvgIcon src="/assets/images/svgIcons/cart.svg" alt="Cart" />}
            href={headerConfig.cartHref}
          />
  
          {showUserLogin && (
            <UserProfile
              profileIcon={<SvgIcon src="/assets/images/svgIcons/user.svg" alt="Profile" />}
              href={headerConfig.profileHref}
            />
          )}
  
          {showHamburger && (
            <HamburgerMenu
              menuIcon={<SvgIcon src="/assets/images/svgIcons/humburger-menu.svg" alt="Menu" />}
              isOpen={sidebarOpen}
              onToggle={setSidebarOpen}
            />
          )}
        </div>
  
      </div>
    </div>
  </header>
  
  );
};

export default Header1;