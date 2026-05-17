import { jwtDecode } from 'jwt-decode'
// สามารถ decode ข้อมูล user ผ่าน token ได้เลย ถ้าต้องการข้อม๔ล user ไปแสดง
export function useAuth() {
    const token = localStorage.getItem('token')
    
    if (!token) return { user: null, isAdmin: false }
    
    try {
        const user = jwtDecode(token) // { id, name, role, exp }
        
        // เช็คว่า token หมดอายุยัง
        if (user.exp < Date.now() / 1000) {
            localStorage.removeItem('token')
            return { user: null, isAdmin: false }
        }
        
        return {
            user,
            isAdmin: user.role === 1
        }
    } catch {
        return { user: null, isAdmin: false }
    }
}