

const Ph = ({ph }) => {

  const getPhColor = (ph) => {
    ph = +ph; 
    if (6.0<=ph && ph <= 7.5 ) return "text-green-500"; 
    return "text-red-500"; 
  };

  return (
    <div className="flex items-center">
      <span
        className={`text-2xl font-semibold ${getPhColor(ph)}`}
      >
        {ph} 
      </span>
    </div>

  );

}

export default Ph; 
