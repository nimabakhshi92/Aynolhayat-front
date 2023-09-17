import classes from "../show-traditions/filter-modal/filter-modal.module.css";
import { Fragment, useState, useEffect } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setSelectedNode } from "../../features/summaryTree/summaryTreeSlice";

export const SummaryTree = ({ data }) => {
  const [subjectVisibility, setSubjectVisibility] = useState([]);
  const dispatch = useDispatch();

  function toggleVisibility(index, alphabet) {
    setSubjectVisibility((prevVisibility) => {
      const updatedVisibility = [...prevVisibility];
      updatedVisibility[index] = !updatedVisibility[index];
      return updatedVisibility;
    });
    dispatch(setSelectedNode({ node: alphabet }));
  }

  return (
    <div className={classes.alphabet}>
      <p className={classes.alphabet_title}>فهرست مطالب</p>
      {data.map((item, index) => (
        <Fragment key={index}>
          <div
            className={`${classes.alphabet_container} ${
              !subjectVisibility[index] ? "" : classes.alphabet_open
            }`}
            onClick={() => toggleVisibility(index, item.alphabet)}
          >
            <p>{item.alphabet}</p>
            <MdOutlineArrowForwardIos
              className={`${classes.arrow} ${
                !subjectVisibility[index] ? "" : classes.arrow__up
              }`}
            />
          </div>
          <div
            className={`${
              !subjectVisibility[index]
                ? classes.subject_container__hidden
                : classes.subject_container__visible
            }`}
          >
            {item.subjects.map((sub, subIndex) => (
              <p key={subIndex} className={classes.subject}>
                {sub.title}
              </p>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
