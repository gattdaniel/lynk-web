export default function Task({ tasks , deleteTask, toggleCheck }) {
  return (
    <>
      {tasks.length > 0 && (
        <div className="w-full max-w-md mx-auto mt-8  shadow-md rounded-md p-4">
          <ul className="space-y-2">
            {tasks.map((task, index) => (
              <li
                key={index}
                className=" flex justify-between items-center p-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={tasks}
                  onChange={toggleCheck}
                  className="w-5 h-5"
                />
                {tasks}
                <button
                  onClick={() => deleteTask(index)}
                  className="bg-blue-400 text-white px-5 py-1 rounded hover:bg-orange-600 transition duration-300"
                >
                  *
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
