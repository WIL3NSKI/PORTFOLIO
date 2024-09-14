import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core'
import * as cocoSsd from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'
import * as faceapi from '@vladmandic/face-api'  // Zmieniony import

@Component({
	selector: 'app-camera',
	standalone: true,
	imports: [],
	templateUrl: './camera.component.html',
	styleUrls: [ './camera.component.scss' ],
})
export class CameraComponent implements OnInit {
	@Input() type: 'face' | 'emotions' | 'ageAndGender' = 'face'
	private model?: cocoSsd.ObjectDetection

	@ViewChild('video', { static: true }) videoElement?: ElementRef<HTMLVideoElement>
	@ViewChild('canvas', { static: true }) canvasElement?: ElementRef<HTMLCanvasElement>

	async ngOnInit() {
		await tf.ready()

		await this.initializeCamera()

		if (this.type === 'face') {
			this.model = await cocoSsd.load()
			await this.startObjectDetection()
		} else if (this.type === 'emotions') {
			await this.loadFaceApiModels()
			this.detectEmotions()
		} else if (this.type === 'ageAndGender') {
			await this.loadFaceApiModels()
			this.detectAgeAndGender()
		}
	}

	private async initializeCamera() {
		if (!this.videoElement) return
		const videoElement = this.videoElement.nativeElement
		videoElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: true })
		await videoElement.play()
	}

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
				ctx.strokeStyle = 'blue'
				ctx.stroke()
				ctx.fillText(`${ prediction.class } ${ Math.round(prediction.score * 100) }%`, x, y > 10 ? y - 5 : 10)
			})
		}, 100)
	}

	private async loadFaceApiModels() {
		const MODEL_URL = '/assets/models'  // Ścieżka do modeli
		await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
		await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
		await faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL)
	}

	private async detectEmotions() {
		const video = this.videoElement?.nativeElement
		const canvas = this.canvasElement?.nativeElement

		if (!video || !canvas) {
			console.error('Brak wideo lub canvasu')
			return
		}

		if (video.videoWidth === 0 || video.videoHeight === 0) {
			console.error('Błędne wymiary wideo')
			return
		}

		const displaySize = { width: video.videoWidth, height: video.videoHeight }
		canvas.width = displaySize.width
		canvas.height = displaySize.height

		setInterval(async () => {
			if (!this.videoElement || !this.canvasElement) {
				console.error('Brak wideo lub canvasu podczas detekcji')
				return
			}

			const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()

			if (!detections || (detections as any).length === 0) {
				console.warn('Brak detekcji twarzy')
				return
			}

			const ctx = canvas.getContext('2d')
			if (!ctx) {
				console.error('Brak kontekstu canvasu')
				return
			}

			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

			const resizedDetections = faceapi.resizeResults(detections, displaySize)

			if (!resizedDetections || (resizedDetections as any).length === 0) {
				console.error('Błędne wyniki detekcji po resizeResults')
				return
			}

			faceapi.draw.drawDetections(canvas, (resizedDetections as any).map((detection: any) => detection.detection))

			faceapi.draw.drawFaceExpressions(canvas, (resizedDetections as any))
		}, 100)
	}

	private async detectAgeAndGender() {
		const video = this.videoElement?.nativeElement
		const canvas = this.canvasElement?.nativeElement

		if (!video || !canvas) {
			console.error('Brak wideo lub canvasu')
			return
		}

		if (video.videoWidth === 0 || video.videoHeight === 0) {
			console.error('Błędne wymiary wideo')
			return
		}

		const displaySize = { width: video.videoWidth, height: video.videoHeight }
		canvas.width = displaySize.width
		canvas.height = displaySize.height

		setInterval(async () => {
			if (!this.videoElement || !this.canvasElement) {
				console.error('Brak wideo lub canvasu podczas detekcji')
				return
			}

			const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withAgeAndGender()

			if (!detections || detections.length === 0) {
				console.warn('Brak detekcji twarzy')
				return
			}

			const ctx = canvas.getContext('2d')
			if (!ctx) {
				console.error('Brak kontekstu canvasu')
				return
			}

			ctx.clearRect(0, 0, canvas.width, canvas.height)
			ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

			const resizedDetections = faceapi.resizeResults(detections, displaySize)

			if (!resizedDetections.length) {
				console.error('Błędne wyniki detekcji po resizeResults')
				return
			}

			faceapi.draw.drawDetections(canvas, resizedDetections.map((detection: any) => detection.detection))

			resizedDetections.forEach(result => {
				const { age, gender, genderProbability } = result
				const box = result.detection.box
				const text = `Wiek: ${ Math.round(age) }, Płeć: ${ gender } (${ Math.round(genderProbability * 100) }%)`
				ctx.fillStyle = 'red'
				ctx.fillText(text, box.x, box.y - 10)
			})
		}, 100)
	}
}
