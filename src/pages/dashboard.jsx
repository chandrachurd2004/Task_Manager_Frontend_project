import { useEffect, useState } from "react";
import axios from "axios";


function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [editTask, setEditTask] = useState("");
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const user = JSON.parse(localStorage.getItem("user"));
    const [showAddTask, setShowAddTask] = useState(false);
    const [newTask, setNewTask] = useState("");

    const fetchTasks = async () => {
        try {
            const response = await axios.post(
                "https://task-manager-backend-project-2g54.onrender.com/api/fetch",
                {
                    userId: userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            setTasks(response.data.task);

        } catch (error) {
            console.log(error.response?.data);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTasks();
    }, []);


    const getStatus = (status) => {
        if (status === "1") return "InActive";
        if (status === "2") return "Ongoing";
        if (status === "3") return "Completed";

        return "Unknown";
    };


    const getStatusColor = (status) => {
        if (status === "1") return "bg-red-100 text-red-700";
        if (status === "2") return "bg-yellow-100 text-yellow-700";
        if (status === "3") return "bg-green-100 text-green-700";

        return "bg-gray-100 text-gray-700";
    };


    const handleLogout = async () => {
        try {
            await axios.post(
                "https://task-manager-backend-project-2g54.onrender.com/api/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("userId");
            window.location.reload();

        } catch (error) {
            console.log(error.response?.data);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Loading tasks...</p>
            </div>
        );
    }

    const handleDelete = async (taskId) => {
        try {
            await axios.post(
                "https://task-manager-backend-project-2g54.onrender.com/api/deleteTask",
                {
                    Taskid: taskId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            // Remove deleted task from UI
            setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== taskId)
            );

        } catch (error) {
            console.log(error.response?.data);
        }
    };

    const handleEdit = async (taskId) => {
        try {
            await axios.post(
                "https://task-manager-backend-project-2g54.onrender.com/api/editTask",
                {
                    Taskid: taskId,
                    task: editTask,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );


            // Update UI after edit
            setTasks((prevTasks) =>
                prevTasks.map((item) =>
                    item.id === taskId
                        ? { ...item, task: editTask }
                        : item
                )
            );


            setEditId(null);
            setEditTask("");

        } catch (error) {
            console.log(error.response?.data);
        }
    };

    const handleStatusChange = async (taskId, currentStatus) => {

        // cycle status: 1 -> 2 -> 3 -> 1
        let newStatus;

        if (currentStatus === "1") {
            newStatus = "2";
        } else if (currentStatus === "2") {
            newStatus = "3";
        } else {
            newStatus = "1";
        }

        try {
            await axios.post(
                "https://task-manager-backend-project-2g54.onrender.com/api/editTaskOption",
                {
                    taskMasterId: taskId,
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );


            // Update UI without fetching again
            setTasks((prevTasks) =>
                prevTasks.map((item) =>
                    item.id === taskId
                        ? {
                            ...item,
                            task_option: {
                                ...item.task_option,
                                status: newStatus,
                            },
                        }
                        : item
                )
            );


        } catch (error) {
            console.log(error.response?.data);
        }
    };


    const handleCreateTask = async () => {

        if (!newTask.trim()) return;

        try {
            await axios.post(
                "https://task-manager-backend-project-2g54.onrender.com/api/createTask",
                {
                    task: newTask,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            // Refresh task list
            fetchTasks();

            setNewTask("");
            setShowAddTask(false);

        } catch (error) {
            console.log(error.response?.data);
        }
    };




    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-6 md:p-10">

            {/* Top Header */}
            <div className="mb-8">

                {/* App Title */}
                <div className="mb-6 text-center">

                    <h1 className="text-4xl font-extrabold tracking-wide text-blue-700">
                        Task Manager
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Organize your tasks and stay productive
                    </p>

                </div>


                {/* User Header */}
                <div className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-lg md:flex-row md:items-center md:justify-between">

                    {/* User Info */}
                    <div className="flex items-center gap-4">

                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-md">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>


                        <div>

                            <h2 className="text-2xl font-bold text-slate-800">
                                Welcome, {user?.name}
                            </h2>

                            <p className="text-slate-500">
                                {user?.email}
                            </p>

                        </div>

                    </div>


                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-red-700 hover:shadow-lg"
                    >
                        Logout
                    </button>


                </div>

            </div>


            {/* Task Summary */}
            <div className="mb-8 grid gap-5 md:grid-cols-3">

                <div className="rounded-2xl bg-white p-6 shadow-md">
                    <p className="text-sm text-slate-500">
                        Total Tasks
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-blue-600">
                        {tasks.length}
                    </h2>
                </div>


                <div className="rounded-2xl bg-white p-6 shadow-md">
                    <p className="text-sm text-slate-500">
                        Active
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-blue-600">
                        {
                            tasks.filter(
                                item => item?.task_option?.status === "1"
                            ).length
                        }
                    </h2>
                </div>


                <div className="rounded-2xl bg-white p-6 shadow-md">
                    <p className="text-sm text-slate-500">
                        Completed
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-green-600">
                        {
                            tasks.filter(
                                item => item?.task_option?.status === "3"
                            ).length
                        }
                    </h2>
                </div>

            </div>



            {/* Task List */}
            <div className="space-y-6">


                {tasks.length === 0 && (

                    <div className="rounded-3xl bg-white p-10 text-center shadow-md">

                        <h2 className="text-xl font-semibold text-slate-700">
                            No Tasks Found
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Create your first task to get started.
                        </p>

                    </div>

                )}



                {tasks.map((item) => (

                    <div
                        key={item.id}
                        className="rounded-3xl bg-white p-6 shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                    >

                        <div className="flex flex-col justify-between gap-5 md:flex-row">


                            {/* Task Details */}
                            <div>

                                {editId === item.id ? (

                                    <input
                                        type="text"
                                        value={editTask}
                                        onChange={(e) => setEditTask(e.target.value)}
                                        className="w-full rounded-xl border p-3 text-lg  outline-none focus:ring-2 focus:ring-blue-500" />

                                ) : (

                                    <h2 className="text-xl font-bold text-slate-800">
                                        {item.task}
                                    </h2>

                                )}

                                <div className="mt-4">

                                    <span
                                        className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
                                            item.task_option.status
                                        )}`}
                                    >
                                        {getStatus(item.task_option.status)}
                                    </span>

                                </div>

                            </div>



                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">


                                <button
                                    onClick={() =>
                                        handleStatusChange(
                                            item.id,
                                            item.task_option.status
                                        )
                                    }
                                    className="rounded-xl bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
                                >
                                    Change Status
                                </button>

                                {editId === item.id ? (

                                    <>
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="
                rounded-xl 
                bg-green-600 
                px-5 
                py-2 
                font-medium 
                text-white
                hover:bg-green-700
            "
                                        >
                                            Save
                                        </button>


                                        <button
                                            onClick={() => {
                                                setEditId(null);
                                                setEditTask("");
                                            }}
                                            className="
                rounded-xl 
                bg-gray-500 
                px-5 
                py-2 
                font-medium 
                text-white
                hover:bg-gray-600
            "
                                        >
                                            Cancel
                                        </button>

                                    </>

                                ) : (

                                    <button
                                        onClick={() => {
                                            setEditId(item.id);
                                            setEditTask(item.task);
                                        }}
                                        className="
            rounded-xl 
            bg-yellow-500 
            px-5 
            py-2 
            font-medium 
            text-white
            hover:bg-yellow-600
        "
                                    >
                                        Edit
                                    </button>

                                )}


                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="rounded-xl bg-red-600 px-5 py-2 font-medium text-white transition hover:bg-red-700"
                                >
                                    Delete
                                </button>


                            </div>


                        </div>


                    </div>

                ))}


            </div>

            <button
                onClick={() => setShowAddTask(true)}
                className="
        fixed 
        bottom-8 
        left-8
        flex 
        h-14 
        w-14 
        items-center 
        justify-center
        rounded-full
        bg-blue-600
        text-3xl
        font-bold
        text-white
        shadow-lg
        transition
        hover:scale-110
        hover:bg-blue-700
      "
            >
                +
            </button>


            {showAddTask && (

                <div className="
    fixed 
    inset-0 
    flex 
    items-center 
    justify-center
    bg-black/40
  ">

                    <div className="
      w-full
      max-w-md
      rounded-3xl
      bg-white
      p-6
      shadow-xl
    ">

                        <h2 className="text-2xl font-bold text-slate-800">
                            Create Task
                        </h2>


                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Enter task..."
                            className="
          mt-5
          w-full
          rounded-xl
          border
          p-3
          outline-none
          focus:ring-2
          focus:ring-blue-500
        "
                        />


                        <div className="mt-5 flex gap-3">

                            <button
                                onClick={handleCreateTask}
                                className="
            flex-1
            rounded-xl
            bg-blue-600
            py-3
            text-white
            hover:bg-blue-700
          "
                            >
                                Create
                            </button>


                            <button
                                onClick={() => {
                                    setShowAddTask(false);
                                    setNewTask("");
                                }}
                                className="
            flex-1
            rounded-xl
            bg-gray-500
            py-3
            text-white
            hover:bg-gray-600
          "
                            >
                                Cancel
                            </button>

                        </div>

                    </div>

                </div>

            )}
        </div>
    );
}

export default Dashboard;