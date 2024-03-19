import React from "react";
import research_image1 from "./research_image1.png";
import research_image2 from "./research_image2.png";
import research_image3 from "./research_image3.png";

const About = () => {
    return (
        <div className="bg-gray-100 py-12 px-6 md:px-8 lg:px-16 xl:px-24">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4 animate-fade-up">Project Description</h1>
            <div className="max-w-3xl mx-auto">
                <p className="text-gray-600 text-center mb-8 my-4 animate-fade-up">
                    At 4DMotion, we are trying to tackle the issue of visualizing 4D motion data from external ventricular drainage (EVD) surgery simulations captured on a motion capture system by researchers at KTH. 
                    EVD is a risky procedure as improper placement of the catheter could cause intracranial haemorrhaging or permanent brain injuries to the patient. 
                    With this in mind, 4DMotion was created as a tool to allow researchers and future surgeons in training to visualize the procedures of EVD surgery by referencing data of previous surgical trials captured using motion capture.
                </p>
                <div className="flex justify-center items-center my-16 relative animate-fade-up">
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 animate-fade-up">How to Use</h1>
                <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/wND7qNWUTRc?si=mc7YbE8bymSj5vKo" 
                    title="YouTube video player" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="justify-center items-center mx-auto my-8"
                    >
                </iframe>
                <div className="flex justify-center items-center my-16 relative animate-fade-up">
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 animate-fade-up">Data</h1>
                <p className="text-gray-600 text-center mb-8 my-4 animate-fade-up">
                    The data for multiple procedures/trials from different settings (i.e. location and system to capture the data, amount of markers, etc.) was given to us from <b>Alessandro Iop</b>. We selected <b>5</b> different trials from <b>one</b> setting (the setting which had the least number of markers, for simplicity). The selected raw data can be found 
                    <a href="https://github.com/AugustPaulsrud/DH2321vt24group8/tree/main/public/data" className="text-blue-500"> here</a> and consists of tsv files. The raw data is parsed and downsampled to 500 points using the Largest Triangle Three Buckets algorithm with <a href="https://github.com/AugustPaulsrud/DH2321vt24group8/tree/main/public/data/notebooks" className="text-blue-500">the following scripts</a>. 
                    The subsampled data can be found <a href="https://github.com/AugustPaulsrud/DH2321vt24group8/tree/main/public/data/csv_downsampled" className="text-blue-500"> here</a> and the metadata <a href="https://github.com/AugustPaulsrud/DH2321vt24group8/blob/main/public/data/metadata.csv" className="text-blue-500"> here</a>. <br/><br/>
                    <b>Note:</b> The parsed data includes angle but this was not used by the visual mappings due to time constraints.
                </p>
                <div className="flex justify-center items-center my-16 relative animate-fade-up">
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 animate-fade-up">Credits/Acknowledgements</h1>
                <p className="text-gray-600 text-center mb-8 my-4 animate-fade-up">
                    We would like to acknowledge <b>Alessandro Iop</b> for proposing the idea, sharing the data, giving us feedback and supporting us throughout the project. 
                    We also want to thank <b>Mario Romero Vega</b> for taking time to review our visualization tool and giving us valuable feedback as well as inspiring us to learn more about information visualization. 
                    Lastly we want to thank <b>Henrik Garde</b> for letting us do a semi-structured interview and giving us a chance to test how well the visualization worked for generating insights as well as giving us important feedback. 
                </p>
                <div className="flex justify-center items-center my-16 relative animate-fade-up">
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 animate-fade-up">Addressing Feedback</h1>
                <p className="text-gray-600 text-left mb-8 my-4 animate-fade-up">
                    <ul className="list-disc ml-6">
                        <li className="p-2"><b>“If the first step is to select previously record session, why isn’t the list of those sessions on the top of the page?” / “If you need to select a dataset before you see the plots it should be nice to have the overview on top instead of the bottom”</b> - This suggestion has been incorporated into the final deliverable.</li>
                        <li className="p-2"><b>“Why is the visualisation tool so vertical? There's a bunch of empty space, huge sliders, and you need to scroll to see every feature.” / ”I feel theres too much info on 1 screen..especially with a vertical layout.Hmm ?”</b> - We have discussed and planned with Alessandro to convert the layout to using carousels to reduce verticality for the future, however, this cannot be incorporated for the final deliverable.</li>
                        <li className="p-2"><b>“Would be nice to overlay a threshold to quickly see if a session was outside the allowed threshold”</b> - Mario has briefly addressed this and has said that this implementation is outside the scope of this current project, although it is a good suggestion for the future.</li>
                        <li className="p-2"><b>“2. would it be useful to synchronise their times to the point of insertion?”</b> - Too much preprocessing to be done before the final deliverable deadline, although there are plans for the future to implement this by Alessandro.</li>
                        <li className="p-2"><b>“Can you show a cylinder marking the boundaries of a successful insertion?”</b> - We have plans for implementing something similar after handing off the project to Alessandro, but currently this cannot be done before the final deliverable</li>
                        <li className="p-2"><b>“Can you show aggregate data? Say, aggregate all of the trials from a participant?”</b> - You can use the Filtering in the Overview Table under the “Trial Name” column, and filter trials to only include the ones with the participant you are looking for. But for a page to only one participant, this is currently out of the scope of the project.</li>
                        <li className="p-2"><b>“A feature to filter out the marker positions before insertion might be helpful”</b> - This would require a lot of preprocessing to detect when the point of insertion has occurred, and as such, it will not be implemented for the final deliverable but is planned for the future.</li>
                        <li className="p-2"><b>“Great job! But would be nice to put values on the sliders”</b> - This has been implemented to a certain extent.</li>
                        <li className="p-2"><b>“Would be nice with a range of Color connected to time, so you can easily see in time when each dot is. Like a gradient over time”</b> - We have this feature already implemented before, Time is based on Opacity, the lower the Opacity the earlier in Time for the trial</li>
                        <li className="p-2"><b>“For the sliders, could be nice to also make it possible to enter the start/end values, not only adjust with the sliders”</b> - As we are using a third-party component, we cannot currently add this feature as we would have to change the source-code of that component, we have plans in the future of refactoring the sliders but this will not be finished by the deadline.</li>
                        <li className="p-2"><b>“Would be cool if displaying the skull would happen on both graphs, or maybe I don‘t see the use of having it only toggled on in one graph”</b> - This can already be done, you simply have to toggle the skull on for both graphs.</li>
                    </ul>
                </p>
                <div className="flex justify-center items-center my-16 relative animate-fade-up">
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                    <div className="h-2 w-2 bg-blue-900 rounded-full mx-2"></div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 animate-fade-up">Citations/References/Source</h1>
                <p className="text-gray-600 text-left mb-8 my-4 animate-fade-up">
                    <ul className="list-disc ml-6">
                        <li className="p-2">[1] Merriaux, Pierre, et al. "A study of vicon system positioning performance." Sensors 17.7 (2017): 1591.</li>
                        <li className="p-2">[2] Kim, Sunwook, and Maury A. Nussbaum. "Performance evaluation of a wearable inertial motion capture system for capturing physical exposures during manual material handling tasks." Ergonomics 56.2 (2013): 314-326.</li>
                        <li className="p-2">[3] Y. Tashiro and T. Saitoh, "A Study on Motion Visualization System Using Motion Capture Data," 17th International Conference on Artificial Reality and Telexistence (ICAT 2007), Esbjerg, Denmark, 2007, pp. 314-315, doi: 10.1109/ICAT.2007.53.</li>
                        <li className="p-2">[4] Wippich, M. (2023). Effects of Virtual Reality and Trajectory Visualization on Neurosurgical Training (Dissertation). Retrieved from https://urn.kb.se/resolve?urn=urn:nbn:se:kth:diva-343144</li>
                        <li className="p-2">[5] Steinarsson, S. (2013). Downsampling time series for visual representation (Doctoral dissertation).</li>
                        <li className="p-2">[6] D3.js. (2023). Data-Driven Documents (Version 7.0.0) [Software]. GitHub. https://github.com/d3/d3</li>
                        <li className="p-2">[7] Plotly Technologies Inc. (2023). Plotly.js (Version 2.0.0) [Software]. Plotly. https://plotly.com/javascript/ </li>
                        <li className="p-2">[8] Sanderson, G. (2018, October 26). Quaternions and 3D rotation, explained interactively. YouTube. https://www.youtube.com/watch?v=zjMuIxRvygQ&ab_channel=3Blue1Brown</li>
                        <li className="p-2">The source code of the project can be found <a href="https://github.com/AugustPaulsrud/DH2321vt24group8" className="text-blue-500">here</a>.</li>
                    </ul>
                </p>
            </div>
        </div>
    );
};

export default About;