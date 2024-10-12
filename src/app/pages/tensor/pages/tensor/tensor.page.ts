import { Component } from '@angular/core'
import { ButtonComponent } from '../../../../core/button/button.component'
import { CameraComponent } from '../../../../core/camera/camera.component'


type TensorMode = 'faceRecognition' | 'emotions' | 'ageAndGender'

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
	mode?: TensorMode = 'emotions'

	modes: { text: string, mode: TensorMode }[] = [
		{ text: 'Face', mode: 'faceRecognition' },
		{ text: 'Emotions in motion :)', mode: 'emotions' },
		{ text: 'gender and age', mode: 'ageAndGender' },
	]

	setMode(mode: TensorMode): void {
		this.mode = mode
	}
}
