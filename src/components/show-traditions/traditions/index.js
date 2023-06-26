import classes from "./traditions.module.css"

import shape_gold from "../../../assets/images/shapes/shape-gold.svg"
import SecondaryButton from "../../ui/buttons/secondary-button";
import DotsDropdown from "../../ui/dots-dropdown";
import {BiPencil} from "react-icons/bi";
import {FiPrinter} from "react-icons/fi";
import {BsFiletypePdf, BsThreeDots} from "react-icons/bs"

export default function Traditions() {
    const dropdown = [
        { id: 1, title: 'پربازدیدترین', icon: <BiPencil />},
        { id: 2, title: 'پرتکرارترین', icon: <FiPrinter />},
        { id: 3, title: 'قدیمی ترین', icon: <BsFiletypePdf />},
    ]
    return (
        <div className={classes.container}>
            <div className={classes.header_container}>
                <p>اجل</p>
                <DotsDropdown items={dropdown} />
            </div>
            <div className={classes.content_container}>
                <p>اجل مسمی در 60 انعام</p>
                <p>اجل مسمی در این حدیث، همان مرگ است</p>
                <p>لِيُقْضى‏ أَجَلٌ مُسَمًّى قال: «هو الموت</p>
            </div>
            <img src={shape_gold} alt={`shape-gold`} className={classes.shape}/>
            <div className={classes.button_container}>
                <SecondaryButton>نمایش کامل حدیث</SecondaryButton>
            </div>
        </div>
    )
}
