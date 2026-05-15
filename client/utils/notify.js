import toast from "react-hot-toast";

export const notify = {
  success: (msg) => toast.success(msg, {
    style: {
      border: '1px solid #E91E63',
      borderRadius: '15px',
      background: '#fff',
      color: '#1A1F2B',
      fontWeight: '600'
    },
  }),
  error: (msg) => toast.error(msg),
};
