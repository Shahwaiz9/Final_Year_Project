import React, { useEffect, useState } from 'react';
import { 
  BsBoxSeam, 
  BsShopWindow,
  BsPeopleFill,
  BsCashCoin, 
  BsBagCheckFill,
  BsClockHistory 
} from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';

function Home() {
  const [dashboardData, setDashboardData] = useState({
    products: 0,
    vendors: 0,
    customers: 0,
    sales: 0,
    orders: 0,
    pendingOrders: 0,
  });

  const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, vendorRes, userRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/admin/product-count'),
          axios.get('http://localhost:5000/admin/vendor-count'),
          axios.get('http://localhost:5000/admin/user-count'),
          axios.get('http://localhost:5000/admin/stats-summary'),
        ]);

        setDashboardData({
          products: productRes.data.count,
          vendors: vendorRes.data.count,
          customers: userRes.data.count,
          sales: statsRes.data.totalSales,
          orders: statsRes.data.totalOrders,
          pendingOrders: statsRes.data.totalPendingOrders,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

      <div className='main-cards'>
        <div className='card card-blue'>
          <div className='card-inner'>
            <BsBoxSeam className='card_icon' />
            <h3>PRODUCTS</h3>
          </div>
          <h1>{dashboardData.products}</h1>
        </div>

        <div className='card card-orange'>
          <div className='card-inner'>
            <BsShopWindow className='card_icon' />
            <h3>VENDORS</h3>
          </div>
          <h1>{dashboardData.vendors}</h1>
        </div>

        <div className='card card-green'>
          <div className='card-inner'>
            <BsPeopleFill className='card_icon' />
            <h3>CUSTOMERS</h3>
          </div>
          <h1>{dashboardData.customers}</h1>
        </div>

        <div className='card card-red'>
          <div className='card-inner'>
            <BsCashCoin className='card_icon' />
            <h3>SALES</h3>
          </div>
          <h1>Rs. {dashboardData.sales}</h1>
        </div>

        <div className='card card-purple'>
          <div className='card-inner'>
            <BsBagCheckFill className='card_icon' />
            <h3>ORDERS</h3>
          </div>
          <h1>{dashboardData.orders}</h1>
        </div>

        <div className='card card-yellow'>
          <div className='card-inner'>
            <BsClockHistory className='card_icon' />
            <h3>PENDING ORDERS</h3>
          </div>
          <h1>{dashboardData.pendingOrders}</h1>
        </div>
      </div>

      <div className='charts'>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
