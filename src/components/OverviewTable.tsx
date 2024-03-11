import React from 'react';
import * as d3 from 'd3';
import { useEffect, useState, useMemo } from 'react';

// Reference: https://www.youtube.com/watch?v=yQfK4sBz1Q8

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

interface OverviewTableProps {
    onSelectStudies1: (study: string, trialName: string) => void;
    onSelectStudies2: (study: string, trialName: string) => void;
    selectedStudies1: Record<string, string>;
    selectedStudies2: Record<string, string>;
}

// Currently, the TSV files are hardcoded, future work could include a way to dynamically fetch the TSV files
const tsvFiles = [
                    "EVDb_SimCaPlus_Ale0004", 
                    "EVDb_SimCaPlus_Ale0005", 
                    "EVDb_SimCaPlus_Mario0006", 
                    "EVDb_SimCaPlus_Mario0007"
                ]; 

const OverviewTable: React.FC<OverviewTableProps> = ({ onSelectStudies1, selectedStudies1, onSelectStudies2, selectedStudies2 }) => {
    const [trialsData, setTrialsData] = useState<TrialData[]>([]);
    const [sortConfig, setSortConfig] = useState<{key: keyof TrialData, direction: 'asc' | 'desc'} | null>(null);
    const [selectedEntry, setSelectedEntry] = useState<TrialData | null>(null);
    const [expandedEntries, setExpandedEntries] = useState<Record<string, boolean>>({});
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
    const [selectedEntries1, setSelectedEntries1] = useState<string[]>([]);
    const [selectedEntries2, setSelectedEntries2] = useState<string[]>([]);

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

    useEffect(() => {
        // Load selected entries from localStorage
        const storedEntries1 = localStorage.getItem('selectedEntries1');
        const storedEntries2 = localStorage.getItem('selectedEntries2');
        if (storedEntries1) {
            setSelectedEntries1(JSON.parse(storedEntries1));
        }
        if (storedEntries2) {
            setSelectedEntries2(JSON.parse(storedEntries2));
        }
    }, []);

    const handleStudySelectionStudy1 = (trialName: string) => {
        // Check if the clicked button is already selected
        if (selectedEntries1.includes(trialName)) {
            // Deselect the button
            setSelectedEntries1([]);
            onSelectStudies1('Study 1', '');
        } else {
            // Deselect previously selected entry for Study 1
            setSelectedEntries1([trialName]);
            onSelectStudies1('Study 1', trialName);
        }
        // Save selected entries to localStorage
        localStorage.setItem('selectedEntries1', JSON.stringify(selectedEntries1));
    };
    
    const handleStudySelectionStudy2 = (trialName: string) => {
        // Check if the clicked button is already selected
        if (selectedEntries2.includes(trialName)) {
            // Deselect the button
            setSelectedEntries2([]);
            onSelectStudies2('Study 2', ''); // Deselect
        } else {
            // Deselect previously selected entry for Study 2
            setSelectedEntries2([trialName]);
            onSelectStudies2('Study 2', trialName);
        }
        localStorage.setItem('selectedEntries2', JSON.stringify(selectedEntries2));
    };
    
    useEffect(() => {
        // Pass selected studies back to the parent component when they change
        onSelectStudies1('Study 1', selectedEntries1[0] || '');
        onSelectStudies2('Study 2', selectedEntries2[0] || '');
    }, [selectedEntries1, selectedEntries2]);

    // Save selected entries to localStorage when they change
    useEffect(() => {
        localStorage.setItem('selectedEntries1', JSON.stringify(selectedEntries1));
    }, [selectedEntries1]);
    
    useEffect(() => {
        localStorage.setItem('selectedEntries2', JSON.stringify(selectedEntries2));
    }, [selectedEntries2]);

    // Allows users to edit Rating and Comments, and save them to local storage
    const handleRatingChange = (trialName: string, value: number) => {
        // Ensure the rating value is within the range of 0 to 10
        value = Math.max(0, Math.min(value, 10));

        const updatedTrialsData = trialsData.map(trial => {
            if (trial.TRIAL_NAME === trialName) {
                return { ...trial, rating: value };
            }
            return trial;
        });
        setTrialsData(updatedTrialsData);
        localStorage.setItem('trialsData', JSON.stringify(updatedTrialsData));
    };
    
    const handleCommentChange = (trialName: string, value: string) => {
        const updatedTrialsData = trialsData.map(trial => {
            if (trial.TRIAL_NAME === trialName) {
                return { ...trial, comment: value };
            }
            return trial;
        });
        setTrialsData(updatedTrialsData);
        localStorage.setItem('trialsData', JSON.stringify(updatedTrialsData));
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

    // Expand or collapse the entry when the user clicks on it
    const handleSelectEntry = (entry: TrialData) => {
        if (selectedEntry && selectedEntry.TRIAL_NAME === entry.TRIAL_NAME) {
            setSelectedEntry(null); // Deselect if already selected
            setExpandedEntries({
                ...expandedEntries,
                [entry.TRIAL_NAME]: !expandedEntries[entry.TRIAL_NAME] // Toggle the expanded state
            });
        } else {
            setSelectedEntry(entry); // Select the entry
            setExpandedEntries({
                ...expandedEntries,
                [entry.TRIAL_NAME]: true // Expand the entry
            });
        }
    };

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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ml-1 ${arrowClass} transition-transform`}>
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
                    {/*<th scope="col" className="px-5 py-3 text-xs tracking-wider">
                        {renderSortFilter('NO_OF_CAMERAS', 'No. of Cameras', 'Number of Cameras used in the Trial')}
                    </th>*/}        
                    <th scope="col" className="px-5 py-3 text-xs tracking-wider">
                        {renderSortFilter('TIME_STAMP', 'Time Stamp', 'Time and Date of when the Trial was Captured')}
                    </th>
                    {/*<th scope="col" className="px-5 py-3 text-xs tracking-wider">
                        {renderSortFilter('DATA_INCLUDED', 'Data Included', 'What Data was Included in the Trial')}
                    </th>*/}    
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
                    <React.Fragment key={index}>
                    {/*<tr className={selectedEntry && selectedEntry.TRIAL_NAME === trial.TRIAL_NAME ? 'bg-gray-100' : ''}>*/}
                    <tr className={`${selectedEntry && selectedEntry.TRIAL_NAME === trial.TRIAL_NAME ? 'bg-gray-100' : ''} ${selectedEntries1.includes(trial.TRIAL_NAME) ? 'bg-blue-100' : selectedEntries2.includes(trial.TRIAL_NAME) ? 'bg-red-100' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <div className="flex items-center justify-center">
                                <button onClick={() => handleSelectEntry(trial)} className="flex items-center">
                                    {expandedEntries[trial.TRIAL_NAME] ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 transform rotate-180 transition-transform">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 0 1 1.414-1.414L10 8.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-2 transition-transform">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 0 1 1.414-1.414L10 8.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {trial.TRIAL_NAME}
                                </button>
                            </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">{trial.NO_OF_FRAMES}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">{trial.NO_OF_MARKERS}</td>
                        {/*<td className="px-4 py-4 whitespace-nowrap text-center">{trial.NO_OF_CAMERAS}</td>*/}
                        <td className="px-4 py-4 whitespace-nowrap text-center">{trial.TIME_STAMP}</td>
                        {/*<td className="px-6 py-4 whitespace-nowrap text-center">{trial.DATA_INCLUDED}</td>*/}
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                        <input
                            type="number"
                            min={0}
                            max={10}
                            value={trial.rating}
                            onChange={(e) => handleRatingChange(trial.TRIAL_NAME, parseInt(e.target.value))}
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
                                onChange={(e) => handleCommentChange(trial.TRIAL_NAME, e.target.value)}
                                className="w-full px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-200"
                                placeholder='Add notes...'
                                rows={2} // Set the number of visible rows when the textarea is not focused
                            />
                        </td>
                    </tr>
                    {selectedEntry && selectedEntry.TRIAL_NAME === trial.TRIAL_NAME && (
                        <tr key={`${trial.TRIAL_NAME}-details`}>
                            <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-center bg-gray-200 ">
                                <p><strong>Trial Name:</strong> {selectedEntry.TRIAL_NAME}</p>
                                <p><strong>Number of Cameras Used:</strong> {selectedEntry.NO_OF_CAMERAS}</p>
                                <p><strong>Data Included:</strong> {selectedEntry.DATA_INCLUDED}</p>
                                {/* Disable Button if it has already been selected as another study */}
                                <button
                                    onClick={() => handleStudySelectionStudy1(trial.TRIAL_NAME)}
                                    disabled={selectedEntries2.includes(trial.TRIAL_NAME)}
                                    className={`px-6 py-2 rounded-md mr-2 mt-2 ${selectedEntries1.includes(trial.TRIAL_NAME) ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                                >
                                    Select as Study #1
                                </button>
                                <button
                                    onClick={() => handleStudySelectionStudy2(trial.TRIAL_NAME)}
                                    disabled={selectedEntries1.includes(trial.TRIAL_NAME)}
                                    className={`px-6 py-2 rounded-md mr-2 mt-2 ${selectedEntries2.includes(trial.TRIAL_NAME) ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
                                >
                                    Select as Study #2
                                </button>
                            </td>
                        </tr>
                    )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default OverviewTable;