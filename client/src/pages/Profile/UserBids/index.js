import React, { useEffect, useState } from "react";
import { message, Modal, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { GetAllBids } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";
function Bids() {
  const [bidsData, setBidsData] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllBids({
        buyer: user._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setBidsData(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "product",
      render: (text, record) => {
        return record.product.name;
      },
    },
    {
      title: " Seller",
      dataIndex: "name",
      render: (text, record) => {
        return record.seller.name;
      },
    },
    {
        title: "Offered Price",
        dataIndex: "offeredPrice",
        render: (text, record) => {
          return record.product.price;
        },
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
    },
    {
      title: "Bid Placed On",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(text).format("DD-MMM-YYYY hh:mm a");
      },
    },
    {
      title: "Message",
      dataIndex: "message",
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className=" flex gap-3 flex-col">
      <Table columns={columns} dataSource={bidsData} />
    </div>
  );
}

export default Bids;
