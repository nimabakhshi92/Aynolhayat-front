import classes from "../show-traditions/filter-modal/filter-modal.module.css";
import { Fragment, useState, useEffect } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useDispatch } from "react-redux";
import { setSelectedNode } from "../../features/summaryTree/summaryTreeSlice";

import { useEffect, useState } from "react";
import "./styles.css";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

export default function SummaryTree() {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  // useEffect(()=>{
  //   console.log("checked", checked);
  //   console.log("expanded", expanded);

  // },[checked, expanded])

  const nodes = [
    {
      value: "Parent 1",
      label: "Parent 1",
      children: [
        { value: "P1 child 1", label: "P1 child 1" },
        { value: "P1 child 2", label: "P1 child 2" },
        { value: "P1 child 3", label: "P1 child 3" },
      ],
    },
    {
      value: "Parent 2",
      label: "Parent 2",
      children: [{ value: "P2 child 1", label: "P2 child 1" }],
    },
    {
      value: "Parent 3",
      label: "Parent 3",
      children: [
        { value: "P3 child 1", label: "P3 child 1" },
        { value: "P3 child 222", label: "P3 child 2" },
        {
          value: "P3 child 3",
          label: "P3 child 3",
          children: [
            { value: "P3 child 3.1", label: "P3 child 3.1" },
            { value: "P3 child 3.2", label: "P3 child 3.2" },
            {
              value: "P3 child 4",
              label: "P3 child 4",
              children: [
                { value: "P3 child 4.1", label: "P3 child 4.1" },
                { value: "P3 child 4.2", label: "P3 child 4.2" },
                { value: "P3 child 4.3", label: "P3 child 4.3" },
                { value: "P3 child 4.4", label: "P3 child 4.4" },
              ],
            },
            { value: "P3 child 5", label: "P3 child 5" },
            { value: "P3 child 6", label: "P3 child 6" },
          ],
        },
      ],
    },
  ];
  return (
    <div className="App">
      <h4> Expanded : {JSON.stringify(expanded)} </h4>
      <h4> Selected : {JSON.stringify(checked)} </h4>

      <CheckboxTree
        nodes={nodes}
        checked={checked}
        expanded={expanded}
        onCheck={(checkedData) => {
          setChecked(checkedData);
        }}
        onExpand={(expandedData) => {
          setExpanded(expandedData);
        }}
      />
    </div>
  );
}

export const SummaryTreeOld = ({ data, section, selectedNode }) => {
  const [subjectVisibility, setSubjectVisibility] = useState([]);
  const dispatch = useDispatch();

  function toggleVisibility(index, alphabet) {
    setSubjectVisibility((prevVisibility) => {
      const updatedVisibility = [...prevVisibility];
      updatedVisibility[index] = !updatedVisibility[index];
      return updatedVisibility;
    });
    dispatch(
      setSelectedNode({ node: { ...selectedNode, [section]: alphabet } })
    );
  }

  return (
    <div className={classes.alphabet}>
      <p className={classes.alphabet_title}>فهرست مطالب</p>
      {data.map((item, index) => (
        <Fragment key={index}>
          <div
            className={`${classes.alphabet_container} ${
              selectedNode[section] !== item.alphabet
                ? ""
                : classes.alphabet_open
            }`}
            onClick={() => toggleVisibility(index, item.alphabet)}
          >
            <p>{item.alphabet}</p>
            <MdOutlineArrowForwardIos
              className={`${classes.arrow} ${
                selectedNode[section] !== item.alphabet ? "" : classes.arrow__up
              }`}
            />
          </div>
          <div
            className={`${
              selectedNode[section] !== item.alphabet
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
