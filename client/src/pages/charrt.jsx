// src/components/OrdersChart.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const OrdersChart = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Users Per Day',
                    data: data.orders,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }, [data]);

    return (
        <div style={{ width: '60%', margin: '0 auto' }}>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default OrdersChart;
