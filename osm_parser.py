import xml.etree.ElementTree as ET
import json
from random import randrange
from math import sin, cos, sqrt, atan2, radians
import sys

data = {}
node_info = {}


def calc_distance(lat1, lon1, lat2, lon2):
    R = 6373.0
    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    return distance



def parse_way(way):
    nodes = []
    for w in way:
        if w.tag == 'nd' and w.attrib['ref'] in node_info:
            nodes.append(w.attrib['ref'])
    return nodes


def create_node(nodes, i):
    length = len(nodes)
    if i == 0:
        pre_node = None
        next_node = int(nodes[i])  # deleted +1
    elif i == length-1:
        pre_node = int(nodes[i-1])
        next_node = None
    else:
        pre_node = int(nodes[i-1])
        next_node = int(nodes[i+1])
    return pre_node, nodes[i], next_node


def create_data_info(current_node):
    lat, lon = node_info[current_node]['lat'], node_info[current_node]['lon']
    data[current_node] = {'lat': lat, 'lon': lon, 'adj': [], 'w': []}


def add_nodes(nodes):
    length = len(nodes)
    for i in range(length):
        pre_node, current_node, next_node = create_node(nodes, i)
        if pre_node:
            pre_node = str(pre_node)
        if current_node:
            current_node = str(current_node)
        if next_node:
            next_node = str(next_node)
        if current_node not in data.keys():
            create_data_info(current_node)
        if pre_node and pre_node not in data.keys():
            create_data_info(pre_node)
        if next_node and next_node not in data.keys():
            create_data_info(next_node)
        if pre_node and pre_node not in data[current_node]['adj'] and str(current_node) != str(pre_node) and pre_node != next_node:
            data[current_node]['adj'].append(int(pre_node))
            data[pre_node]['adj'].append(int(current_node))
            weight = calc_distance(data[pre_node]['lat'], data[pre_node]['lon'], data[current_node]['lat'], data[current_node]['lon']) * 1000
            weight = round(weight, 5)
            data[current_node]['w'].append(weight)
            data[pre_node]['w'].append(weight)
        if next_node and next_node not in data[current_node]['adj'] and str(current_node) != str(next_node) and next_node != pre_node:
            data[current_node]['adj'].append(int(next_node))
            data[next_node]['adj'].append(int(current_node))
            weight = calc_distance(data[next_node]['lat'], data[next_node]['lon'], data[current_node]['lat'], data[current_node]['lon']) * 1000
            weight = round(weight, 5)
            data[current_node]['w'].append(weight)
            data[next_node]['w'].append(weight)


def create_nodes_info(node):
    node_id, lat, lon = node.attrib['id'], node.attrib['lat'], node.attrib['lon']
    node_info[node_id] = {'lat': float(lat), 'lon': float(lon)}


def store_json(data):
        print(json.dumps(data))
    # with open('kolkata-large1.json', 'w') as f:
        # f.write(json.dumps(data))


def main():
    # file_path = input()
    if(len(sys.argv) < 2):
        raise Exception("Please provide the file path")
    file_path = sys.argv[1]
    tree = ET.ElementTree(file=file_path)
    root = tree.getroot()

    for child_root in root:
        if child_root.tag == 'node':
            create_nodes_info(child_root)

    for child_root in root:
        if child_root.tag == 'way':
            nodes = parse_way(child_root)
            add_nodes(nodes)

    store_json(data)


if __name__ == "__main__":
    main()