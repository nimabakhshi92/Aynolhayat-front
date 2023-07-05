import PrimaryButton from "../../ui/buttons/primary-button";
import SecondaryButton from "../../ui/buttons/secondary-button";

import classes from "./filter-modal.module.css"

export default function FilterModal(){
    return(
        <>
            <div className={classes.button_container}>
                <PrimaryButton>روایات</PrimaryButton>
                <SecondaryButton>آیات</SecondaryButton>
                <SecondaryButton>سوره ها</SecondaryButton>
            </div>
            <div className={classes.alphabet}>
                <p>ائمه اطهار</p>
                <p>الف</p>
                <p>ب</p>
                <p>پ</p>
            </div>
        </>
    )
}
