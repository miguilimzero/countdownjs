export default function countup({
    time,
    locale,
    format = { timeStyle: 'medium', timeZone: 'UTC' },
    onTick = (formattedTime) => { },
}) {
    const serverDate = new Date(time * 1000)
    const localDate = new Date()

    // If window is undefined, this is a SSR request, so do one tick and return empty
    if (typeof window === 'undefined') {
        onTick(Intl.DateTimeFormat(locale, format).format(serverDate))
        return
    }

    // Update server time based on elapsed client time
    const updateTime = () => {
        const elapsed = new Date().getTime() - localDate.getTime()

        const currentDate = new Date(serverDate.getTime() + elapsed)
        const formattedTime = Intl.DateTimeFormat(locale, format).format(currentDate)

        onTick(formattedTime)
    }

    // Call the first time, in order to avoid waiting 1 second of the setInterval()
    updateTime()

    // Create and return the interval loop in order to be able to clear it manually
    return setInterval(() => updateServerTime(), 1000)
}
