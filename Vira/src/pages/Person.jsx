import React, { useState, useEffect, useRef } from 'react';
import './person.css';

const Person = () => {
    const gridContainer = useRef(null);
    const [data, setData] = useState([]);
    const [loadingVisible, setLoadingVisible] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);

    useEffect(() => {
        const fetchGridData = async () => {
            setLoadingVisible(true);
            try {
                const response = await fetch('/api/persons');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoadingVisible(false);
            }
        };

        fetchGridData();
    }, []);

    useEffect(() => {
        let gridInstance;

        if (gridContainer.current && window.DevExpress) {
            gridInstance = new window.DevExpress.ui.dxDataGrid(gridContainer.current, {
                dataSource: data,
                columns: [
                    { dataField: 'Name', caption: 'Name' },
                    { dataField: 'NID', caption: 'National ID' },
                    { dataField: 'Mobile', caption: 'Mobile' },
                ],
                scrolling: {
                    mode: 'virtual',
                },
                height: 400,
                columnAutoWidth: true,
            });
        }

        return () => {
            if (gridInstance) {
                gridInstance.dispose();
            }
        };
    }, [data]);

    const toggleFilter = () => {
        setFilterVisible(!filterVisible);
    };

    const handleDelete = () => {
        alert('Delete functionality goes here');
    };

    return (
        <div className="person" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <header style={{ height: '50px', backgroundColor: '#f4f4f4', display: 'flex', alignItems: 'center', padding: '0 15px' }}>
                <h1 style={{ fontSize: '20px', margin: 0 }}>Person Management</h1>
            </header>

            {filterVisible && (
                <div className="filter-container" style={{ padding: '10px', backgroundColor: '#fff', border: '1px solid #ccc', marginBottom: '10px' }}>
                    <h2 style={{ fontSize: '16px', margin: '0 0 10px' }}>Filter</h2>
                    <div>Filter content here</div>
                </div>
            )}

            <div className="content" style={{ flex: 1, overflow: 'auto' }}>
                <div
                    ref={gridContainer}
                    style={{
                        margin: '20px',
                        height: '400px',
                        overflow: 'hidden',
                    }}
                ></div>
            </div>

            <footer style={{ height: '50px', backgroundColor: '#f4f4f4', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 15px' }}>
                <button style={{ marginRight: '10px' }} onClick={toggleFilter}>Filter</button>
                <button style={{ marginRight: '10px' }} onClick={() => console.log('New button clicked')}>New</button>
                <button onClick={handleDelete}>Delete</button>
            </footer>

            {loadingVisible && (
                <div className="popup" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="popup-content" style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', textAlign: 'center' }}>
                        <h2 style={{ margin: 0, marginBottom: '10px' }}>Loading...</h2>
                        <p>Please wait...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Person;
