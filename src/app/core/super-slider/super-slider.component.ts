import { HammerModule } from '@angular/platform-browser'
import * as THREE from 'three'
import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import Hammer from 'hammerjs'


@Component({
	selector: 'app-super-slider',
	standalone: true,
	imports: [ HammerModule ],
	templateUrl: './super-slider.component.html',
	styleUrl: './super-slider.component.scss',
})
export class SuperSliderComponent {
	@Input() model = [
		{ path: 'assets/img/1.png' },
		{ path: 'assets/img/2.png' },
		{ path: 'assets/img/3.png' },
		{ path: 'assets/img/test.png' },
	]

	private scene!: THREE.Scene
	private camera!: THREE.PerspectiveCamera
	private renderer!: THREE.WebGLRenderer
	private currentIndex = 0
	private spacing = window.innerWidth * 0.05

	private imageWidth = window.innerWidth * 0.01
	private imageHeight = 5
	@ViewChild('rendererContainer') rendererContainer!: ElementRef<HTMLDivElement>

	ngAfterViewInit(): void {
		this.initThree()
		this.addImages()
		this.animate()
	}

	ngOnDestroy(): void {
		if (this.renderer) this.renderer.dispose()
	}

	private initThree(): void {
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
		this.camera.position.set(0, 0, 10)
		this.renderer = new THREE.WebGLRenderer({ alpha: true })
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)

		this.addSwipeListeners()
	}

	private addSwipeListeners(): void {
		const hammer = new Hammer(this.rendererContainer.nativeElement)
		hammer.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL })
		hammer.on('swipeleft', () => this.nextSlide())
		hammer.on('swiperight', () => this.previousSlide())
	}

	private addImages(): void {
		const loader = new THREE.TextureLoader()

		this.model.forEach((item, index) => {
			loader.load(item.path, (texture) => {
				const aspectRatio = texture.image.width / texture.image.height
				const geometry = new THREE.PlaneGeometry(this.imageWidth * aspectRatio, this.imageHeight)
				const material = new THREE.MeshBasicMaterial({ map: texture })

				const mesh = new THREE.Mesh(geometry, material)
				const reflectionMesh = new THREE.Mesh(geometry, material)

				mesh.position.x = index * (this.imageWidth + this.spacing) - this.currentIndex * (this.imageWidth + this.spacing)
				reflectionMesh.position.x = mesh.position.x
				reflectionMesh.position.y = -mesh.position.y - 5
				reflectionMesh.rotation.x = Math.PI

				this.scene.add(mesh)
				this.scene.add(reflectionMesh)
			})
		})
	}

	private animate(): void {
		requestAnimationFrame(() => this.animate())
		this.renderer.render(this.scene, this.camera)
	}

	nextSlide(): void {
		if (this.currentIndex < this.model.length - 1) {
			this.currentIndex++
			this.updateCameraPosition()
		}
	}

	previousSlide(): void {
		if (this.currentIndex > 0) {
			this.currentIndex--
			this.updateCameraPosition()
		}
	}

	private updateCameraPosition(): void {
		const spacing = window.innerWidth * 0.05 // Ta sama wartość co w addImages
		const targetPosition = this.currentIndex * (this.imageWidth + spacing)
		this.moveCameraTo(targetPosition)
	}

	private moveCameraTo(position: number): void {
		const startPosition = this.camera.position.x
		const endPosition = position

		const duration = 1000 // czas trwania w ms
		const startTime = Date.now()

		const animate = () => {
			const elapsed = Date.now() - startTime
			const t = elapsed / duration

			if (t < 1) {
				this.camera.position.x = startPosition + (endPosition - startPosition) * t
				requestAnimationFrame(animate)
			} else {
				this.camera.position.x = endPosition
			}
		}

		animate()
	}
}

const vertexShaderSource = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShaderSource = `
varying vec2 vUv;
uniform sampler2D texture;

void main() {
    vec4 texColor = texture2D(texture, vUv);
    gl_FragColor = texColor;
}
`

const reflectionFragmentShaderSource = `
varying vec2 vUv;
uniform sampler2D texture;

void main() {
    vec4 texColor = texture2D(texture, vUv);
    gl_FragColor = vec4(texColor.rgb, 0.5); // Ustaw półprzezroczystość dla efektu odbicia
}
`