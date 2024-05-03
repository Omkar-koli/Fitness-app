import React, { useEffect, useState } from 'react';
import { TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

interface WaterTrackPopupProps {
  setShowWaterTrackPopup: React.Dispatch<React.SetStateAction<boolean>>;
}


const WaterTrackPopup: React.FC<WaterTrackPopupProps> = ({ setShowWaterTrackPopup, }) => {
  const [date, setDate] = useState<any>(dayjs(new Date()));
  const [amount, setAmount] = useState<number | string>('');
  const [reminderTime, setReminderTime] = useState<string>('');
  const [waterEntries, setWaterEntries] = useState<any[]>([]);

  useEffect(() => {
    getWaterByDate(date);
    getDrinkWaterReminderTime(); 
  }, [date]);

  const getDrinkWaterReminderTime = async () => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/getdrinkwaterreminder', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setReminderTime(data.data.reminderTime);
        } else {
          toast.error('Error in fetching drink water reminder time');
        }
      })
      .catch((err) => {
        toast.error('Error in fetching drink water reminder time');
        console.log(err);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Check if the current time matches the reminder time
      const currentTime = dayjs().format('HH:mm');
      if (currentTime === reminderTime) {
        // If it matches, display a popup message reminding the user to drink water
        toast.info('It\'s time to drink water!');
      }
    }, 10000); // Check every minute

    return () => clearInterval(interval);
  }, [reminderTime]);

  const saveWaterEntry = async () => {
    if (!date || !amount) {
      toast.error('Please select date and provide water amount');
      return;
    }

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/addwaterentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        date: date.format('YYYY-MM-DD'),
        amountInMilliliters: amount,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success('Water entry added successfully');
          getWaterByDate(date);
        } else {
          toast.error('Error in adding water entry');
        }
      })
      .catch((err) => {
        toast.error('Error in adding water entry');
        console.log(err);
      });
  };

  const getWaterByDate = async (selectedDate: any) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/getwaterbydate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        date: selectedDate.format('YYYY-MM-DD'),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setWaterEntries(data.data);
        } else {
          toast.error('Error in fetching water entries');
        }
      })
      .catch((err) => {
        toast.error('Error in fetching water entries');
        console.log(err);
      });
  };

  const deleteWaterEntry = async (entryDate: string) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/deletewaterentry', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        date: entryDate,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success('Water entry deleted successfully');
          getWaterByDate(date);
        } else {
          toast.error('Error in deleting water entry');
        }
      })
      .catch((err) => {
        toast.error('Error in deleting water entry');
        console.log(err);
      });
  };
  const setReminder = async () => {
    if (!reminderTime) {
      toast.error('Please select reminder time');
      return;
    }

    // Send reminder time to backend to set the reminder
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/setdrinkwaterreminder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        reminderTime: reminderTime,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success('Water reminder set successfully');
        } else {
          toast.error('Error in setting water reminder');
        }
      })
      .catch((err) => {
        toast.error('Error in setting water reminder');
        console.log(err);
      });
  };

 
  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button className='close' onClick={() => setShowWaterTrackPopup(false)}>
          <AiOutlineClose />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Select Date'
            value={date}
            onChange={(newValue: any) => setDate(newValue)}
          />
        </LocalizationProvider>

        <TextField
          id='outlined-basic'
          label='Water amount (in ml)'
          variant='outlined'
          color='warning'
          type='number'
          onChange={(e) => setAmount(e.target.value)}
        />

        <TextField
          id='outlined-basic'
          label='Reminder Time'
          variant='outlined'
          color='warning'
          type='time'
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          onChange={(e) => setReminderTime(e.target.value)}
        />

        <Button variant='contained' color='warning' onClick={saveWaterEntry}>
          Save
        </Button>

        <Button variant='contained' color='warning' onClick={setReminder}>
          Set Reminder
        </Button>

        <div className='hrline'></div>
        <div className='items'>
          {waterEntries.map((entry: any, index: number) => (
            <div key={index} className='item'>
              <h3>Date: {dayjs(entry.date).format('YYYY-MM-DD')}</h3>
              <h3>Amount: {entry.amountInMilliliters} ml</h3>
              <button onClick={() => deleteWaterEntry(entry.date)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaterTrackPopup;

