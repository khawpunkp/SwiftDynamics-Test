import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import LanguageDetector from 'i18next-browser-languagedetector';
// don't want to use this?
// have a look at the Quick start guide 
// for passing in lng and translations on init

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
        en: {
            translation: {
                english: "EN",
                thai: "TH",
                home: "Home",
                test: "Test",
                layout: "Layout & Style",
                move_shape: "Move Shape",
                move_position: "Move Position",
                api: "Connect API",
                form: "Form & Table",
            }
        },
        th: {
            translation: {
                english: "อังกฤษ",
                thai: "ไทย",
                home: "หน้าหลัก",
                test: "แบบทดสอบที่",
                layout: "การจัดการหน้าเว็บ",
                move_shape: "เลื่อนรูปแบบ",
                move_position: "เปลี่ยนตำแหน่ง",
                api: "การเชื่อมต่อ API",
                form: "การจัดการหน้าฟอร์ม",
            }
        }
    }
  });


export default i18n;