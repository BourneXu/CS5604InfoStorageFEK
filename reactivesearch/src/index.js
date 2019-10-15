import React, { Component } from "react";
import ReactDOM from "react-dom";
import moment from 'moment';
import {
    ReactiveBase,
    ResultList,
    ReactiveList,
    MultiList,
    MultiDropdownList,
    DataSearch,
    SelectedFilters,
    DateRange
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

class Main extends Component {
    dateQuery(value) {
        let query = null;
        if (value) {
            query = [
                {
                    range: {
                        date_from: {
                            gte: moment(value.start).format('YYYYMMDD'),
                        },
                    },
                },
                {
                    range: {
                        date_to: {
                            lte: moment(value.end).format('YYYYMMDD'),
                        },
                    },
                },
            ];
        }
        return query ? { query: { bool: { must: query } } } : null;
    }

    render() {
        return (
            <ReactiveBase
                app="tobacco"
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
                                "Brands", "Witness_Name", "Person_Mentioned", "Organization_Mentioned", "Description", "Title"
                            ]}
                            // fieldWeights={[2, 1, 2, 1, 1, 1, 1, 1]}
                            fuzziness={0}
                            // debounce={100}
                            highlight={true}
                            highlightField={["Brands", "Witness_Name", "Person_Mentioned", "Organization_Mentioned", "Description", "Title"]}
                            placeholder="Search Tobacco"
                            title="Search for Tobacco"
                            react={{
                                and: ["Brands", "Witness_Name", "Person_Mentioned", "Organization_Mentioned", "Description", "Title"],
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
                                componentId="filter_Document_Type"
                                title="Document_Type"
                                dataField="Document_Type"
                                size={100}
                                className="filter"
                            />

                            <MultiList
                                componentId="filter_availablility"
                                dataField="availablility"
                                size={100}
                                title="availablility"
                                className="filter"
                            />

                            <MultiDropdownList
                                componentId="filter_availablilitystatus"
                                dataField="availablilitystatus"
                                size={100}
                                title="availablilitystatus"
                                className="filter"
                            />

                            <DateRange
                                componentId="filter_Date_Added_UCSF"
                                dataField="Date_Added_UCSF"
                                title="Date_Added_UCSF"
                                customQuery={this.dateQuery}
                                initialMonth={new Date('2019-10-01')}
                            />

                            <DateRange
                                componentId="filter_Document_Date"
                                dataField="Document_Date"
                                title="Document_Date"
                                customQuery={this.dateQuery}
                                initialMonth={new Date('2019-10-01')}
                            />

                        </div>

                        <div>
                            <SelectedFilters
                                showClearAll={true}
                                clearAllLabel="Clear filters"
                            />
                            <ReactiveList
                                componentId="List"
                                dataField="Title"
                                pagination={true}
                                className="result"
                                size={5}
                                loader="Loading Results.."
                                react={{
                                    and: ["filter_Document_Type", "filter_availablility", "filter_availablilitystatus", "search"]
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
                                                                __html: res.Title,
                                                            }}
                                                        />
                                                    </ResultList.Title>
                                                    <ResultList.Description>
                                                        <div className="flex column justify-space-between">
                                                            <div>
                                                                <div>
                                                                    by{' '}
                                                                    <span className="authors-list">
                                                                        {res.Witness_Name}
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
                                                            <span className="pub-year">
                                                                Pub {res.Document_Date}
                                                            </span>
                                                            <div
                                                                className="book-text"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: res.Case,
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
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
