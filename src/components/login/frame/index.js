import classes from "./frame.module.css";

export default function Frame({children}){
    return(
        <div className={classes.frame}>
            {children}
        </div>
    )
}
