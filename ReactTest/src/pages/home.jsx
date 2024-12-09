import { useState, useEffect, useRef } from 'react';
import reactLogo from '/src/assets/react.svg';
import { getItems } from '/src/components/common/reportService';

const Home = () => {
    const gridContainer = useRef(null);
    const [data, setData] = useState([]); // Use state to manage data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                // Fetch items and update state
                const fetchedData = await getItems(571319, 4768); // Replace with your parameters
                setData(fetchedData); // Update data state
            } catch (error) {
                setError(error.message); // Set error state
            } finally {
                setLoading(false); // Update loading state
            }
        };

        fetchItems();
    }, []); // Empty dependency array ensures it runs only once

    useEffect(() => {
        if (gridContainer.current && window.DevExpress) {
            // Initialize or update the DataGrid
            new window.DevExpress.ui.dxDataGrid(gridContainer.current, {
                dataSource: data,
                backgroundColor: 'black',
                columns: ['id', 'crew_id', 'flight_id'], // Customize your columns here
                columnAutoWidth: true,
            });
        }
    }, [data]); // Re-run the DataGrid initialization when `data` changes

    return (
        <div>
            <div>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>React Test with DevExpress</h1>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div
                ref={gridContainer}
                style={{
                    margin: '20px',
                    backgroundColor: 'black',
                    color: 'white',
                    padding: '10px',
                }}
            >
                {/* DevExpress DataGrid will be rendered here */}
            </div>
        </div>
    );
};

export default Home;
