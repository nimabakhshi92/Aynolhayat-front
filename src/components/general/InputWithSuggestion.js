import Input, { InputOld } from "../ui/input";
import classes from "../ui/dropdown/dropdown.module.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";


export function InputWithSuggestionWithDebounceBlur({
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
  debounceDependency
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
      <InputOld
        value={value}
        style={{ ...style, backgroundColor: bgColor }}
        reference={reference}
        className={className}
        type="text"
        placeholder={placeholder}
        onClick={() => setOpenSuggestions(true)}
        onMouseEnter={(e) => {
          mouseEntered.current = true;
          setTimeout(() => {
            if (mouseEntered.current) {
              setOpenSuggestions(true);
              setMatchedSuggestions(matchSearch(e));
            }
          }, 350);
        }}
        onMouseLeave={() => {
          mouseEntered.current = false;
          setOpenSuggestions(false);
        }}
        onBlur={(e) => {
          if (openSuggestions) return;
          // if (onBlur) onBlur(e);
        }}
        onChange={(e) => {
          setMatchedSuggestions(matchSearch(e));
          if (onChange) onChange(e);
          debouncedBlur(e)
        }}
        textArea={textArea}
      // onKeyDown={(event) => {
      //   if (event.key === "Enter" || event.key === "NumpadEnter") {
      //     if (onPressEnter && !onBlur) {
      //       if (reference) onPressEnter();
      //       else {
      //         onPressEnter(event);
      //       }
      //     }
      //     event.currentTarget.blur();
      //   }
      // }}
      />
      {openSuggestions && suggestionsExist && (
        <ul
          className={classes.menu}
          onMouseEnter={() => setOpenSuggestions(true)}
          onMouseLeave={() => setOpenSuggestions(false)}
        >
          {matchSearch()?.map((item, index) => (
            <li
              key={index}
              onClick={(e) => {
                setOpenSuggestions(false);
                // onMenuClick(item);
                onChange({ target: { value: item } })
                debouncedBlur({ target: { value: item } })
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


export default function InputWithSuggestion({
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
  flag
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
  useEffect(() => {
    if (flag) {
      setBGColor('var(--primary-color)')
      setTimeout(() => {
        setBGColor('white')
      }, 1000);
    }
  }, [flag])


  return (
    <div className={`relative ${parentClassName}`} ref={ref}
    >
      <InputOld
        value={value}
        style={{ ...style, backgroundColor: bgColor }}
        reference={reference}
        className={className}
        type="text"
        placeholder={placeholder}
        onClick={() => setOpenSuggestions(true)}
        onMouseEnter={(e) => {
          mouseEntered.current = true;
          setTimeout(() => {
            if (mouseEntered.current) {
              setOpenSuggestions(true);
              setMatchedSuggestions(matchSearch(e));
            }
          }, 350);
        }}
        onMouseLeave={() => {
          mouseEntered.current = false;
          setOpenSuggestions(false);
        }}
        onBlur={(e) => {
          if (openSuggestions) return;
          if (onBlur) onBlur(e);
        }}
        onChange={(e) => {
          setMatchedSuggestions(matchSearch(e));
          if (onChange) onChange(e);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === "NumpadEnter") {
            if (onPressEnter && !onBlur) {
              if (reference) onPressEnter();
              else {
                onPressEnter(event);
              }
            }
            event.currentTarget.blur();
          }
        }}
      />
      {openSuggestions && suggestionsExist && (
        <ul
          className={classes.menu}
          onMouseEnter={() => setOpenSuggestions(true)}
          onMouseLeave={() => setOpenSuggestions(false)}
        >
          {matchSearch()?.map((item, index) => (
            <li
              key={index}
              onClick={(e) => {
                setOpenSuggestions(false);
                onMenuClick(item);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
