"use client"
import React from 'react'
import './workoutPage.css'
import { useSearchParams } from 'next/navigation'
const page = () => {
    const [workout, setWorkout] = React.useState<any>(null)
    const searchParams = useSearchParams()
    const [data, setData] = React.useState<any>(null)
    const workoutType = searchParams.get('type');
    

    const getworkout = async () => {
        // let data: any = {
        //     type: 'Chest',
        //     imageUrl: 'https://th.bing.com/th/id/OIG1.jcTe6qXrE9ujmLolphVu?pid=ImgGn',
        //     durationInMin: 40,
        //     exercises: [
        //         {
        //             exercise: 'Flat Bench Press',
        //             videoUrl : 'https://gymvisual.com/img/p/1/7/5/5/2/17552.gif',
        //             sets: 3,
        //             reps: 15,
        //             rest: 60,
        //             description: 'Benchpress is a good exercise for chest'
        //         },
        //         {
        //             exercise: 'Incline Bench Press',
        //             videoUrl : 'https://gymvisual.com/img/p/4/7/7/8/4778.gif',
        //             sets: 3,
        //             reps: 15,
        //             rest: 60,
        //             description: 'Incline Benchpress is a good exercise for Upper chest'
        //         },
        //         {
        //             exercise: 'Decline Bench Press',
        //             videoUrl : 'https://gymvisual.com/img/p/4/7/6/7/4767.gif',
        //             sets: 3,
        //             reps: 15,
        //             rest: 60,
        //             description: 'Incline Benchpress is a good exercise for Lower chest'
        //         }
        //     ]
        
    // };
        
    //     setWorkout(data)
    fetch(process.env.NEXT_PUBLIC_BACKEND_API + `/chest/workouts/` + workoutType, {
            method: 'GET',
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.ok) {
                
                setData(data.data)
            }
            else{
                setData(null)
            }
        })
        .catch(err => {
            console.log(err)
        })
    }
    console.log(data);
    

    React.useEffect(() => {
        getworkout()
    },[])

  return (
    <>
    {
        data && 
        
        <div className='workout'>
        <h1 className='mainhead'> {data.type} Workouts</h1>
        <div className='workout__exercises'>
            
            {
                data && data?.map((item: any, index: number) => {
                    return (
                        <div className={
                            index % 2 === 0 ? 'workout__exercise' : 'workout__exercise workout__exercise--reverse'
                        }>
                            <h3>{index + 1}</h3>
                            <div className='workout__exercise__image'>
                                <img src={item.videoUrl} alt="" />
                            </div>
                            <div className='workout__exercise__content'>
                                <h2>{item.exercise}</h2>
                                <span>{item.sets} sets X {item.reps} reps</span>
                                <p>{item.description}</p>
                            </div>

                        </div>
                    )
                })
            }
        </div>
    </div>
    }
    </>
  )
}

export default page