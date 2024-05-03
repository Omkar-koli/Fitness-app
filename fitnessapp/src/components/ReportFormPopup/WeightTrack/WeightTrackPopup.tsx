import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

interface WeightTrackPopupProps {
  setShowWeightTrackPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const WeightTrackPopup: React.FC<WeightTrackPopupProps> = ({ setShowWeightTrackPopup }) => {
  const [date, setDate] = useState<any>(dayjs(new Date()));
  const [weight, setWeight] = useState<number | string>('');
  const [weightEntries, setWeightEntries] = useState<any[]>([]);

  useEffect(() => {
    getWeightByDate(date);
  }, [date]);

  const saveWeightEntry = async () => {
    if (!date || !weight) {
      toast.error('Please select date and provide weight');
      return;
    }

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/addweightentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        date: date.format('YYYY-MM-DD'),
        weight,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success('Weight entry added successfully');
          getWeightByDate(date);
        } else {
          toast.error('Error in adding weight entry');
        }
        console.log(data)
      })
      .catch((err) => {
        toast.error('Error in adding weight entry');
        console.log(err);
      });
      
  };

  const getWeightByDate = async (selectedDate: any) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/getweightbydate', {
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
          setWeightEntries(data.data);
          console.log(data)
        } else {
          toast.error('Error in fetching weight entries');
        }
      })
      .catch((err) => {
        toast.error('Error in fetching weight entries');
        console.log(err);
      });
  };

  const deleteWeightEntry = async (entryDate: string) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/deleteweightentry', {
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
          toast.success('Weight entry deleted successfully');
          getWeightByDate(date);
        } else {
          toast.error('Error in deleting weight entry');
        }
      })
      .catch((err) => {
        toast.error('Error in deleting weight entry');
        console.log(err);
      });
  };

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button
          className='close'
          onClick={() => {
            setShowWeightTrackPopup(false);
          }}
        >
          <AiOutlineClose />
        </button>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Select Date'
            value={date}
            onChange={(newValue: any) => {
              setDate(newValue);
            }}
          />
        </LocalizationProvider>

        <TextField
          id='outlined-basic'
          label='Weight (kg)'
          variant='outlined'
          type='number'
          onChange={(e) => {
            setWeight(e.target.value);
          }}
        />

        <Button variant='contained' onClick={saveWeightEntry}>
          Save
        </Button>

        <div className='hrline'></div>
        <div className='items'>
          {weightEntries.map((entry: any, index: number) => (
            <div key={index} className='item'>
              <h3>Date: {dayjs(entry.date).format('YYYY-MM-DD')}</h3>
              <h3>Weight: {entry.weight} kg</h3>
              <button onClick={() => deleteWeightEntry(entry.date)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeightTrackPopup;
