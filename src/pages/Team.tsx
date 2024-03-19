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
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Learning Objectives Reached</h1>
                <div className="max-w-3xl mx-auto">
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis vel felis nec lacus eleifend feugiat. Integer at felis varius, ultrices elit eget, hendrerit lectus. Suspendisse potenti. Nulla facilisi. Vivamus porta dui et arcu efficitur congue. Nulla facilisi. Duis eget nisi magna. Fusce vitae magna pharetra, commodo mi a, efficitur ipsum. Nullam vel orci ac sem tempor scelerisque. Aliquam erat volutpat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nullam lobortis nibh non purus gravida, ac mollis sem auctor.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Nam congue, eros sit amet eleifend aliquet, neque purus faucibus mauris, et fermentum nisl metus et metus. Nullam quis risus libero. Sed nec augue eros. Praesent auctor laoreet lectus, vitae sodales metus viverra vel. Ut varius felis ac mi mattis, quis cursus sapien dapibus. Duis eget lacinia nulla. Vestibulum congue fermentum enim a finibus. Proin dictum bibendum felis nec bibendum. Praesent fermentum metus vel ligula suscipit, id molestie lectus lacinia. Sed luctus purus sit amet posuere aliquam. Nulla nec accumsan dolor.
                    </p>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Donec rhoncus eros eu nunc eleifend, vitae vestibulum enim congue. Proin blandit sapien eget nunc tempus, id bibendum nisi feugiat. Integer placerat, nisi ut vestibulum efficitur, mi dui fringilla nulla, ac malesuada orci leo eu turpis. Nullam ac purus eget diam fermentum tempor. Nam lacinia sapien a arcu gravida, in aliquet ante posuere. Vivamus vel tortor arcu. Suspendisse rhoncus quam eu elit varius tempus. Aliquam convallis tortor nec libero bibendum, vel egestas nulla vestibulum.
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