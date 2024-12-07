import { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
    const [count, setCount] = useState(0);
    const gridContainer = useRef(null);

    useEffect(() => {
        if (gridContainer.current && window.DevExpress) {
            new window.DevExpress.ui.dxDataGrid(gridContainer.current, {
                dataSource: [
                    { id: 1, name: 'Alice', age: 30 },
                    { id: 2, name: 'Bob', age: 25 },
                    { id: 3, name: 'Charlie', age: 35 },
                ],
                backgroundColor: 'black',
                columns: ['id', 'name', 'age'],
                columnAutoWidth: true,
            });
        }
    }, []);

    return (
        <>
            <div>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>React Test with DevExpress</h1>

            <div ref={gridContainer} style={{ margin: '20px', backgroundColor: 'black', color: 'white', padding: '10px' }}>
                {/* DevExpress DataGrid will be rendered here */}
            </div>
        </>
    );
}

export default App;
