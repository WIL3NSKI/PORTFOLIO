import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'
import * as faceapi from 'face-api.js'


@Component({
	selector: 'app-camera',
	standalone: true,
	imports: [],
	templateUrl: './camera.component.html',
	styleUrl: './camera.component.scss',
})
export class CameraComponent implements OnInit {
	@Input() type: 'face' | 'emotions' = 'face'
	private model?: cocoSsd.ObjectDetection

	@ViewChild('video', { static: true }) videoElement?: ElementRef<HTMLVideoElement>
	@ViewChild('canvas', { static: true }) canvasElement?: ElementRef<HTMLCanvasElement>

	async ngOnInit() {
		tf.setBackend('webgl').then(async () => {
			await this.initializeCamera()
			if (this.type === 'face') {
				this.model = await cocoSsd.load()
				await this.startObjectDetection()
			} else if (this.type === 'emotions') {
				await this.loadFaceApiModels()
				this.detectEmotions()
			}
		})
	}

	// Inicjalizacja kamery
	private async initializeCamera() {
		if (!this.videoElement) return
		const videoElement = this.videoElement.nativeElement
		videoElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: true })
		await videoElement.play()
	}

	// Wykrywanie obiektów (face detection)
	private async startObjectDetection() {
		if (!this.canvasElement || !this.videoElement) return
		const ctx = this.canvasElement.nativeElement.getContext('2d')
		if (!ctx) return

		this.canvasElement.nativeElement.width = this.videoElement.nativeElement.videoWidth
		this.canvasElement.nativeElement.height = this.videoElement.nativeElement.videoHeight

		setInterval(async () => {
			if (!this.model || !this.canvasElement || !this.videoElement) return
			const predictions = await this.model.detect(this.videoElement.nativeElement)

			ctx.clearRect(0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height)
			ctx.drawImage(this.videoElement.nativeElement, 0, 0, this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height)

			predictions.forEach(prediction => {
				const [ x, y, width, height ] = prediction.bbox
				ctx.beginPath()
				ctx.rect(x, y, width, height)
				ctx.lineWidth = 2
				ctx.strokeStyle = 'red'
				ctx.fillStyle = 'red'
				ctx.stroke()
				ctx.fillText(`${ prediction.class } ${ Math.round(prediction.score * 100) }%`, x, y > 10 ? y - 5 : 10)
			})
		}, 100)
	}

	// Ładowanie modeli Face API do analizy emocji
	private async loadFaceApiModels() {
		const MODEL_URL = '/assets/models'
		await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
		await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
	}

	// Wykrywanie emocji
	private detectEmotions() {
		if (!this.canvasElement || !this.videoElement) return
		const video = this.videoElement.nativeElement
		const canvas = this.canvasElement.nativeElement
		const displaySize = { width: video.videoWidth, height: video.videoHeight }
		const ctx = canvas.getContext('2d')

		faceapi.matchDimensions(canvas, displaySize)

		setInterval(async () => {
			const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
			ctx?.clearRect(0, 0, canvas.width, canvas.height)
			ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

			const resizedDetections = faceapi.resizeResults(detections, displaySize)
			faceapi.draw.drawDetections(canvas, resizedDetections)
			faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
		}, 100)
	}
}
