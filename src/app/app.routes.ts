import { Routes } from '@angular/router'
import { AboutComponent } from './pages/about/pages/about/about.component'
import { HomeModule } from './pages/home/home.module'
 import { TensorPage } from './pages/tensor/pages/tensor/tensor.page'


export const routes: Routes = [
	{
		path: '', loadChildren: () => import('../app/pages/home/home.module').then(m => m.HomeModule),
	},
	{
		path: 'about', component: AboutComponent,
	},
	{
		path: 'tensor', component: TensorPage,
	}
	,
]
