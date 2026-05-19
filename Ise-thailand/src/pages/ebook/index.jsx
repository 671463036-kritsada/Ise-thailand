import React, { useState, useEffect } from 'react';
import { BookOpenText } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const EbookPage = () => {
  const [searchParams] = useSearchParams();
  const typeId = searchParams.get('typeId') || '01';
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:2000/api/asset/${typeId}`)
      .then(res => res.json())
      .then(data => setEbooks(data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [typeId]); // re-fetch เมื่อ typeId เปลี่ยน

  if (loading) return <div className="text-center py-20">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="max-w-7xl mx-auto py-12 px-4 text-center">
        <h1 className="text-4xl font-bold text-forest-green tracking-widest uppercase">
          E-Book
          <div className="h-1.5 w-20 bg-gold mx-auto mt-2 rounded-full"></div>
        </h1>
      </header>

      {/* Grid Content */}
      <main className="max-w-7xl mx-auto pb-20 px-4">
        {ebooks.length === 0 ? (
          <p className="text-center text-gray-500">ไม่พบข้อมูล</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {ebooks.map((book) => (
              <div
                key={book.asset_id}
                className="bg-white rounded-lg overflow-hidden shadow-md flex flex-col border border-border hover:shadow-lg transition-shadow duration-300"
              >
                {/* Title Header */}
                <div className="p-4 bg-surface-2 border-b border-border">
                  <h2 className="text-sm font-bold text-deep-text truncate uppercase text-center">
                    {book.asset_name}
                  </h2>
                </div>

                {/* Cover Image */}
                <div className="p-6 bg-white flex justify-center items-center grow">
                  <img
                    src={book.img_file
                      ? `http://localhost:2000/uploads/${book.img_file}`
                      : 'https://via.placeholder.com/300x400?text=No+Image'}
                    alt={book.asset_name}
                    className="w-full h-auto object-contain rounded shadow-sm border border-border"
                  />
                </div>

                {/* Action Buttons */}
                <div className="p-6 bg-surface-2 flex justify-center gap-10 border-t border-border">
                  {/* PDF */}
                  {book.pdf_file && (

                    <a href={`http://localhost:2000/uploads/${book.pdf_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform"
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-white border-2 border-error rounded-full shadow-sm group-hover:bg-error transition-colors">
                        <span className="text-error font-bold text-xs group-hover:text-white">PDF</span>
                      </div>
                      <span className="text-[10px] font-bold text-muted-text">ดาวน์โหลด</span>
                    </a>
                  )}

                  {/* อ่านออนไลน์ */}
                  {book.url_ebook && (

                    <a href={book.url_ebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center gap-2 hover:scale-110 transition-transform"
                    >
                      <div className="w-12 h-12 flex items-center justify-center bg-white border-2 border-green rounded-full shadow-sm group-hover:bg-green transition-colors">
                        <BookOpenText className="text-xl group-hover:filter group-hover:brightness-0 group-hover:invert transition-all" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-text">อ่านออนไลน์</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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