import React, { useEffect, useRef, useState } from 'react';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

const PushupCounter: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const poseRef = useRef<Pose | null>(null);
    const requestRef = useRef<number>();
    const [count, setCount] = useState(0);
    const [feedback, setFeedback] = useState("Get Ready");

    const countRef = useRef(0);
    const directionRef = useRef(0);
    const formRef = useRef(0);

    const calculateAngle = (p1: any, p2: any, p3: any) => {
        if (!p1 || !p2 || !p3) return 0;

        const angle = Math.abs(
            Math.atan2(p3.y - p2.y, p3.x - p2.x) -
            Math.atan2(p1.y - p2.y, p1.x - p2.x)
        ) * 180 / Math.PI;

        return angle > 180 ? 360 - angle : angle;
    };

    const updatePushupCount = (results: Results) => {
        if (!results.poseLandmarks) return;

        const landmarks = results.poseLandmarks;

        const elbow = calculateAngle(
            landmarks[11], // shoulder
            landmarks[13], // elbow
            landmarks[15]  // wrist
        );

        const shoulder = calculateAngle(
            landmarks[13], // elbow
            landmarks[11], // shoulder
            landmarks[23]  // hip
        );

        const hip = calculateAngle(
            landmarks[11], // shoulder
            landmarks[23], // hip
            landmarks[25]  // knee
        );

        if (elbow > 160 && shoulder > 40 && hip > 160) {
            formRef.current = 1;
        }

        if (formRef.current === 1) {
            if (elbow <= 90 && hip > 160) {
                setFeedback("Up");
                if (directionRef.current === 0) {
                    countRef.current += 0.5;
                    directionRef.current = 1;
                    setCount(Math.floor(countRef.current));
                }
            } else if (elbow > 160 && shoulder > 40 && hip > 160) {
                setFeedback("Down");
                if (directionRef.current === 1) {
                    countRef.current += 0.5;
                    directionRef.current = 0;
                    setCount(Math.floor(countRef.current));
                }
            }
        } else {
            setFeedback("Fix Form");
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

            updatePushupCount(results);
        }

        ctx.restore();
    };

    const animate = async () => {
        if (!videoRef.current || !poseRef.current) return;
        await poseRef.current.send({ image: videoRef.current });
        requestRef.current = requestAnimationFrame(animate);
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

                    requestRef.current = requestAnimationFrame(animate);
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
    }, []);

    return (
        <div className="relative w-full h-screen bg-gray-900 flex items-center justify-center">
            <video
                ref={videoRef}
                className="absolute w-full h-full object-cover"
                playsInline
                muted
            />
            <canvas
                ref={canvasRef}
                className="absolute w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/80 p-4 rounded-lg">
                <h2 className="text-2xl font-bold">Push-up Counter</h2>
                <p className="text-xl">Count: {count}</p>
                <p className="text-xl">Status: {feedback}</p>
            </div>
        </div>
    );
};

export default PushupCounter;