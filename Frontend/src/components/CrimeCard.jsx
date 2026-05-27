function CrimeCard({crime})
{
  return(
    <div className="bg-white p-5 rounded-xl shadow-md ">
      <h2 className="text-xl font-bold mb-2">
        {crime.title}
      </h2>
      <p className="text-gray-600 mb-3">
        {crime.description}
      </p>
      <p className="text-sm text-gray-500">
        location: {crime.location}
      </p>

      <div className="mt-4">

        <span className="
        bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
          {crime.status}
        </span>

      </div>
    </div>
  )
}
export default CrimeCard;