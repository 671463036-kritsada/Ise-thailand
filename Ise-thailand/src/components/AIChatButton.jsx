import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import config from '../config';
import { MessageCircle } from 'lucide-react'

function AIChatButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = { role: 'user', text: message };
    setMessages((prev) => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    setMessages((prev) => [...prev, { role: 'ai', text: '' }]);

    try {
      const response = await fetch(`${config.BASE_URL}/api/ai/royal-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          question: message,
          history: messages.slice(-4),
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data:'));

        for (const line of lines) {
          const data = line.replace('data: ', '').trim();
          if (data === '[DONE]') break;

          try {
            const json = JSON.parse(data);
            if (json.text) {
              fullText += json.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'ai', text: fullText };
                return updated;
              });
            }
          } catch { }
        }
      }

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'เกิดข้อผิดพลาด กรุณาลองใหม่', isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopMessage = async () => {
    try {
      await api.post('/ai/royal-chat/stop');
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatText = (text) => {
    return text
      .split('\n')
      .filter(line => line.trim())
      .map((line, i) => {
        // แปลง **text** เป็น bold
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={i} style={{ margin: '2px 0' }}>
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j}>{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      });
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-[90px] right-6 w-[340px] h-[500px] flex flex-col z-[9999] overflow-hidden"
          style={{
            background: 'var(--color-white)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: '0 8px 32px var(--color-shadow-lg)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3"
            style={{ background: 'var(--color-forest-green)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                style={{ background: 'var(--color-surface-2)' }}
              >
                <MessageCircle/>
              </div>
              <div>
                <p className="m-0 text-sm font-semibold"
                  style={{ color: 'var(--color-white)' }}
                >
                  AI โครงการหลวง
                </p>
                <p className="m-0 text-xs"
                  style={{ color: 'var(--color-green-light)' }}
                >
                  ถามได้ทุกโครงการหลวง
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-xl leading-none cursor-pointer p-1 rounded-full transition-colors"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-green-light)',
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3"
            style={{ background: 'var(--color-surface)' }}
          >
            {messages.length === 0 && (
              <div className="text-center mt-14"
                style={{ color: 'var(--color-placeholder)' }}
              >
                <p className="text-3xl m-0 mb-2">🌿</p>
                <p className="m-0 text-sm" style={{ lineHeight: 'var(--line-height-relaxed)' }}>
                  สวัสดีครับ มีคำถามเกี่ยวกับ<br />โครงการหลวงไหมครับ?
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {/* ซ่อน bubble ว่างตัวสุดท้าย เพราะจะแสดง loading dots แทน */}
                {!(msg.role === 'ai' && msg.text === '' && i === messages.length - 1) && (
                  <div
                    className="max-w-[78%] text-sm"
                    style={{
                      padding: '9px 13px',
                      lineHeight: 'var(--line-height-relaxed)',
                      borderRadius: msg.role === 'user'
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                      background: msg.role === 'user'
                        ? 'var(--color-forest-green)'
                        : msg.isError
                          ? '#fee2e2'
                          : 'var(--color-white)',
                      color: msg.role === 'user'
                        ? 'var(--color-white)'
                        : msg.isError
                          ? 'var(--color-error)'
                          : 'var(--color-deep-text)',
                      border: msg.role === 'ai'
                        ? '1px solid var(--color-border)'
                        : 'none',
                      boxShadow: '0 1px 4px var(--color-shadow)',
                    }}
                  >
                    {formatText(msg.text)}
                  </div>
                )}
              </div>
            ))}
            {loading && messages[messages.length - 1]?.text === '' && (
              <div className="flex justify-start">
                <div className="flex gap-1 items-center px-4 py-3"
                  style={{
                    background: 'var(--color-white)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '16px 16px 16px 4px',
                    boxShadow: '0 1px 4px var(--color-shadow)',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span key={i}
                      className="w-[6px] h-[6px] rounded-full inline-block"
                      style={{
                        background: 'var(--color-green)',
                        animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3" style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-white)' }}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="พิมพ์คำถาม..."
              disabled={loading}
              className="flex-1 text-sm outline-none transition-colors"
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface-2)',
                color: 'var(--color-deep-text)',
                fontFamily: 'var(--font-sans)',
              }}
            />
            {loading ? (
              <button
                onClick={stopMessage}
                className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-all"
                style={{
                  background: 'var(--color-error)',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-white)',
                }}
              >
                ■
              </button>
            ) : (
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-all"
                style={{
                  background: message.trim() ? 'var(--color-forest-green)' : 'var(--color-surface-3)',
                  border: 'none',
                  cursor: message.trim() ? 'pointer' : 'default',
                  color: message.trim() ? 'var(--color-white)' : 'var(--color-disabled)',
                }}
              >
                ➤
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl z-[9999] transition-transform hover:scale-110 active:scale-95"
        style={{
          background: 'var(--color-forest-green)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px var(--color-shadow-lg)',
          color: 'var(--color-white)',
        }}
      >
        {open ? '✕' : <MessageCircle/>}
      </button>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}

export default AIChatButton;