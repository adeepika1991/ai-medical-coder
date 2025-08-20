//Temporary

export type ThemeContextType = {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export interface PatientSummary {
  name: string;
  dob: Date;
  insurance: string | null;
}

// The above can also be written as follows
// import { Patient } from '@prisma/client';

// type PatientSummary = Pick<Patient, 'name' | 'dob' | 'insurance'>;
