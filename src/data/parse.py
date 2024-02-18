#!/usr/bin/python3

# This script is used to parse the .tsv file and convert it to .csv file
# Usage: python parse.py <input_tsv_file> <output_csv_file>
# Usage: python parse.py <input_tsv_file>
# Usage: python parse.py <name_of_tsv_file> <name_of_csv_file>
# Usage: python parse.py <name_of_tsv_file>

# TODO: Implement check for deficient columns in the parsed CSV

import csv
import numpy as np
import pandas as pd

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
            self.length = 487.589617
            self.offset = 0
            
            self.vector = vector
            self.refPoint = np.array([0, 0, 1], dtype=np.float64)
            self.refAngle = np.arccos(np.dot(vector, self.refPoint) / (np.linalg.norm(vector) * np.linalg.norm(self.refPoint)))
            self.refAxis = np.cross(vector, self.refPoint) 
            self.refAxis = self.refAxis / np.linalg.norm(self.refAxis)
            self.q = np.sin(self.refAngle / 2) * self.refAxis
            self.q = np.insert(self.q, 0, np.cos(self.refAngle / 2), axis = 0)
            self.p = vector.values
            self.p = np.insert(self.p, 0, 0, axis = 0)
            self.qi = np.array([self.q[0], -self.q[1], -self.q[2], -self.q[3]], dtype=np.float64)
            
            self.start = self.normalize()
            if np.abs(self.start[2] - self.length) > 1e-6:
                self.offset = self.length - self.start[2]
                self.start[2] = self.length
            
        
        def quaternion_multiply(self, quaternion1, quaternion0):
            w0, x0, y0, z0 = quaternion0
            w1, x1, y1, z1 = quaternion1
            return np.array([-x1 * x0 - y1 * y0 - z1 * z0 + w1 * w0,
                            x1 * w0 + y1 * z0 - z1 * y0 + w1 * x0,
                            -x1 * z0 + y1 * w0 + z1 * x0 + w1 * y0,
                            x1 * y0 - y1 * x0 + z1 * w0 + w1 * z0], dtype=np.float64)
            
        
        def normalize(self, vector=None):
            if vector is None:
                vector = self.p
            else:
                vector = vector.values
                vector = np.insert(vector, 0, 0, axis = 0)
            
            result = self.quaternion_multiply(self.quaternion_multiply(self.q, vector), self.qi)[1:] 
            result[2] = result[2] + self.offset
            
            return result
    
    def getNormalized(self):
        print("Normalizing...")
        nRows = self.data.shape[0]
        normalizer = self.normalizeVector(self.data.loc[(self.data.FRAME == 1) & (self.data.MARKER_NR == "midpoint"), 
                                                            ["X", "Y", "Z"]].astype(np.float64).squeeze())
        for index, row in self.data.iterrows():
            self.data.loc[index, ["X", "Y", "Z"]] = np.round(normalizer.normalize(row[["X", "Y", "Z"]].astype(np.float64).squeeze()), 3)
            
            if index % 1000 == 0:
                print(f"Rows {index}/ {nRows} done.")
        
        print("Done.")
        
            
    def outputCSV(self):
        self.data.to_csv(self.output_csv_file, index=False)

        

def main():
    import sys
    import time
    
    start = time.time()

    try:
        assert len(sys.argv) > 1 and len(sys.argv) <= 3
    except AssertionError:
        print("Usage: python parse.py <input_tsv_file> <output_csv_file> in command line.")
        sys.exit(1)
    
    try:
        assert sys.argv[1].endswith('.tsv')
    except AssertionError:
        print("Input file should be a .tsv file")
        sys.exit(1)

    try:
        if len(sys.argv) == 2:
            p = parser(sys.argv[1])
        else:
            p = parser(sys.argv[1], sys.argv[2])
    except FileNotFoundError:
        print("File not found")
        sys.exit(1)

    try:
        p.parse()
        p.initData()
        p.getVelocities()
        p.getCenter()
        p.getNormalized()
        p.outputCSV()
        print(f"Time taken: {round(time.time() - start, 3)}s")
    except Exception as e:
        print("Parsing failed: ", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
    print("Parsing successful")