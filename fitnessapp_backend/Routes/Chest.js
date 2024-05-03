const express = require('express');
const router = express.Router();
const errorHandler = require('../Middlewares/errorMiddleware');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}
const WorkoutData= [
    {
        type: 'Chest',
        imageUrl: 'https://th.bing.com/th/id/OIG1.jcTe6qXrE9ujmLolphVu?pid=ImgGn',
        durationInMin: 40
      },
      {
        type: 'Abs',
        imageUrl: 'https://th.bing.com/th/id/OIG4.0fzm6VKRdCO31W1dm1r2?w=1024&h=1024&rs=1&pid=ImgDetMain',
        durationInMin: 90
      },
      {
        type: 'Shoulder',
        imageUrl: 'https://th.bing.com/th/id/OIG2..gebG73x8DPV_I2XGmaT?pid=ImgGn',
        durationInMin: 40
      },
      {
        type: 'Back',
        imageUrl: 'https://th.bing.com/th/id/OIG3.HhpWV7WqY13GyFnJFdsD?pid=ImgGn',
        durationInMin: 70
      },
      {
        type: 'Biceps',
        imageUrl: 'https://th.bing.com/th/id/OIG1.RyRlP1adlZR66a.w.lTw?w=1024&h=1024&rs=1&pid=ImgDetMain',
        durationInMin: 40
      },
      {
        type: 'Triceps',
        imageUrl: 'https://th.bing.com/th/id/OIG3.DmUrtPytBwa5OLbwa8HZ?w=1024&h=1024&rs=1&pid=ImgDetMain',
        durationInMin: 30
      },

      {
        type: 'Legs',
        imageUrl: 'https://th.bing.com/th/id/OIG1.NO0gTftjP__0GeJ77Jg0?pid=ImgGn',
        durationInMin: 80
      },

      {
        type: 'Cardio',
        imageUrl: 'https://th.bing.com/th/id/OIG1.96ikUdYf6BGNSa2j7vpD?w=1024&h=1024&rs=1&pid=ImgDetMain',
        durationInMin: 100
      },
      {
        type: 'Forearms',
        imageUrl: 'https://th.bing.com/th/id/OIG3.aaGU5SHpe1.bKWvvBu7p?w=1024&h=1024&rs=1&pid=ImgDetMain',
        durationInMin: 20
      }
];
// Define the chest workout data
const chestWorkoutData = [
  
  {
    name: 'Chest',
    exercise: 'Flat Bench Press',
    videoUrl: 'https://gymvisual.com/img/p/1/7/5/5/2/17552.gif',
    sets: 3,
    reps: 15,
    rest: 60,
    description: 'The flat bench press is a compound exercise that primarily targets the chest muscles (pectoralis major), along with the triceps and shoulders. Lie flat on a bench with your feet planted firmly on the ground. Grip the barbell slightly wider than shoulder-width apart, with your palms facing away from you. Lower the barbell to your chest, then press it back up to the starting position, fully extending your arms'
  },
  {
    name: 'Chest',
    exercise: 'Incline Bench Press',
    videoUrl: 'https://gymvisual.com/img/p/4/7/7/8/4778.gif',
    sets: 3,
    reps: 15,
    rest: 60,
    description: 'The incline bench press targets the upper portion of the chest muscles (pectoralis major), along with the front shoulders and triceps. Set the bench to an incline of around 30-45 degrees. Lie back on the bench with your feet flat on the floor and grip the barbell slightly wider than shoulder-width apart.'
  },
  {
    name: 'Chest',
    exercise: 'Decline Bench Press',
    videoUrl: 'https://gymvisual.com/img/p/4/7/6/7/4767.gif',
    sets: 3,
    reps: 15,
    rest: 60,
    description: 'The decline bench press primarily targets the lower portion of the chest muscles (pectoralis major), along with the triceps and shoulders. Set the bench to a decline angle of around 15-30 degrees. Lie back on the bench with your feet secured under the leg pads and grip the barbell slightly wider than shoulder-width apart. Lower the barbell to your lower chest, then press it back up to the starting position, fully extending your arms.'
  }
];

