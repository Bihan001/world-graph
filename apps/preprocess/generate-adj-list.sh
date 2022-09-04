#!/bin/bash

# Run ./generate-adj-list path_to_filename output_filename

osmfilter $1 --keep="highway=*" >tmp.xml
node get-map-boundary.js tmp.xml >$2.boundaries.txt
node create-adj-list-from-osm.js tmp.xml >$2
rm -f tmp.xml
