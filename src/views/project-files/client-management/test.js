

import React, { useState, useEffect } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { SelectButton } from 'primereact/selectbutton';

import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';


export default function Test() {
    const [nodes, setNodes] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState(null);

    const toggleApplications = () => {
        let _expandedKeys = { ...expandedKeys };

        if (_expandedKeys['0']) delete _expandedKeys['0'];
        else _expandedKeys['0'] = true;

        setExpandedKeys(_expandedKeys);
    };

    const [globalFilter, setGlobalFilter] = useState('');
    const [filterMode, setFilterMode] = useState('lenient');
   

    useEffect(() => {
        const data=[
            {
              "key": "0",
              "data": {
                "name": "Applications",
                "size": "100kb",
                "type": "Folder",
                "id": "1"
              },
              "children": [
                {
                  "key": "0-0",
                  "data": {
                    "name": "React",
                    "size": "25kb",
                    "type": "Folder"
                  },
                  "children": [
                    {
                      "key": "0-0-0",
                      "data": {
                        "name": "react-app.js",
                        "size": "10kb",
                        "type": "File"
                      }
                    },
                    {
                      "key": "1-0-5",
                      "data": {
                        "name": "react-config.json",
                        "size": "5kb",
                        "type": "File"
                      }
                    }
                  ]
                },
                {
                  "key": "0-1",
                  "data": {
                    "name": "Angular",
                    "size": "30kb",
                    "type": "Folder"
                  },
                  "children": [
                    {
                      "key": "0-1-0",
                      "data": {
                        "name": "angular-app.js",
                        "size": "15kb",
                        "type": "File"
                      }
                    },
                    {
                      "key": "0-1-1",
                      "data": {
                        "name": "angular-config.json",
                        "size": "8kb",
                        "type": "File"
                      }
                    }
                  ]
                }
              ]
            },
            {
              "key": "1",
              "data": {
                "name": "Documents",
                "size": "200kb",
                "type": "Folder"
              },
              "children": [
                {
                  "key": "1-0",
                  "data": {
                    "name": "Work",
                    "size": "100kb",
                    "type": "Folder"
                  },
                  "children": [
                    {
                      "key": "1-0-0",
                      "data": {
                        "name": "report.docx",
                        "size": "50kb",
                        "type": "File"
                      }
                    },
                    {
                      "key": "1-0-1",
                      "data": {
                        "name": "presentation.pptx",
                        "size": "30kb",
                        "type": "File"
                      }
                    }
                  ]
                },
                {
                  "key": "1-1",
                  "data": {
                    "name": "Personal",
                    "size": "80kb",
                    "type": "Folder"
                  },
                  "children": [
                    {
                      "key": "1-1-0",
                      "data": {
                        "name": "resume.pdf",
                        "size": "20kb",
                        "type": "File"
                      }
                    },
                    {
                      "key": "1-1-1",
                      "data": {
                        "name": "hobbies.txt",
                        "size": "5kb",
                        "type": "File"
                      }
                    }
                  ]
                }
              ]
            }
          ]
          
        setNodes(data)
    }, []);
    const onSearch = (nodeData) => {
        // console.log('Search button clicked for:', nodeData);
    };

    const onEdit = (nodeData) => {
        // console.log('Edit button clicked for:', nodeData);
    };

    const getHeader = () => {
        return (
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" />
                </IconField>
            </div>
        );
    };

    let header = getHeader();

    const actionTemplate = (node) => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    icon="pi pi-search"
                    rounded
                    style={{ height: '30px' }}
                    onClick={() => onSearch(node.data)}
                >Edit</Button>
                <Button
                    type="button"
                    icon="pi pi-pencil"
                    severity="success"
                    rounded
                    style={{  height: '30px' }}
                    onClick={() => onEdit(node.data)}
                >Delete</Button>
            </div>
        );
    };

    return (
        <div className="card">
            <div className="flex justify-content-center mb-4">
                <SelectButton value={filterMode} onChange={(e) => setFilterMode(e.value)}  />
            </div>

            <Button onClick={toggleApplications} label="Toggle Applications" />
            <TreeTable value={nodes} scrollable frozenWidth="300px" scrollHeight="250px" globalFilter={globalFilter} header={header}>
                <Column field="name" header="Name" expander frozen style={{ width: '250px', height: '57px' }} filter filterPlaceholder="Filter by name"></Column>
                <Column field="size" header="Size" style={{ width: '300px', height: '57px' }} filter filterPlaceholder="Filter by size" columnKey="size_0"></Column>
                <Column field="type" header="Type" style={{ width: '300px', height: '57px' }} filter filterPlaceholder="Filter by type" columnKey="type_0"></Column>
                <Column field="size" header="Size" style={{ width: '300px', height: '57px' }} columnKey="size_1"></Column>
                <Column field="type" header="Type" style={{ width: '300px', height: '57px' }} columnKey="type_1"></Column>
                <Column field="size" header="Size" style={{ width: '300px', height: '57px' }} columnKey="size_2"></Column>
               
                <Column body={actionTemplate} header="Action"  headerClassName="w-10rem"  style={{ width: '300px', height: '57px' }} columnKey="size_2" />
            </TreeTable>
        </div>
    );
}
        