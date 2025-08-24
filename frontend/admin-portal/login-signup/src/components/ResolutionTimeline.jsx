const ResolutionTimeline = () => {
    const steps = [
      {
        title: 'Grievance Filed',
        desc: 'Complaint regarding water supply',
        person: 'John Doe',
        team: 'Water Department',
        date: '2024-02-20',
        status: 'completed',
      },
      {
        title: 'Initial Assessment',
        desc: 'Categorized and priority assigned',
        person: 'Sarah Smith',
        team: 'Assessment Team',
        date: '2024-02-21',
        status: 'completed',
      },
      {
        title: 'Investigation',
        desc: 'Inspection dispatched',
        person: 'Mike Johnson',
        team: 'Field Ops',
        date: '2024-02-22',
        status: 'in-progress',
      },
      {
        title: 'Resolution in Progress',
        desc: 'Repair scheduled',
        person: 'Team A',
        team: 'Maintenance',
        date: '2024-02-23',
        status: 'pending',
      },
    ];
  
    const statusColors = {
      completed: 'bg-green-500',
      'in-progress': 'bg-yellow-500',
      pending: 'bg-gray-400',
    };
  
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-800">Resolution Timeline</h4>
          <a href="#" className="text-blue-500 text-sm hover:underline">View All →</a>
        </div>
  
        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div key={idx} className="relative pl-6 border-l-2 border-gray-200">
              <div className={`w-4 h-4 rounded-full absolute -left-2 top-1.5 ${statusColors[step.status]}`}></div>
              <div>
                <h5 className="font-semibold text-gray-700">{step.title}</h5>
                <p className="text-sm text-gray-500">{step.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{step.person} • {step.team} • {step.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default ResolutionTimeline;
  