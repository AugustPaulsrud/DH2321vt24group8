import React from 'react';
import * as d3 from 'd3';
import { useEffect, useState, useMemo } from 'react';

type TrialData = {
    TRIAL_NAME: string;
    NO_OF_FRAMES: number;
    NO_OF_CAMERAS: number;
    NO_OF_MARKERS: number;
    TIME_STAMP: string;
    DATA_INCLUDED: string;
    rating: number;
    comment: string;
};

// Currently, the TSV files are hardcoded, future work could include a way to dynamically fetch the TSV files
const tsvFiles = ["EVDa_SimCaTip_Ale0003", 
                    "EVDb_SimCaPlus_Ale0004", 
                    "EVDb_SimCaPlus_Ale0005", 
                    "EVDb_SimCaPlus_Mario0006", 
                    "EVDb_SimCaPlus_Mario0007"
                ]; 

const OverviewTable: React.FC = () => {
    const [trialsData, setTrialsData] = useState<TrialData[]>([]);
    const [sortConfig, setSortConfig] = useState<{key: keyof TrialData, direction: 'asc' | 'desc'} | null>(null);
    const [filterText, setFilterText] = useState<Record<keyof TrialData, string>>({
        TRIAL_NAME: '',
        NO_OF_FRAMES: '',
        NO_OF_CAMERAS: '',
        NO_OF_MARKERS: '',
        TIME_STAMP: '',
        DATA_INCLUDED: '',
        rating: '',
        comment: ''
    });

    useEffect(() => {
        // Fetch the trial data from the TSV files
        const fetchDataFromTSV = async () => {

            const allTrialsData: TrialData[] = [];
            const localStorageData = JSON.parse(localStorage.getItem('trialsData') || '[]') as TrialData[];

            for (const fileName of tsvFiles) {
                // Construct the file path and fetch the file text
                const filePath = `${process.env.PUBLIC_URL}/data/tsv/${fileName}.tsv`;
                const fileText = await d3.text(filePath);
                
                // Check if the trial data is already stored in local storage
                const storedTrialData = localStorageData.find(data => data.TRIAL_NAME === fileName);

                // Split the text into lines
                const lines = fileText.split('\n').filter(Boolean);

                const trialData: TrialData = {
                    TRIAL_NAME: fileName,
                    NO_OF_FRAMES: parseInt(lines[0].slice(13)),
                    NO_OF_CAMERAS: parseInt(lines[1].slice(13)),
                    NO_OF_MARKERS: parseInt(lines[2].slice(13)),
                    TIME_STAMP: lines[7].slice(10).replace(/\s\d+\.\d+$/, '').split('.')[0],
                    DATA_INCLUDED: lines[8].slice(13),
                    rating: storedTrialData ? storedTrialData.rating : 0,
                    comment: storedTrialData ? storedTrialData.comment : ""
                };

                allTrialsData.push(trialData);
            }

            setTrialsData(allTrialsData);
        };

        fetchDataFromTSV();
    }, []);

    // Allows users to edit Rating and Comments, and save them to local storage
    const handleRatingChange = (index: number, value: number) => {
        const newTrialsData = [...trialsData];
        newTrialsData[index].rating = value;
        setTrialsData(newTrialsData);
        localStorage.setItem('trialsData', JSON.stringify(newTrialsData));
    };
    
    const handleCommentChange = (index: number, value: string) => {
        const newTrialsData = [...trialsData];
        newTrialsData[index].comment = value;
        setTrialsData(newTrialsData);
        localStorage.setItem('trialsData', JSON.stringify(newTrialsData));
    };

    // Sort the data based on the column header clicked
    const handleSort = (key: keyof TrialData) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        let sortedData = [...trialsData];
        if (sortConfig !== null) {
            sortedData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortedData;
    }, [trialsData, sortConfig]);

    // Update the filterText state when the user types in the filter input
    const handleFilterChange = (column: keyof TrialData, value: string) => {
        setFilterText({ ...filterText, [column]: value });
    };

    // Filter the data based on the filterText
    const filteredData = useMemo(() => {
        return sortedData.filter((trial) =>
            Object.keys(filterText).every((key) => {
                if (filterText[key as keyof TrialData] === '') return true;
                return trial[key as keyof TrialData]
                    .toString()
                    .toLowerCase()
                    .includes(filterText[key as keyof TrialData].toLowerCase());
            })
        );
    }, [sortedData, filterText]);

    // Render the Sort Button and Filter Input for each column
    const renderSortFilter = (column: keyof TrialData, buttonText: string, tooltipText: string) => {
        let arrowClass = 'transform rotate-0'; // Default arrow direction

        // Check if this column is the current sorting column
        if (sortConfig && sortConfig.key === column) {
            arrowClass = sortConfig.direction === 'asc' ? 'transform rotate-180' : 'transform rotate-0';
        }

        return (
            <div className="flex flex-col items-center" title={tooltipText}>
                <button onClick={() => handleSort(column)} className="flex items-center font-medium text-gray-500 uppercase tracking-wider">
                    {buttonText}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ml-1 ${arrowClass}`}>
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 0 1 1.414-1.414L10 8.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
                <input 
                    type="text" 
                    placeholder={`Filter ${buttonText}`} 
                    className="mt-1 px-2 py-1 border border-gray-300 rounded-md"
                    value={filterText[column]}
                    onChange={(e) => handleFilterChange(column, e.target.value)}
                />
            </div>
        );
    };
    
    return (
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                {/* Column Header Elements*/}
                <tr>
                    <th scope="col" className="px-5 py-3 text-xs tracking-wider">
                        {renderSortFilter('TRIAL_NAME', 'Trial Name', 'Name of Trial with Person')}
                    </th>
                    <th scope="col" className="px-5 py-3 text-xs tracking-wider">
                        {renderSortFilter('NO_OF_FRAMES', 'No. of Frames', 'The Number of Frames Captured in the Trial, 200 Frames per Second')}
                    </th>
                    <th scope="col" className="px-5 py-3 text-xs tracking-wider">
                        {renderSortFilter('NO_OF_MARKERS', 'No. of Markers', 'Number of Markers includes Phantom and Catheter Tip Markers')}
                    </th>
                    <th scope="col" className="px-5 py-3 text-xs tracking-wider">
                        {renderSortFilter('NO_OF_CAMERAS', 'No. of Cameras', 'Number of Cameras used in the Trial')}
                    </th>
                    <th scope="col" className="px-5 py-3 text-xs tracking-wider">
                        {renderSortFilter('TIME_STAMP', 'Time Stamp', 'Time and Date of when the Trial was Captured')}
                    </th>
                    <th scope="col" className="px-5 py-3 text-xs tracking-wider">
                        {renderSortFilter('DATA_INCLUDED', 'Data Included', 'What Data was Included in the Trial')}
                    </th>
                    <th scope="col" className="px-5 py-3 text-xs tracking-wider">
                        {renderSortFilter('rating', 'Rating', 'User-defined Rating of the Trial')}
                    </th>
                    <th scope="col" className="px-5 py-3 text-xs tracking-wider">
                        {renderSortFilter('comment', 'Notes', 'User-defined Notes on the Trial')}
                    </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((trial, index) => (
                    // Table Row Elements
                    <tr key={index}>
                        <td className="px-4 py-4 whitespace-nowrap text-center">{trial.TRIAL_NAME}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">{trial.NO_OF_FRAMES}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">{trial.NO_OF_MARKERS}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">{trial.NO_OF_CAMERAS}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">{trial.TIME_STAMP}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">{trial.DATA_INCLUDED}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                        <input
                            type="number"
                            min={0}
                            max={10}
                            value={trial.rating}
                            onChange={(e) => handleRatingChange(index, parseInt(e.target.value))}
                            className={`w-14 h-8 text-center ${
                                trial.rating >= 8 ? 'bg-green-200' :
                                trial.rating >= 5 ? 'bg-orange-200' :
                                'bg-red-200'
                            }`}
                        />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <textarea
                                value={trial.comment}
                                onChange={(e) => handleCommentChange(index, e.target.value)}
                                className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-200"
                                placeholder='Add notes...'
                                rows={4} // Set the number of visible rows when the textarea is not focused
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default OverviewTable;