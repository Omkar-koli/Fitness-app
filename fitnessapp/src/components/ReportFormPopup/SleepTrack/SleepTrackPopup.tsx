// import React, { useState, useEffect } from 'react';
// import { AiOutlineClose, AiFillDelete } from 'react-icons/ai';
// import { TextField, Button } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs from 'dayjs';
// import { toast } from 'react-toastify';

// interface SleepTrackPopupProps {
//     setShowSleepTrackPopup: React.Dispatch<React.SetStateAction<boolean>>;
//   }

//   const SleepTrackPopup: React.FC<SleepTrackPopupProps> = ({setShowSleepTrackPopup}) => {
//     const [date, setDate] = useState(dayjs(new Date()));
//     const [durationInHrs, setDurationInHrs] = useState('');
//   const addSleepEntry = async () => {
//     try {
//       const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/addsleepentry', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           date: date.format('YYYY-MM-DD'),
//           durationInHrs: parseFloat(durationInHrs),
//         }),
//       });
//       const data = await response.json();
//       if (data.ok) {
//         toast.success('Sleep entry added successfully');
//       } else {
//         toast.error('Error in adding sleep entry');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       toast.error('Error in adding sleep entry');
//     }
//   };

//   return (
//     <div className="popupout">
//       <div className="popupbox">
//         <button className="close" onClick={() => setShowSleepTrackPopup(false)}>
//           <AiOutlineClose />
//         </button>
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <DatePicker
//             label="Select Date"
//             value={date}
//             onChange={(newValue:any) => setDate(newValue)}
//           />
//         </LocalizationProvider>

//         <TextField
//           id="outlined-basic"
//           label="Duration (in hrs)"
//           variant="outlined"
//           type="number"
//           value={durationInHrs}
//           onChange={(e) => setDurationInHrs(e.target.value)}
//         />

//         <Button variant="contained" onClick={addSleepEntry}>
//           Save
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default SleepTrackPopup


import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers';
import { AiFillDelete, AiOutlineClose } from 'react-icons/ai';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

interface SleepTrackPopupProps {
  setShowSleepTrackPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SleepTrackPopup: React.FC<SleepTrackPopupProps> = ({ setShowSleepTrackPopup }) => {
  const [date, setDate] = useState<any>(dayjs(new Date()));
  const [duration, setDuration] = useState<number | string>('');
  const [sleepEntries, setSleepEntries] = useState<any[]>([]);

  useEffect(() => {
    getSleepByDate(date);
  }, [date]);

  const saveSleepEntry = async () => {
    if (!date || !duration) {
      toast.error('Please select date and provide sleep duration');
      return;
    }

    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/addsleepentry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        date: date.format('YYYY-MM-DD'),
        durationInHrs: duration,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          toast.success('Sleep entry added successfully');
          getSleepByDate(date);
        } else {
          toast.error('Error in adding sleep entry');
        }
      })
      .catch((err) => {
        toast.error('Error in adding sleep entry');
        console.log(err);
      });
  };

  const getSleepByDate = async (selectedDate: any) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/getsleepbydate', {
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
          setSleepEntries(data.data);
        } else {
          toast.error('Error in fetching sleep entries');
        }
      })
      .catch((err) => {
        toast.error('Error in fetching sleep entries');
        console.log(err);
      });
  };

  const deleteSleepEntry = async (entryDate: string) => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/deletesleepentry', {
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
          toast.success('Sleep entry deleted successfully');
          getSleepByDate(date);
        } else {
          toast.error('Error in deleting sleep entry');
        }
      })
      .catch((err) => {
        toast.error('Error in deleting sleep entry');
        console.log(err);
      });
  };

  return (
    <div className='popupout'>
      <div className='popupbox'>
        <button className='close'
            onClick={() => {
              setShowSleepTrackPopup(false)
            }}
            ><AiOutlineClose /></button>
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
          label='Sleep duration (in hours)'
          variant='outlined'
          color='warning'
          type='number'
          onChange={(e) => {
            setDuration(e.target.value);
          }}
        />

        <Button variant='contained' color='warning' onClick={saveSleepEntry}>
          Save
        </Button>

        <div className='hrline'></div>
        <div className='items'>
          {sleepEntries.map((entry: any, index: number) => (
            <div key={index} className='item'>
              <h3>Date: {dayjs(entry.date).format('YYYY-MM-DD')}</h3>
              <h3>Duration: {entry.durationInHrs} hours</h3>
              <button onClick={() => deleteSleepEntry(entry.date)}>
                <AiFillDelete />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SleepTrackPopup;
