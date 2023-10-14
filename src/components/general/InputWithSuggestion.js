import Input from "../ui/input";
import classes from "../ui/dropdown/dropdown.module.css";
import { useState } from "react";

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
    if (!reference && onChange) {
      // await onChange({ target: { value: item } });
      await onPressEnter({ target: { value: item } });
    }
  };
  return (
    <div className={`relative ${parentClassName}`}>
      <Input
        value={value}
        style={style}
        reference={reference}
        className={className}
        type="text"
        placeholder={placeholder}
        onClick={() => setOpenSuggestions(true)}
        onMouseEnter={(e) => {
          setMatchedSuggestions(matchSearch(e));
          setOpenSuggestions(true);
        }}
        onMouseLeave={() => setOpenSuggestions(false)}
        onBlur={(e) => {
          if (onBlur) onBlur(e);
        }}
        onChange={(e) => {
          setMatchedSuggestions(matchSearch(e));
          if (onChange) onChange(e);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === "NumpadEnter") {
            if (reference) onPressEnter();
            else {
              onPressEnter(event);
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
