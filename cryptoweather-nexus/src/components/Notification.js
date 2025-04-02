import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotification } from '../redux/actions/notificationActions';
import { initWebSocket } from '../utils/websocket';

export default function Notification() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notifications);

  useEffect(() => {
    initWebSocket(dispatch);

    // Automatically remove each notification after 5 seconds
    notifications.forEach((_, index) => {
      const timeout = setTimeout(() => {
        dispatch(clearNotification(index));
      }, 5000);
      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    });
  }, [dispatch, notifications]);

  return (
    <div className="fixed top-4 right-4 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="bg-accent p-4 rounded-lg shadow-md flex justify-between items-center animate-slide-in"
        >
          <p>{notification.message}</p>
          <button
            onClick={() => dispatch(clearNotification(index))}
            className="ml-4 text-red-500 hover:text-red-700"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}