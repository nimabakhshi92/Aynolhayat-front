import classes from "./links.module.css";

export default function Links({onModal}){
    return(
        <div className={`${onModal ? classes.link_container__in_modal : classes.link_container} ${onModal && classes.font_color}`}>
            { onModal && <span>جنة المأوی</span> }
            <span>نمایش حدیث</span>
            <span>ذخیره حدیث</span>
            <span>ذخیره کتاب</span>
        </div>
    )
}
