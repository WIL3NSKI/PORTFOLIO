import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'


@Component({
	selector: 'app-button',
	standalone: true,
	imports: [
		CommonModule,
	],
	templateUrl: './button.component.html',
	styleUrl: './button.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
	@Input() text = ''
	@Input() classes: string[] = []
	@Output() clicked = new EventEmitter<void>()

}
