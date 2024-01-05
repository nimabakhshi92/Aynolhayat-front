import { useState } from "react";
import { Paper } from "./general/Paper";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
export const Pagination = ({ className, noOfPages, selected, setSelected }) => {
  return (
    <Paper
      className={`relative flex h-10 items-center justify-start gap-2 w-fit ${className}`}
      style={{
        zIndex: 2,
      }}
    >
      <BsChevronRight
        onClick={() => setSelected(selected > 1 ? selected - 1 : selected)}
        className="cursor-pointer"
      />
      {Array.from({ length: noOfPages }, (_, i) => i + 1).map((i) => {
        return (
          <span
            style={{
              backgroundColor:
                i === selected ? "var(--primary-color)" : "white",
              color: i === selected ? "white" : "var(--neutral-color-600)",
              cursor: "pointer",
              padding: "2px 12px",
              borderRadius: "7px",
            }}
            onClick={() => {
              setSelected(i);
            }}
          >
            {i}
          </span>
        );
      })}
      <BsChevronLeft
        className="cursor-pointer"
        onClick={() =>
          setSelected(selected < noOfPages ? selected + 1 : selected)
        }
      />
    </Paper>
  );
};
