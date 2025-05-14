import { useEffect, useState, useRef } from "react";
import HeadlessTippy from "@tippyjs/react/headless";

import { IoIosCloseCircle } from "react-icons/io";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import SearchService from "../../../services/site/SearchService";
import SearchWrapper from "../searchWrapper/SearchWrapper";
import SearchItem from "../searchItem/SearchItem";
import styles from "./Search.module.scss";
import useDebounce from "../../../hooks/useDebounce";

function Search() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedValue = useDebounce(searchValue, 500);

  const inputRef = useRef();

  const handleClear = () => {
    setSearchValue("");
    inputRef.current.focus();
    setSearchResult([]);
  };

  const handleHideResult = () => {
    setShowResult(false);
  };

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }
    const fetchApi = async () => {
      setLoading(true);

      const result = await SearchService.searchAll(debouncedValue);
      setSearchResult(result);

      setLoading(false);
    };

    fetchApi();
  }, [debouncedValue]);

  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(" ")) {
      setSearchValue(searchValue);
    }
  };

  return (
    <div>
      <HeadlessTippy
        interactive
        visible={searchResult.length > 0 && showResult}
        render={(attrs) => (
          <div className={`${styles.search_result}`} tabIndex="-1" {...attrs}>
            <SearchWrapper>
              <h4 className={`${styles.search_title}`}>Accounts</h4>
              {searchResult.map((result) => {
                return <SearchItem key={result.id} data={result} />;
              })}
            </SearchWrapper>
          </div>
        )}
        onClickOutside={handleHideResult}
        content="Tìm kiếm"
        placement="bottom"
      >
        <div className={`${styles.search}`}>
          <input
            ref={inputRef}
            value={searchValue}
            placeholder="Tìm kiếm phim"
            spellCheck="false"
            onChange={handleChange}
            onFocus={() => setShowResult(true)}
          />
          {!!searchValue && !loading && (
            <button className={styles.clear} onClick={handleClear}>
              <IoIosCloseCircle />
            </button>
          )}
          {loading && <AiOutlineLoading3Quarters className={styles.loading} />}
          <button
            className={styles.search_btn}
            onMouseDown={(e) => e.preventDefault()}
          >
            <i class="bi bi-search fs-6"></i>
          </button>
        </div>
      </HeadlessTippy>
    </div>
  );
}

export default Search;
