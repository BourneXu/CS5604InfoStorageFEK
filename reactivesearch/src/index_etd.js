/*
 * @Author: Chris
 * Created Date: 2019-10-22 14:33:57
 * -----
 * Last Modified: 2019-11-05 15:28:11
 * Modified By: Chris
 * -----
 * Copyright (c) 2019
 */

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
    DateRange,
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

var advanced_query = ["degree-level", "contributor-department", "contributor-author",
    "contributor-committeechair", "contributor-committeecochair",
    "contributor-committeemember", "date-available", "date-issued",
    "degree-name", "description-abstract", "Author Email", "subject-none",
    "title-none", "type-none"];
// this.customQuery=function(gvalue) {
//   return {
//     "query": {
//       "simple_query_string" : {
//        "query": gvalue,
//        "fields": ["Title"]
//    }
//
//     }
//   }
// }

class Main extends Component {
    dateQuery(value) {
        let query = null;
        if (value) {
            query = [
                {
                    range: {
                        "Document_Date": {
                            gte: moment(value.start).format('YYYY-MM-DD'),
                            lte: moment(value.end).format('YYYY-MM-DD'),
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
                app="etd_metadata"
                // credentials="egdxpZGTu:54c431d1-6a44-44b8-b84a-e46c4fed2de6"
                url={config.get('elasticsearch')}
                theme={{
                    typography: {
                        fontFamily:
                            '"Lato", "Open Sans", "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Droid Sans", "Helvetica Neue", sans-serif'
                    }
                }}
                transformRequest={request => {
                    // Auto-suggestions start from 3rd characters
                    var request_body = request.body.split('\n');


                    // var searchText = document.getElementById("search-downshift-input").value;
                    // // console.log("The search bar says: "+ searchText);
                    // var sT = searchText.split(":");
                    // console.log("The length of the split is " + sT.length);
                    // if (sT.length > 1) //the first part of the split should be the relevant field
                    // {
                    //     advanced_query = ["title-none"];
                    // }
                    // else {   //if it isn't an advanced query then reset it to match all the fields
                    //     advanced_query = ["degree-level", "contributor-department", "contributor-author",
                    //         "contributor-committeechair", "contributor-committeecochair",
                    //         "contributor-committeemember",
                    //         "degree-name", "description-abstract", "Author Email", "subject-none",
                    //         "title-none", "type-none"];

                    // }

                    var body_preference = JSON.parse(request_body[0])
                    var body_query = JSON.parse(request_body[1])

                    // console.log("The body_query is: " + request_body[1]);

                    if (body_preference.preference === "search") {
                        if (body_query.query.bool.must[0].bool.must[0].bool.should[0].multi_match.query.length < 3) {
                            return null;
                        }
                    }

                    // Post logs
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
                            dataField={["contributor-department", "contributor-author",
                                "contributor-committeechair", "contributor-committeecochair",
                                "contributor-committeemember", "degree-name", "description-abstract", "Author Email", "subject-none",
                                "title-none"]}
                            // customQuery={
                            //     function (value, props) {
                            //         return {
                            //             query: {
                            //                 multi_match: {
                            //                     query: value,
                            //                     fields: advanced_query
                            //                 }
                            //             }
                            //         }
                            //     }
                            // }
                            fieldWeights={[1, 3, 3, 3, 1, 1, 1, 1, 1, 5, 1]}
                            fuzziness={0}
                            // debounce={100}
                            highlight={true}
                            placeholder="Search ETD"
                            title="Search for ETD"
                            react={{
                                and: ["contributor-department", "contributor-author",
                                    "contributor-committeechair", "contributor-committeecochair",
                                    "contributor-committeemember",
                                    "degree-name", "description-abstract", "Author Email", "subject-none", "title-none"]
                            }}
                        // renderNoSuggestion={() => (
                        //     <div>
                        //         No suggestions found
                        // </div>
                        // )}

                        />
                    </div>

                    <div className="container">
                        <div>
                            <MultiList
                                componentId="filter_type-none"
                                title="type-none"
                                dataField="type-none"
                                size={100}
                                className="filter"
                            />

                            <MultiDropdownList
                                componentId="filter_degree-level"
                                dataField="degree-level"
                                size={100}
                                title="degree-level"
                            />

                            <DateRange
                                componentId="filter_date-issued"
                                dataField="date-issued"
                                title="date-issued"
                                // customQuery={this.dateQuery}
                                focused={false}
                                autoFocusEnd={true}
                                numberOfMonths={1}
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
                                    and: ["filter_type-none", "filter_degree-level", "search", "filter_date-issued"]
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
                                                                __html: "<a href=\"" + "#" + "\">\n" + res["title-none"] + "</a>",
                                                            }}
                                                        />
                                                    </ResultList.Title>
                                                    <ResultList.Description>
                                                        <div className="flex column justify-space-between">
                                                            <div>
                                                                <div>
                                                                    by{' '}
                                                                    {/* <span className="authors-list">
                                                                        {res.Witness_Name}
                                                                    </span> */}
                                                                    <div
                                                                        className="authors-list"
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: res["contributor-author"] + ', ' + res["contributor-committeechair"] + ', ' + res["contributor-committeecochair"] + ', ' + res["contributor-committeemember"],
                                                                        }}
                                                                    />
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
                                                                Pub: {res["date-issued"]}
                                                            </span>
                                                            <div
                                                                className="book-text"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: res["description-abstract"],
                                                                }}
                                                            />
                                                            <div
                                                                className="book-text"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: res["subject-none"],
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
