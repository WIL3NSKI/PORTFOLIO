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
	private defaultEffect: Function = this.activateWaterEffect

	ngAfterViewInit(): void {
		this.initThree()
		this.addMesh()
		this.animate()
		this.activateWaterEffect()
		this.defaultEffect()
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
				},
				vertexShader: vertexShaderSource,
				fragmentShader: fragmentShaderSource,
			})

			this.mesh = new THREE.Mesh(geometry, material)
			this.scene.add(this.mesh)
		})
	}

	private animate(): void {
		requestAnimationFrame(() => this.animate())
		this.render()
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
		if (this.mesh) {
			const rect = this.renderer.domElement.getBoundingClientRect()
			const x = (event.clientX - rect.left) / rect.width
			const y = 1 - (event.clientY - rect.top) / rect.height // Odwrócenie osi Y
			const material = <THREE.ShaderMaterial> this.mesh.material
 			material.uniforms['mouse'].value.set(x, y)
 		}
	}
}

// Vertex Shader
const vertexShaderSource = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// Fragment Shader
const fragmentShaderSource = `
uniform float time;
uniform sampler2D waterTexture;
uniform vec2 mouse;  
uniform float dynamicEffectIntensity;
uniform float waterEffectIntensity;
uniform float otherEffectIntensity;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;

    if (dynamicEffectIntensity > 0.0) {
        uv.x += sin(uv.y * 10.0 + time) * 0.1;
    } else if (waterEffectIntensity > 0.0) {
        uv.y += cos(uv.x * 10.0 + time) * 0.1;
    } else if (otherEffectIntensity > 0.0) {
           vec2 dist = uv - mouse;
        float effect = exp(-length(dist) * 25.0);

        // Silniejszy efekt fali
        uv.x += effect * sin(uv.y * 20.0 + time * 5.0) * 0.05;
        uv.y += effect * cos(uv.x * 20.0 + time * 5.0) * 0.05;
    }

    gl_FragColor = texture2D(waterTexture, uv);
}
`