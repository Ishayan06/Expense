import React, { useContext, useState, useEffect } from 'react';
import Chart from '../components/Chart.jsx';
import { assets } from '../assets/assets.js';
import { ExpenseContext } from '../context/ExpenseContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const creditCategories = ['Salary', 'Bonus', 'Refund'];

function Credit() {
  const [visible, setVisible] = useState(false);
  const { currency, token, BackendUrl } = useContext(ExpenseContext);

  const [summary, setSummary] = useState({
    totalCredit: 0,
    totalDebit: 0,
    balance: 0,
  });

  const [credits, setCredits] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [creditForm, setCreditForm] = useState({
    amount: '',
    category: '',
    description: ''
  });
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
      

      // Update summary if needed
      const deletedTxn = [...credits].find((txn) => txn._id === txnId);
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
  const fetchCredits = async () => {
    try {
      const res = await axios.get(BackendUrl + '/api/transaction/summary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const userCredits = res.data.transactions.filter(
          (txn) => txn.type === 'credit'
        );
        setCredits(userCredits);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${BackendUrl}/api/transaction/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setSummary({
          totalCredit: res.data.totalCredit,
          totalDebit: res.data.totalDebit,
          balance: res.data.balance,
        });
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  useEffect(() => {
    fetchCredits();
    fetchSummary();
  }, []);

  useEffect(() => {
    const monthlyCreditMap = {};

    credits.forEach((txn) => {
      const date = new Date(txn.timestamp);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      monthlyCreditMap[key] = (monthlyCreditMap[key] || 0) + txn.amount;
    });

    const chartDataArr = Object.entries(monthlyCreditMap).map(([month, value]) => ({
      month,
      income: value,
      expense: 0
    }));

    chartDataArr.sort((a, b) => new Date('1 ' + a.month) - new Date('1 ' + b.month));

    setChartData(chartDataArr);
  }, [credits,summary]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCreditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCredit = async () => {
    try {
      const { amount, category, description } = creditForm;

      if (!amount || !category) {
        alert('Please enter amount and category');
        return;
      }

      const res = await axios.post(
        BackendUrl + '/api/transaction/credit',
        {
          amount,
          category,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setCreditForm({ amount: '', category: '', description: '' });
        setVisible(false);
        fetchCredits();
        fetchSummary();
        toast.success("Credited successfully");
      }
    } catch (err) {
      console.error('Error adding credit:', err);
      toast.error("Failed to credit");
    }
  };

  return (
    <div className='bg-gray-100 w-full h-full py-5 flex flex-col items-center'>

      {/* Summary and Add Credit */}
      <div className='bg-white flex justify-around items-center mt-5 shadow-lg rounded-lg w-[75vw] py-3 sm:py-5'>
        <div className='w-[80vw] sm:w-[23.2vw] mt-3 h-20 flex items-center p-2'>
          <img className='w-10' src={assets.bank} alt='Balance' />
          <div className='p-2'>
            <p className='text-gray-500 text-sm'>Total Credit</p>
            <p>{currency}{summary.totalCredit}</p>
          </div>
        </div>
        <div
          onClick={() => setVisible(!visible)}
          className='p-2 border hover:bg-purple-600 gap-2 hover:text-white cursor-pointer flex items-center justify-center w-[200px] border-black'
        >
          <img src={assets.add} className='w-6' alt='Add' />
          <p>ADD CREDIT</p>
        </div>
      </div>

      {/* Credit Form */}
      {visible && (
        <div className='bg-white mt-2 shadow-lg rounded-lg flex flex-col gap-4 items-center sm:w-[40vw] w-[75vw] py-5'>
          <div className='flex gap-2 text-lg'>
            <label className='w-32'>Category</label>
            <select
              name='category'
              value={creditForm.category}
              onChange={handleInputChange}
              className='border p-1'
            >
              <option value=''>Select</option>
              {creditCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className='flex gap-2 text-lg'>
            <label className='w-32'>Amount</label>
            <input
              name='amount'
              value={creditForm.amount}
              onChange={handleInputChange}
              type='number'
              className='border p-1'
            />
          </div>
          <div className='flex gap-2 text-lg'>
            <label className='w-32'>Description</label>
            <input
              name='description'
              value={creditForm.description}
              onChange={handleInputChange}
              type='text'
              className='border p-1'
            />
          </div>
          <button
            onClick={handleAddCredit}
            className='border px-3 py-1 pb-0 flex items-center justify-center bg-purple-600 text-white rounded-md prata-regular'
          >
            ADD
          </button>
        </div>
      )}

      {/* Monthly Credit Chart */}
      <div className='mt-2'>
        <Chart data={chartData} />
      </div>

      {/* Credit Transactions List */}
      <div className='space-y-4 text-sm sm:px-5 px-4 mt-4 w-full max-w-4xl'>
        {credits.map((txn) => (
          <div key={txn._id} className='flex justify-between items-center bg-white p-3 rounded shadow'>
            <div className='flex items-center gap-2'>
              <img
                src={`/icons/${txn.category?.toLowerCase()}.png`}
                onError={(e) => (e.target.src = '/icons/default.png')}
                className='w-6 h-6'
                alt={txn.category}
              />
              <div>
                <p className='font-medium'>{txn.category}</p>
                <p className='text-gray-500 text-xs'>
                  {new Date(txn.timestamp).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className='flex gap-3'>
                              <img
                                className="w-4 cursor-pointer hover:scale-110 transition-transform"
                                src={assets.remove}
                                alt="Delete"
                                onClick={() => deletedata(txn._id)}
                              />
            </div>
            <p className='text-green-500 font-semibold'>
              + {currency}{txn.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Credit;
