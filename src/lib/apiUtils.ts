import { PatientSummary } from '@/types/types';
import { API_ROUTES } from './apiRoutes';

export const fetchPatient = async (): Promise<PatientSummary> => {
  try {
    const res = await fetch(API_ROUTES.PATIENT);
    if (!res.ok) {
      const { message } = await res.json().catch(() => ({}));
      throw new Error(message || 'Failed to fetch patient');
    }
    return await res.json();
  } catch (error) {
    console.error('API Error [fetchPatient]:', error);
    throw error;
  }
};
