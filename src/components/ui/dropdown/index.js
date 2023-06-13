import {useState} from "react";
import {MdOutlineArrowForwardIos} from 'react-icons/md'

import classes from "./dropdown.module.css"

export default function Dropdown() {
    const [open, setOpen] = useState(false);
    const [dropdownText, setDropdownText] = useState('پربازدیدترین')

    const handleOpen = () => {
        setOpen(!open);
    };
    const onMenuClick = (e) => {
        setDropdownText(e.target.textContent)
        console.log(e.target.textContent)
    }

    return (
        <div onClick={handleOpen} className={classes.container}>
            <div className={classes.dropdown_content}>
                <div>{dropdownText}</div>
                <MdOutlineArrowForwardIos className={classes.arrow}/>
            </div>
            {open && (
                <ul className={classes.menu}>
                    <li onClick={(e) => onMenuClick(e)}>
                        پربازدیدترین
                    </li>
                    <li onClick={(e) => onMenuClick(e)}>
                        پرتکرارترین
                    </li>
                    <li onClick={(e) => onMenuClick(e)}>
                        قدیمی ترین
                    </li>
                </ul>
            )}
        </div>
    )
}
