import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

interface StepsTrackPopupProps {
  setShowStepsTrackPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const StepsTrackPopup: React.FC<StepsTrackPopupProps> = ({ setShowStepsTrackPopup }) => {
  const [date, setDate] = useState<any>(dayjs(new Date()));
  const [steps, setSteps] = useState<number | string>('');
  const [stepsEntries, setStepsEntries] = useState<any[]>([]);

  useEffect(() => {
    getStepsByDate(date);
  }, [date]);

  const saveStepsEntry = async () => {
    if (!date || !steps) {
      toast.error('Please select date and provide steps count');
      return;
    }

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/addstepentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        date: date.format('YYYY-MM-DD'),
        steps,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success('Steps entry added successfully');
          getStepsByDate(date);
        } else {
          toast.error('Error in adding steps entry');
        }
      })
      .catch((err) => {
        toast.error('Error in adding steps entry');
        console.log(err);
      });
  };

  const getStepsByDate = async (selectedDate: any) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/getstepsbydate', {
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
          setStepsEntries(data.data);
        } else {
          toast.error('Error in fetching steps entries');
        }
      })
      .catch((err) => {
        toast.error('Error in fetching steps entries');
        console.log(err);
      });
  };

  const deleteStepsEntry = async (entryDate: string) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/deletestepentry', {
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
          toast.success('Steps entry deleted successfully');
          getStepsByDate(date);
        } else {
          toast.error('Error in deleting steps entry');
        }
      })
      .catch((err) => {
        toast.error('Error in deleting steps entry');
        console.log(err);
      });
  };

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button
          className='close'
          onClick={() => {
            setShowStepsTrackPopup(false);
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
          label='Steps count'
          variant='outlined'
          type='number'
          onChange={(e) => {
            setSteps(e.target.value);
          }}
        />

        <Button variant='contained' onClick={saveStepsEntry}>
          Save
        </Button>

        <div className='hrline'></div>
        <div className='items'>
          {stepsEntries.map((entry: any, index: number) => (
            <div key={index} className='item'>
              <h3>Date: {dayjs(entry.date).format('YYYY-MM-DD')}</h3>
              <h3>Steps: {entry.steps}</h3>
              <button onClick={() => deleteStepsEntry(entry.date)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepsTrackPopup;
