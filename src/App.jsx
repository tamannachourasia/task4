// src/App.js
import React, { useState, useMemo } from 'react';
import customers from './customers';

function App() {
    const [data, setData] = useState(customers);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchInput, setSearchInput] = useState('');

    const sortedData = useMemo(() => {
        if (sortConfig.key) {
            const sorted = [...data].sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
            return sorted;
        }
        return data;
    }, [data, sortConfig]);

    const filteredData = useMemo(() => {
        return sortedData.filter(customer => 
            Object.values(customer).some(val => 
                String(val).toLowerCase().includes(searchInput.toLowerCase())
            )
        );
    }, [sortedData, searchInput]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const renderArrow = (column) => {
        if (sortConfig.key === column) {
            return sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽';
        }
        return '';
    };

    return (
        <div className='w-[150vh] m-10 '>
           <div className='w-full ml-[75vh] mb-[5vh]   '>
            <input className='rounded-full border-zinc-900 border-2 bg-zinc-600 pl-2  '
                value={searchInput}
                onChange={handleSearch}
                placeholder="Search"
                style={{ marginBottom: '10px', marginRight: '10vh' }}
            />
            </div>
            <table  className='ml-40'>
                <thead  className='felx justify-center items-center' >
                    <tr >
                        {['name', 'lastSeen', 'orders', 'totalAmount', 'latestPurchase', 'news', 'segments'].map(column => (
                            <th  className='felx justify-center items-center w-[25vh]' 
                                key={column}
                                onClick={() => requestSort(column)}
                                style={{ cursor: 'pointer' }}
                            >
                                {column}
                                {renderArrow(column)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((customer, index) => (
                        <tr  key={index}>
                            <td  className='w-[120vh]' >{customer.name}</td>
                            <td className='w-[120vh]' >{customer.lastSeen}</td>
                            <td className=' w-[120vh] pl-[6vh]' >{customer.orders}</td>
                            <td className='w-[100vh] pl-[3vh]'>{customer.totalAmount}</td>
                            <td className='w-[120vh] pl-[3vh]' >{customer.latestPurchase}</td>
                            <td className='w-[120vh] pl-[3vh]' >{customer.news}</td>
                            <td className='w-[120vh] pl-[3vh]' >{customer.segments.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
