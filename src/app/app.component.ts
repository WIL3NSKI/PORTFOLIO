import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { Router, RouterOutlet } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'
import { BackgroundComponent } from './core/background/background.component'
import { MenuComponent } from './core/menu/menu.component'


@Component({
	selector: 'app-root',
	standalone: true,
	imports: [ CommonModule, RouterOutlet, BackgroundComponent, MenuComponent ],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'front'

	constructor(private router: Router) {
	}

	get isHomePage(): boolean {
		return this.router.url === '/'
	}

	goToHome(): void {
		this.router.navigateByUrl('/')
	}
}
