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
                title: "Title",
                f_name: "First Name",
                l_name: "Last Name",
                birth: "Birth Date",
                date_placeholder: "Select Date",
                nationality: "Nationality",
                id_number: "Identification Number",
                gender: "Gender",
                dial_code: "Dial Code",
                phone_number: "Telephone Number",
                passport: "Passport Number",               
                salary: "Expected Salary",
                clear: "Clear Data",
                submit: "Submit Data",
                all: "Select All",
                delete_data: "Delete Data",
                name: "Name",
                action: "Action",
                edit: "Edit",
                delete: "Delete",
                enter: "Please Enter",
                number_error: "Please Enter Number Only",
                id_error: "Please Enter 13 Digit",
                phone_error: "Please Enter 10 Digit",
                passport_error: "Please Enter Correct Passport Number",
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
                title: "คำนำหน้า",
                f_name: "ชื่อจริง",
                l_name: "นามสกุล",
                birth: "วันเกิด",
                date_placeholder: "เลือกวันที่",
                nationality: "สัญชาติ",
                id_number: "เลขบัตรประชาชน",
                gender: "เพศ",
                dial_code: "รหัสประเทศ",
                phone_number: "หมายเลขโทรศัพท์มือถือ",
                passport: "เลขที่หนังสือเดินทาง",               
                salary: "เงินเดือนที่คาดหวัง",
                clear: "ล้างข้อมูล",
                submit: "ส่งข้อมูล",
                all: "เลือกทั้งหมด",
                delete_data: "ลบข้อมูล",
                name: "ชื่อ",
                action: "จัดการ",
                edit: "แก้ไข",
                delete: "ลบ",
                enter: "กรุณากรอก",
                number_error: "กรุณากรอกตัวเลขเท่านั้น",
                id_error: "กรุณากรอกตัวเลข 13 หลัก",
                phone_error: "กรุณากรอกตัวเลข 10 หลัก",
                passport_error: "กรุณากรอกเลขหนังสือเดินทางให้ถูกต้อง",
            }
        }
    }
  });


export default i18n;