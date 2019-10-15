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
import axios from "axios";
import "./styles.css";
import config from 'react-global-configuration';

const { ResultListWrapper } = ReactiveList;

// Global Configurations
config.set({
    elasticsearch: "http://localhost:9200/",
    base_uri: "http://0.0.0.0:3000"
});

const client = axios.create({
    baseURL: config.get("base_uri"),
    json: true
});



function App() {
    return (
        <ReactiveBase
            app="shakes"
            // credentials="egdxpZGTu:54c431d1-6a44-44b8-b84a-e46c4fed2de6"
            url={config.get('elasticsearch')}
            theme={{
                typography: {
                    fontFamily:
                        '"Lato", "Open Sans", "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif'
                }
            }}
            transformRequest={request => {
                // console.log(request);
                client({
                    method: 'post',
                    url: '/emitlogs',
                    data: JSON.stringify(request),
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                return request
            }} //TODO: replace with apiClient function to send request to back-end (Flask API)
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
                        // debounce={100}
                        highlight={true}
                        highlightField={["text_entry"]}
                        placeholder="Search ETD"
                        title="Search for ETD"
                        react={{
                            and: ['text_entry'],
                        }}
                        renderNoSuggestion={() => (
                            <div>
                                No suggestions found
                            </div>
                        )}

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
                            size={5}
                            loader="Loading Results.."
                            react={{
                                and: ["filter_play_name", "filter_speech_number", "search"]
                            }}
                            render={({ data }) => (
                                <ResultListWrapper>
                                    {data.map(res => (
                                        <ResultList key={res._id}>
                                            {/* <ResultList.Image src={res.image} /> */}
                                            <ResultList.Content>
                                                <ResultList.Title>
                                                    <div
                                                        className="book-title"
                                                        dangerouslySetInnerHTML={{
                                                            __html: res.play_name,
                                                        }}
                                                    />
                                                </ResultList.Title>
                                                <ResultList.Description>
                                                    <div className="flex column justify-space-between">
                                                        <div>
                                                            <div>
                                                                by{' '}
                                                                <span className="authors-list">
                                                                    {res.speaker}
                                                                </span>
                                                            </div>
                                                            {/* <div className="ratings-list flex align-center">
                                                                <span className="stars">
                                                                    {Array(res.average_rating_rounded)
                                                                        .fill('x')
                                                                        .map((
                                                                            res, // eslint-disable-line
                                                                            index,
                                                                        ) => (
                                                                                <i
                                                                                    className="fas fa-star"
                                                                                    key={index} // eslint-disable-line
                                                                                />
                                                                            ))}
                                                                </span>
                                                                <span className="avg-rating">
                                                                    ({res.average_rating} avg)
														        </span>
                                                            </div> */}
                                                        </div>
                                                        {/* <span className="pub-year">
                                                            Pub {res.original_publication_year}
                                                        </span> */}
                                                        <div
                                                            className="book-text"
                                                            dangerouslySetInnerHTML={{
                                                                __html: res.text_entry,
                                                            }}
                                                        />

                                                    </div>
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
