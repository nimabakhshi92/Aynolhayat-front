import classes from "./input.module.css"

export default function Input({type, placeholder, reference}){

    return <input ref={reference} className={classes.input} type={type} placeholder={placeholder} />
}
