import React, { useState, useContext, useEffect } from 'react';
import Chart from '../components/Chart.jsx';
import { assets } from '../assets/assets.js';
import { ExpenseContext } from '../context/ExpenseContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

function Debit() {
  const [visible, setVisible] = useState(false);
  const { currency, token, BackendUrl } = useContext(ExpenseContext);
const [chartData, setChartData] = useState([]);
  const [summary, setSummary] = useState({
    totalCredit: 0,
    totalDebit: 0,
    balance: 0
  });

  const [debits, setDebits] = useState([]);

  const [debitForm, setDebitForm] = useState({
    amount: '',
    category: '',
    description: ''
  });

  // Fetch all debit transactions
  const fetchDebits = async () => {
    try {
      const res = await axios.get(`${BackendUrl}/api/transaction/summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        const userDebits = res.data.transactions.filter(
          txn => txn.type === 'debit'
        );
        setDebits(userDebits);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  // Fetch balance summary
  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${BackendUrl}/api/transaction/summary`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        setSummary({
          totalCredit: res.data.totalCredit,
          totalDebit: res.data.totalDebit,
          balance: res.data.balance
        });
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  useEffect(() => {
    fetchDebits();
    fetchSummary();
  }, [summary]);
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
      
      setDebits((prev) => prev.filter((txn) => txn._id !== txnId));

      // Update summary if needed
      const deletedTxn = [ ...debits].find((txn) => txn._id === txnId);
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
      const monthlyDebitMap = {};
  
      debits.forEach((txn) => {
        const date = new Date(txn.timestamp);
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const key = `${month} ${year}`;
        monthlyDebitMap[key] = (monthlyDebitMap[key] || 0) + txn.amount;
      });
  
      const chartDataArr = Object.entries(monthlyDebitMap).map(([month, value]) => ({
        month,
        expense: value,
        income: 0
      }));
  
      chartDataArr.sort((a, b) => new Date('1 ' + a.month) - new Date('1 ' + b.month));
  
      setChartData(chartDataArr);
    }, [debits,summary]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDebitForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDebit = async () => {
    const { amount, category, description } = debitForm;

    if (!amount || !category) {
      alert('Please enter amount and category');
      return;
    }

    try {
      const res = await axios.post(
        `${BackendUrl}/api/transaction/debit`,
        { amount, category, description },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setDebitForm({ amount: '', category: '', description: '' });
        setVisible(false);
        fetchDebits();
        fetchSummary();
        toast.success("Debited");
      }
    } catch (err) {
      console.error('Error adding debit:', err);
    }
  };

  return (
    <div className='bg-gray-100 w-full h-full py-5 flex flex-col items-center'>

      {/* Top Summary & Add Button */}
      <div className='bg-white flex justify-around items-center mt-5 shadow-lg rounded-lg w-[75vw] py-3 sm:py-5'>
        <div className='w-[80vw] sm:w-[23.2vw] mt-3 h-20 flex items-center p-2'>
          <img className='w-10' src={assets.bank} alt="Balance" />
          <div className='p-2'>
            <p className='text-gray-500 text-sm'>Total Debit</p>
            <p>{currency}{summary.totalDebit}</p>
          </div>
        </div>
        <div
          onClick={() => setVisible(!visible)}
          className='p-2 border hover:bg-purple-600 gap-2 hover:text-white cursor-pointer flex items-center justify-center w-[200px] border-black'
        >
          <img src={assets.add} className='w-6' alt="Add" />
          <p>ADD DEBIT</p>
        </div>
      </div>

      {/* Debit Form */}
      {visible && (
        <div className='bg-white mt-2 shadow-lg rounded-lg flex flex-col gap-4 items-center sm:w-[40vw] w-[75vw] py-5'>
          <div className='flex gap-2 text-lg'>
            <label className='w-32'>Category</label>
            <select
              name='category'
              value={debitForm.category}
              onChange={handleInputChange}
              className='border p-1'
            >
              <option value=''>Select</option>
              <option value='Food'>Food</option>
              <option value='Travel'>Travel</option>
              <option value='Billing'>Billing</option>
              <option value='Billing'>Lend</option>
              <option value='Others'>Others</option>
            </select>
          </div>
          <div className='flex gap-4 text-lg'>
            <label className=''>Amount</label>
            <input
              name='amount'
              value={debitForm.amount}
              onChange={handleInputChange}
              type='number'
              className='border w-36 p-1'
            />
          </div>
          <div className='flex gap-4 text-lg'>
            <label className=''>Description</label>
            <input
              name='description'
              value={debitForm.description}
              onChange={handleInputChange}
              type='text'
              className='border w-36 p-1'
            />
          </div>
          <button
            onClick={handleAddDebit}
            className='border px-3 py-1 pb-0 flex items-center justify-center bg-purple-600 text-white rounded-md prata-regular'
          >
            ADD
          </button>
        </div>
      )}

      {/* Chart */}
      <div className='mt-2'>
        <Chart data={chartData} />
      </div>

      {/* Transaction List */}
      <div className='space-y-4 text-sm sm:px-5 px-4 mt-4 w-full max-w-4xl'>
        {debits.map((txn) => (
          <div key={txn._id} className='flex justify-between items-center bg-white p-3 rounded shadow'>
            <div className='flex items-center gap-2'>
              <img
                src={`/icons/${txn.category.toLowerCase()}.png`}
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
            <p className='text-red-500 font-semibold'>
              - {currency}{txn.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Debit;
