import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

interface WorkoutTrackPopupProps {
  setShowWorkoutTrackPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkoutTrackPopup: React.FC<WorkoutTrackPopupProps> = ({ setShowWorkoutTrackPopup }) => {
  const [date, setDate] = useState<any>(dayjs(new Date()));
  const [exercise, setExercise] = useState<string>('');
  const [duration, setDuration] = useState<number | string>('');
  const [workoutEntries, setWorkoutEntries] = useState<any[]>([]);

  useEffect(() => {
    getWorkoutsByDate(date);
  }, [date]);

  const saveWorkoutEntry = async () => {
    if (!date || !exercise || !duration) {
      toast.error('Please select date, provide exercise, and duration');
      return;
    }

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/addworkoutentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        date: date.format('YYYY-MM-DD'),
        exercise,
        durationInMinutes: duration,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success('Workout entry added successfully');
          getWorkoutsByDate(date);
        } else {
          toast.error('Error in adding workout entry');
        }
      })
      .catch((err) => {
        toast.error('Error in adding workout entry');
        console.log(err);
      });
  };

  const getWorkoutsByDate = async (selectedDate: any) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/getworkoutsbydate', {
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
          setWorkoutEntries(data.data);
        } else {
          toast.error('Error in fetching workout entries');
        }
      })
      .catch((err) => {
        toast.error('Error in fetching workout entries');
        console.log(err);
      });
  };

  const deleteWorkoutEntry = async (entryDate: string) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/deleteworkoutentry', {
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
          toast.success('Workout entry deleted successfully');
          getWorkoutsByDate(date);
        } else {
          toast.error('Error in deleting workout entry');
        }
      })
      .catch((err) => {
        toast.error('Error in deleting workout entry');
        console.log(err);
      });
  };

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button
          className='close'
          onClick={() => {
            setShowWorkoutTrackPopup(false);
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
          label='Exercise'
          variant='outlined'
          onChange={(e) => {
            setExercise(e.target.value);
          }}
        />

        <TextField
          id='outlined-basic'
          label='Duration (minutes)'
          variant='outlined'
          type='number'
          onChange={(e) => {
            setDuration(e.target.value);
          }}
        />

        <Button variant='contained' onClick={saveWorkoutEntry}>
          Save
        </Button>

        <div className='hrline'></div>
        <div className='items'>
          {workoutEntries.map((entry: any, index: number) => (
            <div key={index} className='item'>
              <h3>Date: {dayjs(entry.date).format('YYYY-MM-DD')}</h3>
              <h3>Exercise: {entry.exercise}</h3>
              <h3>Duration: {entry.durationInMinutes} minutes</h3>
              <button onClick={() => deleteWorkoutEntry(entry.date)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutTrackPopup;
