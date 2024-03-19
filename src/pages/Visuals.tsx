import React, { useState , useEffect, useRef, useMemo} from "react";
import { VelocityChart } from "../components/VelocityPlot";
import Plot3D from "../components/Plot3D";
import MultiRangeSlider, { ChangeResult } from "multi-range-slider-react";
import OverviewTable from "../components/OverviewTable";
import * as d3 from 'd3';
import { Plot2D } from "../components/Plot2D";
import catimg from "./catraw3marked.png";
import skullimg from "./skull1labels.png";

// For changing perspecitves
const X_DIM = 0;
const Y_DIM = 1;
const Z_DIM = 2;
const TIME_DIM = 3;
const NO_DIM = -1;

const Visualisation = () => {
    const [dim1_3D_1, setDim1_3D_1] = useState<number>(X_DIM);
    const [dim2_3D_1, setDim2_3D_1] = useState<number>(Y_DIM);
    const [dim3_3D_1, setDim3_3D_1] = useState<number>(Z_DIM);
    const [dim4_3D_1, setDim4_3D_1] = useState<number>(TIME_DIM);

    const [dim1_3D_2, setDim1_3D_2] = useState<number>(X_DIM);
    const [dim2_3D_2, setDim2_3D_2] = useState<number>(Y_DIM);
    const [dim3_3D_2, setDim3_3D_2] = useState<number>(Z_DIM);
    const [dim4_3D_2, setDim4_3D_2] = useState<number>(TIME_DIM);

    const [dim1_2D_1, setDim1_2D_1] = useState<number>(X_DIM);
    const [dim2_2D_1, setDim2_2D_1] = useState<number>(Y_DIM);
    const [dim3_2D_1, setDim3_2D_1] = useState<number>(TIME_DIM);

    const [dim1_2D_2, setDim1_2D_2] = useState<number>(X_DIM);
    const [dim2_2D_2, setDim2_2D_2] = useState<number>(Y_DIM);
    const [dim3_2D_2, setDim3_2D_2] = useState<number>(TIME_DIM);

    const [upperX, setUpperX] = useState<number>(1000);
   const [lowerX, setLowerX] = useState<number>(-1000);
   const [upperY, setUpperY] = useState<number>(1000);
   const [lowerY, setLowerY] = useState<number>(-1000);
   const [upperZ, setUpperZ] = useState<number>(1000);
   const [lowerZ, setLowerZ] = useState<number>(-1000);

   const [syncTimeSliders, setSyncTimeSliders] = useState<boolean>(true);
   const [timeStart1, setTimeStart1] = useState<number>(0);
   const [timeEnd1, setTimeEnd1] = useState<number>(100);
   const [timeStart2, setTimeStart2] = useState<number>(0);
   const [timeEnd2, setTimeEnd2] = useState<number>(100);

   const [timeMin1, setTimeMin1] = useState<number>(0);
   const [timeMax1, setTimeMax1] = useState<number>(1);
   const [maxX1, setMaxX1] = useState<number>(1);
   const [maxY1, setMaxY1] = useState<number>(1);
   const [maxZ1, setMaxZ1] = useState<number>(1);
   const [minX1, setMinX1] = useState<number>(0);
   const [minY1, setMinY1] = useState<number>(0);
   const [minZ1, setMinZ1] = useState<number>(0);

   const [timeMin2, setTimeMin2] = useState<number>(0);
   const [timeMax2, setTimeMax2] = useState<number>(1);
   const [maxX2, setMaxX2] = useState<number>(1);
   const [maxY2, setMaxY2] = useState<number>(1);
   const [maxZ2, setMaxZ2] = useState<number>(1);
   const [minX2, setMinX2] = useState<number>(0);
   const [minY2, setMinY2] = useState<number>(0);
   const [minZ2, setMinZ2] = useState<number>(0);

    // State to track whether to render 2D or 3D graph
    const [is3D, setIs3D] = useState(true);

    // Initial state for selected CSV files as empty string
    const [selectedCsvFile1, setSelectedCsvFile1] = useState("");
    const [selectedCsvFile2, setSelectedCsvFile2] = useState("");

    type dataFormat = {
        time: number;
        x: number; 
        y: number;
        z: number;
        velocity: number;
        group: string;
    };

    /**
     * Sync data loading and marker selection
     */
    const [selectedMarkers, setSelectedMarkers] = useState<string[]>(["tip7"]);
    const [selectedStudies1, setSelectedStudies1] = useState<Record<string, string>>({});
    const [selectedStudies2, setSelectedStudies2] = useState<Record<string, string>>({});
    const [rawData1, setRawData1] = useState<any>([]);
    const [rawData2, setRawData2] = useState<any>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            if (selectedCsvFile1 !== "") {
                try {
                    const response = await d3.csv(`${process.env.PUBLIC_URL}/data/csv_downsampled/${selectedCsvFile1}.csv`);
                    setRawData1(response);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
    
        fetchData();
    }, [selectedCsvFile1]);

    useEffect(() => {
        const fetchData = async () => {
            if (selectedCsvFile2 !== "") {
                try {
                    const response = await d3.csv(`${process.env.PUBLIC_URL}/data/csv_downsampled/${selectedCsvFile2}.csv`);
                    setRawData2(response);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
    
        fetchData();
    }, [selectedCsvFile2]);
    
    const parsedData1: dataFormat[] = useMemo(() => {
        return rawData1.map((d: any) => ({
            time: +d.TIME,
            x: +d.X,
            y: +d.Y,
            z: +d.Z,
            velocity: +d.VELOCITY,
            group: d.MARKER_NR
        }));
    }, [rawData1]);

    const parsedData2: dataFormat[] = useMemo(() => {
        return rawData2.map((d: any) => ({
            time: +d.TIME,
            x: +d.X,
            y: +d.Y,
            z: +d.Z,
            velocity: +d.VELOCITY,
            group: d.MARKER_NR
        }));
    }, [rawData2]);

    /**
     * Set upper and lower bounds
     * for sliders
     */
    // useEffect(() => {
    //     d3.max(parsedData1, (d) => d.time) || 400;
    // }, [parsedData1]);
    useEffect(() => {
        setMaxX1(d3.max(parsedData1, (d) => d.x) || 1);
        setMaxY1(d3.max(parsedData1, (d) => d.y) || 1);
        setMaxZ1(d3.max(parsedData1, (d) => d.z) || 1);
        setMinX1(d3.min(parsedData1, (d) => d.x) || 0);
        setMinY1(d3.min(parsedData1, (d) => d.y) || 0);
        setMinZ1(d3.min(parsedData1, (d) => d.z) || 0);
        
        setTimeMax1(d3.max(parsedData1, (d) => d.time) || 1);
        setTimeMin1(d3.min(parsedData1, (d) => d.time) || 0);

        // Reset sliders when data source is changed
        setLowerX(-1000);
        setUpperX(1000);
        setLowerY(-1000);
        setUpperY(1000);
        setLowerZ(-1000);
        setUpperZ(1000);
    }, [parsedData1]);

    useEffect(() => {
        setMaxX2(d3.max(parsedData2, (d) => d.x) || 1);
        setMaxY2(d3.max(parsedData2, (d) => d.y) || 1);
        setMaxZ2(d3.max(parsedData2, (d) => d.z) || 1);
        setMinX2(d3.min(parsedData2, (d) => d.x) || 0);
        setMinY2(d3.min(parsedData2, (d) => d.y) || 0);
        setMinZ2(d3.min(parsedData2, (d) => d.z) || 0);

        setTimeMax2(d3.max(parsedData2, (d) => d.time) || 1);
        setTimeMin2(d3.min(parsedData2, (d) => d.time) || 0);

        // Reset sliders when data source is changed
        setLowerX(-1000);
        setUpperX(1000);
        setLowerY(-1000);
        setUpperY(1000);
        setLowerZ(-1000);
        setUpperZ(1000);
    }, [parsedData2]);

    const filteredData1: dataFormat[] = useMemo(() => {
        return parsedData1.filter((d) => selectedMarkers.includes(d.group))
        .filter((d) => d.time >= timeStart1 && d.time <= timeEnd1)
        .filter((d) => d.x >= lowerX && d.x <= upperX)
        .filter((d) => d.y >= lowerY && d.y <= upperY)
        .filter((d) => d.z >= lowerZ && d.z <= upperZ);
    }, [parsedData1,
        upperX, upperY, upperZ, 
        lowerX, lowerY, lowerZ, 
        timeStart1, timeEnd1, 
        selectedMarkers]);
    
    const filteredData2: dataFormat[] = useMemo(() => {
        return parsedData2.filter((d) => selectedMarkers.includes(d.group))
        .filter((d) => d.time >= timeStart2 && d.time <= timeEnd2)
        .filter((d) => d.x >= lowerX && d.x <= upperX)
        .filter((d) => d.y >= lowerY && d.y <= upperY)
        .filter((d) => d.z >= lowerZ && d.z <= upperZ);
    }, [parsedData2,
        upperX, upperY, upperZ, 
        lowerX, lowerY, lowerZ, 
        timeStart2, timeEnd2, 
        selectedMarkers]);

    const allGroups: string[] = useMemo(() => {
        const groups1 = Array.from(new Set(parsedData1.map((d: any) => d.group)));
        const groups2 = Array.from(new Set(parsedData2.map((d: any) => d.group)));
        return Array.from(new Set(groups1.concat(groups2)));
    }, [parsedData1, parsedData2]);

    const colorScale = useMemo(() => {
        return d3
        .scaleOrdinal<string>()
        .domain(allGroups)
        .range(["#800000", "#f032e6", "#e6194b", "#f58231", "#ffe119", "#fabed4", "#9a6324", "#3cb44b", "#000000", "#42d4f4", "#000075"]);
    }, [allGroups]);

    const handleGroupChange = (selectedMarker: string) => {
        // Check if the group is already selected
        if (selectedMarkers.includes(selectedMarker)) {
          // If yes, remove it from the selected groups
          setSelectedMarkers(selectedMarkers.filter(group => group !== selectedMarker));
        } else {
          // If no, add it to the selected groups
          setSelectedMarkers([...selectedMarkers, selectedMarker]);
        }
    };

    const selectAllMarkers = () => {
        //setIs3D(!is3D); // Toggle between 2D and 3D graphs
        setSelectedMarkers(allGroups);
        
    };
    const deselectAllMarkers = () => {
        //setIs3D(!is3D); // Toggle between 2D and 3D graphs
        setSelectedMarkers([]);
    };
    
    // Placeholder Code for dynamically retrieving CSV files from server
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(`/data/csv/`);
    //             const fileNames = await response.text(); // Ensure fileNames is of type string
    //             const filesArray = fileNames.split('\n').filter(name => name.trim() !== ''); // Split by newline and filter out empty strings
    //             setCsvFiles(filesArray);
    //         } catch (error) {
    //             console.error('Error fetching CSV files:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // Add setSelectedStudies function
    const handleSelectStudies1 = (study: string, trialName: string) => {
        const updatedSelectedStudies1 = { ...selectedStudies1 };

        // Check if the selected study is already selected in Study 2
        const study2Trials = selectedStudies2[trialName];
        if (study2Trials === 'Study 2') {
            return;
        }
    
        // Update selected studies for Study 1
        if (updatedSelectedStudies1[trialName] === study) {
            delete updatedSelectedStudies1[trialName];
        } else {
            updatedSelectedStudies1[trialName] = study;
            // Deselect the initial Study 1 if another Study 1 is selected
            for (const key in updatedSelectedStudies1) {
                if (updatedSelectedStudies1.hasOwnProperty(key) && updatedSelectedStudies1[key] === 'Study 1' && key !== trialName) {
                    delete updatedSelectedStudies1[key];
                    break; // Stop after deselecting the first occurrence of Study 1
                }
            }
        }
        setSelectedStudies1(updatedSelectedStudies1);
    
        // Update selected CSV file for Study 1
        if (study === 'Study 1') {
            setSelectedCsvFile1(trialName);
        }
    };
    
    const handleSelectStudiesStudy2 = (study: string, trialName: string) => {
        const updatedSelectedStudies2 = { ...selectedStudies2 };

        // Check if the selected study is already selected in Study 1
        const study1Trials = selectedStudies1[trialName];
        if (study1Trials === 'Study 1') {
            return;
        }
    
        // Update selected studies for Study 2
        if (updatedSelectedStudies2[trialName] === study) {
            delete updatedSelectedStudies2[trialName];
        } else {
            updatedSelectedStudies2[trialName] = study;
            // Deselect the initial Study 2 if another Study 2 is selected
            for (const key in updatedSelectedStudies2) {
                if (updatedSelectedStudies2.hasOwnProperty(key) && updatedSelectedStudies2[key] === 'Study 2' && key !== trialName) {
                    delete updatedSelectedStudies2[key];
                    break; // Stop after deselecting the first occurrence of Study 2
                }
            }
        }
        setSelectedStudies2(updatedSelectedStudies2);
    
        // Update selected CSV file for Study 2
        if (study === 'Study 2') {
            setSelectedCsvFile2(trialName);
        }
    };

    const [isImageVisible, setIsImageVisible] = useState(false);

    const toggleImageVisibility = () => {
        setIsImageVisible(prevState => !prevState);
    };
    
    return (
        <div className="flex flex-col w-full pt-4 bg-gray-100">
            <div className="flex space-x-4 w-full mt-4 justify-center items-center">
                <button
                    className={`px-4 py-2 rounded-md ${is3D ? 'bg-gray-300' : 'bg-blue-900 text-white'}`}
                    onClick={() => setIs3D(false)}
                >
                    Show 2D Graph
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${is3D ? 'bg-blue-900 text-white' : 'bg-gray-300'}`}
                    onClick={() => setIs3D(true)}
                >
                    Show 3D Graph
                </button>
            </div>
            <div className="mb-4 mt-10 animate-fade-up">
                <div className="flex gap-5 justify-center">
                    <div className="rounded-lg border border-gray-300 p-8 shadow-md bg-white">
                        <div className="flex flex-col items-center">
                            <div className="mb-4">
                                <label className="block mb-4 font-bold">Select Markers:</label>
                                <div className="mb-6">
                                    <button className={`px-4 py-2 rounded-md ${(selectedMarkers.length === allGroups.length) ? 'bg-blue-900 text-white' : 'bg-gray-300 text-black' } mr-4`} onClick={() => selectAllMarkers()}>
                                        Select All
                                    </button>
                                    <button className={`px-4 py-2 rounded-md ${(selectedMarkers.length === 0) ? 'bg-blue-900 text-white' : 'bg-gray-300 text-black' } mr-4`} onClick={() => deselectAllMarkers()}>
                                        Deselect All
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {allGroups.map((group: any) => (
                                        <div key={group} className="flex items-center">
                                            <label className="flex mt-4gfe items-center">
                                                <input 
                                                    type="checkbox"
                                                    checked={selectedMarkers.includes(group)}
                                                    onChange={() => handleGroupChange(group)}
                                                    className="form-checkbox h-5 w-5 text-indigo-600"
                                                />
                                                <span className="ml-2 text-gray-700" style={{color: colorScale(group)}}>{group}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center flex-col">
                        <div className="relative ml-4 ">
                            {isImageVisible && (
                                <img src={catimg} alt="Catheter with markers" className="object-scale-down h-80 rounded-md" />
                            )}
                            
                        </div>
                        <div className="relative ml-4">
                            {isImageVisible && (
                                <img src={skullimg} alt="Skull  with markers" className="object-scale-down h-80 rounded-md" />
                            )}
                            
                        </div>
                        <div className="flex justify-center m-4">
                            <button onClick={toggleImageVisibility} className={` p-2 bg-blue-900 text-white rounded-lg focus:outline-none ${isImageVisible ? '' : 'mb-24'}`}>
                                {isImageVisible ? 'Hide Marker Reference' : 'Show Marker Reference'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            { is3D ? 
            ( // 3D Graph
                <div className="flex flex-col md:flex-row w-full justify-center items-center animate-fade-up">
                    <div className="md:mr-5 rounded-lg border border-gray-300 pt-6 px-6 bg-white shadow-md my-10 hover:shadow-lg animate-fade-up">
                        <h2 className="text-xl font-bold mb-4 text-blue-900">{`Study #1: ${selectedCsvFile1}`}</h2>
                        {/* This can probably be done in a cleaner way */}
                        {/* Start of Change perspective */}
                        <div className="flex w-full pt-4">
                            <p className="text-s font-bold mt-1 mr-2">Axis 1: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim1_3D_1(Number(e.target.value))}
                                value={dim1_3D_1}
                            >
                                <option key={0} value={X_DIM}>X</option>
                                <option key={1} value={Y_DIM}>Y</option>
                                <option key={2} value={Z_DIM}>Z</option>
                                <option key={3} value={TIME_DIM}>TIME</option>
                            </select>

                            <p className="text-s font-bold mt-1 mx-2">Axis 2: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim2_3D_1(Number(e.target.value))}
                                value={dim2_3D_1}
                            >
                                <option key={0} value={X_DIM}>X</option>
                                <option key={1} value={Y_DIM}>Y</option>
                                <option key={2} value={Z_DIM}>Z</option>
                                <option key={3} value={TIME_DIM}>TIME</option>
                            </select>

                            <p className="text-s font-bold mt-1 mx-2">Axis 3: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim3_3D_1(Number(e.target.value))}
                                value={dim3_3D_1}
                            >
                                <option key={0} value={X_DIM}>X</option>
                                <option key={1} value={Y_DIM}>Y</option>
                                <option key={2} value={Z_DIM}>Z</option>
                                <option key={3} value={TIME_DIM}>TIME</option>
                            </select>

                            <p className="text-s font-bold mt-1 mx-2">Color: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim4_3D_1(Number(e.target.value))}
                                value={dim4_3D_1}
                            >
                                <option key={0} value={TIME_DIM}>TIME</option>
                                <option key={1} value={NO_DIM}>SOLID</option>
                            </select>
                        </div>
                        {/* End of Change perspective */}
                        <Plot3D 
                            data={filteredData1} 
                            axis1={dim1_3D_1} 
                            axis2={dim2_3D_1} 
                            axis3={dim3_3D_1} 
                            colorAxis={dim4_3D_1} 
                            colorScale={colorScale} 
                            selectedMarkers={selectedMarkers} 
                            allMarkerGroups={allGroups} 
                            width={600} 
                            height={700} 
                            csv_file={selectedCsvFile1} 
                            timeStart={timeStart1} 
                            timeEnd={timeEnd1} 
                            timeMax={timeMax1} 
                            timeMin={timeMin1} 
                        /> 
                    </div>
                    <div className="md:ml-5 relative rounded-lg border bg-white border-gray-300 pt-6 px-6 shadow-md my-10 hover:shadow-lg animate-fade-up">
                        <h2 className="text-xl font-bold mb-4 text-blue-900">{`Study #2: ${selectedCsvFile2}`}</h2>
                        {/* This can probably be done in a cleaner way */}
                        {/* Start of Change perspective */}
                        <div className="flex w-full pt-4">
                            <p className="text-s font-bold mt-1 mr-2">Axis 1: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim1_3D_2(Number(e.target.value))}
                                value={dim1_3D_2}
                            >
                                <option key={0} value={X_DIM}>X</option>
                                <option key={1} value={Y_DIM}>Y</option>
                                <option key={2} value={Z_DIM}>Z</option>
                                <option key={3} value={TIME_DIM}>TIME</option>
                            </select>

                            <p className="text-s font-bold mt-1 mx-2">Axis 2: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim2_3D_2(Number(e.target.value))}
                                value={dim2_3D_2}
                            >
                                <option key={0} value={X_DIM}>X</option>
                                <option key={1} value={Y_DIM}>Y</option>
                                <option key={2} value={Z_DIM}>Z</option>
                                <option key={3} value={TIME_DIM}>TIME</option>
                            </select>

                            <p className="text-s font-bold mt-1 mx-2">Axis 3: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim3_3D_2(Number(e.target.value))}
                                value={dim3_3D_2}
                            >
                                <option key={0} value={X_DIM}>X</option>
                                <option key={1} value={Y_DIM}>Y</option>
                                <option key={2} value={Z_DIM}>Z</option>
                                <option key={3} value={TIME_DIM}>TIME</option>
                            </select>

                            <p className="text-s font-bold mt-1 mx-2">Color: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim4_3D_2(Number(e.target.value))}
                                value={dim4_3D_2}
                            >
                                <option key={0} value={TIME_DIM}>TIME</option>
                                <option key={1} value={NO_DIM}>SOLID</option>
                            </select>
                        </div>
                        {/* End of Change perspective */}
                        <Plot3D 
                            data={filteredData2} 
                            axis1={dim1_3D_2} 
                            axis2={dim2_3D_2} 
                            axis3={dim3_3D_2} 
                            colorAxis={dim4_3D_2} 
                            colorScale={colorScale} 
                            selectedMarkers={selectedMarkers} 
                            allMarkerGroups={allGroups} 
                            width={600} 
                            height={700} 
                            csv_file={selectedCsvFile2} 
                            timeStart={timeStart2} 
                            timeEnd={timeEnd2} 
                            timeMax={timeMax1} 
                            timeMin={timeMin1} 
                        /> 
                    </div>
                </div>
            ) : 
            ( // 2D Graph
                <div className="flex flex-col md:flex-row w-full justify-center items-center animate-fade-up">
                    <div className="md:mr-5 relative rounded-lg border bg-white border-gray-300 p-6 shadow-md my-10 hover:shadow-lg animate-fade-up">
                        <h2 className="text-xl font-bold mb-4 text-blue-900">{`Study #1: ${selectedCsvFile1}`}</h2>
                        {/* <ScatterplotSimple width={600} height={600} csv_file={selectedCsvFile1} upperX={upperX} lowerX={lowerX} upperY={upperY} lowerY={lowerY} timeStart={timeStart} timeEnd={timeEnd} timeMax={timeMax} /> */}

                        {/* This can probably be done in a cleaner way */}
                        {/* Start of Change perspective */}
                        <div className="flex w-full pt-4">
                            <p className="text-s font-bold mt-1 mr-4">Axis 1: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim1_2D_1(Number(e.target.value))}
                                value={dim1_2D_1}
                            >
                                <option key={0} value={X_DIM}>X</option>
                                <option key={1} value={Y_DIM}>Y</option>
                                <option key={2} value={Z_DIM}>Z</option>
                                <option key={3} value={TIME_DIM}>TIME</option>
                            </select>

                            <p className="text-s font-bold mt-1 mx-4">Axis 2: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim2_2D_1(Number(e.target.value))}
                                value={dim2_2D_1}
                            >
                                <option key={0} value={X_DIM}>X</option>
                                <option key={1} value={Y_DIM}>Y</option>
                                <option key={2} value={Z_DIM}>Z</option>
                                <option key={3} value={TIME_DIM}>TIME</option>
                            </select>

                            <p className="text-s font-bold mt-1 mx-4">Color: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim3_2D_1(Number(e.target.value))}
                                value={dim3_2D_1}
                            >
                                <option key={0} value={TIME_DIM}>TIME</option>
                                <option key={1} value={NO_DIM}>SOLID</option>
                            </select>
                        </div>
                        {/* End of Change perspective */}
                        <Plot2D width={600} height={600} data={filteredData1} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups} maxX={maxX1} minX={minX1} maxY={maxY1} minY={minY1} maxZ={maxZ1} minZ={minZ1} timeMax={timeMax1} timeMin={timeMin1} axis1={dim1_2D_1} axis2={dim2_2D_1} colorAxis={dim3_2D_1} />

                        {/* <ScatterXY width={600} height={600} data={filteredData1} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups}  maxX={maxX1} minX={minX1} maxY={maxY1} minY={minY1} maxZ={maxZ1} minZ={minZ1} timeMax={timeMax1} timeMin={timeMin1} />
                        <ScatterXZ width={600} height={600} data={filteredData1} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups}  maxX={maxX1} minX={minX1} maxY={maxY1} minY={minY1} maxZ={maxZ1} minZ={minZ1} timeMax={timeMax1} timeMin={timeMin1} />
                        <ScatterYZ width={600} height={600} data={filteredData1} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups}  maxX={maxX1} minX={minX1} maxY={maxY1} minY={minY1} maxZ={maxZ1} minZ={minZ1} timeMax={timeMax1} timeMin={timeMin1} /> */}
                    </div>
                    <div className="md:ml-5 relative rounded-lg bg-white border border-gray-300 p-6 shadow-md my-10 hover:shadow-lg animate-fade-up">
                        <h2 className="text-xl font-bold mb-4 text-blue-900">{`Study #2: ${selectedCsvFile2}`}</h2>
                        {/* <ScatterplotSimple width={600} height={600} csv_file={selectedCsvFile2} upperX={upperX} lowerX={lowerX} upperY={upperY} lowerY={lowerY} timeStart={timeStart} timeEnd={timeEnd} timeMax={timeMax} />  */}

                        {/* This can probably be done in a cleaner way */}
                        {/* Start of Change perspective */}
                        <div className="flex w-full pt-4">
                            <p className="text-s font-bold mt-1 mr-4">Axis 1: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim1_2D_2(Number(e.target.value))}
                                value={dim1_2D_1}
                            >
                                <option key={0} value={X_DIM}>X</option>
                                <option key={1} value={Y_DIM}>Y</option>
                                <option key={2} value={Z_DIM}>Z</option>
                                <option key={3} value={TIME_DIM}>TIME</option>
                            </select>

                            <p className="text-s font-bold mt-1 mx-4">Axis 2: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim2_2D_2(Number(e.target.value))}
                                value={dim2_2D_2}
                            >
                                <option key={0} value={X_DIM}>X</option>
                                <option key={1} value={Y_DIM}>Y</option>
                                <option key={2} value={Z_DIM}>Z</option>
                                <option key={3} value={TIME_DIM}>TIME</option>
                            </select>

                            <p className="text-s font-bold mt-1 mx-4">Color: </p>
                            <select
                                className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setDim3_2D_2(Number(e.target.value))}
                                value={dim3_2D_2}
                            >
                                <option key={0} value={TIME_DIM}>TIME</option>
                                <option key={1} value={NO_DIM}>SOLID</option>
                            </select>
                        </div>
                        {/* End of Change perspective */}
                        <Plot2D width={600} height={600} data={filteredData2} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups} maxX={maxX2} minX={minX2} maxY={maxY2} minY={minY2} maxZ={maxZ2} minZ={minZ2} timeMax={timeMax2} timeMin={timeMin2} axis1={dim1_2D_2} axis2={dim2_2D_2} colorAxis={dim3_2D_2} />

                        {/* <ScatterXY width={600} height={600} data={filteredData2} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups} maxX={maxX2} minX={minX2} maxY={maxY2} minY={minY2} maxZ={maxZ2} minZ={minZ2} timeMax={timeMax2} timeMin={timeMin2} /> 
                        <ScatterXZ width={600} height={600} data={filteredData2} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups} maxX={maxX2} minX={minX2} maxY={maxY2} minY={minY2} maxZ={maxZ2} minZ={minZ2} timeMax={timeMax2} timeMin={timeMin2} /> 
                        <ScatterYZ width={600} height={600} data={filteredData2} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups} maxX={maxX2} minX={minX2} maxY={maxY2} minY={minY2} maxZ={maxZ2} minZ={minZ2} timeMax={timeMax2} timeMin={timeMin2} /> */}
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-2 justify-center items-center animate-fade-up">
               {syncTimeSliders ? (
                <>
                <label className="ml-4 font-bold">Select Time Range: <span className="font-medium">(Sync time ranges <input type="checkbox" checked={true} onChange={() => setSyncTimeSliders(false)} />)</span></label>
                <MultiRangeSlider
                    style={{width: "90%", backgroundColor: "white", padding: "24px"}}
                    className="m-2 ml-4"
                    min={timeMin1 < timeMin2 ? timeMin1 : timeMin2}
                    max={timeMax1 > timeMax2 ? timeMax1 : timeMax2}
                    step={1}
                    minValue={timeStart1}
                    maxValue={timeEnd1}
                    onChange={(e: ChangeResult) => {
                    setTimeStart1(e.minValue);
                    setTimeStart2(e.minValue);
                    setTimeEnd1(e.maxValue);
                    setTimeEnd2(e.maxValue);
                    }}
                />
                <br />
                </>
               ) : (
                <>
                <div className="flex space-x-4 w-full mt-4 justify-center items-center">
                <div className="w-full">
                <label className="ml-4 font-bold">Select Time Range for Study #1: <span className="font-medium">(Sync time ranges <input type="checkbox" checked={false} onChange={() => setSyncTimeSliders(true)} />)</span></label>
                <MultiRangeSlider
                    style={{width: "90%", backgroundColor: "white", padding: "24px"}}
                    className="m-2 ml-4"
                    min={timeMin1}
                    max={timeMax1}
                    step={1}
                    minValue={timeStart1}
                    maxValue={timeEnd1}
                    onChange={(e: ChangeResult) => {
                    setTimeStart1(e.minValue);
                    setTimeEnd1(e.maxValue);
                    }}
                />
                </div>
                <div className="w-full">
                <label className="ml-4 font-bold">Select Time Range for Study #2: <span className="font-medium">(Sync time ranges <input type="checkbox" checked={false} onChange={() => setSyncTimeSliders(true)} />)</span></label>
                <MultiRangeSlider
                    style={{width: "90%", backgroundColor: "white", padding: "24px"}}
                    className="m-2 ml-4"
                    min={timeMin2}
                    max={timeMax2}
                    step={1}
                    minValue={timeStart2}
                    maxValue={timeEnd2}
                    onChange={(e: ChangeResult) => {
                    setTimeStart2(e.minValue);
                    setTimeEnd2(e.maxValue);
                    }}
                />
                </div>
                </div>
                <br />
                </>
               )}
                <label className="ml-4 font-bold">Select X-Range:</label>
                <MultiRangeSlider
                    style={{width: "90%", backgroundColor: "white", padding: "24px"}}
                    className="m-2 ml-4"
                    min={minX1 < minX2 ? minX1 : minX2}
                    max={maxX1 > maxX2 ? maxX1 : maxX2}
                    step={10}
                    minValue={lowerX}
                    maxValue={upperX}
                    onChange={(e: ChangeResult) => {
                    setLowerX(e.minValue);
                    setUpperX(e.maxValue);
                    }}
                />
                <br />
                <label className="ml-4 font-bold">Select Y-Range:</label>
                <MultiRangeSlider
                    style={{width: "90%", backgroundColor: "white", padding: "24px"}}
                    className="m-2 ml-4"
                    min={minY1 < minY2 ? minY1 : minY2}
                    max={maxY1 > maxY2 ? maxY1 : maxY2}
                    step={10}
                    minValue={lowerY}
                    maxValue={upperY}
                    onChange={(e: ChangeResult) => {
                    setLowerY(e.minValue);
                    setUpperY(e.maxValue);
                    }}
                />
                <br />
                <label className="ml-4 font-bold">Select Z-Range:</label>
                <MultiRangeSlider
                    style={{width: "90%", backgroundColor: "white", padding: "24px"}}
                    className="m-2 ml-4"
                    min={minZ1 < minZ2 ? minZ1 : minZ2}
                    max={maxZ1 > maxZ2 ? maxZ1 : maxZ2}
                    step={10}
                    minValue={lowerZ}
                    maxValue={upperZ}
                    onChange={(e: ChangeResult) => {
                    setLowerZ(e.minValue);
                    setUpperZ(e.maxValue);
                    }}
                />
                <br />
            </div>
            <div className="animate-fade-up">
                <VelocityChart 
                    study1={selectedCsvFile1}
                    study2={selectedCsvFile2}
                    data1={filteredData1} 
                    data2={filteredData2} 
                    colorScale={colorScale} 
                    selectedMarkers={selectedMarkers} 
                    allMarkerGroups={allGroups}
                    timeStart={timeEnd1 < timeEnd2 ? timeEnd1 : timeEnd2} 
                    timeEnd={timeEnd1 > timeEnd2 ? timeEnd1 : timeEnd2} /> 
                 <div className="w-full mt-8">
                    <h1 className="flex text-3xl font-bold mb-2 mt-4 justify-center items-center text-blue-900">
                        Studies Overview
                    </h1>
                    <p className="flex mb-4 justify-center items-center">
                        Select two studies for comparison to render the data on the graphs above. 
                        Table can be sorted in ascending/descending order by clicking on the column headers.
                    </p>
                    <OverviewTable 
                        onSelectStudies1={handleSelectStudies1} 
                        selectedStudies1={selectedStudies1} 
                        onSelectStudies2={handleSelectStudiesStudy2}
                        selectedStudies2={selectedStudies2}
                    />
                </div> 
            </div>
        </div>
    );
};

export default Visualisation;