
export type AnglePoint = {
    name: string;
    points: [number, number, number];
    minAngle?: number;
    maxAngle?: number;
};

export type ExerciseType = 'rep' | 'time' | 'hold';

export interface ExerciseConfig {
    name: string;
    type: ExerciseType;
    anglePoints: AnglePoint[];
    formRequirements: {
        points: [number, number, number];
        minAngle?: number;
        maxAngle?: number;
    }[];
    repThresholds?: {
        down: number;
        up: number;
    };
    holdTime?: number;
    messages: {
        start: string;
        wrongForm: string;
        correct: string;
        halfway?: string;
    };
}

export const exercises: { [key: string]: ExerciseConfig } = {

    pushup: {
        name: "Push-ups",
        type: "rep",
        anglePoints: [
            {
                name: "elbow",
                points: [11, 13, 15],
                minAngle: 80,
                maxAngle: 165
            }
        ],
        formRequirements: [
            {
                points: [11, 23, 25],
                minAngle: 160
            }
        ],
        repThresholds: {
            down: 80,
            up: 165
        },
        messages: {
            start: "Get in plank position",
            wrongForm: "Keep your back straight",
            correct: "Good form!",
            halfway: "Push back up"
        }
    },
    squat: {
        name: "Squats",
        type: "rep",
        anglePoints: [
            {
                name: "knee",
                points: [23, 25, 27],
                minAngle: 45,
                maxAngle: 90
            }
        ],
        formRequirements: [
            {
                points: [11, 23, 25],
                minAngle: 45,
                maxAngle: 180
            }
        ],
        repThresholds: {
            down: 80,
            up: 160
        },
        messages: {
            start: "Stand straight",
            wrongForm: "Watch your form",
            correct: "Good squat!",
            halfway: "Push up"
        }
    },

    // straightLegRaiseRight: {
    //     name: "Straight Leg Raise Right",
    //     type: "rep",
    //     anglePoints: [
    //         {
    //             name: "hip",
    //             points: [23, 25, 27],
    //             minAngle: 0,
    //             maxAngle: 90
    //         }
    //     ],
    //     formRequirements: [
    //         {
    //             points: [11, 23, 25],
    //             minAngle: 150
    //         },
    //         {
    //             points: [23, 25, 27],
    //             minAngle: 150
    //         }
    //     ],
    //     repThresholds: {
    //         down: 10,
    //         up: 75
    //     },
    //     messages: {
    //         start: "Lie on your back with legs straight",
    //         wrongForm: "Keep your leg straight and back flat",
    //         correct: "Good form!",
    //         halfway: "Lower the leg back down slowly"
    //     }
    // },
    // straightLegRaiseLeft: {
    //     name: "Straight Leg Raise Left",
    //     type: "rep",
    //     anglePoints: [
    //         {
    //             name: "hip",
    //             points: [24, 26, 28],
    //             minAngle: 0,
    //             maxAngle: 90
    //         }
    //     ],
    //     formRequirements: [
    //         {
    //             points: [12, 24, 26],
    //             minAngle: 150
    //         },
    //         {
    //             points: [24, 26, 28],
    //             minAngle: 150
    //         }
    //     ],
    //     repThresholds: {
    //         down: 10,
    //         up: 75
    //     },
    //     messages: {
    //         start: "Lie on your back with legs straight",
    //         wrongForm: "Keep your leg straight and back flat",
    //         correct: "Good form!",
    //         halfway: "Lower the leg back down slowly"
    //     }
    // },
    // clamshell: {
    //     name: "Clamshell",
    //     type: "rep",
    //     anglePoints: [
    //         {
    //             name: "hip",
    //             points: [23, 25, 27],
    //             minAngle: 0,
    //             maxAngle: 45
    //         }
    //     ],
    //     formRequirements: [
    //         {
    //             points: [11, 23, 25],
    //             minAngle: 140
    //         }
    //     ],
    //     repThresholds: {
    //         down: 5,
    //         up: 35
    //     },
    //     messages: {
    //         start: "Lie on your side with knees bent at 90°",
    //         wrongForm: "Keep your hips stable",
    //         correct: "Good form!",
    //         halfway: "Lower your knee"
    //     }
    // },
    hipThrust: {
        name: "Hip Thrust",
        type: "rep",
        anglePoints: [
            {
                name: "hip",
                points: [11, 23, 25],
                minAngle: 80,
                maxAngle: 165
            }
        ],
        formRequirements: [
            {
                points: [23, 25, 27],
                minAngle: 45,
                maxAngle: 135
            }
        ],
        repThresholds: {
            down: 85,
            up: 160
        },
        messages: {
            start: "Set up with shoulders on bench, feet flat",
            wrongForm: "Keep your core engaged and maintain controlled movement",
            correct: "Good form!",
            halfway: "Lower your hips with control"
        }
    },
    plank: {
        name: "Plank",
        type: "time",
        anglePoints: [
            {
                name: "back",
                points: [11, 23, 25],
                minAngle: 130,
                maxAngle: 180
            },
            {
                name: "legs",
                points: [23, 25, 27],
                minAngle: 130,
                maxAngle: 180
            }
        ],
        formRequirements: [
            {
                points: [11, 23, 25],
                minAngle: 130,
                maxAngle: 180
            },
            {
                points: [23, 25, 27],
                minAngle: 130,
                maxAngle: 180
            }
        ],
        holdTime: 30,
        messages: {
            start: "Get into plank position",
            wrongForm: "Keep your back and legs straight",
            correct: "Great form, keep holding!",
            halfway: "Halfway there, keep going!"
        }
    },
    forearmPronation: {
        name: "Forearm Pronation",
        type: "rep",
        anglePoints: [
            {
                name: "wrist",
                points: [15, 17, 19],
                minAngle: 10,
                maxAngle: 90
            }
        ],
        formRequirements: [
            {
                points: [11, 13, 15],
                minAngle: 60,
                maxAngle: 120
            }
        ],
        repThresholds: {
            down: 10,
            up: 90
        },
        messages: {
            start: "Hold your arm out with elbow at 90° and rotate your palm down.",
            wrongForm: "Keep your elbow stable and avoid excessive movement.",
            correct: "Good! Rotate your wrist fully to complete the pronation.",
            halfway: "Rotate your wrist further to complete the motion.",

        }
    },
    reversePlank: {
        name: "Reverse Plank",
        type: "hold",
        anglePoints: [
            {
                name: "shoulder",
                points: [11, 13, 23],
                minAngle: 45,
                maxAngle: 90
            },
            {
                name: "hip",
                points: [11, 23, 25],
                minAngle: 150,
                maxAngle: 180
            },
        ],
        formRequirements: [
            {
                points: [11, 13, 23],
                minAngle: 45,
                maxAngle: 90
            },
            {
                points: [11, 23, 25],
                minAngle: 150,
                maxAngle: 180
            },
        ],
        repThresholds: {
            down: 170,
            up: 180
        },
        holdTime: 30,
        messages: {
            start: "Get into reverse plank position with hands behind you and feet extended.",
            wrongForm: "Ensure your body forms a straight line from head to heels.",
            correct: "Good! Keep your core tight and lift your hips higher.",
            halfway: "Focus on keeping your chest open and hips elevated."
        }
    },
    // benchTricepsDips: {
    //     name: "Bench Triceps Dips",
    //     type: "rep",
    //     anglePoints: [
    //         {
    //             name: "elbow",
    //             points: [11, 13, 15], // Shoulder, Elbow, Wrist
    //             minAngle: 120,  // More flexible bottom range (was 110)
    //             maxAngle: 170   // More flexible top range (was 160)
    //         },
    //         {
    //             name: "shoulder",
    //             points: [13, 11, 23], // Elbow, Shoulder, Hip
    //             minAngle: 25,   // More flexible minimum (was 35)
    //             maxAngle: 55    // More flexible maximum (was 48)
    //         },
    //         {
    //             name: "hip",
    //             points: [11, 23, 25], // Shoulder, Hip, Knee
    //             minAngle: 110,  // More flexible bottom range (was 125)
    //             maxAngle: 170   // More flexible top range (was 155)
    //         }
    //     ],
    //     formRequirements: [
    //         {
    //             points: [11, 13, 15], // Shoulder, Elbow, Wrist
    //             minAngle: 120,  // Matching more flexible elbow range
    //             maxAngle: 170
    //         },
    //         {
    //             points: [13, 11, 23], // Elbow, Shoulder, Hip
    //             minAngle: 25,   // Matching more flexible shoulder ran  ge
    //             maxAngle: 55
    //         }, 
    //         {
    //             points: [11, 23, 25], // Shoulder, Hip, Knee
    //             minAngle: 110,  // Matching more flexible hip range
    //             maxAngle: 170
    //         }
    //     ],
    //     repThresholds: {
    //         down: 120,    // More flexible bottom threshold (was 116)
    //         up: 160      // More flexible top threshold (was 154)
    //     },
    //     messages: {
    //         start: "Place your hands on a bench, extend your legs forward.",
    //         wrongForm: "Keep your elbows close and avoid shrugging your shoulders.",
    //         correct: "Good! Lower yourself with control.",
    //         halfway: "Push back up to the starting position."
    //     }
    // },
    overheadTricepsExtension: {
        name: "Overhead Triceps Extension",
        type: "rep",
        anglePoints: [
            {
                name: "elbow",
                points: [11, 13, 15],
                minAngle: 75,
                maxAngle: 160
            },
            {
                name: "shoulder",
                points: [13, 11, 23], // Elbow, Shoulder, Hip
                minAngle: 85,  // Keeps shoulders stable during movement
                maxAngle: 170  // Allows slight movement for control
            },
            {
                name: "spine",
                points: [11, 23, 25], // Shoulder, Hip, Knee
                minAngle: 165,  // Ensures upright posture
                maxAngle: 180   // Prevents excessive arching
            }
        ],
        formRequirements: [
            {
                points: [11, 13, 15], // Shoulder, Elbow, Wrist
                minAngle: 75,  // Ensures full range of motion
                maxAngle: 160  // Prevents elbow overextension
            },
            {
                points: [13, 11, 23], // Elbow, Shoulder, Hip
                minAngle: 85,  // Ensures stability in the shoulders
                maxAngle: 180  // Prevents unnecessary movement
            },
            {
                points: [11, 23, 25], // Shoulder, Hip, Knee
                minAngle: 165,  // Encourages upright posture
                maxAngle: 180   // Prevents excessive back arching
            }
        ],
        repThresholds: {
            down: 80,   // Deepest elbow flexion (weight behind head)
            up: 155     // Full elbow extension (arms straight overhead)
        },
        messages: {
            start: "Stand tall, hold the weight overhead with both hands.",
            wrongForm: "Keep your core tight and avoid excessive back arching.",
            correct: "Good! Extend your arms fully without locking the elbows.",
            halfway: "Lower the weight behind your head while keeping control."
        }
    },
    tricepsKickbacks: {
        name: "Triceps Kickbacks",
        type: "rep",
        anglePoints: [
            {
                name: "elbow",
                points: [11, 13, 15], // Shoulder, Elbow, Wrist
                minAngle: 90,  // Slightly more forgiving bottom position
                maxAngle: 170
            },
            {
                name: "shoulder",
                points: [13, 11, 23], // Elbow, Shoulder, Hip
                minAngle: 0,   // More forgiving for slight variations
                maxAngle: 30   // Allow small natural movement
            },
            {
                name: "hip",
                points: [11, 23, 25], // Shoulder, Hip, Knee
                minAngle: 110, // Match your hip angle
                maxAngle: 140  // Allow some variation in lean
            }
        ],
        formRequirements: [
            {
                points: [11, 13, 15], // Shoulder, Elbow, Wrist
                minAngle: 0,
                maxAngle: 180
            },
            {
                points: [13, 11, 23], // Elbow, Shoulder, Hip
                minAngle: 0,
                maxAngle: 60   // More forgiving for upper arm position
            },
            {
                points: [11, 23, 25], // Shoulder, Hip, Knee
                minAngle: 110,
                maxAngle: 140
            }
        ],
        repThresholds: {
            down: 90,    // Slightly more forgiving bottom position
            up: 170      // Don't require complete extension
        },
        messages: {
            start: "Lean forward slightly, keep your upper arms parallel to your torso.",
            wrongForm: "Keep your elbows fixed and avoid swinging.",
            correct: "Good! Fully extend your arms while keeping control.",
            halfway: "Squeeze your triceps at the top."
        }
    },
    zottmanCurls: {
        name: "Zottman Curls",
        type: "rep", // Repetitive motion for strength training
        anglePoints: [
            {
                name: "elbow",
                points: [11, 13, 15], // Shoulder, Elbow, Wrist
                minAngle: 30,  // Ensures full elbow flexion (top of the curl)
                maxAngle: 160  // Ensures full elbow extension (bottom position)
            },
            {
                name: "shoulder",
                points: [13, 11, 23], // Elbow, Shoulder, Hip
                minAngle: 70,  // Keeps shoulders from excessive movement
                maxAngle: 110  // Allows slight movement for control
            },
            {
                name: "wrist",
                points: [13, 15, 17], // Elbow, Wrist, Hand
                minAngle: 90,  // Ensures wrist rotation (supination to pronation)
                maxAngle: 180   // Maintains controlled grip transition
            }
        ],
        formRequirements: [
            {
                points: [11, 13, 15], // Shoulder, Elbow, Wrist
                minAngle: 30,  // Ensures proper contraction of the biceps
                maxAngle: 160  // Allows full extension without locking
            },
            {
                points: [13, 11, 23], // Elbow, Shoulder, Hip
                minAngle: 70,  // Ensures upper arm stability
                maxAngle: 110  // Prevents unnecessary movement
            },
            {
                points: [13, 15, 17], // Elbow, Wrist, Hand
                minAngle: 90,  // Ensures supination at the bottom and pronation at the top
                maxAngle: 180   // Prevents excessive wrist rotation
            }
        ],
        repThresholds: {
            down: 160,   // Full elbow extension (palms down)
            up: 30       // Full elbow flexion (palms up)
        },
        messages: {
            start: "Stand straight with dumbbells in a supinated grip (palms up).",
            wrongForm: "Keep your elbows close and control the wrist rotation.",
            correct: "Good! Rotate the grip at the top for the reverse curl down.",
            halfway: "Squeeze your biceps at the top before rotating."
        }
    }
};