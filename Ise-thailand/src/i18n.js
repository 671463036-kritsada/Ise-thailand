import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLang = localStorage.getItem("lang");

const defaultLang = savedLang === "EN" ? "en" : "th";

const resources = {
  th: {
    translation: {
      // home page
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
    },
  },

  en: {
    translation: {
      // home page

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
