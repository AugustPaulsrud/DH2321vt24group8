#!/usr/bin/python3

# This script is used to parse the .tsv file and convert it to .csv file
# Usage: python parse.py <input_tsv_file> <output_csv_file>
# Usage: python parse.py <input_tsv_file>
# Usage: python parse.py <name_of_tsv_file> <name_of_csv_file>
# Usage: python parse.py <name_of_tsv_file>

# TODO: Implement check for deficient columns in the parsed CSV

import csv

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

    def getJSON(self):
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
        return self.json_file

def main():
    import sys

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
        p.writeCSV()
    except Exception as e:
        print("Parsing failed: ", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
    print("Parsing successful")