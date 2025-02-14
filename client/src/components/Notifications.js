import { message, Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SetLoader } from "../redux/loadersSlice";
import { DeleteNotification } from "../apicalls/notifications";
import moment from "moment";
function Notifications({
  notifications = [],
  reloadNotifications,
  showNotifications,
  setShowNotifications,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deleteNotifications = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteNotification(id);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success("Notification deleted successfully");
        reloadNotifications();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Modal
      title="Notifications"
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      centered
      footer={null}
      width={1000}
    >
      <div className=" flex flex-col gap-2">
        {notifications.map((notification) => (
          <div className=" flex flex-col border border-solid p-2 border-gray-300 rounded cursor-pointer">
            <div className=" flex justify-between items-center">
              <div
                onClick={() => {
                  navigate(notification.onClick);
                  setShowNotifications(false);
                }}
              >
                <h1 className=" text-gray-700">{notification.title}</h1>
                <span className=" text-gray-600">{notification.message}</span>
                <h1 className=" text-gray-500 text-sm">
                  {moment(notification.createdAt).fromNow()}
                </h1>
              </div>
              <i
                className="ri-delete-bin-line cursor-pointer"
                onClick={() => {
                  deleteNotifications(notification._id);
                }}
              ></i>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default Notifications;
