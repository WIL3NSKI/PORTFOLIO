import { Component } from '@angular/core';
import { SuperSliderComponent } from '../../../../core/super-slider/super-slider.component'

@Component({
  selector: 'app-about',
  standalone: true,
	imports: [
		SuperSliderComponent,
	],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

}
