import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { GetProducts } from "../../apicalls/products";
import { Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";

function Home() {
  const [showFilters, setShowFilters] = useState(true);
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    status: "approved",
    category: [],
    age: [],
  });
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getData = async (req, res) => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  useEffect(()=> {
    getData();
  },[filters])
  return (
    <div className=" flex gap-5">
      {showFilters && (
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      <div className=" flex flex-col gap-5 w-full">
        <div className=" flex gap-5 items-center">
        {!showFilters && <i className="ri-equalizer-line text-xl cursor-pointer" 
          onClick={()=> {
            setShowFilters(!showFilters);
          }}
        ></i>}
        <input type="text"
          placeholder="Search Products here..."
          className=" border border-gray-300 rounded border-solid w-full h-14 py-1 px-2"
        />
        </div>
        <div
          className={`
          grid gap-5 ${showFilters ? "grid-cols-4" : "grid-cols-5"}
        `}
        >
          {products?.map((product) => {
            return (
              <div
                className=" border border-gray-300 border-solid rounded flex flex-col gap-2 pb-2 cursor-pointer"
                key={product._id}
                onClick={() => {
                  // Navigate to product page
                  navigate(`/product/${product._id}`);
                }}
              >
                <img
                  src={product.images[0]}
                  className=" w-full h-52 p-2 rounded-md object-cover"
                  alt={product.name}
                />

                <div className=" px-2 flex flex-col">
                  <h2 className="text-xl font-semibold">{product.name}</h2>
                  <p className=" text-lg">
                    {product.age} {product.age === 1 ? " year " : " years "} old
                    </p>
                  {/* Divider */}
                  <div className="w-full h-[1px] bg-gray-300 my-2"></div>
                  {/* Divider */}

                  <span className=" text-xl font-semibold text-green-700">
                    $ {product.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