// Define the abs workout data
const absWorkoutData = [
  {
    exercise: 'Crunches',
    videoUrl: 'https://gymvisual.com/img/p/5/2/4/3/5243.gif',
    sets: 3,
    reps: 20,
    rest: 45,
    description: 'Crunches are great for working the abdominal muscles'
  },
  {
    exercise: 'Leg Raises',
    videoUrl: 'https://gymvisual.com/img/p/2/2/8/8/7/22887.gif',
    sets: 3,
    reps: 15,
    rest: 60,
    description: 'Leg Raises target the lower abs effectively'
  }
];
const shoulderWorkoutData = [
  {
    exercise: 'Barbell Standing Shoulder Press',
    videoUrl: 'https://gymvisual.com/img/p/2/4/9/5/0/24950.gif',
    sets: 4,
    reps: 8,
    rest: 60,
    description: 'The barbell standing shoulder press, also known as the military press, is a compound exercise that targets the shoulders, particularly the front deltoids, along with the triceps and upper chest. It helps in building overall shoulder strength and muscle mass.'
  },
  {
    exercise: 'Cable Kneeling Rear Delt Row',
    videoUrl: 'https://gymvisual.com/img/p/1/4/6/9/7/14697.gif',
    sets: 3,
    reps: 12,
    rest: 60,
    description: 'The cable kneeling rear delt row targets the rear deltoids, helping to improve shoulder stability and posture. This exercise also engages the upper back muscles, including the rhomboids and traps, contributing to overall back strength and development.'
  }
];
const backWorkoutData = [
  {
    exercise: 'Barbell Bent Over Row',
    videoUrl: 'https://gymvisual.com/img/p/1/0/6/1/7/10617.gif',
    sets: 4,
    reps: 8,
    rest: 60,
    description: 'The barbell bent over row targets the muscles of the upper back, including the latissimus dorsi, rhomboids, and traps, as well as the biceps. Stand with your feet hip-width apart, holding a barbell with an overhand grip, hands slightly wider than shoulder-width apart. Hinge forward from your hips while keeping your back straight until your torso is nearly parallel to the ground. '
  },
  {
    exercise: 'Cable Bar Lateral Pulldown',
    videoUrl: 'https://gymvisual.com/img/p/4/8/8/3/4883.gif',
    sets: 3,
    reps: 12,
    rest: 60,
    description: ' The cable bar lateral pulldown primarily targets the latissimus dorsi muscles (lats), along with the biceps and shoulders. Sit facing the cable machine with your feet flat on the ground and knees bent. Grip the bar with your hands wider than shoulder-width apart and palms facing forward. '
  },
  {
    exercise: 'Bird Dog',
    videoUrl: 'https://gymvisual.com/img/p/2/0/8/2/4/20824.gif',
    sets: 3,
    reps: 12,
    rest: 60,
    description: 'The bird dog exercise is a core stability exercise that targets the muscles of the core, including the lower back, abdominals, and glutes. Begin on your hands and knees in a tabletop position.'
  }
];
const bicepsWorkoutData = [
  {
    exercise: 'Barbell Curl',
    videoUrl: 'https://gymvisual.com/img/p/2/2/6/4/6/22646.gif',
    sets: 4,
    reps: 8,
    rest: 60,
    description: 'Stand with your feet shoulder-width apart, grip a barbell with an underhand grip (palms facing up), and curl the barbell towards your shoulders while keeping your elbows close to your body. '
  },
  {
    exercise: 'Cable Close Grip Curl',
    videoUrl: 'https://gymvisual.com/img/p/7/2/4/3/7243.gif',
    sets: 3,
    reps: 12,
    rest: 60,
    description: 'This exercise involves standing upright with a cable machine set to a low pulley position, holding the handle with a close grip (hands shoulder-width apart or closer), and curling the weight towards the shoulders while keeping the elbows close to the body.'
  },
  {
    exercise: 'Cable Hammer Curl',
    videoUrl: 'https://gymvisual.com/img/p/4/8/9/9/4899.gif',
    sets: 3,
    reps: 12,
    rest: 60,
    description: ' This exercise involves standing upright with a cable machine set to a low pulley position, holding the handle with a neutral grip (palms facing each other), and curling the weight towards the shoulders while keeping the elbows close to the body. It provides a unique stimulus to the arms compared to traditional dumbbell curls and helps in building forearm and bicep strength and size.'
  }
];
const tricepsWorkoutData = [
  {
    exercise: 'Bench Dip (knees bent)',
    videoUrl: 'https://gymvisual.com/img/p/1/0/3/8/6/10386.gif',
    sets: 4,
    reps: 8,
    rest: 60,
    description: 'The bench dip with knees bent is an effective bodyweight exercise for targeting the triceps, chest, and shoulders. It involves sitting on a bench with knees bent and feet flat on the floor, gripping the edge of the bench with hands shoulder-width apart, and lowering the body by bending the elbows until they reach about 90 degrees'
  },
  {
    exercise: 'Cable High Pulley Overhead Tricep Extension',
    videoUrl: 'https://gymvisual.com/img/p/9/7/2/6/9726.gif',
    sets: 3,
    reps: 12,
    rest: 60,
    description: 'The cable high pulley overhead tricep extension targets the triceps brachii muscle. This exercise involves standing upright with a cable machine set to a high pulley position, grasping the handle with both hands, and extending the arms overhead while keeping the elbows close to the head.'
  }
];
const legsWorkoutData = [
  {
    exercise: 'Barbell Full Squat ',
    videoUrl: 'https://gymvisual.com/img/p/6/6/9/6/6696.gif',
    sets: 4,
    reps: 8,
    rest: 60,
    description: 'The barbell full squat is a compound exercise that targets the quadriceps, hamstrings, glutes, and lower back. It involves squatting down until the thighs are parallel to the ground or below parallel if mobility allows, then driving back up to the starting position. '
  },
  {
    exercise: 'Dumbbell Bar Grip Sumo Squat ',
    videoUrl: 'https://gymvisual.com/img/p/1/0/5/6/1/10561.gif',
    sets: 3,
    reps: 12,
    rest: 60,
    description: 'The dumbbell bar grip sumo squat is a variation of the traditional sumo squat using a dumbbell held with both hands vertically in front of the body. This exercise primarily targets the quadriceps, inner thighs, hamstrings, and glutes.'
  },
  {
    exercise: 'Bodyweight Heel Elevated Bulgarian Split Squat  ',
    videoUrl: 'https://gymvisual.com/img/p/3/2/8/3/3/32833.gif',
    sets: 3,
    reps: 12,
    rest: 60,
    description: 'The bodyweight heel elevated Bulgarian split squat is a unilateral lower body exercise that targets the quadriceps, hamstrings, glutes, and calves. By elevating the heel, it increases the emphasis on the quadriceps and provides a greater stretch in the hip flexors. This exercise helps in improving lower body strength, balance, and stability.'
  }
];
const cardioWorkoutData = [
  {
    exercise: 'Back And Forth Step',
    videoUrl: 'https://gymvisual.com/img/p/1/4/7/5/4/14754.gif',
    sets: 4,
    reps: 8,
    rest: 60,
    description: 'Back and forth step, also known as alternating step-ups, is a lower body exercise that targets the quadriceps, hamstrings, glutes, and calves. It involves stepping onto a platform or bench with one foot, then stepping down and repeating the movement with the other foot. This exercise helps in improving lower body strength, stability, and coordination.'
  },
  {
    exercise: 'Burpee',
    videoUrl: 'https://gymvisual.com/img/p/8/9/6/6/8966.gif',
    sets: 3,
    reps: 12,
    rest: 60,
    description: 'Burpees are a full-body exercise that targets multiple muscle groups, including the chest, shoulders, arms, core, and legs. They are performed by combining a squat, push-up, and jump into one fluid motion'
  },
  {
    exercise: 'Frog Hops ',
    videoUrl: 'https://gymvisual.com/img/p/1/4/9/3/1/14931.gif',
    sets: 3,
    reps: 10,
    rest: 60,
    description: ': Frog hops are a plyometric exercise that targets the lower body, including the quadriceps, hamstrings, glutes, and calves. This exercise involves explosive movements that help in improving lower body strength, power, and agility. Frog hops are also effective for cardiovascular conditioning and calorie burning.'
  }
];
const forearmsWorkoutData = [
  {
    exercise: 'Barbell Palms Up Wrist Curl Over A Bench',
    videoUrl: 'https://gymvisual.com/img/p/6/6/7/3/6673.gif',
    sets: 3,
    reps: 15,
    rest: 60,
    description: ' The barbell palms-up wrist curl over a bench targets the forearm flexor muscles, specifically the wrist flexors and the muscles of the forearm. This exercise helps in strengthening the wrists and improving grip strength, which is beneficial for various activities and lifts involving wrist movements.'
  },
  {
    exercise: 'Barbell Standing Reverse Grip Curl',
    videoUrl: 'https://gymvisual.com/img/p/4/8/4/8/4848.gif',
    sets: 3,
    reps: 12,
    rest: 60,
    description: 'The barbell standing reverse grip curl primarily targets the brachioradialis muscle of the forearm, as well as the biceps brachii. This exercise helps in developing forearm size and strength, particularly focusing on the muscles responsible for wrist flexion and pronation.'
  },
  {
    exercise: 'Cable Standing Back Wrist Curl',
    videoUrl: 'https://gymvisual.com/img/p/2/8/2/6/5/28265.gif',
    Sets: 3,
    reps: 15,
    rest: 60,
    description: 'The cable standing back wrist curl targets the forearm extensor muscles, which are responsible for wrist and finger extension. This exercise helps in strengthening the forearms and improving grip strength, which is beneficial for various activities involving wrist and hand movements.'
  }
];

