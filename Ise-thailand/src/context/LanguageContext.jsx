import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(
        localStorage.getItem('lang') || 'TH'  // อ่านจาก localStorage
    )

    const setLang = (newLang) => {
        localStorage.setItem('lang', newLang)  // บันทึกลง localStorage
        setLangState(newLang)
    }

    return (
        <LanguageContext.Provider value={{ lang, setLang }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLang() {
    return useContext(LanguageContext)
}