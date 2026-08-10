import { useState, useEffect } from 'react'
import { getProjectViews } from '../api/axios' // ปรับ path ตามที่เก็บไฟล์ axios.js ของคุณ

export function useProjectViews(projectId) {
    const [views, setViews] = useState(0)
    const [lastUpdated, setLastUpdated] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // ถ้ายังไม่มี projectId ส่งมา ไม่ต้องดึงข้อมูล
        if (!projectId) return

        const fetchViews = async () => {
            try {
                setLoading(true)
                const data = await getProjectViews(projectId)
                
                if (data.success) {
                    setViews(data.totalViews)
                    setLastUpdated(data.lastUpdated)
                }
            } catch (err) {
                console.error("Error in useProjectViews:", err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchViews()
    }, [projectId])

    return { views, lastUpdated, loading, error }
}