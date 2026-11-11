import { useState, useEffect, useRef } from 'react'
import { getSiteViews } from '../api/axios'

export function useSiteViews() {
    const [views, setViews] = useState(null)
    const [viewsData, setViewsData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    // ป้องกัน React StrictMode double-invoke
    const hasFetched = useRef(false)

    useEffect(() => {
        // ถ้าเคย fetch ไปแล้วในรอบนี้ ให้ข้ามเพื่อไม่บันทึกซ้ำ
        if (hasFetched.current) return
        hasFetched.current = true

        const fetchAndTrack = async () => {
            try {
                setLoading(true)
                const data = await getSiteViews()
                if (data.success) {
                    setViews(data.totalViews)
                    setViewsData(data)
                }
            } catch (err) {
                console.error('Error in useSiteViews:', err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchAndTrack()
    }, [])

    return { views, viewsData, loading, error }
}
