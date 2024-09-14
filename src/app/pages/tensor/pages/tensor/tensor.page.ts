import { Component } from '@angular/core'
import { ButtonComponent } from '../../../../core/button/button.component'
import { CameraComponent } from '../../../../core/camera/camera.component'


type TensorModes = 'faceRecognition' | 'emotions' | 'ageAndGender'

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
		{ text: 'gender and age', mode: 'ageAndGender' },
	]

	ngAfterViewInit() {
	}

	setMode(mode: TensorModes): void {
		this.mode = mode
	}
}
