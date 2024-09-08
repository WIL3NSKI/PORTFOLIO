import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BackgroundComponent } from '../../../../core/background/background.component'
import { BannerComponent } from '../../../../core/banner/banner.component'
import { ButtonComponent } from '../../../../core/button/button.component'
import { SliderComponent } from '../../../../core/slider/slider.component'
import { HttpService } from '../../../../services/http.service'



@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		CommonModule,
		RouterModule,
		SliderComponent,
		BannerComponent,
		BackgroundComponent,
		ButtonComponent,
	],
	templateUrl: `./home.component.html`,
	styleUrl: './home.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	@ViewChild('background') backgroundComponent!: BackgroundComponent

	constructor(private httpService: HttpService) {

	}

	ngOnInit() {
	}



}
