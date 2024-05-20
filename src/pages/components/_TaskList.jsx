import { useEffect, useState } from 'react';
import TaskDetails from './_TaskDetails';

export default function TaskList({ tasks, handleShowNewTask, handleDeleteTask, handleTaskComplete, users, projectId }) {
  const [taskDetails, setTaskDetails] = useState(null);
  const [showEditMembers, setShowEditMembers] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const handleClick = (task) => {
    const filtered = {
      id: task.id,
      Name: task.name,
      Description: task.description,
      'Start Date': task.start,
      'End Date': task.end,
      Priority: task.priority,
      Progress: `${task.progress}%`,
      Dependencies: task.dependencies.map(
        (d) => tasks.find((t) => t.id === d)?.name || 'None'
      ),
      'Assigned To': task.assigned_to,
    };
    setTaskDetails(filtered);
  };

  const handleClose = () => {
    setTaskDetails(null);
  };

  const toggleShowEditMembers = () => {
    setShowEditMembers(!showEditMembers);
  }

  const addMember = async (e) => {
    e.preventDefault();
    const member = e.target[0].value;
    const id = projectId
    try {
      const response = await fetch("/api/projects/addmember", {
        method: "POST",
        body: JSON.stringify({email: member, projectId: id}),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
      window.location.replace(`/projects/${projectId}`)
    } catch (error) {
      alert("Error removing a member.");
    }
  }

  const removeMember = async (e) => {
    e.preventDefault();
    const member = e.target[0].value;
    const id = projectId
    try {
      const response = await fetch("/api/projects/removemember", {
        method: "POST",
        body: JSON.stringify({email: member, projectId: id}),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.error);
      }
      window.location.replace(`/projects/${projectId}`)
    } catch (error) {
      alert("Error removing a member.");
    }
  }

  const retrieveUsers = async () => {
    const email = localStorage.getItem('email');
    try {
      const response = await fetch("/api/users/company", {
        method: "POST",
        body: JSON.stringify({email: email})
      });
      if (response.ok) {
        const usersData = await response.json();
        setAllUsers(usersData);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    retrieveUsers();
  }, [])

  const nonProjectMembers = allUsers.filter(user => !users.some(u => u.email === user.email));
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="overflow-x-auto h-full">
          <div className="inline-block min-w-full h-full">
            <div className="bg-gray-900 shadow-md rounded px-4 h-full flex flex-col justify-between">
              {!taskDetails ? (
                <>
                  <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white mt-4">
                    <thead className="border-b border-neutral-200 font-medium dark:border-white/10">
                      <tr>
                        <th
                          scope="col"
                          className="w-2/6 py-4 whitespace-nowrap border-e border-neutral-200 dark:border-white/10">
                          Task Name
                        </th>
                        <th
                          scope="col"
                          className="w-2/6 py-4 whitespace-nowrap border-e border-neutral-200 dark:border-white/10">
                          Start Date
                        </th>
                        <th
                          scope="col"
                          className="w-2/6 py-4 whitespace-nowrap border-e border-neutral-200 dark:border-white/10">
                          Due Date
                        </th>
                      </tr>
                    </thead>
                  </table>
                  <div className="overflow-y-auto">
                  <table className="min-w-full border border-neutral-200 text-center text-sm font-light text-surface dark:border-white/10 dark:text-white mt-2">
                    <tbody>
                      {tasks.map((t) => (
                        <tr
                          onClick={() => handleClick(t)}
                          key={t.id}
                          className="border-b border-neutral-200 transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-white/10 dark:hover:bg-neutral-600 cursor-pointer">
                          <td className="w-2/6 whitespace-nowrap border-e border-neutral-200 py-4 font-medium dark:border-white/10">
                            {t.name}
                          </td>
                          <td className="w-2/6 whitespace-nowrap border-e border-neutral-200 py-4 font-medium dark:border-white/10">
                            {t.start}
                          </td>
                          <td className="w-2/6 whitespace-nowrap border-e border-neutral-200 py-4 font-medium dark:border-white/10">
                            {t.end}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                </>
              ) : (
                <TaskDetails
                  task={taskDetails}
                  onCloseTask={handleClose}
                  onDeleteTask={handleDeleteTask}
                  onTaskComplete={handleTaskComplete}
                />
              )}
              {!taskDetails && (
                <div className="flex justify-between">                
                  <div className="py-4">
                    <button
                      onClick={() => handleShowNewTask(true)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300">
                      + Create New Task
                    </button>
                  </div>
                  <div className="py-4">
                      <button
                        onClick={() => toggleShowEditMembers()}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300">
                        Edit members
                      </button>
                    </div>
                </div>
              )}
              {showEditMembers && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="relative bg-white p-6 rounded-md">
                    <div className="w-full max-w-s flex flex-col items-center">
                      <form className="max-w-sm mx-auto" onSubmit={addMember}>
                        <label htmlFor="countries" className="block mb-2 text-sm font-medium dark:text-black">Select members to add:</label>
                        <select multiple id="all_members_multiple" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {nonProjectMembers.map((u, i) => (
                            <option key={i} value={u.email}>
                            {u.name}
                            </option>
                            ))}
                          </select>
                        <button className="mb-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300">
                          + Add Members
                        </button>
                      </form>
                      <form className="max-w-sm mx-auto" onSubmit={removeMember}>
                        <label htmlFor="countries" className="block mb-2 text-sm font-medium dark:text-black">Select members to remove:</label>
                          <select multiple id="current_members_multiple" className="mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            {users.map((u, i) => (
                            <option key={i} value={u.email}>
                            {u.name}
                            </option>
                            ))}
                          </select>
                        <button className="mb-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300">
                          - Remove Member
                        </button>
                      </form>
                      <div className="p-2">
                        <button onClick={() => toggleShowEditMembers()} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                            Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div> 
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
