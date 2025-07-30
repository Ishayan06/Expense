import { createContext, useState } from "react";

// Create the context
export const ExpenseContext = createContext();

const ExpenseContextProvider = (props) => {
  const currency = "$";
  const [visible, setVisible] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || '');
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  const value = {
    currency,
    visible,
    setVisible,
    token,
    setToken,
    BackendUrl,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {props.children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseContextProvider;
