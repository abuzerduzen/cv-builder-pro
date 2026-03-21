import React from 'react';
import type { ResumeData } from '../types';
import { Mail, Phone, MapPin } from 'lucide-react';

interface Step4Props {
  data: ResumeData;
}

const translations = {
  TR: {
    experience: 'İş Deneyimi',
    education: 'Eğitim',
    certificates: 'Sertifikalar ve Belgeler',
    skills: 'Yetenekler',
    technical: 'Teknik',
    soft: 'Kişisel',
    present: 'Devam Ediyor',
  },
  EN: {
    experience: 'Experience',
    education: 'Education',
    certificates: 'Certificates & Documents',
    skills: 'Skills',
    technical: 'Technical',
    soft: 'Soft',
    present: 'Present',
  },
  DE: {
    experience: 'Berufserfahrung',
    education: 'Bildung',
    certificates: 'Zertifikate & Dokumente',
    skills: 'Fähigkeiten',
    technical: 'Technisch',
    soft: 'Persönlich',
    present: 'Heute',
  },
  FR: {
    experience: 'Expérience',
    education: 'Éducation',
    certificates: 'Certificats et Documents',
    skills: 'Compétences',
    technical: 'Technique',
    soft: 'Personnel',
    present: 'Présent',
  },
  ES: {
    experience: 'Experiencia',
    education: 'Educación',
    certificates: 'Certificados y Documentos',
    skills: 'Habilidades',
    technical: 'Técnico',
    soft: 'Personal',
    present: 'Presente',
  },
  IT: {
    experience: 'Esperienza',
    education: 'Istruzione',
    certificates: 'Certificati e Documenti',
    skills: 'Competenze',
    technical: 'Tecnico',
    soft: 'Personale',
    present: 'Presente',
  },
  AR: {
    experience: 'الخبرة',
    education: 'التعليم',
    certificates: 'الشهادات والمستندات',
    skills: 'المهارات',
    technical: 'تقني',
    soft: 'شخصي',
    present: 'الحاضر',
  },
  RU: {
    experience: 'Опыт работы',
    education: 'Образование',
    certificates: 'Сертификаты и документы',
    skills: 'Навыки',
    technical: 'Технические',
    soft: 'Личные',
    present: 'По настоящее время',
  },
  ZH: {
    experience: '工作经验',
    education: '教育',
    certificates: '证书和文件',
    skills: '技能',
    technical: '技术',
    soft: '软技能',
    present: '至今',
  },
  JP: {
    experience: '職歴',
    education: '学歴',
    certificates: '証明書と書類',
    skills: 'スキル',
    technical: '技術',
    soft: 'ソフト',
    present: '現在',
  },
};

