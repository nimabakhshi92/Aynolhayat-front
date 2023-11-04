import classes from "./traditions.module.css";
import Button from "../../ui/buttons/primary-button";

import shape_gold from "../../../assets/images/shapes/shape-gold.svg";
import DotsDropdown from "../../ui/dots-dropdown";
import { BiPencil } from "react-icons/bi";
import { FiPrinter } from "react-icons/fi";
import { BsFiletypePdf } from "react-icons/bs";
import noteIcon from "../../../assets/images/shapes/Icon-Note.svg";
import shape_green from "../../../assets/images/shapes/shape-green.svg";
import { Fragment } from "react";
import { useSelector } from "react-redux";

export default function Traditions({ data, section }) {
  const dropdown = [
    { id: 1, title: "پربازدیدترین", icon: <BiPencil /> },
    { id: 2, title: "پرتکرارترین", icon: <FiPrinter /> },
    { id: 3, title: "قدیمی ترین", icon: <BsFiletypePdf /> },
  ];
  return (
    <div className={classes.container}>
      {data?.map((i, index) => (
        <div className={classes.card_container} key={index}>
          <div className={classes.header_container}>
            {section === "surah" ? (
              <p>
                {i.verse_no} - {i.verse_content}
              </p>
            ) : (
              <p>{i.title}</p>
            )}
            <DotsDropdown items={dropdown} />
          </div>
          {(i?.sub_subjects || []).map((subItem, subIndex) => (
            <div key={subIndex} className={classes.content_container}>
              <div className={classes.content_container__title}>
                <img src={noteIcon} alt="icon" />
                <span>{subItem.title}</span>
              </div>
              {subItem?.subjects_3.map((subject_3) => {
                return (
                  <>
                    {subject_3.title && (
                      <div
                        className={classes.content_container__title}
                        style={{ paddingRight: "32px" }}
                      >
                        <img src={noteIcon} alt="icon" />
                        <span>{subject_3.title}</span>
                      </div>
                    )}
                    {subject_3.subjects_4.map((subject_4) => {
                      return (
                        <>
                          {subject_4.title && (
                            <div
                              className={classes.content_container__title}
                              style={{ paddingRight: "64px" }}
                            >
                              <img src={noteIcon} alt="icon" />
                              <span>{subject_4.title}</span>
                            </div>
                          )}
                          {(subject_4?.content || []).map(
                            (contentItem, contentIndex) => (
                              <Fragment key={contentIndex}>
                                <div className="grid gap-6 grid-cols-2">
                                  <p>{contentItem.expression}</p>
                                  <p>{contentItem.summary}</p>
                                </div>
                                {contentIndex ===
                                (subItem.content || []).length - 1 ? null : (
                                  <div className="flex justify-center">
                                    <img
                                      className={classes.shape_green}
                                      src={shape_green}
                                      alt="shape-green"
                                    />
                                  </div>
                                )}
                              </Fragment>
                            )
                          )}
                        </>
                      );
                    })}
                  </>
                );
              })}

              <img
                src={shape_gold}
                alt={`shape-gold`}
                className={classes.shape_gold}
              />
              <div
                className={`${classes.button_container} 
                                            ${
                                              subIndex ===
                                              i.sub_subjects.length - 1
                                                ? null
                                                : classes.button_container_border
                                            }`}
              >
                <Button variant="secondary">نمایش کامل حدیث</Button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
