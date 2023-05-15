import classes from './user-entrance.module.css'

export default function UserEntrance({children}) {
    return (
        <div className={classes.container}>
            {children}
        </div>
    )
}
