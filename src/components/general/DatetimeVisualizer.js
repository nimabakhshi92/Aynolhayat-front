import { useEffect, useState } from "react"
import { convertGregorianToJalali } from "../../functions/general";

export const DatetimeVisualizer = () => {
    const [now, setNow] = useState()

    useEffect(() => {
        const timer = setInterval(() => {
            const updated = new Date()
            const h = updated.getHours()
            const m = updated.getMinutes()
            const s = updated.getSeconds()
            const jalali = convertGregorianToJalali(updated)
            setNow(jalali.replace('-', '/').replace('-', '/') + ' - ' + `${h}:${m}:${s}`)
        }, 500);

        return () => clearInterval(timer)
    }, [])

    return <span className="inline-block w-40" style={{ direction: 'ltr' }}>{now}</span>
}
