export const Label = ({ variant, text, style, ...props }) => {
    let bgcolor, color
    switch (variant) {
        case 'success':
            bgcolor = 'var(--green-100)'
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
            ...style
        }} {...props}>{text}</span>
    )
}

export const PendingNarrationSentLabel = ({ ...props }) => {
    return (
        <Label variant={'warning'} text='در انتظار تایید' {...props} />

    )
}

export const RejectedNarrationSentLabel = ({ ...props }) => {
    return (
        <Label variant={'error'} text='نیاز به تغییر' {...props} />

    )
}

export const AcceptedNarrationSentLabel = ({ ...props }) => {
    return (
        <Label variant={'success'} text='تایید شده' {...props} />

    )
}

export const InsertedNarrationSentLabel = ({ ...props }) => {
    return (
        <Label variant={'success'} text='افزوده شده' {...props} />

    )
}


export const SendingNarrationSentLabel = ({ ...props }) => {
    return (
        <Label variant={'info'} text='در حال ارسال...' {...props} />

    )
}

export const NarrationSentStatusLabel = ({ status }) => {
    if (status === 'sending')
        return <SendingNarrationSentLabel />
    if (status === 'pending')
        return <PendingNarrationSentLabel />
    if (status === 'accepted')
        return <AcceptedNarrationSentLabel />
    if (status === 'rejected')
        return <RejectedNarrationSentLabel />
}


