import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { ExpenseContext } from "../context/ExpenseContext";
import Chart from "../components/Chart";

function Dashboard() {
  const [user, setUser] = useState({});
  const { currency, token, BackendUrl } = useContext(ExpenseContext);
  const [summary, setSummary] = useState({
    totalCredit: 0,
    totalDebit: 0,
    balance: 0,
  });
  const [credits, setCredits] = useState([]);
  const [debits, setDebits] = useState([]);
  const [chartData, setChartData] = useState([]);
  const deletedata = async (txnId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirmDelete) return;

    const res = await axios.post(
  `${BackendUrl}/api/transaction/delete/${txnId}`,
  {}, // empty body
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    if (res.data.success) {
      // Remove from UI
      setCredits((prev) => prev.filter((txn) => txn._id !== txnId));
      setDebits((prev) => prev.filter((txn) => txn._id !== txnId));

      // Update summary if needed
      const deletedTxn = [...credits, ...debits].find((txn) => txn._id === txnId);
      if (deletedTxn) {
        const amt = deletedTxn.amount;
        setSummary((prev) => ({
          ...prev,
          totalCredit: deletedTxn.type === 'credit' ? prev.totalCredit - amt : prev.totalCredit,
          totalDebit: deletedTxn.type === 'debit' ? prev.totalDebit - amt : prev.totalDebit,
          balance: deletedTxn.type === 'credit' ? prev.balance - amt : prev.balance + amt,
        }));
      }

      alert("Transaction deleted successfully");
    }
    } catch (error) {
      console.error("Error deleting transaction:", error.message);
    alert("Failed to delete transaction");
    }
  };
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${BackendUrl}/api/transaction/summary`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          const transactions = res.data.transactions;

          setSummary({
            totalCredit: res.data.totalCredit,
            totalDebit: res.data.totalDebit,
            balance: res.data.balance,
          });

          setUser(res.data.user);

          const userCredits = transactions.filter(
            (txn) => txn.type === "credit"
          );
          const userDebits = transactions.filter((txn) => txn.type === "debit");
          setCredits(userCredits);
          setDebits(userDebits);

          // Prepare chart data (month-wise)
          const monthlyData = {};
          transactions.forEach((txn) => {
            const date = new Date(txn.timestamp);
            const month = date.toLocaleString("default", { month: "short" });
            const year = date.getFullYear();
            const key = `${month} ${year}`;

            if (!monthlyData[key]) {
              monthlyData[key] = { income: 0, expense: 0 };
            }

            if (txn.type === "credit") {
              monthlyData[key].income += txn.amount;
            } else if (txn.type === "debit") {
              monthlyData[key].expense += txn.amount;
            }
          });

          const chartDataArr = Object.entries(monthlyData).map(
            ([month, values]) => ({
              month,
              income: values.income,
              expense: values.expense,
            })
          );

          chartDataArr.sort(
            (a, b) => new Date("1 " + a.month) - new Date("1 " + b.month)
          );

          setChartData(chartDataArr);
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    if (token) fetchSummary();
  }, [token,summary]);

  return (
    <div className="bg-gray-100 w-full h-full pt-9">
      {/* Profile */}
      <div className="flex justify-center mt-5">
        <div className="w-[80vw] text-black sm:w-[75vw] p-10 flex flex-col items-center bg-white rounded-lg shadow-lg">
          <img
            src={assets.user}
            className="w-16 p-2 border border-black rounded-full"
            alt="User"
          />
          <p className="mt-2">{user?.name}</p>
          <p>{user?.email}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="w-full flex flex-col sm:flex-row gap-5 sm:gap-10 justify-center items-center pt-3">
        <div className="w-[80vw] sm:w-[23.2vw] h-20 flex bg-white items-center p-2 shadow-lg rounded">
          <img className="w-10" src={assets.bank} alt="Balance" />
          <div className="p-2">
            <p className="text-gray-500 text-sm">Total Balance</p>
            <p>
              {currency}
              {summary.balance}
            </p>
          </div>
        </div>
        <div className="w-[80vw] sm:w-[23.2vw] h-20 flex bg-white items-center p-2 shadow-lg rounded">
          <img className="w-10" src={assets.income} alt="Income" />
          <div className="p-2">
            <p className="text-gray-500 text-sm">Total Income</p>
            <p>
              {currency}
              {summary.totalCredit}
            </p>
          </div>
        </div>
        <div className="w-[80vw] sm:w-[23.2vw] h-20 flex bg-white items-center p-2 shadow-lg rounded">
          <img className="w-10" src={assets.expense} alt="Expense" />
          <div className="p-2">
            <p className="text-gray-500 text-sm">Total Expense</p>
            <p>
              {currency}
              {summary.totalDebit}
            </p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-5">
        <Chart data={chartData} />
      </div>

      <div className="flex flex-col items-center">
        {/* Credit Transactions */}
        <div className="text-center mt-8 text-xl font-bold">Credits</div>
        <div className="space-y-4 text-sm sm:px-5 px-4 mt-2 w-full max-w-4xl">
          {credits.map((txn) => (
            <div
              key={txn._id}
              className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
              <div className="flex items-center gap-2">
                <img
                  src={`/icons/${txn.category?.toLowerCase()}.png`}
                  onError={(e) => (e.target.src = "/icons/default.png")}
                  className="w-6 h-6"
                  alt={txn.category}
                />
                <div>
                  <p className="font-medium">{txn.category}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(txn.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <img
                  className="w-4 cursor-pointer hover:scale-110 transition-transform"
                  src={assets.remove}
                  alt="Delete"
                  onClick={() => deletedata(txn._id)}
                />
              </div>
              <p className="text-green-500 font-semibold">
                + {currency}
                {txn.amount}
              </p>
            </div>
          ))}
        </div>

        {/* Debit Transactions */}
        <div className="text-center mt-8 text-xl font-bold">Debits</div>
        <div className="space-y-4 text-sm sm:px-5 px-4 mt-2 w-full max-w-4xl">
          {debits.map((txn) => (
            <div
              key={txn._id}
              className="flex justify-between items-center bg-white p-3 rounded shadow"
            >
              <div className="flex items-center gap-2">
                <img
                  src={`/icons/${txn.category?.toLowerCase()}.png`}
                  onError={(e) => (e.target.src = "/icons/default.png")}
                  className="w-6 h-6"
                  alt={txn.category}
                />
                <div>
                  <p className="font-medium">{txn.category}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(txn.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                                <img
                  className="w-4 cursor-pointer hover:scale-110 transition-transform"
                  src={assets.remove}
                  alt="Delete"
                  onClick={() => deletedata(txn._id)}
                />
              </div>
              <p className="text-red-500 font-semibold">
                - {currency}
                {txn.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
