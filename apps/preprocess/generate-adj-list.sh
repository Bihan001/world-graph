#!/bin/bash

# Run ./generate-adj-list input_file.osm output_file_prefix

osmfilter $1 --keep="highway=*" >tmp.xml
node get-map-boundary.js tmp.xml >$2.boundaries.txt
node create-adj-list-from-osm.js tmp.xml >$2.json
rm -f tmp.xml
