import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterModule, Routes } from '@angular/router'
import { BackgroundComponent } from '../../core/background/background.component'
import { BannerComponent } from '../../core/banner/banner.component'
import { ButtonComponent } from '../../core/button/button.component'
import { InfoComponent } from '../../core/info/info.component'
import { SliderComponent } from '../../core/slider/slider.component'
import { HomeComponent } from './pages/home/home.component'


const routes: Routes = [
	{
		path: '', component: HomeComponent,
	},
]

@NgModule({
	declarations: [
		HomeComponent,
	],
	imports: [
		RouterModule.forChild(routes),
		CommonModule,
		ButtonComponent,
		RouterLink,
		BackgroundComponent,
		BannerComponent,
		SliderComponent,
		InfoComponent,
	],
	exports: [
		HomeComponent,
	],
})
export class HomeModule {
}
