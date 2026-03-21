export type ResumeData = {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    summary: string;
    photo?: string;
  };
  experience: {
    id: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    degree: string;
    school: string;
    graduationDate: string;
    gpa: string;
    fileName?: string;
    description?: string;
  }[];
  skills: {
    technical: string[];
    soft: string[];
  };
  settings: {
    primaryColor: string;
    fontFamily: string;
    fontSize: string;
    template: 'modern' | 'classic' | 'minimal';
    language: 'TR' | 'EN' | 'DE' | 'FR' | 'ES' | 'IT' | 'AR' | 'RU' | 'ZH' | 'JP';
  };
};