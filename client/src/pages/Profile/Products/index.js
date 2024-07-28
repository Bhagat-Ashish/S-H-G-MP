import { Button, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProduct, GetProducts } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";
import moment from "moment";
import Bids from "./Bids";

function Products() {
  const [showBids, setShowBids] = useState(false);
  const [selectedProduct, setselectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts({
        seller: user._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteProduct(id);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success("Product deleted successfully");
        getData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  const columns = [
    {
      title: "Product",
      dataIndex: "image",
      render: (text, record) => (
        <img
          src={record?.images?.length > 0 ? record.images[0] : ""}
          alt="Product Image"
          className=" h-20 w-20 object-cover rounded-md"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Category",
      dataIndex: "category",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Added On",
      dataIndex: "createdAt",
      render: (text, record) =>
        moment(record.createdAt).format("DD-MM-YYYY hh:mm A"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div className=" flex gap-5 items-center cursor-pointer">
          <i
            className="ri-delete-bin-line cursor-pointer"
            onClick={() => {
              deleteProduct(record._id);
            }}
          ></i>
          <i
            className="ri-pencil-line cursor-pointer"
            onClick={() => {
              setselectedProduct(record);
              setShowProductForm(true);
            }}
          ></i>

          <span className=" underline"
            onClick={()=> {
              setselectedProduct(record);
              setShowBids(true);
            }}
          >Show Bids</span>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="flex justify-end mb-2">
        <Button
          type="default"
          onClick={() => {
            setselectedProduct(null);
            setShowProductForm(true);
          }}
        >
          Add Product
        </Button>
      </div>
      <Table columns={columns} dataSource={products} />
      {showProductForm && (
        <ProductForm
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          selectedProduct={selectedProduct}
          getData={getData}
        />
      )}

      {showBids && (
        <Bids
        showBidsModal={showBids}
        setShowBidsModal={setShowBids}
        selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
}

export default Products;
