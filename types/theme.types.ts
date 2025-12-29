export interface ThemeColors {
    main: {
      primaryColor: string;
      secondaryColor: string;
      backgroundColor: string;
    };
    topBar: {
      background: string;
      foreground: string;
    };
    category: {
      background: string;
      foreground: string;
      hover: string;
      active: string;
    };
    product: {
      background: string;
      nameColor: string;
      descriptionColor: string;
      price: {
        background: string;
        foreground: string;
      };
      addButton: {
        background: string;
      };
    };
    footer: {
      background: string;
      foreground: string;
    };
  }