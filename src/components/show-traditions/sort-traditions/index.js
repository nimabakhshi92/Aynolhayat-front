import classes from "./sort-traditions.module.css"
import Dropdown from "../../ui/dropdown";

export default function SortTraditions(){
        return(
            <div className={classes.container}>
                <div className={classes.sort_container}>
                    <p>مرتب سازی :</p>
                    <Dropdown />
                </div>
            </div>
        )
}
