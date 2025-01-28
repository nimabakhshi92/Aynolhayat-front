import Input, { InputOld } from "../ui/input";
import classes from "../ui/dropdown/dropdown.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import { Autocomplete, createFilterOptions, createTheme, TextField } from "@mui/material";
import { removeArabicCharacters, removeTashkel } from "../../pages/NarrationWarehouseLT";


const filterOptions = createFilterOptions({
  ignoreAccents: true,
  ignoreCase: true,
  stringify: (option) => removeTashkel(removeArabicCharacters(option.title)),
});



export function InputWithSuggestionAutoCompleteWithDebounceBlur({
  style,
  placeholder,
  reference,
  className,
  suggestions,
  onPressEnter,
  onChange,
  value,
  onBlur,
  parentClassName,
  flag,
  status,
  textArea,
  debounceDependency,
  type,
  getOptionLabel
}) {
  const [matchedSuggesttions, setMatchedSuggestions] = useState(suggestions);
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const matchSearch = (e) => {
    // console.log(e.target.value);
    // console.log(
    //   suggestions.filter((item) => {
    //     return item?.includes(e.target.value);
    //   })
    // );
    if (!reference) {
      if (!value) return suggestions;
      return suggestions?.filter((item) => {
        return item?.includes(value);
      });
    }

    if (!reference?.current) return suggestions;
    const searchTerm = reference.current?.value;
    if (!searchTerm) return suggestions;
    return suggestions.filter((item) => item?.includes(searchTerm));
  };

  const suggestionsExist = matchedSuggesttions?.length > 0;
  const onMenuClick = async (item) => {
    if (reference) reference.current.value = item;
    if (reference && onChange) onChange();
    if (!reference && onChange && onPressEnter) {
      // await onChange({ target: { value: item } });
      await onPressEnter({ target: { value: item } });
    }
  };
  const mouseEntered = useRef(false);
  const suggestionsClicked = useRef(false);

  const [bgColor, setBGColor] = useState('')
  const ref = useRef(false)
  // useEffect(() => {
  //   if (ref?.current && flag) {
  //     ref.current.style.backgroundColor = 'var(--primary-color)'
  //     setTimeout(() => {
  //       ref.current.style.backgroundColor = 'white'
  //     }, 1000);
  //   }
  // }, [flag])
  // console.log(flag, status)
  useEffect(() => {
    // console.log(flag, status)
    if (flag) {
      if (status === 'isLoading') {
        setBGColor('var(--orange)')
      } else if (status === 'success') {
        setBGColor('var( --primary-color-light)')
        setTimeout(() => {
          setBGColor('white')
        }, 1000);
      } else if (status === 'error') {
        setBGColor('var(--error-color)')
        setTimeout(() => {
          setBGColor('white')
        }, 1000);
      }
    }
  }, [flag, status])

  const debouncedBlur = useMemo(() => debounce(onBlur || (() => { }), 1000), [debounceDependency])
  return (

    <div className={`relative ${parentClassName}`} ref={ref}
    >
      <Autocomplete
        filterOptions={filterOptions}
        disablePortal
        options={suggestions}
        renderInput={(params) => <TextField {...params}
          sx={{
            "& .MuiInputBase-root": {
              fontSize: "16px", // Input text size
              height: '40px',
              borderRadius: '7px',
              fontFamily: 'IRANSansWeb'
            },
          }}
        />}
        disableClearable
        onChange={(e, newValue) => onChange?.(e, newValue)}
        value={value}
        placeholder={placeholder}
        getOptionLabel={getOptionLabel}
        style={style}
      // className={className}
      // inputValue={value ?? ''}
      // onInputChange={onchange}
      />
    </div>
  );
}

