import { Bar } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { users, leads } = useSelector(state => ({
    users: state.users.list,
    leads: state.leads.connectedLeads
  }));

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Calls per day',
      data: [12, 19, 3, 5, 2, 3, 7],
      backgroundColor: 'rgba(75,192,192,0.4)'
    }]
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="metrics">
        <div>Total Telecallers: {users.length}</div>
        <div>Total Calls: {leads.length}</div>
      </div>
      
      <div className="chart">
        <Bar data={chartData} />
      </div>
      
      <div className="connected-calls">
        {leads.map(lead => (
          <div key={lead._id}>
            <div>{lead.name}</div>
            <div>{new Date(lead.callDate).toLocaleString()}</div>
            <div>{lead.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Dashboard ;