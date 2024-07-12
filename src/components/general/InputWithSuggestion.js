import Input, { InputOld } from "../ui/input";
import classes from "../ui/dropdown/dropdown.module.css";
import { useEffect, useRef, useState } from "react";

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
    <div className={`relative ${parentClassName}`} ref={ref}>
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
          // if (openSuggestions) return;

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
              onClick={() => {
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
