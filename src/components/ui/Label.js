import { shareNarrationStatus } from "../../utils/enums"
import { HiBadgeCheck } from "react-icons/hi";

export const Label = ({ variant, text, style, ...props }) => {
    let bgcolor, color
    switch (variant) {
        case 'superSuccess':
            bgcolor = 'var(--green-100)'
            bgcolor = '#0bab6433'
            color = 'var(--primary-color)'
            break
        case 'success':
            // bgcolor = 'var(--green-100)']
            bgcolor = '#6AFFAA50'
            color = 'var(--primary-color)'
            break
        case 'error':
            bgcolor = 'var(--red-100)'
            color = 'var(--error-color)'
            break
        case 'info':
            bgcolor = 'var(--blue-200)'
            color = 'var(--secondary-blue-color)'
            break
        case 'warning':
            bgcolor = 'var(--yellow-100)'
            color = 'var(--secondary-brown-color)'
            break
        case 'debug':
            bgcolor = 'var(--blue-200)'
            color = 'var(--secondary-blue-color)'
            break
    }

    return (
        <span style={{
            borderRadius: '7px',
            padding: '4px 8px',
            color: 'white',
            backgroundColor: bgcolor,
            color,
            fontSize: '1.1rem',
            cursor: props?.onClick && 'pointer',
            display: 'flex',
            gap: '4px',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...style
        }} {...props}>{text}
            {variant === 'superSuccess' &&
                < HiBadgeCheck style={{ width: 16, height: 16 }} fill="green" />
            }
        </span>
    )
}


export const SendingNarrationSentLabel = ({ ...props }) => {
    return <Label variant={'info'} text='در حال ارسال...' {...props} />
}

export const PendingNarrationSentLabel = ({ ...props }) => {
    return <Label variant={'info'} text='درخواست ارسال شده' {...props} />
}

export const CheckingNarrationSentLabel = ({ ...props }) => {
    return <Label variant={'warning'} text='در حال بررسی' {...props} />
}

export const RejectedNarrationSentLabel = ({ ...props }) => {
    return <Label variant={'error'} text='نیاز به تغییر' {...props} />
}

export const AcceptedNarrationSentLabel = ({ ...props }) => {
    return <Label variant={'success'} text='تایید شده' {...props} />
}

export const InsertedNarrationSentLabel = ({ ...props }) => {
    return <Label variant={'superSuccess'} text='انتقال یافته به سایت' {...props} />
}


export const NarrationSentStatusLabel = ({ status, ...props }) => {
    if (status === shareNarrationStatus.SENDING)
        return <SendingNarrationSentLabel {...props} />
    if (status === shareNarrationStatus.PENDING)
        return <PendingNarrationSentLabel {...props} />
    if (status === shareNarrationStatus.CHECKING)
        return <CheckingNarrationSentLabel {...props} />
    if (status === shareNarrationStatus.ACCEPTED)
        return <AcceptedNarrationSentLabel {...props} />
    if (status === shareNarrationStatus.REJECTED)
        return <RejectedNarrationSentLabel {...props} />
    if (status === shareNarrationStatus.TRANSFERRED)
        return <InsertedNarrationSentLabel {...props} />
}


