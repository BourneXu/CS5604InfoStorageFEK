import React from "react";
import ReactDOM from "react-dom";
import {
    ReactiveBase,
    ResultList,
    ReactiveList,
    MultiList,
    MultiDropdownList,
    DataSearch,
    SelectedFilters
} from "@appbaseio/reactivesearch";

import "./styles.css";

const { ResultListWrapper } = ReactiveList;

function App() {
    return (
        <ReactiveBase
            app="shakes"
            // credentials="egdxpZGTu:54c431d1-6a44-44b8-b84a-e46c4fed2de6"
            // url="http://2001.0468.0c80.6102.0001.7015.3ae5.9506.ip6.name/"
            url="http://localhost:9200/"
            theme={{
                typography: {
                    fontFamily:
                        '"Lato", "Open Sans", "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif'
                }
            }}
        >
            <div className="fek-searching">
                <div className="searchbar">
                    <DataSearch
                        componentId="search"
                        dataField={[
                            "text_entry",
                        ]}
                        // fieldWeights={[2, 1, 2, 1, 1, 1, 1, 1]}
                        fuzziness={0}
                        highlight={true}
                        highlightField={["text_entry"]}
                        placeholder="Search books"
                        title="Book Search"
                        react={{
                            and: ['text_entry'],
                        }}
                    />
                </div>

                <div className="container">
                    <div>
                        <MultiList
                            componentId="filter_play_name"
                            title="play_name"
                            dataField="play_name"
                            size={100}
                            className="filter"
                        />

                        <MultiDropdownList
                            componentId="filter_speech_number"
                            dataField="speech_number"
                            size={100}
                            title="speech_number"
                            className="filter"
                        />
                    </div>
                    <div>
                        <SelectedFilters
                            showClearAll={true}
                            clearAllLabel="Clear filters"
                        />
                        <ReactiveList
                            componentId="List"
                            dataField="text_entry"
                            pagination={true}
                            className="result"
                            size={10}
                            react={{
                                and: ["filter_play_name", "filter_speech_number", "search"]
                            }}
                            render={({ data }) => (
                                <ResultListWrapper>
                                    {data.map(res => (
                                        <ResultList key={res._id}>
                                            {/* <ResultList.Image src={res.speaker} /> */}
                                            <ResultList.Content>
                                                <ResultList.Title>
                                                    {res.play_name}
                                                </ResultList.Title>
                                                <ResultList.Description>
                                                    {res.text_entry}
                                                </ResultList.Description>
                                            </ResultList.Content>
                                        </ResultList>
                                    ))}
                                </ResultListWrapper>
                            )}
                        />
                    </div>
                </div>
            </div>
        </ReactiveBase >
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
