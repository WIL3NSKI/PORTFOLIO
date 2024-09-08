import { Routes } from '@angular/router'
import { AboutComponent } from './pages/about/pages/about/about.component'
import { HomeComponent } from './pages/home/pages/home/home.component'
import { TensorPage } from './pages/tensor/pages/tensor/tensor.page'


export const routes: Routes = [
	{
		path: '', component: HomeComponent,
	},
	{
		path: 'about', component: AboutComponent,
	},
	{
		path: 'tensor', component: TensorPage,
	}
	,
]
