import React from 'react';
// import { FaLinkedin } from 'react-icons/fa';

interface ProfileCardProps {
    name: string;
    email: string;
    role: string;
    secondRole: string;
    linkedin: string;
    imageSrc: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, role, secondRole, linkedin, imageSrc }) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center hover:shadow-lg animate-fade-up">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                <div
                    className="w-full h-full bg-center bg-cover"
                    style={{ backgroundImage: `url(${imageSrc})` }}
                ></div>
            </div>
            <h2 className="text-lg text-blue-500 font-bold text-center">{name}</h2>
            <p className="text-gray-600 mb-6 text-center">{email}</p>
            <p className="text-gray-600 text-center">{role}</p>
            <p className="text-gray-600 mb-4 text-center">{secondRole}</p>
            {/* <div className="px-6 py-4">
                <a href={linkedin} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                    <FaLinkedin />
                </a>
            </div> */}
        </div>
    );
};

export default ProfileCard;
