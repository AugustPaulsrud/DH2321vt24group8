#!/usr/bin/python3

# This script is used to parse the .tsv file and convert it to .csv file
# Usage: python parse.py <input_tsv_file> <output_csv_file>
# Usage: python parse.py <input_tsv_file>
# Usage: python parse.py <name_of_tsv_file> <name_of_csv_file>
# Usage: python parse.py <name_of_tsv_file>
# Usage: python parse.py <input_tsv_file> -t (for downsampling)

# TODO: Implement check for deficient columns in the parsed CSV

import csv
import numpy as np
import pandas as pd
import traceback
import warnings
warnings.simplefilter(action='ignore', category=RuntimeWarning)

class parser:
    def __init__(self, input_tsv_file, output_csv_file=-1):

        if 'tsv/' in input_tsv_file:
            self.input_tsv_file = input_tsv_file
        else:
            self.input_tsv_file = "tsv/" + input_tsv_file

        if output_csv_file == -1:
            self.output_csv_file = "csv/" + self.input_tsv_file.rsplit('.', 1)[0].rsplit("/", 1)[1] + '.csv'
        elif 'csv/' in output_csv_file:
            self.output_csv_file = output_csv_file
        else:
            self.output_csv_file = "csv/" + output_csv_file
        
        self.tsv_working_file = open(self.input_tsv_file, "r", encoding="utf8")
        
        # flag for json file
        self.json_file = -1
    
    def __del__(self):

        try:
            self.tsv_working_file.close()
        except AttributeError:
            pass

    def parse(self):

        self.tsv_reader = csv.reader(self.tsv_working_file, delimiter="\t")

        # Read metadata
        self.NO_OF_FRAMES = int(next(self.tsv_reader)[1])
        self.NO_OF_CAMERAS = int(next(self.tsv_reader)[1])
        self.NO_OF_MARKERS = int(next(self.tsv_reader)[1])
        self.FREQUENCY = int(next(self.tsv_reader)[1])
        self.NO_OF_ANALOG = int(next(self.tsv_reader)[1])
        self.ANALOG_FREQUENCY = int(next(self.tsv_reader)[1])
        self.DESCRIPTION = next(self.tsv_reader)[1]
        self.TIME_STAMP, self.TIME_STAMP = next(self.tsv_reader)[1:]
        self.DATA_INCLUDED = next(self.tsv_reader)[1]

        temp = next(self.tsv_reader)[:]

        if temp[0] != "EVENT":
            self.marker_row = temp[1:]
        else:
            self.EVENT = temp[1:]
            self.marker_row = next(self.tsv_reader)[1:]
        
        del temp
        
        self.marker_dict = {}
        self.marker_idx = {}

        idx = 0
        for marker in self.marker_row:
            group, name = marker.rsplit('_', 1)
            self.marker_dict[marker] = {'group': group, 'name': name, 'trajectory': ''}
            self.marker_idx[idx] = marker
            idx += 1
        
        self.trajectory_row = next(self.tsv_reader)[1:]
        for marker, trajectory in zip(self.marker_dict.keys(), self.trajectory_row):
            self.marker_dict[marker]['trajectory'] = trajectory
        
        self.nrof_markers = len(self.marker_dict)

    def writeCSV(self):

        self.new_header = next(self.tsv_reader)
        
        with open(self.output_csv_file, 'w', newline='') as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerow(['FRAME', 'TIME', 'PHANTOM', 'MARKER_NR', 'TRAJECTORY_TYPE', 'X', 'Y', 'Z'])


            # Parse the rows
            for row in self.tsv_reader:
                frame = row[0]
                time = row[1]

                for i in range(0, self.nrof_markers):
                    marker_positions = row[2+(i*3):(i*3)+5]
                    csv_writer.writerow([frame, time, self.marker_dict[self.marker_idx[i]]['group'], 
                                        self.marker_dict[self.marker_idx[i]]['name'], self.marker_dict[self.marker_idx[i]]['trajectory'], 
                                        marker_positions[0], marker_positions[1], marker_positions[2]])

    def initData(self):
        import json

        if self.json_file != -1:
            return self.json_file
        
        next(self.tsv_reader)

        columns = ["FRAME", "TIME", "PHANTOM", "MARKER_NR", "TRAJECTORY_TYPE", "X", "Y", "Z"]
        self.json_file = []

        for row in self.tsv_reader:
            frame = row[0]
            time = row[1]

            for i in range(0, self.nrof_markers):
                marker_positions = row[2+(i*3):(i*3)+5]
                self.json_file.append({columns[0]: frame, columns[1]: time, columns[2]: self.marker_dict[self.marker_idx[i]]['group'], 
                                        columns[3]: self.marker_dict[self.marker_idx[i]]['name'], columns[4]: self.marker_dict[self.marker_idx[i]]['trajectory'], 
                                        columns[5]: marker_positions[0], columns[6]: marker_positions[1], columns[7]: marker_positions[2]})

        self.json_file = json.dumps(self.json_file)
        
        self.data = pd.json_normalize(json.loads(self.json_file)).astype({"FRAME": "int", "TIME": "float", 
                                                                "X": "float", "Y": "float", "Z": "float"})
        return self.json_file
    
    def getVelocities(self):

        WINDOW_SIZE = 3
        
        self.data.sort_values(by=["MARKER_NR", "FRAME"], inplace=True)
        
        self.data["flag"] = (self.data.loc[:, ["MARKER_NR"]].shift(-1) == self.data.loc[:, ["MARKER_NR"]].shift(1))
        self.data[["VX", "VY", "VZ"]] = ((self.data.loc[:, ["X", "Y", "Z"]].shift(-1) - self.data.loc[:, ["X", "Y", "Z"]].shift(1)) / 0.01).where(self.data["flag"], np.nan).round(10)

        self.data["VELOCITY"] = np.sqrt(self.data["VX"]**2 + self.data["VY"]**2 + self.data["VZ"]**2).rolling(window=WINDOW_SIZE, center=True).mean().round(3)

        self.data.drop(columns=["flag"], inplace=True)
        self.data.sort_index(inplace=True)
    
    def getCenter(self):
        print("Getting centers...")
        p = []
        for d in self.data.loc[self.data.PHANTOM == "skull"].groupby("FRAME"):
            temp = d[1].loc[:, ["MARKER_NR", "X", "Y", "Z"]].set_index("MARKER_NR").T
            
            v1 = temp.phantom4 - temp.phantom2
            v2 = temp.phantom1 - temp.phantom2
            
            midpoint = np.round(temp.phantom2 + np.dot(v2, v1) / np.dot(v1, v1) * v1, 3)
            
            current = d[1].iloc[0]
            
            p.append([current.FRAME, current.TIME, current.PHANTOM, "midpoint", "calculated", 
                                midpoint.X, midpoint.Y, midpoint.Z, np.nan, np.nan, np.nan, np.nan])
            
            if d[0] % 1000 == 0:
                print(f"Frame {d[0]}/ {self.NO_OF_FRAMES} done.")
        print("Done.")
            
        self.data = pd.concat([self.data, pd.DataFrame(p, columns=self.data.columns)], ignore_index=True)
        self.data = self.data.sort_values(by=["FRAME", "MARKER_NR"]).reset_index(drop=True)
    
    class normalizeVector():
        def __init__(self, vector):
            
            # hyperparameters
            self.refPoint = np.array([391.05266052, 333.05802599, 184.30882738], dtype=np.float64)
            
            # rotation
            self.mid = vector
            self.angle = np.arccos(np.dot(self.mid, self.refPoint) / (np.linalg.norm(self.mid) * np.linalg.norm(self.refPoint)))
            self.rotationMatrix = np.array([[np.cos(self.angle), -np.sin(self.angle), 0],
                                        [np.sin(self.angle), np.cos(self.angle), 0],
                                        [0, 0, 1]], dtype=np.float64)
            
            # translation
            self.offset = 0
            if np.linalg.norm(self.rotationMatrix @ self.mid - self.refPoint) > 1e-3:
                self.offset = self.rotationMatrix @ self.mid - self.refPoint
        
        def normalize(self, vector=None):
            if vector is None:
                vector = self.mid
            
            result = self.rotationMatrix @ vector 
            result = (result.T - self.offset).T
            
            return result
    
    def getNormalized(self):
        print("Normalizing...")
        for d in self.data.groupby("FRAME"):
            normalizer = self.normalizeVector(d[1].loc[d[1].MARKER_NR == "midpoint", ["X", "Y", "Z"]].astype(np.float64).squeeze())
            self.data.loc[d[1].index, ["X", "Y", "Z"]] = pd.DataFrame(np.round(normalizer.normalize(d[1].loc[:, ["X", "Y", "Z"]].T.astype(np.float64).values).T, 3),
                                                                      index=d[1].index, columns=["X", "Y", "Z"])
            
            if d[0] % 1000 == 0:
                print(f"Frame {d[0]}/ {self.NO_OF_FRAMES} done.")
        print("Done.")
    
    def LTTB(self, data: pd.DataFrame, threshold: int, bins=-1) -> pd.DataFrame:
        """
        Reduce the number of points in a dataset by using the Largest Triangle Three Buckets algorithm.
        """
        if bins == -1:
            bins = []
            for d in data.groupby("MARKER_NR"):
                slice = d[1].reset_index().set_index("FRAME")
                maxSeconds = (slice.TIME.max() // 0.5) * 0.5
                time = np.arange(0, maxSeconds+0.5, 0.5)
                interval = pd.interval_range(start=slice.index[0], end=slice.index[-2], periods=threshold-2, closed="right")
                bins.append(interval)
        
        final = pd.Index([])
        for i, d in enumerate(data.groupby("MARKER_NR")):
            slice = d[1].reset_index().set_index("FRAME")
            bin = bins[i]
            n = len(bin)
            cut = pd.cut(slice.index, bin)
            slice["bins"] = cut
            
            
            
            selected = []
            selected.append(slice.index[0])
            
            binGroups = slice.groupby("bins", observed=False)
            
            prev = slice.iloc[0, :].loc[["X", "Y", "Z"]]
            for j in range(len(bin)):

                flag = binGroups.get_group(bin[j]).TIME.isin(time)
                intSec = binGroups.get_group(bin[j]).loc[flag].index.values
                for s in intSec:
                    if s not in selected:
                        selected.append(int(s))
                        continue
                
                if j == len(bin) - 1:
                    avg = slice.iloc[-1, :].loc[["X", "Y", "Z"]]
                else:
                    avg = binGroups.get_group(bin[j+1]).loc[:, ["X", "Y", "Z"]].mean()
                AB = binGroups.get_group(bin[j]).loc[:, ["X", "Y", "Z"]] - prev
                AC = avg - prev
                
                area = pd.DataFrame(np.linalg.norm(np.cross(AB, AC).astype("float"), axis=1) / 2, index=binGroups.get_group(bin[j]).index, columns=["area"])
                maxIndex = area.idxmax()
                if maxIndex.values[0] not in selected:
                    selected.append(maxIndex.values[0])
                prev = slice.loc[maxIndex, ["X", "Y", "Z"]].values.reshape(3)

            selected.append(slice.index[-1])
            downsampled = slice.loc[selected, :].reset_index().set_index("index")
            final = final.union(downsampled.index)
            
        return data.loc[final, :]
        
    def downSample(self, threshold: int):
        print("Downsampling...")
        self.data = self.LTTB(self.data, threshold)
        print("Done.")
    
    def getArrowheadAngle(self):
        self.data["ANGLEXY"] = np.nan
        self.data["ANGLEXZ"] = np.nan
        self.data["ANGLEYZ"] = np.nan
        for d in self.data.groupby("MARKER_NR"):
            
            diff = d[1].loc[:, ["X", "Y", "Z"]].shift(-1) - d[1].loc[:, ["X", "Y", "Z"]]
            
            xy = (270 - np.tan(diff.Y / diff.X) * 180 / np.pi) % 360
            xz = (270 - np.tan(diff.Z / diff.X) * 180 / np.pi) % 360
            yz = (270 - np.tan(diff.Z / diff.Y) * 180 / np.pi) % 360
            
            results = pd.DataFrame(pd.concat([xy, xz, yz], axis=1).values, columns=["ANGLEXY", "ANGLEXZ", "ANGLEYZ"], index = diff.index)
            results.loc[results.index != results.index[-1]] = results.loc[results.index != results.index[-1]].fillna(180)
            self.data.loc[results.index, ["ANGLEXY", "ANGLEXZ", "ANGLEYZ"]] = np.round(results, 3)
            
    def outputCSV(self):
        self.data.to_csv(self.output_csv_file, index=False)

        

def main():
    import sys
    import time
    
    start = time.time()

    try:
        assert len(sys.argv) > 1 and len(sys.argv) <= 4
    except AssertionError:
        print("Usage: python parse.py <input_tsv_file> <output_csv_file> in command line.")
        sys.exit(1)
    
    try:
        assert sys.argv[1].endswith('.tsv')
    except AssertionError:
        print("Input file should be a .tsv file")
        sys.exit(1)

    try:
        if len(sys.argv) == 2 or (len(sys.argv) == 3 and sys.argv[2] == "-t"):
            p = parser(sys.argv[1])
        else:
            p = parser(sys.argv[1], sys.argv[2])
    except FileNotFoundError:
        print("File not found")
        sys.exit(1)

    try:
        THRESHOLD = 500
        
        p.parse()
        p.initData()
        p.getVelocities()
        p.getCenter()
        p.getNormalized()
        if (len(sys.argv) == 4 and sys.argv[3] == "-t") or (len(sys.argv) == 3 and sys.argv[2] == "-t"):
            p.downSample(THRESHOLD)
            p.output_csv_file = "csv_downsampled/" + p.output_csv_file.rsplit('.', 1)[0].rsplit("/", 1)[1] + f'_downsampled_{THRESHOLD}.csv'
        p.getArrowheadAngle()
        p.outputCSV()
        print(f"Time taken: {round(time.time() - start, 3)}s")
    except Exception as e:
        print("Parsing failed: ", e)
        print(traceback.format_exc())
        sys.exit(1)


if __name__ == "__main__":
    main()
    print("Parsing successful")