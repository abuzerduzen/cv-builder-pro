import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import type { ResumeData } from '../types';

interface Step4Props {
  data: ResumeData;
}

const Step4: React.FC<Step4Props> = ({ data }) => {
  const { personalInfo, experience, education, skills, settings } = data;

  const getFontFamilyStyle = () => {
    switch (settings.fontFamily) {
      case 'serif': return 'Georgia, serif';
      case 'mono': return '"JetBrains Mono", monospace';
      case 'roboto': return '"Roboto", sans-serif';
      case 'lato': return '"Lato", sans-serif';
      case 'poppins': return '"Poppins", sans-serif';
      case 'inter': return '"Inter", sans-serif';
      default: return 'ui-sans-serif, system-ui, sans-serif';
    }
  };

  const getFontSizeStyle = () => {
    if (settings.fontSize === 'small') return '12px';
    if (settings.fontSize === 'base') return '14px';
    if (settings.fontSize === 'large') return '18px';
    return `${settings.fontSize}px`;
  };

  const getLabels = () => {
    switch (settings.language) {
      case 'EN':
        return {
          experience: 'Experience',
          education: 'Education',
          skills: 'Skills',
          summary: 'Professional Summary',
          gpa: 'GPA',
          present: 'Present'
        };
      case 'DE':
        return {
          experience: 'Berufserfahrung',
          education: 'Ausbildung',
          skills: 'Fähigkeiten',
          summary: 'Berufliches Profil',
          gpa: 'Note',
          present: 'Heute'
        };
      case 'FR':
        return {
          experience: 'Expérience',
          education: 'Formation',
          skills: 'Compétences',
          summary: 'Profil Professionnel',
          gpa: 'Moyenne',
          present: 'Présent'
        };
      case 'ES':
        return {
          experience: 'Experiencia',
          education: 'Educación',
          skills: 'Habilidades',
          summary: 'Perfil Profesional',
          gpa: 'Promedio',
          present: 'Presente'
        };
      default:
        return {
          experience: 'İş Deneyimi',
          education: 'Eğitim',
          skills: 'Yetenekler',
          summary: 'Profesyonel Özet',
          gpa: 'GNO',
          present: 'Devam Ediyor'
        };
    }
  };

  const labels = getLabels();

  // ==========================================
  // 1. MODERN ŞABLON (Renkli Header, Dikey Akış)
  // ==========================================
  const renderModernTemplate = () => (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Header */}
      <div 
        className="px-10 py-8 text-white flex items-center gap-8 break-inside-avoid"
        style={{ backgroundColor: settings.primaryColor }}
      >
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md shrink-0"
          />
        )}
        <div className="flex-1">
          <h1 className="text-[2.25em] font-bold mb-2 leading-tight">{personalInfo.fullName || 'Ad Soyad'}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9em] opacity-95 mt-3">
            {personalInfo.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content - Tam Genişlik Dikey Akış */}
      <div className="p-10 flex flex-col gap-8 flex-1">
        {personalInfo.summary && (
          <section className="break-inside-avoid w-full">
            <h2 
              className="text-[1.15em] font-bold mb-3 uppercase tracking-wider border-b-2 pb-1"
              style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
            >
              {labels.summary}
            </h2>
            <p className="text-[1em] leading-relaxed text-gray-700 whitespace-pre-wrap break-words text-justify">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="w-full">
            <h2 
              className="text-[1.15em] font-bold mb-4 uppercase tracking-wider border-b-2 pb-1 break-inside-avoid"
              style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
            >
              {labels.experience}
            </h2>
            <div className="flex flex-col gap-6">
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid w-full">
                  <div className="flex justify-between items-baseline mb-1 gap-4">
                    <h3 className="text-[1.05em] font-bold text-gray-900 break-words">{exp.jobTitle}</h3>
                    <span className="text-[0.9em] text-gray-600 font-medium shrink-0">
                      {exp.startDate} - {exp.current ? labels.present : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[1em] font-medium text-gray-700 mb-2">{exp.company}</div>
                  <p className="text-[1em] text-gray-600 whitespace-pre-wrap break-words leading-relaxed text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="w-full">
            <h2 
              className="text-[1.15em] font-bold mb-4 uppercase tracking-wider border-b-2 pb-1 break-inside-avoid"
              style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
            >
              {labels.education}
            </h2>
            <div className="flex flex-col gap-5">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid w-full">
                  <div className="flex justify-between items-baseline mb-1 gap-4">
                    <h3 className="text-[1.05em] font-bold text-gray-900 break-words">{edu.degree}</h3>
                    <span className="text-[0.9em] text-gray-600 font-medium shrink-0">
                      {edu.graduationDate}
                    </span>
                  </div>
                  <div className="text-[1em] text-gray-700 font-medium mb-1">
                    {edu.school} 
                    {edu.gpa && <span className="ml-2 text-gray-500 font-normal">| {labels.gpa}: {edu.gpa}</span>}
                  </div>
                  {edu.description && (
                    <p className="text-[1em] text-gray-600 mt-1 whitespace-pre-wrap break-words text-justify">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(skills.technical.length > 0 || skills.soft.length > 0) && (
          <section className="break-inside-avoid w-full">
            <h2 
              className="text-[1.15em] font-bold mb-4 uppercase tracking-wider border-b-2 pb-1"
              style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
            >
              {labels.skills}
            </h2>
            <div className="flex flex-wrap gap-2">
              {[...skills.technical, ...skills.soft].map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md text-[0.95em] font-medium break-words"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  // ==========================================
  // 2. KLASİK ŞABLON (Ortalanmış Header, Dikey Akış)
  // ==========================================
  const renderClassicTemplate = () => (
    <div className="p-12 flex flex-col h-full w-full bg-white">
      {/* Header */}
      <div className="text-center border-b-2 pb-6 mb-8 flex flex-col items-center break-inside-avoid" style={{ borderColor: settings.primaryColor }}>
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-2 shadow-sm mb-5"
            style={{ borderColor: settings.primaryColor }}
          />
        )}
        <h1 className="text-[2.5em] font-bold text-gray-900 mb-3 uppercase tracking-wide leading-tight">
          {personalInfo.fullName || 'Ad Soyad'}
        </h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[0.95em] text-gray-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {(personalInfo.city || personalInfo.country) && (
            <span>• {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
          )}
        </div>
      </div>

      {/* Content - Tam Genişlik Dikey Akış */}
      <div className="flex flex-col gap-8 w-full">
        {personalInfo.summary && (
          <section className="break-inside-avoid w-full">
            <h2 className="text-[1.15em] font-bold uppercase tracking-widest text-gray-900 mb-3 text-center">
              {labels.summary}
            </h2>
            <p className="text-[1em] leading-relaxed text-gray-800 text-justify whitespace-pre-wrap break-words">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="w-full">
            <h2 className="text-[1.15em] font-bold uppercase tracking-widest text-gray-900 mb-5 mt-2 break-inside-avoid text-center">
              {labels.experience}
            </h2>
            <div className="flex flex-col gap-6">
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid w-full">
                  <div className="flex justify-between items-baseline gap-4 mb-1">
                    <h3 className="text-[1.05em] font-bold text-gray-900 break-words">{exp.jobTitle}</h3>
                    <span className="text-[0.95em] text-gray-700 italic shrink-0">
                      {exp.startDate} - {exp.current ? labels.present : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[1em] text-gray-800 font-medium mb-2">{exp.company}</div>
                  <p className="text-[1em] text-gray-700 leading-relaxed text-justify whitespace-pre-wrap break-words">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="w-full">
            <h2 className="text-[1.15em] font-bold uppercase tracking-widest text-gray-900 mb-5 mt-2 break-inside-avoid text-center">
              {labels.education}
            </h2>
            <div className="flex flex-col gap-5">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid w-full">
                  <div className="flex justify-between items-baseline gap-4 mb-1">
                    <h3 className="text-[1.05em] font-bold text-gray-900 break-words">{edu.degree}</h3>
                    <span className="text-[0.95em] text-gray-700 italic shrink-0">
                      {edu.graduationDate}
                    </span>
                  </div>
                  <div className="text-[1em] text-gray-800 font-medium">
                    {edu.school}
                    {edu.gpa && <span className="ml-2 text-gray-600 font-normal">| {labels.gpa}: {edu.gpa}</span>}
                  </div>
                  {edu.description && (
                    <p className="text-[1em] text-gray-700 mt-2 whitespace-pre-wrap break-words text-justify">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(skills.technical.length > 0 || skills.soft.length > 0) && (
          <section className="break-inside-avoid w-full text-center">
            <h2 className="text-[1.15em] font-bold uppercase tracking-widest text-gray-900 mb-4 mt-2">
              {labels.skills}
            </h2>
            <p className="text-[1em] text-gray-800 leading-relaxed break-words">
              {[...skills.technical, ...skills.soft].join(' • ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );

  // ==========================================
  // 3. MİNİMAL ŞABLON (Sol İnce Bar, Sağ Geniş Alan)
  // ==========================================
  const renderMinimalTemplate = () => (
    <div className="flex flex-row h-full w-full bg-white">
      
      {/* Sol İnce Bar (İletişim & Yetenekler) */}
      <div 
        className="w-[35%] py-12 px-8 flex flex-col items-center border-r border-gray-200"
        style={{ 
          backgroundColor: settings.primaryColor === '#ffffff' ? '#ffffff' : `${settings.primaryColor}15` 
        }}
      >
        <div className="flex flex-col items-center text-center break-inside-avoid w-full">
          {personalInfo.photo && (
            <img
              src={personalInfo.photo}
              alt="Profile"
              className="w-40 h-40 rounded-full object-cover shadow-md mb-6 border-4 border-white"
            />
          )}
          <h1 className="text-[2.2em] font-bold text-gray-900 tracking-tight mb-6 leading-tight">
            {personalInfo.fullName || 'Ad Soyad'}
          </h1>
          
          <div className="flex flex-col gap-3 text-[0.9em] text-gray-700 w-full items-center text-center mb-10">
            {personalInfo.email && (
              <div className="flex items-center gap-2 break-all justify-center">
                <Mail className="w-4 h-4 shrink-0" style={{ color: settings.primaryColor }} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2 justify-center">
                <Phone className="w-4 h-4 shrink-0" style={{ color: settings.primaryColor }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <div className="flex items-center gap-2 justify-center">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: settings.primaryColor }} />
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {(skills.technical.length > 0 || skills.soft.length > 0) && (
          <section className="break-inside-avoid w-full mt-4 pt-8 border-t" style={{ borderColor: `${settings.primaryColor}30` }}>
            <h2 className="text-[1.1em] font-bold uppercase tracking-widest text-gray-900 mb-5 text-center">
              {labels.skills}
            </h2>
            <ul className="flex flex-col gap-3 items-center text-center">
              {[...skills.technical, ...skills.soft].map((skill, index) => (
                <li key={index} className="text-[0.95em] text-gray-800 break-words font-medium">
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Sağ Geniş Alan (Özet, Deneyim, Eğitim) */}
      <div className="w-[65%] p-12 flex flex-col gap-10">
        {personalInfo.summary && (
          <section className="break-inside-avoid w-full">
            <h2 className="text-[1.15em] font-bold uppercase tracking-widest text-gray-800 mb-4 flex items-center gap-3">
              <span className="w-6 h-0.5" style={{ backgroundColor: settings.primaryColor }}></span>
              {labels.summary}
            </h2>
            <p className="text-[1em] leading-relaxed text-gray-700 font-light whitespace-pre-wrap break-words text-justify">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="w-full">
            <h2 className="text-[1.15em] font-bold uppercase tracking-widest text-gray-800 mb-6 break-inside-avoid flex items-center gap-3">
              <span className="w-6 h-0.5" style={{ backgroundColor: settings.primaryColor }}></span>
              {labels.experience}
            </h2>
            <div className="flex flex-col gap-8">
              {experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid w-full">
                  <h3 className="text-[1.1em] font-semibold text-gray-900 break-words">{exp.jobTitle}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-[0.9em] text-gray-500 mt-1 mb-3">
                    <span className="font-medium text-gray-700 break-words">{exp.company}</span>
                    <span>•</span>
                    <span className="shrink-0">{exp.startDate} - {exp.current ? labels.present : exp.endDate}</span>
                  </div>
                  <p className="text-[1em] text-gray-700 leading-relaxed font-light whitespace-pre-wrap break-words text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="w-full">
            <h2 className="text-[1.15em] font-bold uppercase tracking-widest text-gray-800 mb-6 break-inside-avoid flex items-center gap-3">
              <span className="w-6 h-0.5" style={{ backgroundColor: settings.primaryColor }}></span>
              {labels.education}
            </h2>
            <div className="flex flex-col gap-6">
              {education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid w-full">
                  <h3 className="text-[1.1em] font-semibold text-gray-900 break-words">{edu.degree}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-[0.9em] text-gray-500 mt-1 mb-2">
                    <span className="font-medium text-gray-700 break-words">{edu.school}</span>
                    <span>•</span>
                    <span className="shrink-0">{edu.graduationDate}</span>
                  </div>
                  {edu.gpa && (
                    <div className="text-[0.9em] text-gray-600 mb-2">
                      <span className="font-medium">{labels.gpa}:</span> {edu.gpa}
                    </div>
                  )}
                  {edu.description && (
                    <p className="text-[1em] text-gray-700 leading-relaxed font-light whitespace-pre-wrap break-words text-justify">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );

  return (
    <div 
      className="bg-white shadow-xl flex flex-col mx-auto print:shadow-none overflow-x-hidden max-w-full"
      style={{ 
        color: '#1f2937',
        fontFamily: getFontFamilyStyle(),
        fontSize: getFontSizeStyle(),
        width: '210mm',
        minHeight: '297mm', // Minimum 1 A4 boyutu
        height: 'auto',     // İçerik uzadıkça sayfa uzar (Taşmayı engeller)
      }}
    >
      {settings.template === 'modern' && renderModernTemplate()}
      {settings.template === 'classic' && renderClassicTemplate()}
      {settings.template === 'minimal' && renderMinimalTemplate()}
    </div>
  );
};

export default Step4;
