import { Modal } from "@mui/material";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";

export const CustomModal = ({
  children,
  modalOpen,
  setModalOpen,
  width = 400,
  height = 400,
  className,
}) => {
  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div
        className={className}
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: width,
          height: height,
          backgroundColor: "white",
          padding: "5rem 2.4rem 4rem 2.4rem",
          boxShadow: "var(--box-shadow-elevation-400)",
          borderRadius: "7px",
          border: "transparent",
          position: "absolute",
          textAlign: "center",
        }}
      >
        {children}
        <AiOutlineClose
          className="absolute cursor-pointer right-2 top-2"
          onClick={() => setModalOpen(false)}
        />
      </div>
    </Modal>
  );
};

export const CustomModal2 = ({ open, setOpen, title, text, ...props }) => {
  if (open)
    return (
      <div
        className=" fixed top-1/2 left-1/2 "
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          transform: "translate(-50%, -50%)",
          zIndex: 101,
          ...props.style,
        }}
      >
        <div style={{}} className="relative p-3   w-100  ">
          <AiOutlineClose
            className="absolute cursor-pointer right-2 top-2"
            onClick={() => setOpen(false)}
          />
          <div
            className="flex gap-1  items-center"
            style={{
              flexDirection: "column",
              overflow: "scroll",
              maxHeight: "35vh",
            }}
          >
            {title && <h2>{title}</h2>}
            {text && <p className="mt-0">{text}</p>}
          </div>
        </div>
      </div>
    );
};
