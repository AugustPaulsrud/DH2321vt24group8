import React, { useState , useEffect, useRef, useMemo} from "react";
import { VelocityChart } from "../components/VelocityPlot";
import Plot3D from "../components/Plot3D";
import MultiRangeSlider, { ChangeResult } from "multi-range-slider-react";
import { ScatterXY } from "../components/ScatterXY";
import { ScatterXZ } from "../components/ScatterXZ";
import { ScatterYZ } from "../components/ScatterYZ";
import * as d3 from 'd3';

const Visualisation = () => {
    const [upperX, setUpperX] = useState<number>(1000);
   const [lowerX, setLowerX] = useState<number>(-1000);
   const [upperY, setUpperY] = useState<number>(1000);
   const [lowerY, setLowerY] = useState<number>(-1000);
   const [upperZ, setUpperZ] = useState<number>(1000);
   const [lowerZ, setLowerZ] = useState<number>(-1000);

   const [timeStart, setTimeStart] = useState<number>(0);
   const [timeEnd, setTimeEnd] = useState<number>(100);

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
    const [is3D, setIs3D] = useState(false);

    // Initial state for selected CSV files as empty string
    const [selectedCsvFile1, setSelectedCsvFile1] = useState("");
    const [selectedCsvFile2, setSelectedCsvFile2] = useState("");

    // const [csvFiles, setCsvFiles] = useState<string[]>([]);

    // Manually provided list of CSV file names for demonstration
    const csvFiles = ["EVDa_SimCaTip_Ale0003", 
                    "EVDb_SimCaPlus_Ale0004", 
                    "EVDb_SimCaPlus_Ale0005", 
                    "EVDb_SimCaPlus_Mario0006", 
                    "EVDb_SimCaPlus_Mario0007"
                ]; 

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
    const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
    const [rawData1, setRawData1] = useState<any>([]);
    const [rawData2, setRawData2] = useState<any>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            if (selectedCsvFile1 !== "") {
                try {
                    const response = await d3.csv(`${process.env.PUBLIC_URL}/data/csv/${selectedCsvFile1}.csv`);
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
                    const response = await d3.csv(`${process.env.PUBLIC_URL}/data/csv/${selectedCsvFile2}.csv`);
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
    }, [parsedData2]);

    const filteredData1: dataFormat[] = useMemo(() => {
        return parsedData1.filter((d) => selectedMarkers.includes(d.group))
        .filter((d) => d.time >= timeStart && d.time <= timeEnd)
        .filter((d) => d.x >= lowerX && d.x <= upperX)
        .filter((d) => d.y >= lowerY && d.y <= upperY)
        .filter((d) => d.z >= lowerZ && d.z <= upperZ);
    }, [parsedData1,
        upperX, upperY, upperZ, 
        lowerX, lowerY, lowerZ, 
        timeStart, timeEnd, 
        selectedMarkers]);
    
    const filteredData2: dataFormat[] = useMemo(() => {
        return parsedData2.filter((d) => selectedMarkers.includes(d.group))
        .filter((d) => d.time >= timeStart && d.time <= timeEnd)
        .filter((d) => d.x >= lowerX && d.x <= upperX)
        .filter((d) => d.y >= lowerY && d.y <= upperY)
        .filter((d) => d.z >= lowerZ && d.z <= upperZ);
    }, [parsedData2,
        upperX, upperY, upperZ, 
        lowerX, lowerY, lowerZ, 
        timeStart, timeEnd, 
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
        .range(["#e0ac2b", "#e85252", "#6689c6", "#9a6fb0", "#a53253"]);    
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

    const toggleGraph = () => {
        setIs3D(!is3D); // Toggle between 2D and 3D graphs
    };

    return (
        <div className="flex flex-col p-4 w-full">
            <div className="flex space-x-4 w-full mb-4 ml-4">
                <button
                    className={`px-4 py-2 rounded-md ${is3D ? 'bg-gray-300' : 'bg-blue-500 text-white'}`}
                    onClick={() => setIs3D(false)}
                >
                    Show 2D Graph
                </button>
                <button
                    className={`px-4 py-2 rounded-md ${is3D ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                    onClick={() => setIs3D(true)}
                >
                    Show 3D Graph
                </button>
            </div>
            <div>
      <label>Select time range:</label> 
      <MultiRangeSlider
        style={{width: "90%"}}
        className="m-2"
	    min={timeMin1 < timeMin2 ? timeMin1 : timeMin2}
        max={timeMax1 > timeMax2 ? timeMax1 : timeMax2}
        step={1}
        minValue={timeStart}
        maxValue={timeEnd}
        onChange={(e: ChangeResult) => {
          setTimeStart(e.minValue);
          setTimeEnd(e.maxValue);
          //console.log(e);
			  }}
		  />
      <br />
      <label>Select X range:</label>
      <MultiRangeSlider
        style={{width: "90%"}}
        className="m-2"
		min={minX1 < minX2 ? minX1 : minX2}
        max={maxX1 > maxX2 ? maxX1 : maxX2}
        step={10}
        minValue={lowerX}
        maxValue={upperX}
        onChange={(e: ChangeResult) => {
          setLowerX(e.minValue);
          setUpperX(e.maxValue);
          //console.log(e);
			  }}
		  />
      <br />
      <label>Select Y range:</label>
      <MultiRangeSlider
        style={{width: "90%"}}
        className="m-2"
		min={minY1 < minY2 ? minY1 : minY2}
        max={maxY1 > maxY2 ? maxY1 : maxY2}
        step={10}
        minValue={lowerY}
        maxValue={upperY}
        onChange={(e: ChangeResult) => {
          setLowerY(e.minValue);
          setUpperY(e.maxValue);
          //console.log(e);
			  }}
		  />
      <br />
      <label>Select Z range:</label>
      <MultiRangeSlider
        style={{width: "90%"}}
        className="m-2"
		min={minZ1 < minZ2 ? minZ1 : minZ2}
        max={maxZ1 > maxZ2 ? maxZ1 : maxZ2}
        step={10}
        minValue={lowerZ}
        maxValue={upperZ}
        onChange={(e: ChangeResult) => {
          setLowerZ(e.minValue);
          setUpperZ(e.maxValue);
          //console.log(e);
			  }}
		  />
      <br />

      <div className="mb-4 pt-20">
        <label className="p-4">Select Markers:</label>
        <button className="px-4 py-2 rounded-md bg-blue-500 text-white" onClick={() => selectAllMarkers()}>
            Select all
        </button>
        <button className="px-4 py-2 rounded-md bg-gray-300 text-black}" onClick={() => deselectAllMarkers()}>
            Deselect all
        </button>
        <div className="grid grid-cols-3 gap-2">
            {allGroups.map((group: any) => (
                <div key={group} className="flex items-center">
                <label className="flex items-center">
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
            { is3D ? 
            ( // 3D Graph
                <div className="flex flex-col md:flex-row w-full justify-center items-center">
                    <div className="md:mr-5">
                        <div className="pt-20">
                            <h2 className="text-xl font-bold mb-4">Study #1</h2>
                            <select
                                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setSelectedCsvFile1(e.target.value)}
                                value={selectedCsvFile1}
                            >
                                <option value="" className="font-bold">Select Study...</option>
                                {csvFiles.map((file, index) => (
                                    <option key={index} value={file}>{file}</option>
                                ))}
                            </select>
                        </div>

                        <Plot3D data={filteredData1} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups} width={600} height={700} csv_file={selectedCsvFile1} timeStart={timeStart} timeEnd={timeEnd} /> 
                    </div>
                    <div className="md:ml-5 relative">
                        <div className="pt-20">
                            <h2 className="text-xl font-bold mb-4">Study #2</h2>
                            <select
                                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setSelectedCsvFile2(e.target.value)}
                                value={selectedCsvFile2}
                            >
                                <option value="">Select Study...</option>
                                {csvFiles.map((file, index) => (
                                    <option key={index} value={file}>{file}</option>
                                ))}
                            </select>
                        </div>
                        <Plot3D data={filteredData2} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups} width={600} height={700} csv_file={selectedCsvFile2} timeStart={timeStart} timeEnd={timeEnd} /> 
                    </div>
                </div>
            ) : 
            ( // 2D Graph
                <div className="flex flex-col md:flex-row w-full justify-center items-center">
                    <div className="md:mr-5 relative">
                        <div className="mb-4 pt-20">
                            <h2 className="text-xl font-bold mb-4">Study #1</h2>
                            <select
                                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setSelectedCsvFile1(e.target.value)}
                                value={selectedCsvFile1}
                            >
                                <option value="" className="font-bold">Select Study...</option>
                                {csvFiles.map((file, index) => (
                                    <option key={index} value={file}>{file}</option>
                                ))}
                            </select>
                        </div>

                        {/* <ScatterplotSimple width={600} height={600} csv_file={selectedCsvFile1} upperX={upperX} lowerX={lowerX} upperY={upperY} lowerY={lowerY} timeStart={timeStart} timeEnd={timeEnd} timeMax={timeMax} /> */}
                        <ScatterXY width={600} height={600} data={filteredData1} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups}  maxX={maxX1} minX={minX1} maxY={maxY1} minY={minY1} maxZ={maxZ1} minZ={minZ1} />
                        <ScatterXZ width={600} height={600} data={filteredData1} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups}  maxX={maxX1} minX={minX1} maxY={maxY1} minY={minY1} maxZ={maxZ1} minZ={minZ1} />
                        <ScatterYZ width={600} height={600} data={filteredData1} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups}  maxX={maxX1} minX={minX1} maxY={maxY1} minY={minY1} maxZ={maxZ1} minZ={minZ1} />
                    </div>
                    <div className="md:ml-5 relative">
                        <div className="pt-20 mb-4">
                            <h2 className="text-xl font-bold mb-4">Study #2</h2>
                            <select
                                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                                onChange={(e) => setSelectedCsvFile2(e.target.value)}
                                value={selectedCsvFile2}
                            >
                                <option value="">Select Study...</option>
                                {csvFiles.map((file, index) => (
                                    <option key={index} value={file}>{file}</option>
                                ))}
                            </select>
                        </div>
                        {/* <ScatterplotSimple width={600} height={600} csv_file={selectedCsvFile2} upperX={upperX} lowerX={lowerX} upperY={upperY} lowerY={lowerY} timeStart={timeStart} timeEnd={timeEnd} timeMax={timeMax} />  */}
                        <ScatterXY width={600} height={600} data={filteredData2} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups} maxX={maxX2} minX={minX2} maxY={maxY2} minY={minY2} maxZ={maxZ2} minZ={minZ2} /> 
                        <ScatterXZ width={600} height={600} data={filteredData2} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups} maxX={maxX2} minX={minX2} maxY={maxY2} minY={minY2} maxZ={maxZ2} minZ={minZ2} /> 
                        <ScatterYZ width={600} height={600} data={filteredData2} colorScale={colorScale} selectedMarkers={selectedMarkers} allMarkerGroups={allGroups} maxX={maxX2} minX={minX2} maxY={maxY2} minY={minY2} maxZ={maxZ2} minZ={minZ2} />
                    </div>
                </div>
            )}
            <div className="justify-center items-center">
                <VelocityChart 
                 data1={filteredData1} 
                 data2={filteredData2} 
                 colorScale={colorScale} 
                 selectedMarkers={selectedMarkers} 
                 allMarkerGroups={allGroups}
                 timeStart={timeStart} 
                 timeEnd={timeEnd} /> 
            </div>
        </div>
    );
};

export default Visualisation;