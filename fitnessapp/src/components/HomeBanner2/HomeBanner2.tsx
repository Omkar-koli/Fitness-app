import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import './HomeBanner2.css'
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';
import { duration } from '@mui/material';
const HomeBanner2 = () => {
  const [workouts, setWorkouts] = React.useState<any[] | null>(null)
  const [data, setData] = React.useState<any[] | null>(null)
  // const getworkouts = async () => {
  //   let data: any =[
  //     {
  //       type: 'Chest',
  //       imageUrl: 'https://th.bing.com/th/id/OIG1.jcTe6qXrE9ujmLolphVu?pid=ImgGn',
  //       durationInMin: 40
  //     },
  //     {
  //       type: 'Abs',
  //       imageUrl: 'https://th.bing.com/th/id/OIG4.0fzm6VKRdCO31W1dm1r2?w=1024&h=1024&rs=1&pid=ImgDetMain',
  //       durationInMin: 90
  //     },
  //     {
  //       type: 'Shoulder',
  //       imageUrl: 'https://th.bing.com/th/id/OIG2..gebG73x8DPV_I2XGmaT?pid=ImgGn',
  //       durationInMin: 40
  //     },
  //     {
  //       type: 'Back',
  //       imageUrl: 'https://th.bing.com/th/id/OIG3.HhpWV7WqY13GyFnJFdsD?pid=ImgGn',
  //       durationInMin: 70
  //     },
  //     {
  //       type: 'Biceps',
  //       imageUrl: 'https://th.bing.com/th/id/OIG1.RyRlP1adlZR66a.w.lTw?w=1024&h=1024&rs=1&pid=ImgDetMain',
  //       durationInMin: 40
  //     },
  //     {
  //       type: 'Triceps',
  //       imageUrl: 'https://th.bing.com/th/id/OIG3.DmUrtPytBwa5OLbwa8HZ?w=1024&h=1024&rs=1&pid=ImgDetMain',
  //       durationInMin: 30
  //     },

  //     {
  //       type: 'Legs',
  //       imageUrl: 'https://th.bing.com/th/id/OIG1.NO0gTftjP__0GeJ77Jg0?pid=ImgGn',
  //       durationInMin: 80
  //     },

  //     {
  //       type: 'Cardio',
  //       imageUrl: 'https://th.bing.com/th/id/OIG1.96ikUdYf6BGNSa2j7vpD?w=1024&h=1024&rs=1&pid=ImgDetMain',
  //       durationInMin: 100
  //     },
  //     {
  //       type: 'Forearms',
  //       imageUrl: 'https://th.bing.com/th/id/OIG3.aaGU5SHpe1.bKWvvBu7p?w=1024&h=1024&rs=1&pid=ImgDetMain',
  //       durationInMin: 20
  //     }
  //   ]
  //   setWorkouts(data)
  // }
   

    const getData = async () => {
      fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/chest/workouts', {
        method: 'GET',
        credentials: 'include',
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if(data.ok) {
          setData(data.data)
        }
        else {
          setData([])
        }
      })
      .catch(err => {
        console.log(err)
        setData([])
      })
    }
    React.useEffect(() => {
      getData()
    },[])
  return (
   <>
   {
    data &&
    <div>
    <h1 className='mainhead'>Workouts</h1>
    <Swiper
      slidesPerView={1}
      spaceBetween={10}
      pagination={{
        clickable: true,
      }}
      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: 50,
        },
      }}
      modules={[Pagination]}
      className="mySwiper"
    >
     {
      data && data.map((item, index) => {
        return(
          <SwiperSlide key={index} >
            <div className='swiper-slide'
                style={{
                  backgroundImage: `url(${item.imageUrl})`,
                }}
                onClick={() => {
                  window.location.href =`/workout?type=${item.type}`
                }}
            >
              <div className='swiper-slide-content'>
                <h2>{item.type}</h2>
                <p>{item.durationInMin} Min</p>
              </div>
            </div>
          </SwiperSlide>
        )
      })
     }
    </Swiper>
  </div>
   }
   </>
  )
}

export default HomeBanner2