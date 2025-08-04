//Temporary

export type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export interface ThemeProviderProps {
  children: React.ReactNode;
}