export const Step4 = ({ data }: Step4Props) => {
  const t = translations[data.settings.language] || translations.TR;
  const { personalInfo, experience, education, skills, settings } = data;

  const certificates = education.filter((edu) => edu.fileName);
  const regularEducation = education.filter((edu) => !edu.fileName);

  const getFontFamily = () => {
    switch (settings.fontFamily) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  const getFontSize = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const renderModern = () => (
    <>
      <div
        className="p-8 text-white flex items-center space-x-6"
        style={{ backgroundColor: settings.primaryColor }}
      >
        {personalInfo.photo && (
          <img
            src={personalInfo.photo}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
          />
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName || 'Ad Soyad'}</h1>
          <div className="flex flex-wrap gap-4 text-sm opacity-90">
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 flex-1 grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          {personalInfo.summary && (
            <section>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h2
                className="text-xl font-bold mb-4 border-b-2 pb-1"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                {t.experience}
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900">{exp.jobTitle}</h3>
                      <span className="text-sm text-gray-500 font-medium">
                        {exp.startDate} - {exp.current ? t.present : exp.endDate}
                      </span>
                    </div>
                    <div className="text-gray-600 font-medium mb-2">{exp.company}</div>
                    <p className="text-gray-700 text-sm whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {regularEducation.length > 0 && (
            <section>
              <h2
                className="text-xl font-bold mb-4 border-b-2 pb-1"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                {t.education}
              </h2>
              <div className="space-y-4">
                {regularEducation.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                      <span className="text-sm text-gray-500 font-medium">{edu.graduationDate}</span>
                    </div>
                    <div className="text-gray-600 font-medium">
                      {edu.school} {edu.gpa && <span className="text-gray-400">| GPA: {edu.gpa}</span>}
                    </div>
                    {edu.description && (
                      <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          {(skills.technical.length > 0 || skills.soft.length > 0) && (
            <section>
              <h2
                className="text-xl font-bold mb-4 border-b-2 pb-1"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                {t.skills}
              </h2>
              
              {skills.technical.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wider">{t.technical}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {skills.soft.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wider">{t.soft}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.soft.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {certificates.length > 0 && (
            <section>
              <h2
                className="text-xl font-bold mb-4 border-b-2 pb-1"
                style={{ borderColor: settings.primaryColor, color: settings.primaryColor }}
              >
                {t.certificates}
              </h2>
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="text-sm">
                    <div className="font-bold text-gray-900">{cert.degree}</div>
                    <div className="text-gray-600">{cert.school}</div>
                    <div className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                      <span className="truncate max-w-[150px]" title={cert.fileName}>{cert.fileName}</span>
                      {cert.graduationDate && <span>• {cert.graduationDate}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );

  const renderClassic = () => (
    <div className="p-10 flex-1 flex flex-col space-y-8">
      <div className="text-center border-b-2 pb-6" style={{ borderColor: settings.primaryColor }}>
        {personalInfo.photo && (
          <img src={personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2" style={{ borderColor: settings.primaryColor }} />
        )}
        <h1 className="text-4xl font-bold mb-3" style={{ color: settings.primaryColor }}>{personalInfo.fullName || 'Ad Soyad'}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {(personalInfo.city || personalInfo.country) && <span>• {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <section>
          <p className="text-gray-800 leading-relaxed text-center italic">{personalInfo.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-1 uppercase tracking-wider" style={{ color: settings.primaryColor, borderColor: '#e5e7eb' }}>{t.experience}</h2>
          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">{exp.jobTitle}</h3>
                  <span className="text-sm font-medium" style={{ color: settings.primaryColor }}>{exp.startDate} - {exp.current ? t.present : exp.endDate}</span>
                </div>
                <div className="text-gray-700 font-medium mb-2">{exp.company}</div>
                <p className="text-gray-600 text-sm whitespace-pre-line">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {regularEducation.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 border-b pb-1 uppercase tracking-wider" style={{ color: settings.primaryColor, borderColor: '#e5e7eb' }}>{t.education}</h2>
          <div className="space-y-4">
            {regularEducation.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900 text-lg">{edu.degree}</h3>
                  <span className="text-sm font-medium" style={{ color: settings.primaryColor }}>{edu.graduationDate}</span>
                </div>
                <div className="text-gray-700 font-medium">{edu.school} {edu.gpa && <span className="text-gray-500">| GPA: {edu.gpa}</span>}</div>
                {edu.description && <p className="text-gray-600 text-sm mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-8">
        {(skills.technical.length > 0 || skills.soft.length > 0) && (
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-1 uppercase tracking-wider" style={{ color: settings.primaryColor, borderColor: '#e5e7eb' }}>{t.skills}</h2>
            <div className="space-y-3 text-sm">
              {skills.technical.length > 0 && (
                <div><span className="font-bold text-gray-800">{t.technical}:</span> <span className="text-gray-600">{skills.technical.join(', ')}</span></div>
              )}
              {skills.soft.length > 0 && (
                <div><span className="font-bold text-gray-800">{t.soft}:</span> <span className="text-gray-600">{skills.soft.join(', ')}</span></div>
              )}
            </div>
          </section>
        )}
        {certificates.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-1 uppercase tracking-wider" style={{ color: settings.primaryColor, borderColor: '#e5e7eb' }}>{t.certificates}</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              {certificates.map((cert) => (
                <li key={cert.id}>
                  <span className="font-bold">{cert.degree}</span> - {cert.school} ({cert.graduationDate})
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="p-10 flex-1 grid grid-cols-12 gap-8">
      <div className="col-span-4 space-y-8 border-r border-gray-200 pr-6">
        <div>
          {personalInfo.photo && (
            <img src={personalInfo.photo} alt="Profile" className="w-32 h-32 rounded-xl object-cover mb-6 shadow-sm" />
          )}
          <h1 className="text-3xl font-light tracking-tight mb-4 text-gray-900">{personalInfo.fullName || 'Ad Soyad'}</h1>
          <div className="space-y-2 text-sm text-gray-500">
            {personalInfo.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> <span className="truncate">{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> <span>{personalInfo.phone}</span></div>}
            {(personalInfo.city || personalInfo.country) && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span></div>}
          </div>
        </div>

        {(skills.technical.length > 0 || skills.soft.length > 0) && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">{t.skills}</h2>
            <div className="space-y-4">
              {skills.technical.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2">{t.technical}</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.technical.map((s, i) => <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{s}</span>)}
                  </div>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2">{t.soft}</h3>
                  <div className="flex flex-wrap gap-1">
                    {skills.soft.map((s, i) => <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">{s}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {certificates.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">{t.certificates}</h2>
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="text-xs">
                  <div className="font-semibold text-gray-800">{cert.degree}</div>
                  <div className="text-gray-500">{cert.school}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="col-span-8 space-y-8">
        {personalInfo.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Profil</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">{t.experience}</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: settings.primaryColor }}>
                  <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5" style={{ backgroundColor: settings.primaryColor }} />
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                    <span className="text-xs text-gray-400">{exp.startDate} - {exp.current ? t.present : exp.endDate}</span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{exp.company}</div>
                  <p className="text-gray-600 text-sm whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {regularEducation.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">{t.education}</h2>
            <div className="space-y-6">
              {regularEducation.map((edu) => (
                <div key={edu.id} className="relative pl-4 border-l-2" style={{ borderColor: settings.primaryColor }}>
                  <div className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5" style={{ backgroundColor: settings.primaryColor }} />
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <span className="text-xs text-gray-400">{edu.graduationDate}</span>
                  </div>
                  <div className="text-sm text-gray-500">{edu.school} {edu.gpa && <span>| GPA: {edu.gpa}</span>}</div>
                  {edu.description && <p className="text-gray-600 text-sm mt-1">{edu.description}</p>}
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
      className={`bg-white shadow-xl a4-paper ${getFontFamily()} ${getFontSize()} flex flex-col`}
      style={{
        color: '#1f2937',
        transformOrigin: 'top center',
      }}
    >
      {settings.template === 'classic' && renderClassic()}
      {settings.template === 'minimal' && renderMinimal()}
      {settings.template === 'modern' && renderModern()}
    </div>
  );
};
