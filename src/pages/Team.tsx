import React from "react";
import ProfileCard from "../components/ProfileCard";
import Alexander from "./Alexander.png";
import August from "./August.png";
import Chloe from "./Chloe.png";
import Marcus from "./Marcus.png";
import William from "./William.png";

const Team = () => {
    return (
        <div className="bg-gray-100 py-12 px-6 md:px-8 lg:px-16 xl:px-24 flex flex-row gap-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">Learning Objectives Reached</h1>
                <div className="max-w-3xl mx-auto">
                    <p className="text-lg font-bold mb-4">Throughout the project we have reached the following learning objectives in relation to the the intended learning outcomes: </p>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Design:
                        <ul className="list-disc ml-6">
                            <li>Learned how to use D3.js and Plotly.js to create visual mappings for effective visualisations.</li>
                            <li>Learned how to combine D3.js and Plotly.js with React.js in order to facilitate data and view transformations.</li>
                            <li>Learned how to facilitate actionable insights through our visualizations by using the visualization pipeline and methods learned in the course.</li>
                            <li>Practiced how to discuss the design and the visualization choices within the team and with the intended user on how to balance the user needs with time constraints.</li>
                            <li>Practiced concurrent collaboration on GitHub and how to collaborate on different features using Agile methodologies.</li>
                        </ul>
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Defend:
                        <ul className="list-disc ml-6">
                            <li>Although the prerequisite domain knowledge needed to generate insights from the visualization tool was high (since it is a brain surgery procedure and used motion capture, things that we all were unfamiliar with), we were able to defend our design choices by continuously having meetings with the intended user and by reading articles related to the topic.</li>
                        </ul>
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Critique:
                        <ul className="list-disc ml-6">
                            <li>We were able to criticize other visualization tools through domain theory. For example the default motion capture visualization tool that lacked interactive data transformations and did not facilitate much insight.</li>
                            <li>Learned how to critique our own visualizations through theories and practices learnt in the course. For example lack of direct manipulation.</li>
                        </ul>
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Evaluate:
                        <ul className="list-disc ml-6">
                            <li>Prepared, ran and analyzed a semi-structured interview with an external partner in order to  get criticism.</li>
                            <li>Evaluate feedback from different sources and integrate them into the visualization tool.</li>
                        </ul>
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Demonstrate:
                        <ul className="list-disc ml-6">
                            <li>Demonstrated our visualization systems to our intended users / domain experts (Alessandro, Mario and Henrik)</li>
                            <li>Demonstrated our visualization systems to novices (Through Hello World Demo and Final Presentation with students from the course)</li>
                            <li>Learned how to present a highly specific visualization to an audience lacking the domain expertise by simplifying explanations</li>
                        </ul>
                    </p>
                 </div>
            </div>
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">About Us</h1>
                <div className="flex flex-wrap justify-center gap-6 my-10">
                    <ProfileCard
                        name="Alexander Astély"
                        email="astely@kth.se"
                        role="Frontend Developer"
                        secondRole="Backend Developer"
                        linkedin="https://www.linkedin.com/in/alexander-ast%C3%A9ly-0b2a86154/"
                        imageSrc={Alexander}
                    />
                    <ProfileCard
                        name="August Paulsrud"
                        email="augustpa@kth.se"
                        role="Frontend Developer"
                        secondRole="3D Modeler"
                        linkedin="https://www.linkedin.com/in/august-paulsrud-a45405227/"
                        imageSrc={August}
                    />
                    <ProfileCard
                        name="Ka Ching Hui Chloe"
                        email="kchui@kth.se"
                        role="Data Processing"
                        secondRole="UI/UX Designer"
                        linkedin="https://www.linkedin.com/in/kachinghui/"
                        imageSrc={Chloe}
                    />
                    <ProfileCard
                        name="Ko Sung Kit Marcus"
                        email="ko2@kth.se"
                        role="Frontend Developer"
                        secondRole="UI/UX Designer"
                        linkedin="https://www.linkedin.com/in/marcus-ko-sung-kit/"
                        imageSrc={Marcus}
                    />
                    <ProfileCard
                        name="William Yap"
                        email="wkhyap@kth.se"
                        role="Backend Developer"
                        secondRole="Data Processing"
                        linkedin="https://www.linkedin.com/in/william-yap-06128a255/"
                        imageSrc={William}
                    />
                </div>
            </div>
        </div>
    )
}

export default Team;