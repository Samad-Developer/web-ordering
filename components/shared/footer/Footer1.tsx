import React from "react";
import { FooterContent } from "@/types/footer.types";
import { RestaurantAbout } from "./partials/RestaurantAbout";
import { ContactDetails } from "./partials/ContactDetails";
import { SocialLinks } from "./partials/SocialLinks";
import { AppDownloadSection } from "./partials/AppDownloadSection";
import { FooterLogo } from "./partials/FooterLogo";
import Link from "next/link";

interface Footer1Props {
  content: FooterContent;
}

export const footerData: FooterContent = {
  about: {
    title:
      "Kababjees Fried Chicken",
    description: `This haven for fried chicken enthusiasts serves up an array of tantalizing options, featuring a menu that boasts the crispiest and most flavorful chicken in the city. At Kababjees Fried Chicken, each dish is a masterpiece, from the classic Crispy Chicken to the ever-popular Crispy Zenga Burger.
      Our Kababjees Fried Chicken menu is carefully curated to ensure every bite is a delightful experience. Whether you\'re craving Crispy Chicken Wings or the best fried chicken in Karachi, our menu is designed to cater to all tastes. What sets us apart is our dedication to quality and flavor, making us a standout choice for fried chicken in Karachi.
      Convenience is a key in today\'s fast-paced world. Kababjees Fried Chicken’s delivery is swift and reliable, ensuring that your meal arrives hot, fresh, and ready to delight your taste buds. With exciting fried chicken deals, we offer great value, making our mouth-watering chicken accessible to everyone.
      At Kababjees Fried Chicken, we\'re committed to offering the most delicious crispy fried chicken that Karachi loves. So what are you waiting for? ORDER NOW and enjoy the best fried chicken in the city.`,
  },
  contact: [
    {
      type: "phone",
      value: "0348-5497976",
      href: "tel:021111666111",
    },
  ],
  social: [
    {
      platform: "facebook",
      url: "https://web.facebook.com/unitedkingpakistan/?_rdc=1&_rdr#",
      icon: "facebook",
      ariaLabel: "Follow us on Facebook",
    },
    {
      platform: "instagram",
      url: "https://www.instagram.com/unitedkingpakistan/?hl=en",
      icon: "instagram",
      ariaLabel: "Follow us on Instagram",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/company/united-king/",
      icon: "linkdin",
      ariaLabel: "Follow us on Linkdin",
    },
    {
      platform: "youtube",
      url: "https://www.youtube.com/@UnitedKingPakistan/videos",
      icon: "youtube",
      ariaLabel: "Follow us on YouTube",
    },
  ],
  appDownload: {
    title: "Get The App!",
    subtitle: "App is where the fun is! It's Easy, Fast and Convenient",
    apps: [
      {
        platform: "ios",
        url: "https://apps.apple.com/pk/app/kababjees-pk/id1559873794",
        icon: "/assets/images/app/app-store.webp",
      },
      {
        platform: "android",
        url: "https://play.google.com/store/apps/details?id=com.blink.kababjeesbakers&hl=en",
        icon: "/assets/images/app/google-play.webp",
      },
    ],
    image: "/assets/images/app/mockupbg.webp",
  },
  footerLogo: {
    src: "",
  },
};

const Footer1 = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-2 border-t ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col max-w-4xl mx-auto">
          <div>
            <div className="flex justify-center">
              <FooterLogo footerLogo={footerData.footerLogo} />
            </div>
            <RestaurantAbout
              title={footerData.about.title}
              description={footerData.about.description}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.8fr] gap-8 lg:gap-12 items-start mt-10">
            <ContactDetails contacts={footerData.contact} />
            <SocialLinks links={footerData.social} />
            <AppDownloadSection
              title={footerData.appDownload.title}
              subtitle={footerData.appDownload.subtitle}
              apps={footerData.appDownload.apps}
              image={footerData.appDownload.image}
            />
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} {footerData.about.title}. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacy-policy"
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer1;
