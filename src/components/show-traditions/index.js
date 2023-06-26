import classes from "./show-traditions.module.css";
import SortTraditions from "./sort-traditions";
import Traditions from "./traditions";
import Filter from "../ui/filter";

export default function ShowTraditions() {
    return (
        <div className={classes.container}>
            <SortTraditions/>
            <Traditions/>
            <div className={classes.filter}>
                <Filter/>
            </div>
        </div>
    )
}