router.get('/workouts', async (req, res) => {
    try {
        // Return the predefined chest workout data
        res.json(createResponse(true, ' workout fetched successfully', WorkoutData));
    } catch (err) {
        res.json(createResponse(false, err.message));
    }
});

// Route to fetch workouts based on type
router.get('/workouts/:type', async (req, res) => {
  try {
    const { type } = req.params;

    // Check the type and return the appropriate workout data
    let data;
    if (type === 'Chest') {
      data = chestWorkoutData;
    } else if (type === 'Abs') {
      data = absWorkoutData;
    } else if (type === 'Shoulder'){
      data = shoulderWorkoutData;
    }
      else if ( type === 'Back'){
        data = backWorkoutData;
      }
      else if ( type === 'Biceps'){
        data = bicepsWorkoutData;
      }
      else if ( type === 'Triceps'){
        data = tricepsWorkoutData;
      }
      else if ( type === 'Legs'){
        data = legsWorkoutData;
      }
      else if ( type === 'Cardio'){
        data = cardioWorkoutData ;
      }
      else if ( type === 'Forearms'){
        data = forearmsWorkoutData;
      }
      else {
      throw new Error('Invalid workout type')
    }
    
    res.json(createResponse(true, `${type} workout fetched successfully`, data));
  } catch (err) {
    res.json(createResponse(false, err.message));
  }
});

// Error handling middleware
router.use(errorHandler);

module.exports = router;
