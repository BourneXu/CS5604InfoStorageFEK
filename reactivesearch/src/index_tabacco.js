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
import $ from 'jquery';

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

var advanced_query = ["Brands", "Witness_Name", "Person_Mentioned", "Organization_Mentioned", "Title", "Topic"];
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
    // generate custom query
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
                app="tobacco3"
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
                    console.log("object 1: %O", request);
                    var request_body = request.body.split('\n');
                    var searchText = document.getElementById("search-downshift-input").value;

                    var sT = searchText.split(":");

                    var body_preference = JSON.parse(request_body[0]);
                    var body_query = JSON.parse(request_body[1]);

                    if (sT.length > 1) //the first part of the split should be the relevant field(s)
                    {
                        var fields = sT[0].split("+");
                        var newfieldsinput = "[";
                        for (var i = 0; i < fields.length; i++) {
                            newfieldsinput = newfieldsinput + "\"" + fields[i] + "\"";
                            if (i != fields.length - 1) { newfieldsinput += ","; }

                        }
                        newfieldsinput += "]";
                        //Future work: make a function to put the fields in a variable instead of hardcoding
                        request.body = request.body.replace("[\"Brands\",\"Witness_Name\",\"Person_Mentioned\",\"Organization_Mentioned\",\"Title\",\"Topic\"]", newfieldsinput);
                    }



                    console.log("object 2: %O", request);

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
                            dataField={[
                                "Brands", "Witness_Name", "Person_Mentioned", "Organization_Mentioned", "Title", "Topic"
                            ]}
                            customQuery={
                                function (value, props) {
                                    return {
                                        query: {
                                            multi_match: {
                                                query: value,
                                                fields: advanced_query
                                            }
                                        }
                                    }
                                }
                            }
                            fieldWeights={[1, 3, 1, 1, 1, 1, 5, 1]}
                            fuzziness={0}
                            // debounce={100}
                            highlight={true}
                            highlightField={["Brands", "Witness_Name", "Person_Mentioned", "Organization_Mentioned", "Title"]}
                            placeholder="Search Tobacco"
                            title="Search for Tobacco"
                            react={{
                                and: ["Brands", "Witness_Name", "Person_Mentioned", "Organization_Mentioned", "Title"],
                                or: ["Topic"]
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
                                componentId="filter_Document_Date"
                                dataField="Document_Date"
                                title="Document_Date"
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
                                    and: ["filter_Document_Type", "filter_availablility", "filter_availablilitystatus", "filter_Brands", "search", "filter_Document_Date"]
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
                                                            onClick={() => this.onclick_book_title(res)}
                                                            dangerouslySetInnerHTML={{
                                                                __html: "<a href=\"" + res.url + "\">\n" + res.Title + "</a>",
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
                                                                            __html: res.Witness_Name,
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
                                                                Pub: {res.Document_Date}
                                                            </span>
                                                            <div
                                                                className="book-text"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: res.Case,
                                                                }}
                                                            />
                                                            <div
                                                                className="book-text"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: res.Organization_Mentioned,
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

    onclick_book_title = obj => {
        var data = {
            method: 'post',
            url: '/emitlogs',
            data: JSON.stringify(obj),
            contentType: "application/json",
            success: function () {
                console.log('success');
                //window.location.href = obj.url;
            }
        };
        $.post(data);
    };
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
