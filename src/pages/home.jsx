import React, { useEffect, useState, useMemo } from "react";
import { Select } from "antd";
import { CdnComboText } from "../animation/cdn-combo.jsx";
import { SearchHistory } from "../components/search-history.jsx";
import { Subject, debounceTime, filter, distinctUntilChanged } from "rxjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Home = () => {
  const [inputSubject$] = useState(new Subject());
  const navigate = useNavigate();
  /**
   * author:
   *    email: "dominic.tarr@gmail.com"
   *    name: "Dominic Tarr"
   *    url: "http://bit.ly/dominictarr"
   * date: "2018-10-14T01:24:01.629Z"
   * description: "rawStream.pipe(JSONStream.parse()).pipe(streamOfObjects)"
   * keywords: (6) ['json', 'stream', 'streaming', 'parser', 'async', 'parsing']
   * links: {npm: 'https://www.npmjs.com/package/JSONStream', homepage: 'http://github.com/dominictarr/JSONStream', repository: 'https://github.com/dominictarr/JSONStream', bugs: 'https://github.com/dominictarr/JSONStream/issues'}
   * maintainers: (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
   * name: "JSONStream"
   * publisher: {username: 'dominictarr', email: 'dominic.tarr@gmail.com'}
   * scope: "unscoped"
   * version: "1.3.5"
   */
  const [suggestList, setSuggestList] = useState([]);

  useEffect(() => {
    const subscriber = inputSubject$
      .pipe(
        //  filter empty
        filter((value) => value.trim().length > 0),
        // distinct
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value) => {
        axios({
          method: "get",
          url: `/api/search/suggestions?q=${value}`,
        }).then((res) => {
          setSuggestList(res.data);
        });
      });
    return () => {
      subscriber.unsubscribe();
    };
  }, []);

  const options = useMemo(() => {
    return suggestList.map((item) => {
      return {
        label: (
          <span>
            {item.name}
            {<span className="color-black-45">({item.description})</span>}
          </span>
        ),
        value: item.name,
      };
    });
  }, [suggestList]);

  return (
    <div className="padding-64">
      <CdnComboText />
      <Select
        onSearch={(value) => inputSubject$.next(value)}
        className="width-100-percent"
        showArrow={false}
        listHeight={800}
        placeholder="Text your package name"
        showSearch
        size="large"
        notFoundContent={null}
        options={options}
        onSelect={(value) => {
          // history.push(`/tree/${value}`);
          navigate(`/versions/${value}`);
        }}
      />
      <SearchHistory />
    </div>
  );
};
