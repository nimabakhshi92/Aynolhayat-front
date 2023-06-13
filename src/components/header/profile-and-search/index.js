import {FiSearch} from "react-icons/fi";

import classes from "./profile-and-search.module.css";
export default function ProfileAndSearch(){
    return(
        <div>
            <FiSearch className={classes.search_icon} />
            <div className={classes.profile_icon}>M</div>
        </div>
    )
}
