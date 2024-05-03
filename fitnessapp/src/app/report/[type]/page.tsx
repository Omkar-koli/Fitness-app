"use client"
import React from 'react'
import { LineChart } from '@mui/x-charts/LineChart';
import './ReportPage.css'
import { AiFillEdit } from 'react-icons/ai'
import CaloriIntakePopup from '@/components/ReportFormPopup/CalorieIntake/CalorieIntakePopup';
import SleepTrackPopup from '@/components/ReportFormPopup/SleepTrack/SleepTrackPopup';
import StepsTrackPopup from '@/components/ReportFormPopup/StepTrack/StepTrackPopup';
import WaterTrackPopup from '@/components/ReportFormPopup/WaterTrack/WaterTrackPopup';
import WeightTrackPopup from '@/components/ReportFormPopup/WeightTrack/WeightTrackPopup';
import WorkoutTrackPopup from '@/components/ReportFormPopup/WorkoutTrack/WorkoutTrackPopup';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const page = () => {
    const [reminderTime, setReminderTime] = React.useState('');

    React.useEffect(() => {
        getDrinkWaterReminderTime();
    }, []);

    React.useEffect(() => {
        const interval = setInterval(() => {
            const currentTime = dayjs().format('HH:mm');
            
            if (reminderTime.length > 0) {
                const firstReminder = reminderTime[0];
                if (currentTime === firstReminder) {
                    toast.info('It\'s time to drink water!');
                } else {
                    console.log('Please input reminder time')
                }
            } else {
                toast.error('No reminder time fetched');
            }
        }, 10000);  // Check every minute

        return () => clearInterval(interval);
    }, [reminderTime]);

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
    const color = '#ffc20e'
    const pathname = usePathname()
    console.log(pathname)
    const chartsParams = {
        // margin: { bottom: 20, left: 25, right: 5 },
        height: 300,

    };

    const [dataS1, setDataS1] = React.useState<any>(null)
    
    const getDataForS1 = async () => {
        if (pathname == '/report/Calorie%20Intake') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/calorieintake/getcalorieintakebylimit' , {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ limit: 10 })
            })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    let temp = data.data.map((item: any) => {
                        return {
                            date: item.date,
                            value: item.calorieIntake,
                            unit: 'kcal'
                        }
                    })
                    let dataForLineChart = temp.map((item: any) => {
                        let val = JSON.stringify(item.value)
                        return val
                    })
                    let dataForXAxis = temp.map((item: any) => {
                        let val = new Date(item.date)
                        return val
                    })

                    setDataS1({
                        data: dataForLineChart,
                        title: '1 Day Calorie Intake',
                        color: color,
                        xAxis: {
                            data: dataForXAxis,
                            label: 'Last 10 Days',
                            scaleType: 'time'
                        }
                    })
                } else {
                    setDataS1([])
                }
            })

            .catch(err => {
                console.log(err)
            })
        }
        else if (pathname == '/report/Sleep') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/sleeptrack/getsleepbylimit' , {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ limit: 10 })
            })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    let temp = data.data.map((item: any) => {
                        return {
                            date: item.date,
                            value: item.durationInHrs,
            
                        }
                    })
                    let dataForLineChart = temp.map((item: any) => {
                        let val = JSON.stringify(item.value)
                        return val
                    })
                    let dataForXAxis = temp.map((item: any) => {
                        let val = new Date(item.date)
                        return val
                    })

                    setDataS1({
                        data: dataForLineChart,
                        title: '1 Day Sleep',
                        color: color,
                        xAxis: {
                            data: dataForXAxis,
                            label: 'Last 10 Days',
                            scaleType: 'time'
                        }
                    })
                } else {
                    setDataS1([])
                }
            })

            .catch(err => {
                console.log(err)
            })
        }
        else if (pathname == '/report/Steps') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/steptrack/getstepsbylimit', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ limit: 10 })
            })
              .then(res => res.json())
              .then(data => {
                if (data.ok) {
                  let temp = data.data.map((item: any) => {
                    return {
                      date: item.date,
                      value: item.steps
                    }
                  });
                  let dataForLineChart = temp.map((item: any) => {
                    let val = JSON.stringify(item.value);
                    return val;
                  });
                  let dataForXAxis = temp.map((item: any) => {
                    let val = new Date(item.date);
                    return val;
                  });
        
                  setDataS1({
                    data: dataForLineChart,
                    title: '1 Day Steps',
                    color: color,
                    xAxis: {
                      data: dataForXAxis,
                      label: 'Last 10 Days',
                      scaleType: 'time'
                    }
                  });
                  
                } else {
                  setDataS1([]);
                }
              })
              .catch(err => {
                console.log(err);
              });
          } 
              else if (pathname == '/report/Water') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/watertrack/getwaterbylimit' , {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({ limit: 10 })
            })
            .then(res => res.json())
            .then(data => {
                if (data.ok) {
                    let temp = data.data.map((item: any) => {
                        return {
                            date: item.date,
                            value: item.amountInMilliliters,
            
                        }
                    })
                    let totalWaterIntake = temp.reduce((total: number, item: any) => total + item.value, 0);

                    if (totalWaterIntake < 4000) {
                        // Show popup reminder to drink water
                        toast.warn('You haven\'t reached your water intake target yet!');
                    }
                    let dataForLineChart = temp.map((item: any) => {
                        let val = JSON.stringify(item.value)
                        return val
                    })
                    let dataForXAxis = temp.map((item: any) => {
                        let val = new Date(item.date)
                        return val
                    })

                    setDataS1({
                        data: dataForLineChart,
                        title: '1 Day Water Intake',
                        color: color,
                        xAxis: {
                            data: dataForXAxis,
                            label: 'Last 10 Days',
                            scaleType: 'time'
                        }
                    })
                    
                } else {
                    setDataS1([])
                }
            })

            .catch(err => {
                console.log(err)
            })
        }
        else if (pathname === '/report/Weight') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/weighttrack/getweightbylimit', {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ limit: 10 })
            })
              .then(res => res.json())
              .then(data => {
                if (data.ok) {
                  let temp = data.data.map((item: any) => {
                    return {
                      date: item.date,
                      value: item.weight,
                      unit: 'kg'
                    };
                  });
                  let dataForLineChart = temp.map((item: any) => {
                    let val = JSON.stringify(item.value);
                    return val;
                  });
                  let dataForXAxis = temp.map((item: any) => {
                    let val = new Date(item.date);
                    return val;
                  });
        
                  setDataS1({
                    data: dataForLineChart,
                    title: '1 Day Weight Tracking',
                    color: color,
                    xAxis: {
                      data: dataForXAxis,
                      label: 'Last 10 Days',
                      scaleType: 'time'
                    }
                  });
                } else {
                  setDataS1([]);
                }
              })
              .catch(err => {
                console.log(err);
              });
          } else if (pathname === '/report/Workout') {
            fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/workouttrack/getworkoutsbylimit', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ limit: 10 })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.ok) {
                        let temp = data.data.map((item: any) => {
                            return {
                                date: item.date,
                                value: item.durationInMinutes,
                                unit: 'minutes'
                            };
                        });
                        let dataForLineChart = temp.map((item: any) => {
                            let val = JSON.stringify(item.value);
                            return val;
                        });
                        let dataForXAxis = temp.map((item: any) => {
                            let val = new Date(item.date);
                            return val;
                        });
    
                        setDataS1({
                            data: dataForLineChart,
                            title: '1 Day Workout Duration',
                            color: color,
                            xAxis: {
                                data: dataForXAxis,
                                label: 'Last 10 Days',
                                scaleType: 'time'
                            }
                        });
                    } else {
                        setDataS1([]);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            console.log('Invalid pathname');
        }
        

        // let temp = [
        //     {
        //         date : 'Fri Apr 19 2024 19:34:58 GMT+0530 (India Standard Time)',
        //         value: 2000,
        //         unit: 'kcal'
        //     },
        //     {
        //         date: "Wed Apr 17 2024 19:34:58 GMT+0530 (India Standard Time)",
        //         value: 2500,
        //         unit: 'kcal'
        //     },
        //     {
        //         date: "Tue Apr 16 2024 19:34:58 GMT+0530 (India Standard Time)",
        //         value: 2700,
        //         unit: 'kcal'
        //     },
        //     {
        //         date: "Mon Apr 15 2024 19:34:58 GMT+0530 (India Standard Time)",
        //         value: 3000,
        //         unit: 'kcal'
        //     },
        //     {
        //         date: "Sun Apr 14 2024 19:34:58 GMT+0530 (India Standard Time)",
        //         value: 2000,
        //         unit: 'kcal'
        //     },
        //     {
        //         date: "Sat Apr 13 2024 19:34:58 GMT+0530 (India Standard Time)",
        //         value: 2300,
        //         unit: 'kcal'
        //     },
        //     {
        //         date: "Fri Apr 12 2024 19:34:58 GMT+0530 (India Standard Time)",
        //         value: 2500,
        //         unit: 'kcal'
        //     },
        //     {
        //         date: "Thu Apr 11 2024 19:34:58 GMT+0530 (India Standard Time)",
        //         value: 2700,
        //         unit: 'kcal'
        //     },
        // ]

    //     let dataForLineChart = temp.map((item: any) => {
    //         let val = JSON.stringify(item.value)
    //         return val
    //     })

    //     let dataForXAxis = temp.map((item: any) => {
    //         let val = new Date(item.date)
    //         return val
    //     })

    //     console.log({
    //       data: dataForLineChart,
    //       title: '1 Day Calorie Intake',
    //       color: color,
    //       xAxis: {
    //           data: dataForXAxis,
    //           label: 'Last 10 Days',
    //           scaleType: 'time'
    //       }
    //   })

    //     setDataS1({
    //       data: dataForLineChart,
    //       title: '1 Day Calorie Intake',
    //       color: color,
    //       xAxis: {
    //           data: dataForXAxis,
    //           label: 'Last 10 Days',
    //           scaleType: 'time'
    //       }
    //   })
     }

    React.useEffect(() => {
        getDataForS1()
    }, [])
    const dateFormatter = new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
  });
  
  
  const valueFormatter = (date: any) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    // Check if dateObj is a valid Date object
    if (isNaN(dateObj.getTime())) {
        return ''; // or any default value you prefer
    }
    
    return dateFormatter.format(dateObj);
};
    const [showCalorieIntakePopup, setShowCalorieIntakePopup] = React.useState<boolean>(false)
    const [showSleepPopup, setShowSleepPopup ] = React.useState<boolean>(false)
    const [showStepsPopup, setShowStepsPopup ] =   React.useState<boolean>(false)
    const [showWaterPopup, setShowWaterPopup ] = React.useState<boolean>(false)
    const [showWeightPopup, setShowWeightPopup ]= React.useState<boolean>(false)
    const [showWorkoutPopup, setShowWorkoutPopup ] = React.useState<boolean>(false)
    return (
        <div className='reportpage'>
        
                <div className='s1'>
                {
                   (dataS1 && Object.keys(dataS1).length > 0) &&(
                    <LineChart
                        xAxis={[{
                            id: 'Day',
                            data: dataS1.xAxis.data,
                            scaleType: dataS1.xAxis.scaleType,
                            label: dataS1.xAxis.label,
                            valueFormatter,
                        }]}
                        series={[
                            {
                                data: dataS1.data,
                                label: dataS1.title,
                                color: dataS1.color,
                            },
                        ]}
                        {...chartsParams}
                    />)
                }
            </div>
            
           
            <button className='editbutton'
                onClick={() => {
                    if (pathname == '/report/Calorie%20Intake') {
                        setShowCalorieIntakePopup(true)
                    }
                    else if (pathname == '/report/Sleep'){
                        setShowSleepPopup(true)
                    }
                    else if (pathname == '/report/Steps'){
                        setShowStepsPopup(true)
                    }   
                    else if (pathname == '/report/Water'){
                        setShowWaterPopup(true)
                    }
                    else if (pathname == '/report/Weight'){
                        setShowWeightPopup(true)
                    }
                    else if (pathname == '/report/Workout'){
                        setShowWorkoutPopup(true)
                    }
                    else{
                        console.log('error')
                    }
                }}
            >
                <AiFillEdit />
            </button>

            {
                showCalorieIntakePopup && 

                <CaloriIntakePopup setShowCalorieIntakePopup={setShowCalorieIntakePopup} />

            }
            {
                showSleepPopup &&
                <SleepTrackPopup setShowSleepTrackPopup={setShowSleepPopup} />
            }
            {
                showStepsPopup &&
                <StepsTrackPopup setShowStepsTrackPopup={setShowStepsPopup} />

            }
            {
    
                showWaterPopup &&
                <WaterTrackPopup setShowWaterTrackPopup={setShowWaterPopup}  />
                
            }
            {
                showWeightPopup &&
                <WeightTrackPopup setShowWeightTrackPopup={setShowWeightPopup} />
            }
            {
                showWorkoutPopup &&
                <WorkoutTrackPopup setShowWorkoutTrackPopup={setShowWorkoutPopup} />
            }
        </div>
    )
}

export default page