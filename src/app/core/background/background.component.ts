import { CommonModule } from '@angular/common'
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core'
import * as THREE from 'three'


@Component({
	selector: 'app-background',
	standalone: true,
	imports: [ CommonModule ],
	templateUrl: './background.component.html',
	styleUrl: './background.component.scss',
})
export class BackgroundComponent {
	@Input() imagePath = 'assets/img/3.png'
	@ViewChild('rendererContainer') rendererContainer!: ElementRef

	private scene!: THREE.Scene
	private camera!: THREE.PerspectiveCamera
	private renderer!: THREE.WebGLRenderer
	private mesh!: THREE.Mesh
	private defaultEffect: Function = this.activateOtherEffect
	private rippleRenderTarget1!: THREE.WebGLRenderTarget
	private rippleRenderTarget2!: THREE.WebGLRenderTarget
	private currentRenderTarget!: THREE.WebGLRenderTarget

	ngAfterViewInit(): void {
		this.initThree()
		this.addMesh()
		this.animate()
		this.initRenderTargets()
		this.activateWaterEffect()
	}

	private initRenderTargets(): void {
		const width = window.innerWidth
		const height = window.innerHeight

		const renderTargetParams = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
		}

		this.rippleRenderTarget1 = new THREE.WebGLRenderTarget(width, height, renderTargetParams)
		this.rippleRenderTarget2 = this.rippleRenderTarget1.clone()
		this.currentRenderTarget = this.rippleRenderTarget1
	}

	ngOnDestroy(): void {
		if (this.renderer) this.renderer.dispose()
	}

	private initThree(): void {
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
		this.camera.position.set(0, 0, 2)
		this.renderer = new THREE.WebGLRenderer({ alpha: true })
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.rendererContainer.nativeElement.appendChild(this.renderer.domElement)
	}

	private addMesh(): void {
		const textureLoader = new THREE.TextureLoader()
		const imagePath = this.imagePath

		textureLoader.load(imagePath, (texture) => {
			const aspectRatio = texture.image.width / texture.image.height
			const geometry = new THREE.PlaneGeometry(5 * aspectRatio, 5)
			const material = new THREE.ShaderMaterial({
				uniforms: {
					time: { value: 0.0 },
					waterTexture: { value: texture },
					dynamicEffectIntensity: { value: 0.0 },
					waterEffectIntensity: { value: 0.0 },
					otherEffectIntensity: { value: 0.0 },
					mouse: { value: new THREE.Vector2(0.5, 0.5) },
					mouseActive: { value: 0.0 },
					rippleTexture: { value: this.rippleRenderTarget1.texture },
				},
				vertexShader: vertexShaderSource,
				fragmentShader: fragmentShaderSource,
			})

			this.mesh = new THREE.Mesh(geometry, material)
			this.scene.add(this.mesh)
			this.defaultEffect()
		})
	}

	private animate(): void {
		requestAnimationFrame(() => this.animate())

		if (!this.mesh || !this.mesh.material) return

		const material = <THREE.ShaderMaterial> this.mesh.material

		// Przełączamy render targety
		this.renderer.setRenderTarget(this.currentRenderTarget)
		this.renderer.render(this.scene, this.camera)

		// Zamieniamy render target na drugi
		this.currentRenderTarget = (this.currentRenderTarget === this.rippleRenderTarget1)
			? this.rippleRenderTarget2 : this.rippleRenderTarget1

		// Ustawiamy rippleTexture na nowy render target
		material.uniforms['rippleTexture'].value = this.currentRenderTarget.texture

		// Renderujemy do ekranu (domyślny render target)
		this.renderer.setRenderTarget(null)
		this.renderer.render(this.scene, this.camera)
	}

	private render(): void {
		if (this.mesh) {
			const material = <THREE.ShaderMaterial> this.mesh.material
			material.uniforms['time'].value += 0.05
		}
		this.renderer.render(this.scene, this.camera)
	}

	activateDynamicEffect(): void {
		if (this.mesh) {
			const material = <THREE.ShaderMaterial> this.mesh.material
			material.uniforms['dynamicEffectIntensity'].value = 1.0
			material.uniforms['waterEffectIntensity'].value = 0.0
			material.uniforms['otherEffectIntensity'].value = 0.0
		}
	}

	activateWaterEffect(): void {
		if (this.mesh) {
			const material = <THREE.ShaderMaterial> this.mesh.material
			material.uniforms['dynamicEffectIntensity'].value = 0.0
			material.uniforms['waterEffectIntensity'].value = 1.0
			material.uniforms['otherEffectIntensity'].value = 0.0
		}
	}

	activateOtherEffect(): void {
		if (this.mesh) {
			const material = <THREE.ShaderMaterial> this.mesh.material
			material.uniforms['dynamicEffectIntensity'].value = 0.0
			material.uniforms['waterEffectIntensity'].value = 0.0
			material.uniforms['otherEffectIntensity'].value = 1.0
		}
	}

	@HostListener('window:mousemove', [ '$event' ])
	onMouseMove(event: MouseEvent): void {
		const rect = this.renderer.domElement.getBoundingClientRect()
		const mouse = new THREE.Vector2()
		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

		const raycaster = new THREE.Raycaster()
		raycaster.setFromCamera(mouse, this.camera)

		const intersects = raycaster.intersectObject(this.mesh)
		if (intersects.length > 0) {
			const uv = intersects[0].uv
			if (!uv) {
				return
			}
			const material = <THREE.ShaderMaterial> this.mesh.material
			if (material.uniforms['mouse'] && material.uniforms['mouseActive']) {
				material.uniforms['mouse'].value.set(uv.x, uv.y)
				material.uniforms['mouseActive'].value = 1.0
			}
		}
	}

	@HostListener('window:mouseleave')
	onMouseLeave(): void {
		const material = <THREE.ShaderMaterial> this.mesh.material
		if (material.uniforms['mouseActive']) {
			material.uniforms['mouseActive'].value = 0.0
		}
	}
}

const vertexShaderSource = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// ten shader jest zepstuy do efektu wody rozkminic jak zrobic wplywanie fali na fale
const fragmentShaderSource = `
uniform float time;
uniform sampler2D waterTexture;
uniform vec2 mouse;
uniform float mouseActive;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    // Obliczamy dystans od kursora
    float dist = distance(mouse, uv);

    // Dynamiczne generowanie fal o mniejszym zasięgu
    float ripple = mouseActive * sin(30.0 * dist - time * 2.0) * 0.02;

    // Zniekształcamy tylko lokalnie, w mniejszym obszarze
    ripple *= exp(-dist * 20.0);  // Fale szybciej maleją, lokalnie

    // Pobieramy teksturę wody i dodajemy efekt fali
    vec4 color = texture2D(waterTexture, uv + ripple);

    gl_FragColor = color;
}
`