import '@mediapipe/pose';
import {
    Pose,
    Results,
    POSE_CONNECTIONS,
    PoseLandmark
} from '@mediapipe/pose';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

enum Complexity {
    Low = 1,
    Medium = 2,
    High = 3
}

interface PoseDetectorConfig {
    mode?: boolean;
    complexity?: Complexity;
    smoothLandmarks?: boolean;
    enableSegmentation?: boolean;
    smoothSegmentation?: boolean;
    detectionCon?: number;
    trackCon?: number;
}

interface Point {
    x: number;
    y: number;
    z: number;
    visibility?: number;
}

export class PoseDetector {
    private pose: Pose;
    private results: Results | null = null;
    private landmarksList: Point[] = [];
    private canvasContext: CanvasRenderingContext2D | null = null;

    constructor({
        mode = false,
        complexity = 1,
        smoothLandmarks = true,
        enableSegmentation = false,
        smoothSegmentation = true,
        detectionCon = 0.5,
        trackCon = 0.5
    }: PoseDetectorConfig = {}) {
        this.pose = new Pose({
            locateFile: (file: string) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });

        this.pose.setOptions({
            selfieMode: mode,
            modelComplexity: complexity,
            smoothLandmarks: smoothLandmarks,
            enableSegmentation: enableSegmentation,
            smoothSegmentation: smoothSegmentation,
            minDetectionConfidence: detectionCon,
            minTrackingConfidence: trackCon
        });

        this.pose.onResults((results: Results) => {
            this.results = results;
            if (results.poseLandmarks) {
                this.landmarksList = results.poseLandmarks;
            }
        });
    }

    public setCanvas(canvas: HTMLCanvasElement) {
        this.canvasContext = canvas.getContext('2d');
    }

    async findPose(imageSource: HTMLVideoElement | HTMLImageElement, draw = true): Promise<void> {
        await this.pose.send({ image: imageSource });

        if (draw && this.results?.poseLandmarks && this.canvasContext) {
            // Draw landmarks and connections using MediaPipe's drawing utilities
            drawConnectors(
                this.canvasContext,
                this.results.poseLandmarks,
                POSE_CONNECTIONS,
                { color: '#00FF00', lineWidth: 2 }
            );

            drawLandmarks(
                this.canvasContext,
                this.results.poseLandmarks,
                { color: '#FF0000', lineWidth: 1, radius: 3 }
            );
        }
    }

    findPosition(): Point[] {
        return this.landmarksList;
    }

    findAngle(p1: Point, p2: Point, p3: Point): number {
        if (!p1 || !p2 || !p3) return 0;
        if (p1.visibility && p1.visibility < 0.5) return 0;
        if (p2.visibility && p2.visibility < 0.5) return 0;
        if (p3.visibility && p3.visibility < 0.5) return 0;

        let angle = Math.atan2(p3.y - p2.y, p3.x - p2.x) -
            Math.atan2(p1.y - p2.y, p1.x - p2.x);

        angle = angle * 180.0 / Math.PI;

        if (angle < 0) {
            angle += 360;
            if (angle > 180) {
                angle = 360 - angle;
            }
        } else if (angle > 180) {
            angle = 360 - angle;
        }

        return angle;
    }

    // Method to draw angle visualization if needed
    drawAngle(p1: Point, p2: Point, p3: Point, angle: number) {
        if (!this.canvasContext) return;

        const ctx = this.canvasContext;

        // Draw lines connecting points
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw angle text
        ctx.font = '16px Arial';
        ctx.fillStyle = '#FF0000';
        ctx.fillText(
            Math.round(angle).toString(),
            p2.x - 20,
            p2.y - 20
        );
    }
}

// Example usage:
async function initializePoseDetection(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement) {
    const detector = new PoseDetector();
    detector.setCanvas(canvasElement);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 640,
                height: 480
            }
        });

        videoElement.srcObject = stream;
        await videoElement.play();

        // Ensure canvas matches video dimensions
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;

        const processFrame = async () => {
            const ctx = canvasElement.getContext('2d');
            if (ctx) {
                // Clear canvas
                ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                // Draw video frame
                ctx.drawImage(videoElement, 0, 0);
                // Process pose
                await detector.findPose(videoElement);
            }
            requestAnimationFrame(processFrame);
        };

        processFrame();

    } catch (error) {
        console.error('Error setting up pose detection:', error);
    }
}

export default PoseDetector;