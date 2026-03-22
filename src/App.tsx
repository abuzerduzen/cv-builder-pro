import { useState, useEffect, useRef } from 'react';
import { Step1 } from './components/Step1';
import { Step2 } from './components/Step2';
import { Step3 } from './components/Step3';
import Step4 from './components/Step4';
import { ProgressBar } from './components/ProgressBar';
import type { ResumeData } from './types';
import { FileText, Download, Sparkles, Settings, ChevronRight, ChevronLeft, Loader2, User, Briefcase, GraduationCap } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const initialData: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    city: '',
    country: '',
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
  },
  settings: {
    primaryColor: '#2563eb',
    fontFamily: 'inter',
    fontSize: '14', // Default font size in px
    language: 'TR',
    template: 'modern',
  },
};

const languages = ['TR', 'EN', 'DE', 'FR', 'ES', 'IT', 'AR', 'RU', 'ZH', 'JP'] as const;
const colors = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea', '#4f46e5', '#0891b2', '#be123c', '#4338ca', '#1e293b'];
const fonts = ['sans', 'serif', 'mono', 'inter', 'roboto', 'lato', 'poppins'];

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ResumeData>(initialData);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [resumeScore, setResumeScore] = useState(0);
  const [aiFeedback, setAiFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [textScale, setTextScale] = useState(100);
  
  // Otomatik ölçeklendirme için referans ve state
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  const totalSteps = 4;

  // CV Skorunu Hesapla
  useEffect(() => {
    calculateResumeScore();
  }, [formData]);

  // Ekran boyutuna göre A4 kağıdını otomatik ölçeklendir
  useEffect(() => {
    const updateScale = () => {
      if (previewContainerRef.current) {
        const containerWidth = previewContainerRef.current.clientWidth;
        const containerHeight = previewContainerRef.current.clientHeight;
        
        // A4 kağıdının piksel cinsinden yaklaşık boyutları (96dpi)
        const A4_WIDTH = 794;
        const A4_HEIGHT = 1123;

        // Hem genişliğe hem yüksekliğe sığması için %5 boşluk (0.95) bırakarak ölçekle
        const scaleX = containerWidth / A4_WIDTH;
        const scaleY = containerHeight / A4_HEIGHT;
        const newScale = Math.min(scaleX, scaleY) * 0.95;

        setPreviewScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const calculateResumeScore = () => {
    let score = 0;
    const { personalInfo, experience, education, skills } = formData;

    if (personalInfo.fullName) score += 5;
    if (personalInfo.email) score += 5;
    if (personalInfo.phone) score += 5;
    if (personalInfo.summary.length > 50) score += 10;
    if (personalInfo.photo) score += 5;

    if (experience.length > 0) score += 15;
    if (experience.length > 1) score += 10;
    if (experience.some(exp => exp.description.length > 50)) score += 10;

    if (education.length > 0) score += 10;
    if (education.some(edu => edu.gpa)) score += 5;

    if (skills.technical.length > 0) score += 10;
    if (skills.soft.length > 0) score += 10;

    setResumeScore(Math.min(100, score));
  };

  const handleLanguageChange = async (newLang: string) => {
    const oldLang = formData.settings.language;
    updateSettings({ language: newLang as any });

    if (oldLang === newLang) return;

    // Check if there is actual data to translate
    const hasData = formData.personalInfo.summary || formData.experience.length > 0 || formData.education.length > 0 || (formData.skills.technical.length > 0 || formData.skills.soft.length > 0);
    if (!hasData) return;

    setIsTranslating(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        alert('Gemini API anahtarı bulunamadı. Çeviri yapılamıyor.');
        setIsTranslating(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const translatableData = {
        personalInfo: {
          fullName: formData.personalInfo.fullName,
          summary: formData.personalInfo.summary,
          city: formData.personalInfo.city,
          country: formData.personalInfo.country,
        },
        experience: formData.experience.map(exp => ({
          id: exp.id,
          jobTitle: exp.jobTitle,
          company: exp.company,
          description: exp.description,
        })),
        education: formData.education.map(edu => ({
          id: edu.id,
          degree: edu.degree,
          school: edu.school,
          description: edu.description,
        })),
        skills: formData.skills
      };

      const prompt = `Translate the following JSON data to ${newLang} language. 
      Keep the exact same JSON structure, keys, and IDs. 
      Only translate the string values. Do not translate IDs or keys.
      JSON Data:
      ${JSON.stringify(translatableData)}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      if (response.text) {
        const translated = JSON.parse(response.text);
        
        setFormData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            fullName: translated.personalInfo.fullName || prev.personalInfo.fullName,
            summary: translated.personalInfo.summary || prev.personalInfo.summary,
            city: translated.personalInfo.city || prev.personalInfo.city,
            country: translated.personalInfo.country || prev.personalInfo.country,
          },
          experience: prev.experience.map(exp => {
            const transExp = translated.experience?.find((t: any) => t.id === exp.id);
            return transExp ? { ...exp, ...transExp } : exp;
          }),
          education: prev.education.map(edu => {
            const transEdu = translated.education?.find((t: any) => t.id === edu.id);
            return transEdu ? { ...edu, ...transEdu } : edu;
          }),
          skills: translated.skills || prev.skills
        }));
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Çeviri sırasında bir hata oluştu.');
    } finally {
      setIsTranslating(false);
    }
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setAiFeedback('Gemini API anahtarı bulunamadı. Lütfen .env dosyanızı kontrol edin.');
        setIsAnalyzing(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Bu CV verilerini analiz et ve nasıl geliştirilebileceğine dair 3 kısa, profesyonel öneri sun (Türkçe olarak):
      Ad Soyad: ${formData.personalInfo.fullName}
      Özet: ${formData.personalInfo.summary}
      Deneyim Sayısı: ${formData.experience.length}
      Eğitim Sayısı: ${formData.education.length}
      Yetenekler: ${formData.skills.technical.join(', ')} (Teknik), ${formData.skills.soft.join(', ')} (Kişisel)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiFeedback(response.text || 'Analiz tamamlanamadı.');
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAiFeedback('Yapay zeka analizi sırasında bir hata oluştu.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersonalInfo = (data: Partial<ResumeData['personalInfo']>) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data },
    }));
  };

  const updateExperience = (data: ResumeData['experience']) => {
    setFormData((prev) => ({ ...prev, experience: data }));
  };

  const updateEducation = (data: ResumeData['education']) => {
    setFormData((prev) => ({ ...prev, education: data }));
  };

  const updateSettings = (data: Partial<ResumeData['settings']>) => {
    setFormData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...data },
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Kişisel Bilgiler</h2>
            </div>
            <Step1 data={formData.personalInfo} updateData={updatePersonalInfo} />
          </div>
        );
      case 2:
        return (
          <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">İş Deneyimi</h2>
            </div>
            <Step2 data={formData.experience} updateData={updateExperience} />
          </div>
        );
      case 3:
        return (
          <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Eğitim & Yetenekler</h2>
            </div>
            <Step3 
              data={formData.education}
              updateData={updateEducation}
            />
          </div>
        );
      case 4:
        return (
          <div className="animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Tasarım & Ayarlar</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tema Rengi</label>
                <div className="flex space-x-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => updateSettings({ primaryColor: color })}
                      className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                        formData.settings.primaryColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Ailesi</label>
                <select
                  value={formData.settings.fontFamily}
                  onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  <option value="inter">Inter (Modern)</option>
                  <option value="roboto">Roboto (Klasik)</option>
                  <option value="lato">Lato (Zarif)</option>
                  <option value="poppins">Poppins (Yuvarlak)</option>
                  <option value="serif">Georgia (Geleneksel)</option>
                  <option value="mono">JetBrains Mono (Teknik)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Metin Ölçeği (Kağıt Zoom: %{textScale})
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={textScale}
                  onChange={(e) => setTextScale(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Yazı Boyutu (px) - Sadece Metinler
                </label>
                <input
                  type="number"
                  min="10"
                  max="30"
                  value={formData.settings.fontSize === 'base' ? '14' : formData.settings.fontSize.replace('px', '')}
                  onChange={(e) => updateSettings({ fontSize: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dil (Otomatik Çeviri)</label>
                <select
                  value={formData.settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Şablon Stili</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateSettings({ template: 'modern' })}
                    className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                      formData.settings.template === 'modern'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Modern
                  </button>
                  <button
                    onClick={() => updateSettings({ template: 'classic' })}
                    className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                      formData.settings.template === 'classic'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Klasik
                  </button>
                  <button
                    onClick={() => updateSettings({ template: 'minimal' })}
                    className={`px-3 py-2 text-sm font-medium rounded-md border transition-colors ${
                      formData.settings.template === 'minimal'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Minimal
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Translation Loading Overlay */}
      {isTranslating && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Yapay Zeka Çevirisi</h3>
            <p className="text-sm text-gray-500 text-center">
              CV içeriğiniz seçilen dile çevriliyor. Lütfen bekleyin...
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">CV Builder Pro</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">CV Score: {resumeScore}/100</span>
            </div>
            
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">PDF İndir</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Split Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-8 h-[calc(100vh-4rem)]">
        
        {/* Left Panel - Form (50%) */}
        <div className={`w-full lg:w-1/2 flex flex-col h-full ${showMobilePreview ? 'hidden lg:flex' : 'flex'}`}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1 overflow-y-auto custom-scrollbar">
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            
            <div className="mt-8">
              {renderStep()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-4 flex justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Geri</span>
            </button>
            
            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <span>İleri</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={analyzeWithAI}
                disabled={isAnalyzing}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? 'Analiz Ediliyor...' : 'Yapay Zeka Analizi'}</span>
              </button>
            )}
          </div>

          {/* AI Feedback Area */}
          {aiFeedback && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-100 rounded-xl">
              <h3 className="text-sm font-bold text-purple-900 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI Önerileri
              </h3>
              <p className="text-sm text-purple-800 whitespace-pre-line">{aiFeedback}</p>
            </div>
          )}
        </div>

        {/* Right Panel - Live Preview (50%) */}
        <div className={`w-full lg:w-1/2 h-full ${!showMobilePreview ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-gray-200 rounded-xl p-4 lg:p-8 h-full overflow-y-auto custom-scrollbar flex items-start justify-center">
            <div className="w-full max-w-[210mm] transition-transform origin-top" style={{ transform: `scale(${textScale / 100})` }}>
              <Step4 data={formData} />
            </div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setShowMobilePreview(!showMobilePreview)}
          className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-50 flex items-center gap-2"
        >
          {showMobilePreview ? (
            <>
              <Settings className="w-5 h-5" />
              <span className="font-medium">Düzenle</span>
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span className="font-medium">Önizleme</span>
            </>
          )}
        </button>

      </main>
    </div>
  );
}

export default App;