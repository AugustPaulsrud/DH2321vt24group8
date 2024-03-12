import React from "react";
import ProfileCard from "../components/ProfileCard";
import Alexander from "./Alexander.png";
import August from "./August.png";
import Chloe from "./Chloe.png";
import Marcus from "./Marcus.png";
import William from "./William.png";

const AboutUs = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold my-4 text-center">About Us</h1>
            <div className="flex flex-wrap justify-center gap-4 my-10">
                <ProfileCard
                    name="Alexander Astély"
                    email="astely@kth.se"
                    role="Frontend Developer"
                    secondRole="Backend Developer"
                    linkedin="https://www.linkedin.com/in/johndoe/"
                    imageSrc={Alexander}
                />
                <ProfileCard
                    name="August Paulsrud"
                    email="augustpa@kth.se"
                    role="Frontend Developer"
                    secondRole="3D Modeler"
                    linkedin="https://www.linkedin.com/in/johndoe/"
                    imageSrc={August}
                />
                <ProfileCard
                    name="Ka Ching Hui Chloe"
                    email="kchui@kth.se"
                    role="Data Processing"
                    secondRole="UI/UX Designer"
                    linkedin="https://www.linkedin.com/in/johndoe/"
                    imageSrc={Chloe}
                />
                <ProfileCard
                    name="Ko Sung Kit Marcus"
                    email="ko2@kth.se"
                    role="Frontend Developer"
                    secondRole="UI/UX Designer"
                    linkedin="https://www.linkedin.com/in/johndoe/"
                    imageSrc={Marcus}
                />
                <ProfileCard
                    name="William Yap"
                    email="wkhyap@kth.se"
                    role="Backend Developer"
                    secondRole="Data Processing"
                    linkedin="https://www.linkedin.com/in/johndoe/"
                    imageSrc={William}
                />
            </div>
        </div>
    )
}

export default AboutUs;