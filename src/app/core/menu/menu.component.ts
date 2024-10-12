import { Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { BackgroundComponent } from '../background/background.component'


@Component({
	selector: 'app-menu',
	standalone: true,
	imports: [
		RouterLink,
		BackgroundComponent,
	],
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.scss',
})
export class MenuComponent {
	routing = [
		{
			name: 'Home',
			url: '/',
		},
		{
			name: 'Tensor',
			url: '/tensor',
		}, {
			name: 'Test slidera 3d',
			url: '/about',
		},
	]
}
