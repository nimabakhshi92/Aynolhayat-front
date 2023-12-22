import { Stack } from "@mui/material";

export const HeaderLT = () => {
  return (
    <header
      className="p-3 px-12 bg-white h-15 fixed w-full top-0 right-0"
      style={
        {
          // boxShadow: "10px",
        }
      }
    >
      <Stack
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
      >
        <h1> عین الحیاه</h1>
        {/* <div className="w-9 h-9 flex justify-center items-center rounded-[50%] bg-[green]">
          N
              </div> */}
        <span
          style={{
            border: "1px solid #aaa",
            padding: "2px",
            borderRadius: "6px",
          }}
        >
          ورود / ثبت نام
        </span>
      </Stack>
    </header>
  );
};
