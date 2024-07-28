import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import { GetAllBids, GetProducts } from "../../apicalls/products";
import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { GetProductById } from "../../apicalls/products";
import { useParams } from "react-router-dom";
import moment from "moment";
import BidModal from "./BidModal";

function ProductInfo() {
  const { user } = useSelector((state) => state.users);
  const [showAddNewBid, setShowAddNewBid] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getData = async (req, res) => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(id);
      dispatch(SetLoader(false));
      if (response.success) {
        const bidsResponse = await GetAllBids({ product: id });
        setProduct({
          ...response.data,
          bids: bidsResponse.data,
        });
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    product && (
      <div>
        <div className=" grid grid-cols-2 gap-5 mt-5">
          {/* Image */}
          <div className=" flex flex-col gap-5">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-md"
            />

            <div className=" flex gap-5 mt-3">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={product.name}
                  className={
                    "w-20 h-20 object-cover rounded-md cursor-pointer " +
                    (index === selectedImageIndex
                      ? "border-2 border-green-700 border-dashed p-2"
                      : "")
                  }
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gray-300 my-2"></div>
            {/* Divider */}

            <div>
              <h1 className="text-2xl font-semibold text-lime-800 mb-2">
                Added On
              </h1>
              <span className=" text-gray-600">
                {moment(product.createdAt).format("MMM D , YYYY hh:mm A")}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className=" flex flex-col gap-3">
            <div>
              <h1 className=" text-2xl font-semibold text-lime-800 mb-2">
                {product.name}
              </h1>
              <span>{product.description}</span>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gray-300 my-2"></div>
            {/* Divider */}

            <div className=" flex flex-col">
              <h1 className="text-2xl font-semibold text-lime-800 mb-2">
                PRODUCT DETAILS
              </h1>
              <div className=" flex justify-between mb-2">
                <span>Price</span>
                <span>$ {product.price}</span>
              </div>
              <div className=" flex justify-between mb-2">
                <span>Category</span>
                <span className=" uppercase">{product.category}</span>
              </div>
              <div className=" flex justify-between mb-2">
                <span>Age</span>
                <span>{product.age}</span>
              </div>
              <div className=" flex justify-between mb-2">
                <span>Bill Available</span>
                <span>{product.billAvailable ? "Yes" : "No"}</span>
              </div>
              <div className=" flex justify-between mb-2">
                <span>Box Available</span>
                <span>{product.boxAvailable ? "Yes" : "No"}</span>
              </div>
              <div className=" flex justify-between mb-2">
                <span>Accessories Available</span>
                <span>{product.accessoriesAvailable ? "Yes" : "No"}</span>
              </div>
              <div className=" flex justify-between mb-2">
                <span>Warranty Available</span>
                <span>{product.warrantyAvailable ? "Yes" : "No"}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gray-300 my-2"></div>
            {/* Divider */}

            <div className=" flex flex-col">
              <h1 className="text-2xl font-semibold text-lime-800 mb-2">
                OWNER DETAILS
              </h1>
              <div className=" flex justify-between mb-2">
                <span>Seller Name</span>
                <span> {product.seller.name}</span>
              </div>
              <div className=" flex justify-between mb-2">
                <span>Email</span>
                <span className=" ">{product.seller.email}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-gray-300 my-2"></div>
            {/* Divider */}

            {/* Bids */}

            <div className=" flex flex-col">
              <div className=" flex justify-between mb-5">
                <h1 className=" text-2xl font-semibold text-lime-800 mb-2">
                  Bids
                </h1>
                <Button
                  onClick={() => setShowAddNewBid(!showAddNewBid)}
                  disabled={user._id === product.seller._id}
                >
                  New Bids
                </Button>
              </div>
              {product.showBidsOnProductPage &&
                product?.bids?.map((bid) => {
                  return (
                    <div className=" border border-gray-300 border-solid rounded p-3 mt-5">
                      <div className=" flex justify-between text-gray-700">
                        <span>Name</span>
                        <span>{bid.buyer.name}</span>
                      </div>
                      <div className=" flex justify-between text-gray-700">
                        <span>Bid Amount</span>
                        <span>$ {bid.bidAmount}</span>
                      </div>
                      <div className=" flex justify-between text-gray-700">
                        <span>Bid Placed On</span>
                        <span>
                          {moment(bid.bidPlacedOn).format(
                            "MMM D, YYYY hh:mm A"
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {showAddNewBid && (
          <BidModal
            showBidModal={showAddNewBid}
            setShowBidModal={setShowAddNewBid}
            product={product}
            reloadData={getData}
          />
        )}
      </div>
    )
  );
}

export default ProductInfo;
