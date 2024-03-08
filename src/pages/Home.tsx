import React from "react";
import research_image1 from "./research_image1.png";
import research_image2 from "./research_image2.png";
import research_image3 from "./research_image3.png";
import OverviewTable from "../components/OverviewTable";

const Home = () => {
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Progress</h1>
            <ul className="list-disc ml-6">
                <li>Researched and read papers on similar studies for inspiration on what visual structures, attempted to implement a few examples (with massive help from Alessandro). Some examples include...</li>
                <li>[1] Merriaux, Pierre, et al. "A study of vicon system positioning performance." Sensors 17.7 (2017): 1591.</li>
                <img src={research_image2} className="mt-4 mb-4"/>
                <img src={research_image3} className="mt-4 mb-4"/>
                <li>[2] Kim, Sunwook, and Maury A. Nussbaum. "Performance evaluation of a wearable inertial motion capture system for capturing physical exposures during manual material handling tasks." Ergonomics 56.2 (2013): 314-326.</li>
                <img src={research_image1} className="mt-4 mb-4"/>
                <li>Created Figma Prototypes of possible implementations and visual structures <a href="https://www.figma.com/file/ifiSF1PLdKRUAzwRWlCDxG/Visualization-DH2321?type=design&mode=design&t=8y3xmuCLSgHDaXiW-1" className="text-blue-500" target="_blank" rel="noopener noreferrer">(link)</a></li>
                <li>Data has been normalised and preprocessed, can dedicate more resources into frontend development</li>
                <li>Prototyped and deployed a barebones application to showcase how we can handle and understand the data</li>
                <li>Established development conventions and delegated tasks appropriately accordiing to experience and deadlines</li>
                <li>Met with Alessandro multiple times for feedback and questions regarding the project, as well as suggestions and recommendations on steps to take</li>
            </ul>
            <h1 className="text-3xl font-bold my-4">Challenges</h1>
            <ul className="list-disc ml-6">
                <li>Learning new technologies; conflicts between multiple libraries e.g. Plotly, React, D3.js</li>
                <li>Refining and selecting appropriate visualisations for our preprocessed data to balance ease of understanding and conveying information</li>
            </ul>
            <h1 className="text-3xl font-bold my-4">Future Plans</h1>
            <ul className="list-disc ml-6">
                <li>Complete implementations of our planned visual structures and features from Figma prototypes and meeting discussions</li>
                <li>Make the application mobile responsive to be portable</li>
                <li>Continue meeting with Alessandro to refine our project and ideas</li>
            </ul>
            <h1 className="text-3xl font-bold my-4">Overview</h1>
        </div>
    );
};

export default Home;