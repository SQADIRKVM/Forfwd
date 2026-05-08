import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OnboardingState {
    userName: string;
    studentType: string;
    location: string;
    currency: string;
    questionnaireAnswers: Record<string, string | number | string[]>;
    
    // Actions
    setUserName: (name: string) => void;
    setStudentType: (type: string) => void;
    setLocation: (location: string) => void;
    setCurrency: (currency: string) => void;
    setQuestionnaireAnswers: (answers: Record<string, string | number | string[]>) => void;
    clearSession: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            userName: '',
            studentType: '',
            location: 'Global',
            currency: 'USD',
            questionnaireAnswers: {},
            
            setUserName: (name) => set({ userName: name }),
            setStudentType: (type) => set({ studentType: type }),
            setLocation: (loc) => set({ location: loc }),
            setCurrency: (cur) => set({ currency: cur }),
            setQuestionnaireAnswers: (answers) => set({ questionnaireAnswers: answers }),
            clearSession: () => set({ userName: '', studentType: '', location: 'Global', currency: 'USD', questionnaireAnswers: {} }),
        }),
        {
            name: 'forfwd-onboarding-storage',
        }
    )
);
