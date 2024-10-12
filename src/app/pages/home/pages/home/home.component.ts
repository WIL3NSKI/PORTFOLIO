import {  Component, ViewChild } from '@angular/core'
import { BackgroundComponent } from '../../../../core/background/background.component'

import { HttpService } from '../../../../services/http.service'


@Component({
	selector: 'app-home',
	templateUrl: `./home.component.html`,
	styleUrl: './home.component.scss',
})
export class HomeComponent {
	@ViewChild('background') backgroundComponent!: BackgroundComponent

	constructor(private httpService: HttpService) {

	}

	ngOnInit() {
	}

}
