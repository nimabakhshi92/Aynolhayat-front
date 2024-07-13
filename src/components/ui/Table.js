import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Stack } from "@mui/system";
import * as React from "react";


const TableHeaderCell = ({
    className,
    labelClassName,
    columnsMinWidth,
    label,
}) => {
    return (
        <TableCell
            className={`h-9 p-0 pr-1 pl-3 ${className}`}
            tabIndex={1}
            sx={{
                background: "white",
                border: "1px solid var(--neutral-color-400)",
                // borderRadius: "4px 4px 0px 0px",
                minWidth: columnsMinWidth,
            }}
        >
            <Box className="flex justify-between items-center">
                <span className={`t-iran-sans t-large text-gray-800 ${labelClassName} `}>
                    {label}
                </span>
            </Box>
        </TableCell>
    );
};

const TableHeader = ({
    headers,
    columnsMinWidth,
}) => {
    return (
        <TableHead>
            <TableRow>
                {headers?.map((header, index) => {
                    return (
                        <TableHeaderCell
                            key={index}
                            className={"cursor-pointer"}
                            labelClassName={
                                "sentence-case"
                            }
                            label={header.label}
                            columnsMinWidth={columnsMinWidth}
                            endAndromat={
                                null

                            }
                        />
                    );
                })}
            </TableRow>
        </TableHead>
    );
};

export const Table = (props) => {
    const {
        className,
        data,
        headers,
        columnsMinWidth,
        onRowClick,
        style
    } = props;

    return (
        <Wrapper className={className} rowRemoveable={false} style={style}>
            <MuiTable stickyHeader>
                <TableHeader
                    columnsMinWidth={columnsMinWidth}
                    headers={headers}
                />
                <TableBody>
                    {data?.map((row, index) => {
                        const handleRowClick = onRowClick ? () => onRowClick(row) : undefined
                        return (
                            <Row
                                {...props}
                                key={index}
                                row={row}
                                onRowClick={handleRowClick}
                            />
                        );

                    })}
                </TableBody>
            </MuiTable>
        </Wrapper>

    );
};


const Row = ({
    row,
    headers,
    onRowClick,
}) => {
    return (
        <TableRow
            className={`relative`}
            sx={{
                ":hover": {
                    background: "var(--blue-200)",

                },
                backgroundColor: 'white',

            }}
            onClick={onRowClick}
        >
            {headers?.map((header, index) => {
                const value = header.valueTransformation(row);
                return (
                    <CustomCell
                        key={index}
                        value={value}
                        valueClassName={`t-body-l body-cell 
                            }`}
                    />
                );
            })}
        </TableRow>
    );
};


const TextCellContent = ({
    value,
    onClick,
}) => {

    return (
        <>

            <span className="t-iran-sans t-semi-large">{value}</span>
        </>
    );
};

const TextCell = ({
    valueClassName,
    value,
    onClick,
}) => {
    return (
        <TableCell
            className={valueClassName}
            sx={{
                ":hover": {
                    backgroundColor: "var(--clr-secondary-blue-100)",
                },
            }}
        >
            <Stack spacing={3} className="w-full">
                <TextCellContent
                    value={value}
                    onClick={onClick}
                />
            </Stack>
        </TableCell>
    );
};

const CustomCell = (props) => {
    return <TextCell {...props} />;
}
const Wrapper = styled(TableContainer)(({ rowRemoveable }) => ({
    paddingLeft: `${rowRemoveable ? "42px" : ""}`,
    textAlign: "left",
    backgroundColor: 'white',
    ".body-cell": {
        borderRight: "1px solid var(--neutral-color-200)",
        borderLeft: "1px solid var(--neutral-color-200)",
        // padding: "0rem 1.6rem",
        height: "4.8rem",
    },
    ".text-center": {
        textAlign: "center",
    },
    ".opacity-zero": {
        opacity: 0,
    },
}));
