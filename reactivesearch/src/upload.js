/*
 * @Author: Chris
 * Created Date: 2019-11-11 17:19:58
 * -----
 * Last Modified: 2019-11-11 18:26:49
 * Modified By: Chris
 * -----
 * Copyright (c) 2019
 */
import React, { Component } from "react";
// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Our app
export class UploaderETD extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Set initial files, type 'local' means this is a file
            // that has already been uploaded to the server (see docs)
            // files: [
            //     {
            //         source: "upload.html",
            //         options: {
            //             type: "local"
            //         }
            //     }
            // ]
        };
    }

    handleInit() {
        console.log("FilePond instance has initialised", this.pond);
    }

    render() {
        return (
            <div className="upload">
                {/* Pass FilePond properties as attributes */}
                <a> Upload File to ETD </a>
                <FilePond
                    ref={ref => (this.pond = ref)}
                    files={this.state.files}
                    allowMultiple={true}
                    maxFiles={10}
                    instantUpload={false}
                    server="/api"
                    oninit={() => this.handleInit()}
                    onupdatefiles={fileItems => {
                        // Set currently active file objects to this.state
                        this.setState({
                            files: fileItems.map(fileItem => fileItem.file)
                        });
                    }}
                />
            </div>
        );
    }
}



export class UploaderTobacco extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Set initial files, type 'local' means this is a file
            // that has already been uploaded to the server (see docs)
            // files: [
            //     {
            //         source: "upload.html",
            //         options: {
            //             type: "local"
            //         }
            //     }
            // ]
        };
    }

    handleInit() {
        console.log("FilePond instance has initialised", this.pond);
    }

    render() {
        return (
            <div className="upload">
                {/* Pass FilePond properties as attributes */}
                <a> Upload File to Tobacco </a>
                <FilePond
                    ref={ref => (this.pond = ref)}
                    files={this.state.files}
                    allowMultiple={true}
                    instantUpload={false}
                    maxFiles={10}
                    server="/api"
                    oninit={() => this.handleInit()}
                    onupdatefiles={fileItems => {
                        // Set currently active file objects to this.state
                        this.setState({
                            files: fileItems.map(fileItem => fileItem.file)
                        });
                    }}
                />
            </div>
        );
    }
}


