function formatNumber(number, withPadding) {
    return withPadding ? String(number).padStart(2, '0') : String(number)
}

function countdownInternal(countdownObjective, template, withPadding, onTick, onFinish, intervalLoop = null) {
    // Remaining seconds
    const totalSeconds = Math.round(countdownObjective - Math.round(Date.now() / 1000))

    // Calculate remaining time
    var seconds = totalSeconds
    var minutes = template.includes('{minutes}') ? Math.floor(seconds / 60) : 0 // 1 minute = 60 seconds
    var hours = template.includes('{hours}') ? Math.floor(minutes / 60) : 0
    var days = template.includes('{days}') ? Math.floor(hours / 24) : 0

    // Replace template variables
    if (template.includes('{days}')) {
        template = template.replace('{days}', formatNumber(days, false))
        hours -= days * 24
    }
    if (template.includes('{hours}')) {
        template = template.replace('{hours}', formatNumber(hours, withPadding))
        minutes -= days * 24 * 60 + hours * 60
    }
    if (template.includes('{minutes}')) {
        template = template.replace('{minutes}', formatNumber(minutes, withPadding))
        seconds -= days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60
    }
    if (template.includes('{seconds}')) {
        template = template.replace('{seconds}', formatNumber(seconds, withPadding))
    }

    // Finally update using onTick()
    onTick(template, totalSeconds)

    // Finish countdown & Stop this interval 
    // Note: Using totalSeconds as seconds is recalculated with minutes
    if (totalSeconds <= 0) {
        onFinish()

        if (intervalLoop) clearInterval(intervalLoop)
    }
}

export default function countdown({
    seconds,
    template = '{hours}:{minutes}:{seconds}',
    withPadding = true,
    onTick = (string, remainingSeconds) => { },
    onFinish = () => { },
}) {
    // If window is undefined, this is a SSR request
    // so call onFinish() and return
    if (typeof window === 'undefined') {
        onFinish()
        return
    }

    // This objective based on computer date is used
    // in order to avoid problems with the browser
    // suspending the tab activity and the looping being frozen
    const countdownObjective = seconds + Math.round(Date.now() / 1000)

    // Call the first time, in order to avoid waiting 1 second
    countdownInternal(countdownObjective, template, withPadding, onTick, onFinish)

    // Create the interval loop and appending it to a variable
    // in order to be able to clear it later
    const intervalLoop = setInterval(
        () => countdownInternal(countdownObjective, template, withPadding, onTick, onFinish, intervalLoop)
    , 1000)

    // Return the interval loop in order to be able to clear it manually
    return intervalLoop
}