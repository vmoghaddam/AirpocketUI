import { useState, useEffect, useRef } from 'react';
import reactLogo from '/src/assets/react.svg';
import { getItems } from '/src/services/reportService';

const Home = () => {
    const gridContainer = useRef(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const fetchedData = await getItems(571319, 4768);
                console.log(fetchedData);
                setData(fetchedData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    useEffect(() => {

        let gridInstance;

        if (gridContainer.current && window.DevExpress) {
            gridInstance = new window.DevExpress.ui.dxDataGrid(gridContainer.current, {
                dataSource: data,
                columns: ['UserName', 'FirstName', 'LastName', 'PhoneNumber'],
                scrolling: {
                    mode: 'virtual',
                },
                height: 400, // Explicit grid height
                columnAutoWidth: true,
            });


        }

        

        return () => {
            // Dispose of the grid instance when the component unmounts or data changes
            if (gridInstance) {
                gridInstance.dispose();
            }
        };
    }, [data]);




    return (
        <div>
            <div>
                <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>React Test with DevExpress</h1>
            <div style={{ height:'400px' }}>
            <div
                ref={gridContainer}
                style={{
                    margin: '20px',
                    color: 'white',
                    padding: '10px',
                    height: '400px', // Limit container height
                    overflow: 'hidden', 
                }}
            >
                {/* DevExpress DataGrid will be rendered here */}
                </div>
            </div>
        </div>
    );
};

export default Home;
