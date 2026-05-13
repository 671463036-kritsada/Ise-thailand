import React from 'react';
import { BookOpenText } from 'lucide-react';

const EbookPage = () => {
  const ebooks = [
    {
      id: 1,
      title: "THAILAND'S BCG TRANSFORMATION",
      image: "https://via.placeholder.com/300x400?text=BCG+Transformation",
    },
    {
      id: 2,
      title: "ความเพียงพอจากไทยส่งไกลถึงรัฐบาล",
      image: "https://via.placeholder.com/300x400?text=Sufficiency+Economy",
    },
    {
      id: 3,
      title: "คู่มือทักษะชีวิต",
      image: "https://via.placeholder.com/300x400?text=Life+Skills+Manual",
    },
    {
      id: 4,
      title: "กลยุทธ์พอเพียงจากฟากฟ้าสู่ลุ่มน้ำโขง",
      image: "https://via.placeholder.com/300x400?text=Sky+to+Mekong",
    },
    {
      id: 5,
      title: "กระบวนการเรียนรู้เพื่อพัฒนาทักษะชีวิตและอาชีพแกนนำเยาวชน...",
      image: "https://via.placeholder.com/300x400?text=Learning+Process",
    },
    {
      id: 6,
      title: "การพัฒนาทักษะชีวิตและอาชีพเครือข่ายแกนนำเยาวชน...",
      image: "https://via.placeholder.com/300x400?text=Youth+Network",
    },
  ];

  return (
    // ใช้สีพื้นหลัง bg-surface และฟอนต์ที่กำหนดใน body ของ index.css
    <div className="min-h-screen bg-surface"> 
      {/* Header */}
      <header className="max-w-7xl mx-auto py-12 px-4 text-center">
        {/* ใช้สี forest-green และ deep-text ตามที่กำหนดใน theme */}
        <h1 className="text-4xl font-bold text-forest-green tracking-widest uppercase">
          E-Book
          <div className="h-1.5 w-20 bg-gold mx-auto mt-2 rounded-full"></div>
        </h1>
      </header>

      {/* Grid Content */}
      <main className="max-w-7xl mx-auto pb-20 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {ebooks.map((book) => (
            <div 
              key={book.id} 
              // ใช้ shadow-md และสีพื้นผิว surface-2
              className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col border border-border hover:shadow-lg transition-shadow duration-300"
            >
              {/* Title Header */}
              <div className="p-4 bg-surface-2 border-b border-border">
                <h2 className="text-sm font-bold text-deep-text truncate uppercase text-center">
                  {book.title}
                </h2>
              </div>
              
              {/* Cover Image Container */}
              <div className="p-6 bg-white flex justify-center items-center grow">
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="w-full h-auto object-contain rounded shadow-sm border border-border"
                />
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-surface-2 flex justify-center gap-10 border-t border-border">
                {/* PDF Button - ใช้สี error (warm red) ตาม palette */}
                <button className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform">
                  <div className="w-12 h-12 flex items-center justify-center bg-white border-2 border-error rounded-full shadow-sm group-hover:bg-error group-hover:text-white transition-colors">
                    <span className="text-error font-bold text-xs group-hover:text-white">PDF</span>
                  </div>
                  <span className="text-[10px] font-bold text-muted-text">ดาวน์โหลด</span>
                </button>

                {/* Read Button - ใช้สี green (primary) */}
                <button className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform">
                  <div className="w-12 h-12 flex items-center justify-center bg-white border-2 border-green rounded-full shadow-sm group-hover:bg-green transition-colors">
                    <BookOpenText className="text-xl group-hover:filter group-hover:brightness-0 group-hover:invert transition-all" />
                  </div>
                  <span className="text-[10px] font-bold text-muted-text">อ่านออนไลน์</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-forest-green py-6 mt-auto">
        <p className="text-center text-green-light text-xs font-medium tracking-wider">
          ©2022 Institute of Sufficiency Economy. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default EbookPage;