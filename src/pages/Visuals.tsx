import React, { useState , useEffect, useRef} from "react";
import { ScatterplotSimple } from "../components/ScatterplotSimple";
import Plot3D from "../components/Plot3D";
import MultiRangeSlider, { ChangeResult } from "multi-range-slider-react";

const Visuals = () => {
    const [upperX, setUpperX] = useState<number>(1000);
   const [lowerX, setLowerX] = useState<number>(0);
   const [upperY, setUpperY] = useState<number>(1000);
   const [lowerY, setLowerY] = useState<number>(0);

   const [timeStart, setTimeStart] = useState<number>(0);
   const [timeEnd, setTimeEnd] = useState<number>(60);
   const [timeMax, setTimeMax] = useState<number>(60);

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
			  min={0}
        max={10}
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
			  min={0}
        max={1000}
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
			  min={0}
        max={1000}
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
      </div>
            { is3D ? 
            ( // 3D Graph
                <div className="flex flex-col md:flex-row w-full justify-center items-center md:divide-x-2 max-md:divide-y-2">
                    <div className="ml-5">
                        <div className="pt-20 relative inline-block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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
                        <Plot3D width={700} height={700} csv_file={selectedCsvFile1} /> 
                    </div>
                    <div className="[&>*]:mx-5">
                        <div className="pt-20 relative inline-block top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
                        <Plot3D width={700} height={700} csv_file={selectedCsvFile2} /> 
                    </div>
                </div>
            ) : 
            ( // 2D Graph
                <div className="flex flex-col md:flex-row w-full justify-center items-center max-md:divide-y-2">
                    <div className="[&>*]:mr-5">
                        <div className="pt-20 relative inline-block top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
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
                        <ScatterplotSimple width={600} height={600} csv_file={selectedCsvFile1} upperX={upperX} lowerX={lowerX} upperY={upperY} lowerY={lowerY} timeStart={timeStart} timeEnd={timeEnd} timeMax={timeMax} /> 
                    </div>
                    <div className="[&>*]:ml-5">
                        <div className="pt-20 relative inline-block top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
                        <ScatterplotSimple width={600} height={600} csv_file={selectedCsvFile2} upperX={upperX} lowerX={lowerX} upperY={upperY} lowerY={lowerY} timeStart={timeStart} timeEnd={timeEnd} timeMax={timeMax} /> 
                    </div>
                </div>
                
            )}
        </div>
    );
};

export default Visuals;