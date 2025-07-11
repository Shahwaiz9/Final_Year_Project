import React, { useEffect, useState } from 'react';
import { 
  BsBoxSeam, 
  BsShopWindow,
  BsPeopleFill,
  BsCashCoin, 
  BsBagCheckFill,
  BsClockHistory 
} from 'react-icons/bs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';
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

  // ⬇️ Dummy data for the last 7 days
  const data = [
    { name: 'Sat', productsAdded: 6, orders: 10, sales: 1871 },
    { name: 'Sun', productsAdded: 10, orders: 12, sales: 1202 },
    { name: 'Mon', productsAdded: 6, orders: 12, sales: 1334 },
    { name: 'Tue', productsAdded: 6, orders: 11, sales: 1655 },
    { name: 'Wed', productsAdded: 14, orders: 17, sales: 4005 },
    { name: 'Thu', productsAdded: 12, orders: 17, sales: 3027 },
    { name: 'Fri', productsAdded: 5, orders: 11, sales: 4966 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const [productRes, vendorRes, userRes, statsRes] = await Promise.all([
          axios.get("http://localhost:5000/admin/product-count", {
            headers: { Authorization: `${token}` },
          }),
          axios.get("http://localhost:5000/admin/vendor-count", {
            headers: { Authorization: `${token}` },
          }),
          axios.get("http://localhost:5000/admin/user-count", {
            headers: { Authorization: `${token}` },
          }),
          axios.get("http://localhost:5000/admin/stats-summary", {
            headers: { Authorization: `${token}` },
          }),
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
        console.error("Error fetching dashboard data:", error);
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
            <Bar dataKey="productsAdded" fill="#8884d8" name="Products Added" />
            <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
          </BarChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#ff7300" activeDot={{ r: 8 }} name="Daily Sales" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
