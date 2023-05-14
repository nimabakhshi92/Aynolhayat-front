import classes from "./input.module.css"

export default function Input({type, placeholder}){
    return <input className={classes.input} type={type} placeholder={placeholder} />
}
