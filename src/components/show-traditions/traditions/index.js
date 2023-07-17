import classes from "./traditions.module.css"

import shape_gold from "../../../assets/images/shapes/shape-gold.svg"
import SecondaryButton from "../../ui/buttons/secondary-button";
import DotsDropdown from "../../ui/dots-dropdown";
import {BiPencil} from "react-icons/bi";
import {FiPrinter} from "react-icons/fi";
import {BsFiletypePdf} from "react-icons/bs"
import noteIcon from "../../../assets/images/shapes/Icon-Note.svg"
import shape_green from "../../../assets/images/shapes/shape-green.svg"
import {Fragment} from "react";

export default function Traditions() {
    const dropdown = [
        {id: 1, title: 'پربازدیدترین', icon: <BiPencil/>},
        {id: 2, title: 'پرتکرارترین', icon: <FiPrinter/>},
        {id: 3, title: 'قدیمی ترین', icon: <BsFiletypePdf/>},
    ]
    const a = [
        {
            "title": "پرانتز",
            "sub_subjects": [
                {
                    "title": "ازمایشی",
                    "content": [
                        {
                            "expression": "ا",
                            "summary": "ت"
                        },
                        {
                            "expression": "اب",
                            "summary": "تب"
                        },
                    ]
                },
                {
                    "title": "ازمایشی ذو",
                    "content": [
                        {
                            "expression": "ا",
                            "summary": "ت"
                        },
                    ]
                }
            ]
        },
        {
            "title": "پرانتز",
            "sub_subjects": [
                {
                    "title": "ازمایشی",
                    "content": [
                        {
                            "expression": "ا",
                            "summary": "ت"
                        },
                        {
                            "expression": "اب",
                            "summary": "تب"
                        },
                    ]
                },
                {
                    "title": "ازمایشی ذو",
                    "content": [
                        {
                            "expression": "ا",
                            "summary": "ت"
                        },
                    ]
                }
            ]
        }
    ]
    return (
        <div className={classes.container}>
            {a.map((i, index) => (
                <div className={classes.card_container} key={index}>
                    <div className={classes.header_container}>
                        <p>{i.title}</p>
                        <DotsDropdown items={dropdown}/>
                    </div>
                    {i.sub_subjects.map((subItem, subIndex) => (
                        <div key={subIndex} className={classes.content_container}>
                            <div className={classes.content_container__title}>
                                <img src={noteIcon} alt='icon'/>
                                <span>{subItem.title}</span>
                            </div>
                            {subItem.content.map((contentItem, contentIndex) => (
                                <Fragment key={contentIndex}>
                                    <p>{contentItem.expression}</p>
                                    <p>{contentItem.summary}</p>
                                    {contentIndex === subItem.content.length - 1 ? null :
                                        <img className={classes.shape_green} src={shape_green} alt="shape-green"/>}
                                </Fragment>
                            ))}
                            <img src={shape_gold} alt={`shape-gold`} className={classes.shape_gold}/>
                            <div
                                className={`${classes.button_container} 
                                            ${subIndex === i.sub_subjects.length - 1 ? null : classes.button_container_border}`}>
                                <SecondaryButton>نمایش کامل حدیث</SecondaryButton>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
