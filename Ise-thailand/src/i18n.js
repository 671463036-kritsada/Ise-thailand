import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLang = localStorage.getItem("lang");

const defaultLang = savedLang === "EN" ? "en" : "th";

const resources = {
  th: {
    translation: {
      // home page
      overview: "ภาพรวม",
      researcher: "นักวิจัย",
      researcher_unit: "คน",

      royal_project: "โครงการพระราชดำริ",
      royal_project_unit: "โครงการ",

      news: "ข่าวประชาสัมพันธ์",
      activities: "กิจกรรม",

      institute_video: "วิดีโอแนะนำสถาบัน",

      loading: "กำลังโหลด...",
      processing_media: "กำลังประมวลผลข้อมูลสื่อเผยแพร่...",

      media: "สื่อเผยแพร่",
      media_unit: "เรื่อง",

      institute_projects: "โครงการภายใต้สถาบันเศรษฐกิจพอเพียง",
      project_unit: "โครงการ",

      vr_learning: "สื่อการเรียนรู้เสมือนจริง",

      project_videos: "วีดีทัศน์โครงการ",
      list_unit: "รายการ",

      additional_details: "รายละเอียดเพิ่มเติม",

      // end home page

      // project page

      all_projects: "โครงการทั้งหมด",
      total_projects: "โครงการทั้งหมด",

      search_projects: "ค้นหาโครงการ...",

      all: "ทั้งหมด",

      showing_projects: "แสดง",

      in_category: "ใน",

      clear_filter: "ล้างตัวกรอง",

      project_not_found: "ไม่พบโครงการที่ค้นหา",

      view_details: "ดูรายละเอียด",

      // end project page

      //project detail

      project_not_found_detail: "ไม่พบโครงการนี้",

      back_to_projects: "กลับไปหน้าโครงการ",

      back: "กลับ",

      infographic: "อินโฟกราฟิก",

      references: "แหล่งอ้างอิง",

      back_to_all_projects: "กลับไปยังโครงการทั้งหมด",

      // emd project Detail

      // research page
      project_research: "โครงการ / งานวิจัย",
      project_research_subtitle: "ภายใต้สถาบันเศรษฐกิจพอเพียง",
      show: "แสดง",
      items_per_page: "รายการ",
      search_placeholder: "ค้นหา...",
      project_name: "ชื่อโครงการ",
      project_type: "ประเภทโครงการ",
      researcher_name: "ชื่อนักวิจัย",
      no_data: "ไม่พบข้อมูล",
      showing_from_to: "แสดง",
      from_total: "จาก",
      total_items: "รายการ",
      // end research page

      // ebook page
      ebook_title: "E-Book",
      no_data_found: "ไม่พบข้อมูล",
      download: "ดาวน์โหลด",
      read_online: "อ่านออนไลน์",
      // end ebook page

      // institute page
      contact_title: "ติดต่อสถาบัน",
      contact_subtitle: "ร่วมสืบสานศาสตร์พระราชาและปรัชญาเศรษฐกิจพอเพียง",
      contact_info: "ข้อมูลการติดต่อ",
      contact_address_title: "ที่อยู่สถาบัน",
      contact_address_desc:
        "99 หมู่ 1 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ",
      contact_phone_title: "เบอร์โทรศัพท์",
      contact_phone_desc: "02-123-4567",
      contact_email_title: "อีเมล",
      contact_email_desc: "info@sufficiency.or.th",
      contact_hours_title: "เวลาทำการ",
      contact_hours_desc: "จันทร์ - ศุกร์ | 08.30 - 16.30 น.",
      contact_form_title: "ส่งข้อความถึงเรา",
      contact_firstname: "ชื่อ",
      contact_firstname_placeholder: "ระบุชื่อ",
      contact_lastname: "นามสกุล",
      contact_lastname_placeholder: "ระบุนามสกุล",
      contact_phone: "เบอร์โทรศัพท์",
      contact_email: "อีเมล",
      contact_detail: "รายละเอียด",
      contact_detail_placeholder: "พิมพ์ข้อความที่นี่...",
      contact_submit: "ส่งข้อความ",
      contact_success_title: "ส่งข้อมูลสำเร็จ",
      contact_submit_again: "ส่งอีกครั้ง",
      // end institute page

      // login page
      login_brand: "Research Portal",
      login_brand_subtitle: "ระบบจัดการงานวิจัย",
      login_google: "Google",
      login_facebook: "Facebook",
      login_or_email: "หรือเข้าสู่ระบบด้วย Email",
      login_forgot_password: "ลืมรหัสผ่าน?",
      login_submit: "SIGN IN",
      login_loading: "กำลังเข้าสู่ระบบ...",
      login_no_account: "ยังไม่มีบัญชี?",
      login_register: "สมัครสมาชิก",

      // register modal
      register_title: "สมัครสมาชิก",
      register_subtitle: "กรอกข้อมูลให้ครบถ้วนเพื่อสร้างบัญชีใหม่",
      register_step_1: "ข้อมูลส่วนตัว",
      register_step_2: "ข้อมูลติดต่อ",
      register_step_3: "ที่อยู่",
      register_step_4: "บัญชีผู้ใช้",
      register_title_prefix: "คำนำหน้าชื่อ",
      register_title_prefix_placeholder: "-- คำนำหน้า --",
      register_name_thai: "ชื่อ-นามสกุล (ภาษาไทย)",
      register_firstname_placeholder: "ชื่อ",
      register_lastname_placeholder: "นามสกุล",
      register_name_eng: "Full Name (English)",
      register_institute: "สถาบัน",
      register_institute_search: "ค้นหาสถาบัน...",
      register_institute_placeholder: "-- เลือกสถาบัน --",
      register_email: "Email",
      register_phone: "เบอร์โทรศัพท์",
      register_id_card: "เลขบัตรประชาชน",
      register_address: "บ้านเลขที่ / ที่อยู่",
      register_address_placeholder: "บ้านเลขที่ ถนน หมู่บ้าน",
      register_zipcode: "รหัสไปรษณีย์",
      register_province: "จังหวัด",
      register_province_placeholder: "-- จังหวัด --",
      register_amphure: "อำเภอ",
      register_amphure_placeholder: "-- อำเภอ --",
      register_district: "ตำบล",
      register_district_placeholder: "-- ตำบล --",
      register_username: "Username",
      register_username_placeholder: "ชื่อผู้ใช้",
      register_password: "Password",
      register_password_placeholder: "รหัสผ่าน",
      register_password_rules_title: "ข้อกำหนดรหัสผ่าน",
      register_password_rule_1: "ความยาวอย่างน้อย 8 ตัวอักษร",
      register_password_rule_2: "มีตัวอักษรภาษาอังกฤษและตัวเลข",
      register_step_label: "ขั้นตอนที่",
      register_step_of: "จาก",
      register_back: "ย้อนกลับ",
      register_next: "ถัดไป →",
      register_submit: "✓ สมัครสมาชิก",
      register_loading: "กำลังสมัคร...",
      // end login page

      // navbar
      nav_home: "หน้าหลัก",
      nav_royal: "ศาสตร์ของพระราชา",
      nav_royal_all: "ดูทั้งหมด",
      nav_institute: "งานภายใต้สถาบันเศรษฐกิจพอเพียง",
      nav_institute_research: "โครงการ/งานวิจัย",
      nav_about: "สถาบันเศรษฐกิจพอเพียง",
      nav_login: "เข้าสู่ระบบ",
      nav_logout: "ออกจากระบบ",
      nav_admin: "Admin",
      nav_administrator: "Administrator",
      nav_user: "User",
      // end navbar

      // footer
      footer_brand: "สถาบันเศรษฐกิจพอเพียง",
      footer_tagline:
        "น้อมนำหลักปรัชญาของเศรษฐกิจพอเพียง\nสู่การพัฒนาที่ยั่งยืน",
      footer_menu: "เมนูหลัก",
      footer_nav_home: "หน้าแรก",
      footer_nav_about: "เกี่ยวกับเรา",
      footer_nav_research: "งานวิจัย",
      footer_nav_news: "ข่าวสาร",
      footer_contact: "ติดต่อเรา",
      footer_address: "99 หมู่ 1 ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กรุงเทพฯ",
      footer_phone: "02-123-4567",
      footer_email: "info@sufficiency.or.th",
      footer_copyright:
        "©2022 Institute of Sufficiency Economy. All rights reserved.",
      footer_privacy: "นโยบายความเป็นส่วนตัว",
      footer_terms: "เงื่อนไขการใช้งาน",
      // end footer


      Read_more_details: "อ่านรายละเอียดเพิ่มเติม",
      Image_Gallery: "อัลบั้มรูปภาพ",
      unit_image : "รูป",
      image_at : "รูปที่"
    },
  },

  en: {
    translation: {
      // home page
      overview: "Overview",
      researcher: "Researchers",
      researcher_unit: "People",

      royal_project: "Royal Projects",
      royal_project_unit: "Projects",

      news: "News",
      activities: "Activities",

      institute_video: "Institute Introduction Video",

      loading: "Loading...",
      processing_media: "Processing media data...",

      media: "Publications",
      media_unit: "Items",

      institute_projects: "Projects Under the Sufficiency Economy Institute",
      project_unit: "Projects",

      vr_learning: "Virtual Learning Media",

      project_videos: "Project Videos",
      list_unit: "Items",

      additional_details: "Additional Details",

      // end home page

      // project page
      all_projects: "All Projects",
      total_projects: "Total Projects",

      search_projects: "Search projects...",

      all: "All",

      showing_projects: "Showing",

      in_category: "in",

      clear_filter: "Clear Filter",

      project_not_found: "No matching projects found",

      view_details: "View Details",
      // end project page

      // project detail
      project_not_found_detail: "Project not found",

      back_to_projects: "Back to Projects",

      back: "Back",

      infographic: "Infographic",

      references: "References",

      back_to_all_projects: "Back to All Projects",

      // eng project detail

      // research page
      project_research: "Projects / Research",
      project_research_subtitle: "Under the Sufficiency Economy Institute",
      show: "Show",
      items_per_page: "entries",
      search_placeholder: "Search...",
      project_name: "Project Name",
      project_type: "Project Type",
      researcher_name: "Researcher Name",
      no_data: "No data found",
      showing_from_to: "Showing",
      from_total: "of",
      total_items: "entries",
      // end research page

      // ebook page
      ebook_title: "E-Book",
      no_data_found: "No data found",
      download: "Download",
      read_online: "Read Online",
      // end ebook page

      // institute page
      contact_title: "Contact Us",
      contact_subtitle:
        "Join us in continuing the King's Philosophy and Sufficiency Economy",
      contact_info: "Contact Information",
      contact_address_title: "Address",
      contact_address_desc:
        "99 Moo 1, Phahon Yothin Rd, Lat Yao, Chatuchak, Bangkok",
      contact_phone_title: "Phone",
      contact_phone_desc: "02-123-4567",
      contact_email_title: "Email",
      contact_email_desc: "info@sufficiency.or.th",
      contact_hours_title: "Office Hours",
      contact_hours_desc: "Monday - Friday | 08:30 - 16:30",
      contact_form_title: "Send Us a Message",
      contact_firstname: "First Name",
      contact_firstname_placeholder: "Enter first name",
      contact_lastname: "Last Name",
      contact_lastname_placeholder: "Enter last name",
      contact_phone: "Phone Number",
      contact_email: "Email",
      contact_detail: "Message",
      contact_detail_placeholder: "Type your message here...",
      contact_submit: "Send Message",
      contact_success_title: "Message Sent Successfully",
      contact_submit_again: "Send Again",
      // end institute page

      // login page
      login_brand: "Research Portal",
      login_brand_subtitle: "Research Management System",
      login_google: "Google",
      login_facebook: "Facebook",
      login_or_email: "or sign in with Email",
      login_forgot_password: "Forgot password?",
      login_submit: "SIGN IN",
      login_loading: "Signing in...",
      login_no_account: "Don't have an account?",
      login_register: "Register",

      // register modal
      register_title: "Create Account",
      register_subtitle:
        "Fill in all required information to create a new account",
      register_step_1: "Personal Info",
      register_step_2: "Contact",
      register_step_3: "Address",
      register_step_4: "Account",
      register_title_prefix: "Title",
      register_title_prefix_placeholder: "-- Title --",
      register_name_thai: "Full Name (Thai)",
      register_firstname_placeholder: "First Name",
      register_lastname_placeholder: "Last Name",
      register_name_eng: "Full Name (English)",
      register_institute: "Institute",
      register_institute_search: "Search institute...",
      register_institute_placeholder: "-- Select Institute --",
      register_email: "Email",
      register_phone: "Phone Number",
      register_id_card: "ID Card Number",
      register_address: "Address",
      register_address_placeholder: "House No., Street, Village",
      register_zipcode: "Zip Code",
      register_province: "Province",
      register_province_placeholder: "-- Province --",
      register_amphure: "District",
      register_amphure_placeholder: "-- District --",
      register_district: "Sub-district",
      register_district_placeholder: "-- Sub-district --",
      register_username: "Username",
      register_username_placeholder: "Username",
      register_password: "Password",
      register_password_placeholder: "Password",
      register_password_rules_title: "Password Requirements",
      register_password_rule_1: "At least 8 characters",
      register_password_rule_2: "Contains letters and numbers",
      register_step_label: "Step",
      register_step_of: "of",
      register_back: "Back",
      register_next: "Next →",
      register_submit: "✓ Register",
      register_loading: "Registering...",
      // end login page

      // navbar
      nav_home: "Home",
      nav_royal: "Royal Projects",
      nav_royal_all: "View All",
      nav_institute: "Work Under Sufficiency Economy Institute",
      nav_institute_research: "Projects / Research",
      nav_about: "Sufficiency Economy Institute",
      nav_login: "Sign In",
      nav_logout: "Sign Out",
      nav_admin: "Admin",
      nav_administrator: "Administrator",
      nav_user: "User",
      // end navbar

      // footer
      footer_brand: "Sufficiency Economy Institute",
      footer_tagline:
        "Promoting the Philosophy of\nSufficiency Economy for Sustainable Development",
      footer_menu: "Menu",
      footer_nav_home: "Home",
      footer_nav_about: "About Us",
      footer_nav_research: "Research",
      footer_nav_news: "News",
      footer_contact: "Contact Us",
      footer_address: "99 Moo 1, Phahon Yothin Rd, Lat Yao, Chatuchak, Bangkok",
      footer_phone: "02-123-4567",
      footer_email: "info@sufficiency.or.th",
      footer_copyright:
        "©2022 Institute of Sufficiency Economy. All rights reserved.",
      footer_privacy: "Privacy Policy",
      footer_terms: "Terms of Use",
      // end footer

       Read_more_details: "Read more details",
       Image_Gallery : "Image Gallery",
       unit_image : "Image",
       image_at : "Image"
    },
  },
};

i18n.use(initReactI18next).init({
  resources,

  lng: defaultLang,

  fallbackLng: "th",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
