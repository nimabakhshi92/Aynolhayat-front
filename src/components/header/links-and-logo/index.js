import HumberBtn from "./humber-btn";
import Links from "./links";

export default function LinksAndLogo({menuClickHandler}){
    return(
        <div>
            <p>جنة المأوی</p>
            <HumberBtn menuClickHandler={menuClickHandler} />
            <Links/>
        </div>
    )
}
