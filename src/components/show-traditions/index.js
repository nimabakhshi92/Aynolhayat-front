import classes from "./show-traditions.module.css";
import SortTraditions from "./sort-traditions";

export default function ShowTraditions(){
    return(
        <div className={classes.container} >
            <SortTraditions />
        </div>
    )
}
