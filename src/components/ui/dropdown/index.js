import {useState} from "react";
import {MdOutlineArrowForwardIos} from 'react-icons/md'

import classes from "./dropdown.module.css"

export default function Dropdown({items}) {
    const [open, setOpen] = useState(false);
    const [dropdownText, setDropdownText] = useState(items[0].title)

    const handleOpen = () => {
        setOpen(!open);
    }

    const onMenuClick = (e) => {
        setDropdownText(e.target.textContent)
    }

    return (
        <div onClick={handleOpen} className={classes.container}>
            <div className={classes.dropdown_content}>
                <div>{dropdownText}</div>
                <MdOutlineArrowForwardIos className={`${classes.arrow} ${open && classes.arrow_up}`}/>
            </div>
            {open && (
                <ul className={classes.menu}>
                    {
                        items.map( item =>
                            <li key={item.id} onClick={(e) => onMenuClick(e)}>
                                {item.title}
                            </li>)
                    }
                </ul>
            )}
        </div>
    )
}
