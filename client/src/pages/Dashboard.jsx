import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Paper,
  ButtonGroup,
  Button
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  MoreVert
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Bar,
  Line,
  Doughnut,
  Pie
} from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const stats = [
    {
      title: '26K',
      subtitle: 'Users',
      change: '-12.4%',
      trend: 'down',
      color: '#8b5cf6',
      chartColor: '#a78bfa'
    },
    {
      title: '$6.200',
      subtitle: 'Income',
      change: '40.9%',
      trend: 'up',
      color: '#3b82f6',
      chartColor: '#60a5fa'
    },
    {
      title: '2.49%',
      subtitle: 'Conversion Rate',
      change: '84.7%',
      trend: 'up',
      color: '#f59e0b',
      chartColor: '#fbbf24'
    },
    {
      title: '44K',
      subtitle: 'Sessions',
      change: '-23.6%',
      trend: 'down',
      color: '#ef4444',
      chartColor: '#f87171'
    }
  ];

  const ChartComponent = ({ type, data, options, title, docsLink }) => {
    const getChartComponent = () => {
      switch (type) {
        case 'bar':
          return <Bar data={data} options={options} />;
        case 'line':
          return <Line data={data} options={options} />;
        case 'doughnut':
          return <Doughnut data={data} options={options} />;
        case 'pie':
          return <Pie data={data} options={options} />;
        default:
          return null;
      }
    };

    return (
      <Paper sx={{
        p: 3,
        height: 400,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
        }
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            href={docsLink}
            target="_blank"
            sx={{ textTransform: 'none' }}
          >
            docs
          </Button>
        </Box>
        <Box sx={{ height: 300 }}>
          {getChartComponent()}
        </Box>
      </Paper>
    );
  };

  const chartData = {
    barChart: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'GitHub Commits',
          data: [40, 20, 12, 39, 10, 40, 39, 50, 60, 70, 80, 75],
          backgroundColor: '#3E84F6',
          borderColor: '#ffffff',
          borderWidth: 1
        }
      ]
    },
    lineChart: {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'My First dataset',
          data: [50, 40, 60, 35, 95, 5, 10],
          borderColor: '#36a2eb',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          tension: 0.1
        },
        {
          label: 'My Second dataset',
          data: [20, 50, 35, 45, 35, 85, 75],
          borderColor: '#4bc0c0',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.1
        }
      ]
    },
    doughnutChart: {
      labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
      datasets: [
        {
          data: [40, 20, 20, 20],
          backgroundColor: ['#769FCD', '#FCE38A', '#95E1D3', '#F38181']
        }
      ]
    },
    pieChart: {
      labels: ['Red', 'Green', 'Yellow'],
      datasets: [
        {
          data: [40, 30, 30],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    }
  };

  const StatCard = ({ stat }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.chartColor}25 100%)`,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        height: 140,
        minWidth: 280,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${stat.color}40 0%, ${stat.chartColor}60 100%)`,
          zIndex: -1
        },
        '&:hover': {
          transform: 'translateY(-5px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)'
        }
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flex: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0, pr: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 'bold',
                mb: 0.5,
                fontSize: { xs: '1.5rem', sm: '2rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {stat.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {stat.subtitle}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {stat.trend === 'up' ? (
                <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ fontSize: 16, mr: 0.5 }} />
              )}
              <Typography variant="caption">
                ({stat.change})
              </Typography>
            </Box>
          </Box>
          <IconButton sx={{ color: 'white', flexShrink: 0 }}>
            <MoreVert />
          </IconButton>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '60%',
            height: '50%',
            opacity: 0.2,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 100%)',
            borderRadius: '50% 0 0 0',
            filter: 'blur(1px)'
          }}
        />

        {/* Additional glass effect elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '30px',
            height: '30px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(2px)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '10px',
            width: '15px',
            height: '15px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            filter: 'blur(1px)'
          }}
        />
      </CardContent>
    </Card>
  );

  return (
    <>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="primary">
          Home / Dashboard
        </Typography>
      </Box>

      <div className="container-fluid">
        <div className="row">
          {stats.map((stat, index) => (
            <div className="col-12 col-sm-6 col-md-3 mb-4" key={index}>
              <StatCard stat={stat} />
            </div>
          ))}
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-md-8 mb-3">
            <ChartComponent
              type="bar"
              data={chartData.barChart}
              title="Bar Chart"
              docsLink="#"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 80
                  }
                }
              }}
            />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <ChartComponent
              type="doughnut"
              data={chartData.doughnutChart}
              title="Doughnut Chart"
              docsLink="#"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <ChartComponent
              type="pie"
              data={chartData.pieChart}
              title="Pie Chart"
              docsLink="#"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'bottom'
                  }
                }
              }}
            />
          </div>
          <div className="col-12 col-md-8 mb-3">
            <ChartComponent
              type="line"
              data={chartData.lineChart}
              title="Line Chart"
              docsLink="#"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;