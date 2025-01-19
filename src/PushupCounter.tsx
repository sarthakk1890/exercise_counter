import React, { useEffect, useRef, useState } from 'react';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { ExerciseConfig, exercises } from './Exercises';


const CountUpTimer: React.FC<{
    startTime?: number;
    targetTime?: number;
    onComplete?: () => void;
}> = ({ startTime = 0, targetTime, onComplete }) => {
    const [time, setTime] = useState(startTime);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Start new interval
        intervalRef.current = setInterval(() => {
            setTime(prevTime => {
                const newTime = prevTime + 1;
                if (targetTime && newTime >= targetTime) {
                    if (onComplete) onComplete();
                    // Clear interval when target is reached
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                }
                return newTime;
            });
        }, 1000);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    return (
        <div className="text-xl font-bold">
            {time} / {targetTime || 0} seconds
        </div>
    );
};


const ExerciseMonitor: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const poseRef = useRef<Pose | null>(null);
    const requestRef = useRef<number>();

    const [selectedExercise, setSelectedExercise] = useState<string>("pushup");
    const [count, setCount] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [feedback, setFeedback] = useState("Get Ready");
    const [debugAngles, setDebugAngles] = useState<{ [key: string]: number }>({});
    const [showTimer, setShowTimer] = useState(false);

    const [formStreak, setFormStreak] = useState(0);

    const countRef = useRef(0);
    const directionRef = useRef(0);
    const lastValidFormTime = useRef<number | null>(null);

    const calculateAngle = (p1: any, p2: any, p3: any) => {
        if (!p1 || !p2 || !p3) return 0;

        const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) -
            Math.atan2(p1.y - p2.y, p1.x - p2.x);
        let angle = Math.abs(radians * 180.0 / Math.PI);

        if (angle > 180.0) {
            angle = 360 - angle;
        }

        return angle;
    };

    const checkForm = (landmarks: any[], requirements: ExerciseConfig['formRequirements']) => {
        const angles: { [key: string]: number } = {};
        const validations = requirements.map((req, index) => {
            const angle = calculateAngle(
                landmarks[req.points[0]],
                landmarks[req.points[1]],
                landmarks[req.points[2]]
            );

            angles[`angle${index}`] = angle;

            const isValid = (!req.minAngle || angle >= req.minAngle) &&
                (!req.maxAngle || angle <= req.maxAngle);

            console.log(`Angle ${index}:`, angle.toFixed(2),
                `Valid: ${isValid}`,
                `Range: ${req.minAngle}-${req.maxAngle}`);

            return isValid;
        });

        setDebugAngles(angles);
        return validations.every(v => v);
    };

    const handleTimedExercise = (landmarks: any[], config: ExerciseConfig) => {
        const hasCorrectForm = checkForm(landmarks, config.formRequirements);

        if (hasCorrectForm) {
            // Immediately set timer states when form is correct
            setIsActive(true);
            setShowTimer(true);
            setFeedback(config.messages.correct);

            // Increment form streak after states are set
            setFormStreak(prev => {
                console.log('Current form streak:', prev + 1);
                return prev + 1;
            });
        } else {
            // Reset everything when form is incorrect
            setFormStreak(0);
            setIsActive(false);
            setShowTimer(false);
            setFeedback(config.messages.wrongForm);
        }

        // Debug logging
        console.log('Timer Debug:', {
            hasCorrectForm,
            formStreak,
            isActive,
            showTimer,
            angles: debugAngles
        });
    };

    const handleRepExercise = (landmarks: any[], config: ExerciseConfig) => {

        if (!config.repThresholds) return;

        const mainAngle = calculateAngle(
            landmarks[config.anglePoints[0].points[0]],
            landmarks[config.anglePoints[0].points[1]],
            landmarks[config.anglePoints[0].points[2]]
        );

        if (checkForm(landmarks, config.formRequirements)) {
            if (directionRef.current === 0 && mainAngle <= config.repThresholds.down) {
                setFeedback(config.messages.halfway || "");
                directionRef.current = 1;
            } else if (directionRef.current === 1 && mainAngle >= config.repThresholds.up) {
                countRef.current++;
                setCount(countRef.current);
                setFeedback(config.messages.correct);
                directionRef.current = 0;
            }
        } else {
            setFeedback(config.messages.wrongForm);
        }
    };

    const handleExerciseComplete = () => {
        setIsActive(false);
        setShowTimer(false);
        setFeedback("Exercise complete!");
    };

    const updateExerciseStatus = (results: Results) => {
        if (!results.poseLandmarks) return;

        console.log("______________SELECTED_EXERCISE__________________:", selectedExercise);

        // Ensure the selected exercise config is used
        const config = exercises[selectedExercise];
        const landmarks = results.poseLandmarks;

        switch (config.type) {
            case 'rep':
                handleRepExercise(landmarks, config);
                break;
            case 'time':
            case 'hold':
                handleTimedExercise(landmarks, config);
                break;
        }
    };

    const onResults = (results: Results) => {
        if (!canvasRef.current || !videoRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        if (results.poseLandmarks) {
            drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
                color: '#00FF00',
                lineWidth: 2
            });
            drawLandmarks(ctx, results.poseLandmarks, {
                color: '#FF0000',
                lineWidth: 1,
                radius: 3
            });

            updateExerciseStatus(results);
        }

        ctx.restore();
    };

    useEffect(() => {
        const initializePose = async () => {
            const pose = new Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                }
            });

            pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            pose.onResults(onResults);
            poseRef.current = pose;

            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 640, height: 480 }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();

                    if (canvasRef.current) {
                        canvasRef.current.width = videoRef.current.videoWidth;
                        canvasRef.current.height = videoRef.current.videoHeight;
                    }

                    requestAnimationFrame(animate);
                }
            } catch (error) {
                console.error('Error:', error);
                setFeedback('Camera error');
            }
        };

        initializePose();

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream)
                    .getTracks()
                    .forEach(track => track.stop());
            }
            if (poseRef.current) {
                poseRef.current.close();
            }
        };
    }, [selectedExercise]);

    useEffect(() => {
        setFormStreak(0);
        setIsActive(false);
        setShowTimer(false);
        console.log('Selected Exercise Changed:', selectedExercise);
        const config = exercises[selectedExercise];
        console.log('Exercise Config:', config);
    }, [selectedExercise]);


    const animate = async () => {
        if (!videoRef.current || !poseRef.current) return;
        await poseRef.current.send({ image: videoRef.current });
        requestRef.current = requestAnimationFrame(animate);
    };

    return (
        <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
            <canvas
                ref={canvasRef}
                className="absolute w-full h-full object-cover"
            />
            <video
                ref={videoRef}
                className="absolute w-full h-full object-cover"
                playsInline
                muted
            />
            
            <div className="absolute top-4 left-4 bg-white/80 p-4 rounded-lg">
                <select
                    value={selectedExercise}
                    onChange={(e) => {
                        const newExercise = e.target.value;
                        setSelectedExercise(newExercise);

                        // Reset all states for the new exercise
                        setCount(0);
                        setShowTimer(false);
                        setIsActive(false);
                        setFeedback(exercises[newExercise].messages.start); // Reset feedback to start message
                        countRef.current = 0;
                        directionRef.current = 0;
                        lastValidFormTime.current = null;

                        const newConfig = exercises[newExercise];
                        if (newConfig.type === 'rep') {
                            // Additional setup for rep-based exercises if needed
                        } else if (newConfig.type === 'time' || newConfig.type === 'hold') {
                            // Additional setup for time-based or hold exercises if needed
                        }
                    }}
                    className="mb-4 p-2 rounded"
                >
                    {Object.entries(exercises).map(([key, exercise]) => (
                        <option key={key} value={key}>
                            {exercise.name}
                        </option>
                    ))}
                </select>
                <h2 className="text-2xl font-bold">{exercises[selectedExercise].name}</h2>
                {exercises[selectedExercise].type === 'rep' ? (
                    <p className="text-xl">Reps: {count}</p>
                ) : (
                    <div className="text-xl">
                        {showTimer && (
                            <CountUpTimer
                                targetTime={exercises[selectedExercise].holdTime}
                                onComplete={handleExerciseComplete}
                            />
                        )}
                    </div>
                )}
                <p className="text-xl font-semibold mt-2">Status: {feedback}</p>
                <div className="text-sm mt-2">
                    <p className="font-medium">Active: {isActive ? 'Yes' : 'No'}</p>
                    <p className="font-medium">Timer Visible: {showTimer ? 'Yes' : 'No'}</p>
                    <p className="font-medium">Form Streak: {formStreak}</p>
                    {Object.entries(debugAngles).map(([key, angle]) => (
                        <p key={key} className="font-medium">
                            {key}: {angle.toFixed(1)}°
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExerciseMonitor;