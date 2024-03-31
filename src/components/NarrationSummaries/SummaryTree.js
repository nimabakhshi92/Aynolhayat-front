import classes from "../show-traditions/filter-modal/filter-modal.module.css";
import { Fragment, useState, useEffect, useRef } from "react";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedNode,
  toggleTreeIsOpen,
} from "../../features/summaryTree/summaryTreeSlice";

// import "./styles.css";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import Input from "../ui/input";
import { extractPosition, extractTreeIndex } from "../../utils/manipulation";
import { BiChevronLeft, BiFileBlank } from "react-icons/bi";

export function SummaryTree({ data, section, selectedNode }) {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [clicked, setClicked] = useState({});
  const [c, setC] = useState([]);

  useEffect(() => {
    let newc = data.map((level1, index1) => {
      return {
        value: index1 + "l1" + level1.alphabet,
        label: level1.alphabet,
        // className:
        //   index1 + "l1" + level1.alphabet == clicked.value ? "b-red" : null,

        children: level1.subjects?.map((level2, index2) => {
          return {
            value: index1 + "l1" + index2 + "l2" + level2.title,
            label: level2.title,
            // className:
            //   index1 + "l1" + index2 + "l2" + level2.title === clicked.value
            //     ? "b-red"
            //     : null,
            children: level2.sub_subjects?.map((level3, index3) => {
              return {
                value:
                  index1 + "l1" + index2 + "l2" + index3 + "l3" + level3.title,
                label: level3.title,
                className:
                  index1 +
                    "l1" +
                    index2 +
                    "l2" +
                    index3 +
                    "l3" +
                    level3.title ===
                  clicked.value
                    ? "b-red"
                    : null,
                children: level2.subjects_3?.map((level4, index4) => {
                  return {
                    value:
                      index1 +
                      "l1" +
                      index2 +
                      "l2" +
                      index3 +
                      "l3" +
                      index4 +
                      "l4" +
                      level4.title,
                    label: level4.title,
                    children: level4.subjects_4?.map((level5, index5) => {
                      return {
                        value:
                          index1 +
                          "l1" +
                          index2 +
                          "l2" +
                          index3 +
                          "l3" +
                          index4 +
                          "l4" +
                          index5 +
                          "l5" +
                          level5.title,
                        label: level5.title,
                      };
                    }),
                  };
                }),
              };
            }),
          };
        }),
      };
    });
    setC(newc);
  }, [data, clicked]);

  useEffect(() => {
    if (!filterText) {
      setFilteredNodes(c);
      return;
    }
    setFilteredNodes(c.reduce(filterNodes, []));
  }, [filterText, c]);
  const onClick = (value) => {
    setClicked(value);
    dispatch(
      setSelectedNode({ node: { ...selectedNode, [section]: value.value } })
    );
  };

  useEffect(() => {
    const clickedValue = clicked.value;
    const filteredExpanded = expanded.filter((e) =>
      extractPosition(clickedValue).includes(extractPosition(e))
    );
    setExpanded(filteredExpanded);
  }, [clicked]);

  const filterNodes = (filtered, node) => {
    const children = (node.children || []).reduce(filterNodes, []);

    if (
      node.label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) >
        -1 ||
      children.length
    ) {
      filtered.push({ ...node, children });
    }

    return filtered;
  };
  return (
    <div className={classes.alphabet}>
      {/* <p className={classes.alphabet_title}>فهرست مطالب</p> */}
      <div>
        <Input
          className="w-full my-2"
          style={{ height: "48px" }}
          type="search"
          placeholder="جستجو در فهرست"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <CheckboxTree
          style={{
            overflow: "scroll",
            paddingBottom: "70px",
          }}
          nodes={filteredNodes}
          checked={checked}
          expanded={expanded}
          expandOnClick
          onCheck={(checkedData) => {
            setChecked(checkedData);
          }}
          onClick={onClick}
          onExpand={(expandedData) => {
            setExpanded(expandedData);
          }}
        />
      </div>
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
const getBGColor = (level) => (level === 1 ? "#eefff850" : "#eefff8");

export const TreeItem = ({
  children,
  level,
  label,
  className,
  onClick,
  open,
  flag,
  selected,
}) => {
  const [showChildren, setShowChildren] = useState(open);
  const ref = useRef();
  const [bgColor, setBgColor] = useState(null);

  useEffect(() => {
    setShowChildren(open);
  }, [flag]);

  return (
    <li
      className={` ${!children && "hover:bg-[#deffe8]"} cursor-pointer`}
      // onMouseEnter={() => setShowChildren(true)}
      // onMouseLeave={() => setShowChildren(false)}
      onClick={(e) => {
        if (children && !ref.current?.contains(e.target))
          setShowChildren(!showChildren);
        if (onClick) onClick();
      }}
      onMouseEnter={() => setBgColor("#deffe8")}
      onMouseLeave={() => setBgColor(null)}
      style={{
        // transition: "all 0.3s linear",
        paddingRight: "7%",
        color: showChildren && "var(--primary-color)",
        backgroundColor: selected
          ? "#beffc8"
          : !showChildren
          ? bgColor
          : children && showChildren && getBGColor(level),
        cursor: !children && "pointer",
      }}
    >
      <div
        className={`flex justify-start ${
          children ? "items-start" : "items-start"
        }`}
      >
        {children && (
          <div
            style={{
              width: "32px",
              height: "32px",
            }}
          >
            <BiChevronLeft
              style={{
                transition: "all 0.2s linear",
                transform: showChildren ? "rotate(-90deg)" : "",
                width: "32px",
                height: "32px",
              }}
            />
          </div>
        )}
        {!children && (
          <div
            style={{
              width: "22px",
              height: "22px",
              display: "block",
            }}
          >
            <BiFileBlank
              style={{
                width: "22px",
                height: "22px",
                marginTop: "4px",
                display: "block",
              }}
            />
          </div>
        )}

        <span
          className={` ${className}`}
          style={{
            marginRight: "8px",
          }}
        >
          {label}
        </span>
      </div>
      <div
        ref={ref}
        style={{
          // transition: `max-height 4s linear`,
          display: showChildren ? "block" : "none",
          // width: showChildren ? "100%" : "0%",
          // maxHeight: showChildren ? "8000px" : 0,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </li>
  );
};

export const MySummaryTree = ({ data, section, selectedNode }) => {
  const dispatch = useDispatch();
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filteredNodes, setFilteredNodes] = useState([]);
  const [clicked, setClicked] = useState({});
  const [c, setC] = useState([]);
  useEffect(() => {
    let newc = data.map((level1, index1) => {
      return {
        value: index1 + "l1" + level1.alphabet,
        label: level1.alphabet,
        // className:
        //   index1 + "l1" + level1.alphabet == clicked.value ? "b-red" : null,

        children: level1.subjects?.map((level2, index2) => {
          return {
            value: index1 + "l1" + index2 + "l2" + level2.title,
            label: level2.title,
            // className:
            //   index1 + "l1" + index2 + "l2" + level2.title === clicked.value
            //     ? "b-red"
            //     : null,
            children: level2.sub_subjects?.map((level3, index3) => {
              return {
                value:
                  index1 + "l1" + index2 + "l2" + index3 + "l3" + level3.title,
                label: level3.title,
                className:
                  index1 +
                    "l1" +
                    index2 +
                    "l2" +
                    index3 +
                    "l3" +
                    level3.title ===
                  clicked.value
                    ? "b-red"
                    : null,
                children: level2.subjects_3?.map((level4, index4) => {
                  return {
                    value:
                      index1 +
                      "l1" +
                      index2 +
                      "l2" +
                      index3 +
                      "l3" +
                      index4 +
                      "l4" +
                      level4.title,
                    label: level4.title,
                    children: level4.subjects_4?.map((level5, index5) => {
                      return {
                        value:
                          index1 +
                          "l1" +
                          index2 +
                          "l2" +
                          index3 +
                          "l3" +
                          index4 +
                          "l4" +
                          index5 +
                          "l5" +
                          level5.title,
                        label: level5.title,
                      };
                    }),
                  };
                }),
              };
            }),
          };
        }),
      };
    });
    setC(newc);
  }, [data, clicked]);

  useEffect(() => {
    if (
      c?.length > 0 &&
      !selectedNode[section] &&
      c[3]?.children[2]?.children[1]?.value
    ) {
      dispatch(
        setSelectedNode({
          node: {
            ...selectedNode,
            [section]: c[3]?.children[2]?.children[1]?.value,
          },
        })
      );
    }
  }, [c, selectedNode]);

  useEffect(() => {
    if (!filterText) {
      setFilteredNodes(c);
      return;
    }
    setFilteredNodes(c.reduce(filterNodes, []));
  }, [filterText, c]);

  const onClick = (value) => {
    setClicked(value);
    dispatch(
      setSelectedNode({ node: { ...selectedNode, [section]: value.value } })
    );
    dispatch(toggleTreeIsOpen());
  };

  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const clickedValue = clicked.value;
    const filteredExpanded = expanded.filter((e) =>
      extractPosition(clickedValue).includes(extractPosition(e))
    );
    setExpanded(filteredExpanded);
    setFlag(!flag);
  }, [clicked]);

  const filterNodes = (filtered, node) => {
    const children = (node.children || []).reduce(filterNodes, []);

    if (
      node.label.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) >
      -1
    ) {
      filtered.push(node);
    } else if (children.length) filtered.push({ ...node, children });

    return filtered;
  };

  const isOpen = (value) => {
    if (!value || !selectedNode[section]) return false;
    const valueTreeIndex = extractTreeIndex(value);
    const [lvl1, lvl2, lvl3] = valueTreeIndex;

    const selectedNodeValue = selectedNode[section];
    const nodeTreeIndex = extractTreeIndex(selectedNodeValue);
    const [lvl1Node, lvl2Node, lvl3Node] = nodeTreeIndex;

    if (lvl1 === lvl1Node && lvl2 === undefined && lvl3 === undefined)
      return true;
    if (lvl1 === lvl1Node && lvl2 === lvl2Node && lvl3 === undefined)
      return true;
    if (lvl1 === lvl1Node && lvl2 === lvl2Node && lvl3 === lvl3Node)
      return true;
    return false;
  };
  return (
    <div className={classes.alphabet}>
      <p style={{ fontSize: 18 }}>فهرست موضوعات</p>
      <Input
        className="w-full my-2"
        style={{ height: "48px" }}
        type="search"
        placeholder="جستجو در فهرست"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <ul>
        {filteredNodes?.map((node) => {
          return (
            <TreeItem
              label={node.label}
              level={1}
              open={isOpen(node.value)}
              flag={flag}
            >
              <ul>
                {node.children?.map((child) => {
                  return (
                    <TreeItem
                      label={child.label}
                      level={2}
                      open={isOpen(child.value)}
                      flag={flag}
                    >
                      <ul>
                        {child?.children?.map((item) => {
                          return (
                            <TreeItem
                              label={item.label}
                              level={3}
                              onClick={() => onClick(item)}
                              open={isOpen(item.value)}
                              flag={flag}
                              selected={selectedNode[section] === item.value}
                            />
                          );
                        })}
                      </ul>
                    </TreeItem>
                  );
                })}
              </ul>
            </TreeItem>
          );
        })}
      </ul>
    </div>
  );
};
