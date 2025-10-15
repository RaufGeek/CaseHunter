// Global type definitions

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          query_id?: string;
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          auth_date: number;
          hash: string;
        };
        version: string;
        platform: string;
        colorScheme: "light" | "dark";
        themeParams: {
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
          hint_color?: string;
          bg_color?: string;
          text_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        BackButton: {
          isVisible: boolean;
          show(): void;
          hide(): void;
          onClick(callback: () => void): void;
          offClick(callback: () => void): void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isProgressVisible: boolean;
          isActive: boolean;
          setText(text: string): void;
          onClick(callback: () => void): void;
          offClick(callback: () => void): void;
          show(): void;
          hide(): void;
          enable(): void;
          disable(): void;
          showProgress(leaveActive?: boolean): void;
          hideProgress(): void;
          setParams(params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }): void;
        };
        HapticFeedback: {
          impactOccurred(
            style: "light" | "medium" | "heavy" | "rigid" | "soft"
          ): void;
          notificationOccurred(type: "error" | "success" | "warning"): void;
          selectionChanged(): void;
        };
        CloudStorage: {
          setItem(
            key: string,
            value: string,
            callback?: (error: string | null, result: boolean) => void
          ): void;
          getItem(
            key: string,
            callback: (error: string | null, result: string | null) => void
          ): void;
          getItems(
            keys: string[],
            callback: (
              error: string | null,
              result: Record<string, string>
            ) => void
          ): void;
          removeItem(
            key: string,
            callback?: (error: string | null, result: boolean) => void
          ): void;
          removeItems(
            keys: string[],
            callback?: (error: string | null, result: boolean) => void
          ): void;
          getKeys(
            callback: (error: string | null, result: string[]) => void
          ): void;
        };
        ready(): void;
        expand(): void;
        close(): void;
      };
    };
  }
}

export {};
