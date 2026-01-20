import { useRef } from 'react';

export function useScrollToSection() {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  console.log("checkcing scetionrefs", sectionRefs)

  const scrollToSection = (sectionId: string, delay = 300) => {
    setTimeout(() => {
      const element = sectionRefs.current[sectionId];
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, delay);
  };

  const registerSection = (sectionId: string) => (el: HTMLElement | null) => {
    sectionRefs.current[sectionId] = el;
  };

  return { scrollToSection, registerSection };
}