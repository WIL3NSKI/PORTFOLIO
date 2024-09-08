import { Component } from '@angular/core'
import { ButtonComponent } from '../../../../core/button/button.component'
import { CameraComponent } from '../../../../core/camera/camera.component'


type TensorModes = 'faceRecognition' | 'emotions'

@Component({
	selector: 'app-tensor',
	standalone: true,
	imports: [
		ButtonComponent,
		CameraComponent,
	],
	templateUrl: './tensor.page.html',
	styleUrl: './tensor.page.scss',
})
export class TensorPage {
	mode?: TensorModes = 'emotions'

	modes: { text: string, mode: TensorModes }[] = [
		{ text: 'Face', mode: 'faceRecognition' },
		{ text: 'Emotions in motion :)', mode: 'emotions' },
	]

	ngAfterViewInit() {
	}

	setMode(mode: TensorModes): void {
		this.mode = mode
	}
}
